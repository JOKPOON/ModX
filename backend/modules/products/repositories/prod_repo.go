package repositories

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type ProductRepo struct {
	Cfg *configs.Configs
	Db  *sqlx.DB
}

func NewProductRepo(db *sqlx.DB, cfg *configs.Configs) entities.ProductRepository {
	return &ProductRepo{Db: db, Cfg: cfg}
}

func (p *ProductRepo) Create(req *entities.Product) (*entities.ProductCreateRes, error) {
	query := `
	INSERT INTO "products"(
		"title",
		"price",
		"discount",
		"description",
		"picture",
		"options",
		"category",
		"rating",
		"sold",
		"stock"
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	RETURNING "id";
	`

	option, err := json.Marshal(req.Options)
	if err != nil {
		return nil, err
	}

	row, err := p.Db.Queryx(query,
		strings.ToLower(req.Title),
		req.Price,
		req.Discount,
		req.Desc,
		strings.Join(req.Picture, ","),
		option,
		strings.ToLower(req.Category),
		req.Rating,
		req.Sold,
		req.Stock,
	)

	if err != nil {
		return nil, err
	}

	for row.Next() {
		err = row.StructScan(&req)
		if err != nil {
			return nil, err
		}
	}

	return &entities.ProductCreateRes{
		Status:  "success",
		Message: fmt.Sprintf("product %s successfully created", req.Title),
	}, nil

}

func (p *ProductRepo) GetAll(req *entities.ProductQuery) (*entities.AllProductRes, error) {
	sqlQuery, err := sqlQuery(req)
	if err != nil {
		return nil, err
	}

	stmt, err := p.Db.PrepareNamed(sqlQuery)
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Queryx(req)
	if err != nil {
		return nil, err
	}

	var result entities.AllProductRes
	for rows.Next() {
		res := new(entities.AllProduct)
		err = rows.StructScan(&res)
		if err != nil {
			return nil, err
		}

		data := strings.Split(res.Picture, ",")
		for i, v := range data {
			data[i] = fmt.Sprintf(p.Cfg.S3.URL + v)
		}

		res.Picture = data[0]

		result.Data = append(result.Data, *res)
	}

	if len(result.Data) == 0 {
		return nil, fmt.Errorf("error, product not found")
	}

	return &result, nil
}

func (p *ProductRepo) DeleteFile(req *entities.Product) error {
	for _, v := range req.Picture {
		err := os.Remove(fmt.Sprintf("./static/products/%s", v))
		if err != nil {
			return fmt.Errorf("error, failed to delete file")
		}
	}
	return nil
}

func (p *ProductRepo) Delete(req *entities.Product) error {
	query := `
	DELETE FROM "products"
	WHERE "id" = $1;
	`

	_, err := p.Db.Queryx(query, req.Id)
	if err != nil {
		return err
	}

	return nil
}

func sqlQuery(req *entities.ProductQuery) (string, error) {
	sqlQuery := "SELECT id, title, price, discount, picture, rating, sold FROM products WHERE 1=1"
	if req.Id != "" {
		sqlQuery += " AND id = :id"
	}
	if req.Search != "" {
		sqlQuery += " AND (title LIKE :search OR category LIKE :search)"
		req.Search = "%" + strings.ToLower(req.Search) + "%"
	}
	if req.Title != "" {
		sqlQuery += " AND title = :title"
	}
	if len(req.Category) > 0 {
		sqlQuery += " AND category IN ("
		for i, v := range req.Category {
			v = strings.ToLower(v)
			if i == 0 {
				sqlQuery += "'" + v + "'"
			} else {
				sqlQuery += ", '" + v + "'"
			}
		}
		sqlQuery += ")"
	}
	if req.Rating != "" {
		sqlQuery += " AND rating >= :rating"
	}
	if req.MaxPrice != "" {
		sqlQuery += " AND price <= :max_price"
	}
	if req.MinPrice != "" {
		sqlQuery += " AND price >= :min_price"
	}
	if req.PriceSort != "" {
		if req.PriceSort != "ASC" && req.PriceSort != "DESC" {
			return "", fmt.Errorf("error, price sort must be ASC or DESC")
		}
		sqlQuery += " ORDER BY price " + req.PriceSort
	}

	if req.Sort != "" {
		var sortBy string
		switch req.Sort {
		case "top_sale":
			sortBy = "sold"
		case "latest":
			sortBy = "created_at"
		case "rating":
			sortBy = "rating"
		default:
			return "", fmt.Errorf("error, sort must be top_sale, latest, or rating")
		}
		if req.PriceSort != "" {
			sqlQuery += ", " + sortBy + " DESC"
		} else {
			sqlQuery += " ORDER BY " + sortBy + " DESC"
		}
	}

	if req.Limit != "" {
		sqlQuery += " LIMIT :limit"
	}

	fmt.Println("Generated SQL Query:", sqlQuery)
	return sqlQuery, nil
}

