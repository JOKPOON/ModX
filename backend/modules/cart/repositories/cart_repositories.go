package repositories

import (
	"encoding/json"
	"errors"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type CartRepo struct {
	Db *sqlx.DB
}

func NewCartRepo(db *sqlx.DB) entities.CartRepository {
	return &CartRepo{Db: db}
}

func (c *CartRepo) AddCartItem(req *entities.Cart) error {
	query := `
	INSERT INTO "carts"(
		"user_id",
		"total",
		"product_id",
		"items"
	)
	VALUES ($1, $2, $3, $4)
	RETURNING "id";
	`

	product_json := &req.Items
	res, err := json.Marshal(product_json)
	if err != nil {
		return err
	}

	_, err = c.Db.Queryx(query, req.UserId, req.Total, req.ProductId, res)
	if err != nil {
		return err
	}

	return err
}

func (c *CartRepo) GetCartItems(req *entities.Cart) (*entities.Cart, error) {
	query := `
	SELECT
		"id",
		"product_id",
		"total",
		"items"
	FROM "carts"
	WHERE "user_id" = $1;
	`

	rows, err := c.Db.Queryx(query, req.UserId)
	if err != nil {
		return nil, err
	}

	var product_json []byte
	for rows.Next() {
		err = rows.Scan(&req.Id, &req.ProductId, &req.Total, &product_json)
		if err != nil {
			return nil, err
		}
	}

	err = json.Unmarshal(product_json, &req.Items)
	if err != nil {
		return nil, err
	}

	return req, nil

}

func (c *CartRepo) DeleteCartItem(req *entities.CartDeleteReq) error {
	query := `
	DELETE FROM "carts"
	WHERE "id" = $1;
	`

	rows, err := c.Db.Queryx(query, req.Id)
	if err != nil {
		return err
	}

	type Id struct {
		Id int `json:"id"`
	}

	var Ids Id

	for rows.Next() {
		err = rows.Scan(&Ids)
		if err != nil {
			return err
		}
	}

	if Ids.Id == 0 {
		return errors.New("cart item not found")
	}

	return nil
}

func (c *CartRepo) GetProductVariantById(req *entities.ProductVariant) error {
	query := `
	SELECT
		"product_variants"."id",
		"product_variants"."product_id",
		"product_variants"."stock",
		"product_variants"."price",
		"product_variants"."color",
		"product_variants"."size",
		"product_variants"."model"
	FROM "product_variants"
	WHERE "product_variants"."id" = $1;
	`

	err := c.Db.QueryRowx(query, req.Id).StructScan(req)
	if err != nil {
		return err
	}

	return nil
}
