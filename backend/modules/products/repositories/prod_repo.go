package repositories

import (
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

func (p *ProductRepo) Create(req *entities.ProductWithVariants) (*entities.ProductCreateRes, error) {
	query := `
	INSERT INTO "products"(
		"title",
		"description",
		"price",
		"category",
		"sub_type",
		"sold",
		"stock",
		"picture",
		"rating"
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	RETURNING "id", "title";
	`

	product := new(entities.ProductCreateRes)

	stringOfPicture := ""
	for i, v := range req.Product.Picture {
		if i == len(req.Product.Picture)-1 {
			stringOfPicture += v
		} else {
			stringOfPicture += v + ","
		}
	}

	row, err := p.Db.Queryx(
		query,
		req.Product.Title,
		req.Product.Desc,
		req.Product.Price,
		req.Product.Category,
		req.Product.SubType,
		req.Product.Sold,
		req.Product.Stock,
		stringOfPicture,
		req.Product.Rating,
	)
	if err != nil {
		p.DeleteFile(&req.Product)
		return nil, err
	}

	for row.Next() {
		err = row.Scan(&req.Product.Id, &req.Product.Title)
		if err != nil {
			p.DeleteFile(&req.Product)
			return nil, err
		}
	}

	log.Println(req.Product.Id)

	query = `
	INSERT INTO "product_variants"(
		"product_id",
		"price",
		"stock",
		"color",
		"size",
		"model"
	)
	VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING "id";
	`

	if len(req.Variant) > 0 {
		for _, v := range req.Variant {
			_, err := p.Db.Queryx(query, req.Product.Id, v.Price, v.Stock, v.Color, v.Size, v.Model)
			if err != nil {
				p.DeleteFile(&req.Product)
				p.Delete(&req.Product)
				return nil, err
			}
		}
	} else {
		p.DeleteFile(&req.Product)
		p.Delete(&req.Product)
		return nil, fmt.Errorf("error, variants cannot be empty")
	}

	product.Status = "success"
	product.Message = "product created"

	return product, nil
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
	defer rows.Close()

	var res entities.AllProductReq
	var product entities.Product
	var result entities.AllProductRes
	for rows.Next() {

		err = rows.StructScan(&res)
		if err != nil {
			return &result, err
		}
		picture := strings.Split(res.Picture, ",")
		for i, v := range picture {
			picture[i] = fmt.Sprintf("http://localhost:8080/static/products/%s", v)
		}

		product.Id = res.Id
		product.Title = res.Title
		product.Desc = res.Desc
		product.Price = res.Price
		product.Category = res.Category
		product.SubType = res.SubType
		product.Rating = res.Rating
		product.Sold = res.Sold
		product.Stock = res.Stock
		product.Created = res.Created
		product.Updated = res.Updated
		product.Picture = picture

		result.Data = append(result.Data, product)
	}

	if res.Id == 0 {
		return &result, fmt.Errorf("error, product not found")
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
	sqlQuery := "SELECT * FROM products WHERE 1=1"
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
	if req.SubType != "" {
		sqlQuery += " AND sub_type = :sub_type"
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

	var picture string
	for row.Next() {
		err = row.Scan(
			&req.Id,
			&req.Title,
			&req.Desc,
			&req.Price,
			&req.Category,
			&req.SubType,
			&req.Rating,
			&req.Sold,
			&req.Stock,
			&req.Created,
			&req.Updated,
			&picture,
		)
		if err != nil {
			return nil, err
		}

	}

	req.Picture = strings.Split(picture, ",")
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

	query = `
	SELECT * FROM product_variants WHERE product_id = $1;
	`

	row, err = p.Db.Queryx(query, req.Id)
	if err != nil {
		return nil, err
	}

	var variant entities.ProductVariant
	for row.Next() {
		err = row.StructScan(&variant)
		if err != nil {
			return nil, err
		}
		req.Variants = append(req.Variants, variant)
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