func (p *ProductRepo) GetProduct(req *entities.Product) (*entities.Product, error) {
	query := `
	SELECT * FROM products WHERE id = $1;
	`

	row, err := p.Db.Queryx(query, req.Id)
	if err != nil {
		return nil, fmt.Errorf("error, failed to query product")
	}

	if !row.Next() {
		return nil, fmt.Errorf("error, product not found")
	}

	res := new(entities.ProductRes)
	err = row.StructScan(&res)
	if err != nil {
		return nil, fmt.Errorf("error, failed to scan product data")
	}
	var data map[string]interface{}
	err = json.Unmarshal([]byte(res.Options), &data)
	if err != nil {
		return nil, fmt.Errorf("error, failed to unmarshal product options")
	}

	req.Id = res.Id
	req.Title = res.Title
	req.Desc = res.Desc
	req.Price = res.Price
	req.Category = res.Category
	req.Options = data
	req.Rating = res.Rating
	req.Sold = res.Sold
	req.Stock = res.Stock
	req.Updated = res.Updated
	req.Picture = strings.Split(res.Picture, ",")
	for i, v := range req.Picture {
		req.Picture[i] = fmt.Sprintf(p.Cfg.S3.URL + v)
	}

	query = `
	SELECT id, user_id, comment, rating, created_at 
	FROM reviews WHERE product_id = $1;
	`

	row, err = p.Db.Queryx(query, req.Id)
	if err != nil {
		return nil, err
	}

	var review entities.ReviewRes
	for row.Next() {
		err := row.Scan(
			&review.Id,
			&review.UserId,
			&review.Comment,
			&review.Rating,
			&review.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		created_time := strings.Split(review.CreatedAt, "T")
		review.CreatedAt = created_time[0]

		query := `
		SELECT username FROM users WHERE id = $1;
		`

		rows, err := p.Db.Queryx(query, review.UserId)
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			err = rows.Scan(&review.Name)
			if err != nil {
				return nil, err
			}
		}

		req.Reviews = append(req.Reviews, review)
	}

	return req, nil
}

func (p *ProductRepo) AddReview(req *entities.Review) error {
	query := `
	INSERT INTO "reviews"(
		"user_id",
		"product_id",
		"rating",
		"comment",
		"order_product_id"
	)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING "id";
	`

	row, err := p.Db.Queryx(query, req.UserId, req.ProductId, req.Rating*10, req.Comment, req.ItemId)
	if err != nil {
		return err
	}

	for row.Next() {
		err = row.StructScan(&req)
		if err != nil {
			return err
		}
	}

	query = `
	UPDATE order_products SET is_reviewed = true WHERE id = $1;
	`

	_, err = p.Db.Queryx(query, req.ItemId)
	if err != nil {
		return err
	}

	query = `
	UPDATE "products"
	SET "rating" = COALESCE(subquery."average_rating", 0)
	FROM (
		SELECT 
			"reviews"."product_id",
			AVG("reviews"."rating") AS "average_rating"
		FROM "reviews"
		GROUP BY "reviews"."product_id"
	) AS subquery
	WHERE "products"."id" = subquery."product_id";`

	_, err = p.Db.Queryx(query)
	if err != nil {
		return err
	}

	return nil
}

func (p *ProductRepo) DeleteProduct(req *entities.Product) error {
	query := `
	DELETE FROM "products"
	WHERE "id" = $1;
	`

	_, err := p.Db.Queryx(query, req.Id)
	if err != nil {
		return err
	}

	return nil
}

func (p *ProductRepo) UpdateProduct(req *entities.Product) (*entities.Product, error) {
	query := `
	UPDATE "products"
	SET
		"title" = $1,
		"price" = $2,
		"discount" = $3,
		"description" = $4,
		"picture" = $5,
		"options" = $6,
		"category" = $7,
		"rating" = $8,
		"sold" = $9,
		"stock" = $10
	WHERE "id" = $11;
	`

	option, err := json.Marshal(req.Options)
	if err != nil {
		return nil, err
	}

	row, err := p.Db.Queryx(query,
		req.Title,
		req.Price,
		req.Discount,
		req.Desc,
		strings.Join(req.Picture, ","),
		option,
		req.Category,
		req.Rating,
		req.Sold,
		req.Stock,
		req.Id,
	)

	if err != nil {
		return nil, err
	}

	for row.Next() {
		err = row.StructScan(&req)
		if err != nil {
			return nil, err
		}
	}

	return req, nil
}
