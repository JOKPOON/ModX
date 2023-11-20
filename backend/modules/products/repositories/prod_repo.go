package repositories

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type ProductRepo struct {
	Db *sqlx.DB
}

func NewProductRepo(db *sqlx.DB) entities.ProductRepository {
	return &ProductRepo{Db: db}
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
		log.Fatal(err)
	}

	rows, err := stmt.Queryx(req)
	if err != nil {
		return nil, err
	}

	if !rows.Next() {
		return nil, fmt.Errorf("error, product not found")
	}

	var res entities.AllProduct
	var result entities.AllProductRes
	for rows.Next() {
		err := rows.Scan(
			&res.Id,
			&res.Title,
			&res.Price,
			&res.Discount,
			&res.Picture,
			&res.Rating,
			&res.Sold,
		)
		if err != nil {
			return &result, err
		}

		picture := strings.Split(res.Picture, ",")
		for i, v := range picture {
			picture[i] = fmt.Sprintf("http://localhost:8080/static/products/%s", v)
		}

		res.Picture = picture[0]

		result.Data = append(result.Data, res)
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
		sqlQuery += " AND title LIKE :search"
		req.Search = "%" + req.Search + "%"
	}
	if req.Title != "" {
		sqlQuery += " AND title = :title"
	}
	if req.Category != "" {
		sqlQuery += " AND category = :category"
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
	if req.Limit != "" {
		sqlQuery += " LIMIT :limit"
	}

	return sqlQuery, nil
}

func (p *ProductRepo) GetProduct(req *entities.Product) (*entities.Product, error) {
	query := `
	SELECT * FROM products WHERE id = $1;
	`

	row, err := p.Db.Queryx(query, req.Id)
	if err != nil {
		return nil, err
	}

	if !row.Next() {
		return nil, fmt.Errorf("error, product not found")
	}

	type Product struct {
		Id       int    `json:"id" db:"id"`
		Title    string `json:"title" db:"title"`
		Desc     string `json:"desc" db:"description"`
		Price    int    `json:"price" db:"price"`
		Picture  string `json:"picture" db:"picture"`
		Category string `json:"category" db:"category"`
		Option   string `json:"option" db:"options"`
		Rating   int    `json:"rating" db:"rating"`
		Sold     int    `json:"sold" db:"sold"`
		Stock    int    `json:"stock" db:"stock"`
		Created  string `json:"created" db:"created_at"`
		Updated  string `json:"updated" db:"updated_at"`
	}

	res := new(Product)
	err = row.StructScan(&res)
	if err != nil {
		return nil, err
	}

	var data map[string]interface{}
	err = json.Unmarshal([]byte(res.Option), &data)
	if err != nil {
		return nil, err
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
	req.Created = res.Created
	req.Updated = res.Updated
	req.Picture = strings.Split(res.Picture, ",")
	for i, v := range req.Picture {
		req.Picture[i] = fmt.Sprintf("http://localhost:8080/static/products/%s", v)
	}

	query = `
	SELECT * FROM reviews WHERE product_id = $1;
	`

	row, err = p.Db.Queryx(query, req.Id)
	if err != nil {
		return nil, err
	}

	var review entities.Review
	for row.Next() {
		err = row.StructScan(&review)
		if err != nil {
			return nil, err
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
		"comment"
	)
	VALUES ($1, $2, $3, $4)
	RETURNING "id";
	`

	row, err := p.Db.Queryx(query, req.UserId, req.ProductId, req.Rating, req.Comment)
	if err != nil {
		return err
	}

	for row.Next() {
		err = row.StructScan(&req)
		if err != nil {
			return err
		}
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
