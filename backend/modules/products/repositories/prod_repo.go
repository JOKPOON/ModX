package repositories

import (
	"fmt"
	"log"
	"os"

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
		"desc",
		"category",
		"sub_type",
		"sold",
		"stock",
		"picture"
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
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

	row, err := p.Db.Queryx(query, req.Product.Title, req.Product.Desc, req.Product.Category, req.Product.SubType, req.Product.Sold, req.Product.Stock, stringOfPicture)
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

	return product, nil
}

func (p *ProductRepo) GetAll(req *entities.ProductQuery) (*entities.AllProductReq, error) {
	sqlQuery := "SELECT * FROM products WHERE 1=1"
	if req.Id != "" {
		sqlQuery += " AND id = :id"
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
		sqlQuery += " AND rating = :rating"
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
	for rows.Next() {
		err = rows.StructScan(&res)
		if err != nil {
			return &res, err
		}
	}

	return &res, nil
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
