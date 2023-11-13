package repositories

import (
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
		"desc",
		"category",
		"sub_type",
		"sold",
		"stock",
		"picture",
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	RETURNING "id", "title";
	`

	product := new(entities.ProductCreateRes)

	rows, err := p.Db.Queryx(query, req.Title, req.Desc, req.Category, req.SubType, req.Sold, req.Stock, req.Picture)
	if err != nil {
		return nil, err
	} else {
		product.Message = "Product created successfully"
		product.Status = "success"
	}

	for rows.Next() {
		if err := rows.StructScan(product); err != nil {
			return nil, err
		}
	}

	query = `
	INSERT INTO "product_variants(
		"product_id",
		"price",
		"stock",
		"color",
		"size"
		"model"
	)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING "id";
	`

	for _, v := range req.Variants {
		rows, err := p.Db.Queryx(query, req.ProductId, v.Price, v.Stock, v.Color, v.Size, v.Model)
		if err != nil {
			return nil, err
		} else {
			product.Message = "Product variant created successfully"
			product.Status = "success"
		}

		for rows.Next() {
			if err := rows.StructScan(product); err != nil {
				return nil, err
			}
		}

	}

	return product, nil

}
