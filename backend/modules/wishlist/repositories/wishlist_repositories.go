package repositories

import (
	"encoding/json"
	"strings"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type WishlistRepo struct {
	Cfg *configs.Configs
	Db  *sqlx.DB
}

func NewWishlistRepo(db *sqlx.DB, cfg *configs.Configs) entities.WishlistRepository {
	return &WishlistRepo{Db: db, Cfg: cfg}
}

func (r *WishlistRepo) GetWishlistItems(req *entities.WhishlistGetReq) (*entities.WhishlistGetRes, error) {
	products := []entities.Whishlist{}
	query := `
	SELECT 
		whishlist.id,
		whishlist.user_id,
		whishlist.product_id,
		whishlist.quantity,
		whishlist.options,
		whishlist.created_at,
		whishlist.updated_at,
		products.price
	FROM whishlist
	INNER JOIN products ON products.id = whishlist.product_id
	WHERE whishlist.user_id = $1
	`
	row, err := r.Db.Queryx(query, req.UserId)
	if err != nil {
		return nil, err
	}

	for row.Next() {
		var product entities.Whishlist
		var options_json string
		err := row.Scan(
			&product.Id,
			&product.UserId,
			&product.ProductId,
			&product.Quantity,
			&options_json,
			&product.CreatedAt,
			&product.UpdatedAt,
			&product.Price,
		)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal([]byte(options_json), &product.Options)
		if err != nil {
			return nil, err
		}

		products = append(products, product)
	}

	res := &entities.WhishlistGetRes{
		Products: products,
		Totals:   len(products),
	}

	return res, nil
}

func (r *WishlistRepo) AddWishlistItem(req *entities.WhishlistAddReq) (*entities.WhishlistAddRes, error) {
	products := []entities.Whishlist{}

	options_json, err := json.Marshal(req.Products.Options)
	if err != nil {
		return nil, err
	}

	query := `SELECT user_id, product_id, options FROM whishlist WHERE user_id = $1 AND product_id = $2 AND options = $3`
	row, err := r.Db.Queryx(query, req.UserId, req.Products.ProductId, options_json)
	if err != nil {
		return nil, err
	}

	for row.Next() {
		var product entities.Whishlist
		var options_json string
		err := row.Scan(
			&product.UserId,
			&product.ProductId,
			&options_json,
		)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal([]byte(options_json), &product.Options)
		if err != nil {
			return nil, err
		}

		products = append(products, product)
	}

	if len(products) > 0 {
		query := `UPDATE whishlist SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 AND options = $4`
		_, err := r.Db.Exec(query, req.Products.Quantity, req.UserId, req.Products.ProductId, options_json)
		if err != nil {
			return nil, err
		}
	} else {
		query := `INSERT INTO whishlist (user_id, product_id, quantity, options) VALUES ($1, $2, $3, $4) RETURNING id`
		err := r.Db.Get(&req.Products.Id, query, req.UserId, req.Products.ProductId, req.Products.Quantity, options_json)
		if err != nil {
			return nil, err
		}
	}

	return &entities.WhishlistAddRes{
		Id: req.Products.Id,
	}, nil
}

func (r *WishlistRepo) DeleteWishlistItem(req *entities.WhishlistDeleteReq) (*entities.WhishlistDeleteRes, error) {
	query := `DELETE FROM whishlist WHERE user_id = $1 AND id = $2`
	_, err := r.Db.Exec(query, req.UserId, req.Id)
	if err != nil {
		return nil, err
	}

	return &entities.WhishlistDeleteRes{
		Id: req.Id,
	}, nil
}

func (r *WishlistRepo) GetProductOptions(productId int) (*entities.ProductOptions, error) {
	options := &entities.ProductOptions{}
	query := `SELECT options FROM products WHERE id = $1`
	row, err := r.Db.Queryx(query, productId)
	if err != nil {
		return nil, err
	}

	for row.Next() {
		var options_json string
		err := row.Scan(
			&options_json,
		)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal([]byte(options_json), &options.Options)
		if err != nil {
			return nil, err
		}

	}

	return options, nil
}

func (r *WishlistRepo) GetProductDetails(product_id int) (*entities.ProductGetByIdRes, error) {
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
	err := r.Db.QueryRowx(query, product_id).StructScan(&res)
	if err != nil {
		return nil, err
	}

	picture := strings.Split(res.Picture, ",")
	for i, v := range picture {
		picture[i] = r.Cfg.GCS.URL + v
	}

	res.Picture = picture[0]

	return &res, nil
}
