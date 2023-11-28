package repositories

import (
	"encoding/json"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type WishlistRepo struct {
	Db *sqlx.DB
}

func NewWishlistRepo(db *sqlx.DB) entities.WishlistRepository {
	return &WishlistRepo{Db: db}
}

func (r *WishlistRepo) GetWishlistItems(req *entities.WhishlistGetReq) (*entities.WhishlistGetRes, error) {
	products := []entities.Whishlist{}
	query := `SELECT id, user_id, product_id, quantity, options, created_at, updated_at FROM whishlist WHERE user_id = $1`
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
	err = r.Db.Select(&products, query, req.UserId, req.Products.ProductId, options_json)
	if err != nil {
		return nil, err
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
	query := `DELETE FROM whishlist WHERE user_id = $1 AND product_id = $2 AND options = $3`

	options_json, err := json.Marshal(req.Options)
	if err != nil {
		return nil, err
	}
	_, err = r.Db.Exec(query, req.UserId, req.ProductId, options_json)
	if err != nil {
		return nil, err
	}

	return &entities.WhishlistDeleteRes{
		Id: req.ProductId,
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
