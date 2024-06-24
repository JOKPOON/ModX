package repositories

import (
	"encoding/json"
	"log"
	"strings"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type CartRepo struct {
	Cfg *configs.Configs
	Db  *sqlx.DB
}

func NewCartRepo(db *sqlx.DB, cfg *configs.Configs) entities.CartRepository {
	return &CartRepo{Db: db, Cfg: cfg}
}

func (c *CartRepo) AddCartItem(req *entities.CartAddReq) (*entities.CartAddRes, error) {
	query := `
	INSERT INTO "carts"(
		"user_id",
		"product_id",
		"options",
		"quantity"
	)
	VALUES ($1, $2, $3, $4)
	RETURNING "id";
	`

	product_json, err := json.Marshal(req.Products.Options)
	if err != nil {
		return nil, err
	}

	var res entities.CartAddRes
	err = c.Db.QueryRowx(
		query,
		req.UserId,
		req.Products.ProductId,
		product_json,
		req.Products.Quantity,
	).Scan(&res.Id)

	if err != nil {
		return nil, err
	}

	return &res, nil
}

func (c *CartRepo) GetCartItems(req *entities.CartGetReq) (*entities.CartGetRes, error) {
	query := `
	SELECT
		"carts"."id",
		"carts"."product_id",
		"carts"."options",
		"carts"."quantity"
	FROM "carts"
	WHERE "carts"."user_id" = $1;
	`

	rows, err := c.Db.Queryx(query, req.UserId)
	if err != nil {
		return nil, err
	}

	var cart entities.CartGetRes

	log.Println(cart)
	for rows.Next() {
		var product entities.CartProduct
		var options_json string
		var options map[string]string

		err = rows.Scan(
			&product.Id,
			&product.ProductId,
			&options_json,
			&product.Quantity,
		)
		if err != nil {
			return nil, err
		}

		log.Println(options_json)
		err = json.Unmarshal([]byte(options_json), &options)
		if err != nil {
			return nil, err
		}

		product.Options = options

		cart.Products = append(cart.Products, product)
	}

	return &cart, nil

}

func (c *CartRepo) GetProductOptions(product_id int) (*entities.ProductOptions, error) {
	query := `
	SELECT options FROM products WHERE id = $1;
	`

	type Options struct {
		Options string `db:"options"`
	}

	var options Options
	err := c.Db.QueryRowx(query, product_id).StructScan(&options)
	if err != nil {
		return nil, err
	}

	var options_json map[string]interface{}
	err = json.Unmarshal([]byte(options.Options), &options_json)
	if err != nil {
		return nil, err
	}

	return &entities.ProductOptions{Options: options_json}, nil
}

func (c *CartRepo) GetProductDetails(product_id int) (*entities.ProductGetByIdRes, error) {
	query := `
	SELECT
		products.id,
		products.title,
		products.picture,
		products.discount
	FROM products
	WHERE products.id = $1;
	`

	var res entities.ProductGetByIdRes
	err := c.Db.QueryRowx(query, product_id).StructScan(&res)
	if err != nil {
		return nil, err
	}

	picture := strings.Split(res.Picture, ",")
	for i, v := range picture {
		picture[i] = c.Cfg.S3.URL + v
	}

	res.Picture = picture[0]

	return &res, nil
}

func (c *CartRepo) DeleteCartItem(req *entities.CartDeleteReq) (*entities.CartDeleteRes, error) {
	query := `
	DELETE FROM "carts"
	WHERE "carts"."id" = $1
	AND "carts"."user_id" = $2
	RETURNING "id";
	`

	var res entities.CartDeleteRes
	for _, v := range req.CartId {
		err := c.Db.QueryRowx(query, v, req.UserId).Scan(&res.Id)
		if err != nil {
			return nil, err
		}
	}

	return &res, nil
}
