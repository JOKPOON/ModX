package repositories

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"

	"github.com/Bukharney/ModX/modules/entities"
)

type OrderRepo struct {
	Db *sqlx.DB
}

func NewOrderRepo(db *sqlx.DB) *OrderRepo {
	return &OrderRepo{Db: db}
}

func (o *OrderRepo) CreateOrder(req *entities.OrderCreateReq) (*entities.OrderCreateRes, error) {
	s_id, err := o.GetShippingId(req.UserId)
	if err != nil {
		return nil, err
	}

	req.ShippingId = s_id

	query := `
	INSERT INTO "orders"(
		"user_id",
		"shipping_id",
		"shipping_type",
		"items_cost",
		"shipping_cost",
		"total_cost",
		"payment_type",
		"payment_status",
		"status"
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	RETURNING "id";
	`

	var res entities.OrderCreateRes
	err = o.Db.QueryRowx(
		query,
		req.UserId,
		req.ShippingId,
		req.ShippingType,
		req.ItemCost,
		req.ShippingCost,
		req.TotalCost,
		req.PaymentType,
		req.PaymentStatus,
		req.Status,
	).Scan(&res.OrderId)

	if err != nil {
		return nil, fmt.Errorf("failed to create order: %w", err)
	}

	return &res, nil
}

func (o *OrderRepo) Create(req *entities.OrderCreateReq) (*entities.OrderCreateRes, error) {
	for _, v := range req.OrderProducts {
		query := `
		INSERT INTO "order_products"(
			"order_id",
			"product_id",
			"options",
			"price",
			"quantity"
		)
		VALUES ($1, $2, $3, $4, $5);
		`

		option, err := json.Marshal(v.Options)
		if err != nil {
			return nil, err
		}

		_, err = o.Db.Exec(
			query,
			req.Id,
			v.ProductId,
			option,
			v.Price,
			v.Quantity,
		)
		if err != nil {
			return nil, err
		}
	}

	return &entities.OrderCreateRes{OrderId: req.Id}, nil
}

func (o *OrderRepo) Update(req *entities.OrderUpdateReq) error {
	query := `
	UPDATE "orders"
	SET
		"payment_status" = $1,
		"status" = $2
	WHERE "id" = $3;
	`

	_, err := o.Db.Exec(query, req.PaymentStatus, req.Status, req.Id)
	if err != nil {
		return err
	}

	return nil
}

func (o *OrderRepo) GetProductOptions(product_id int) (*entities.ProductOptions, error) {
	query := `
	SELECT options FROM products WHERE id = $1;
	`

	type Options struct {
		Options string `db:"options"`
	}

	var options Options
	err := o.Db.QueryRowx(query, product_id).StructScan(&options)
	if err != nil {
		return nil, fmt.Errorf("failed to get product options: %w", err)
	}

	var options_json map[string]interface{}
	err = json.Unmarshal([]byte(options.Options), &options_json)
	if err != nil {
		return nil, errors.New("failed to unmarshal product options")
	}

	return &entities.ProductOptions{Options: options_json}, nil
}

func (o *OrderRepo) GetAll(req *entities.OrderGetAllReq) (*[]entities.OrderGatAllRes, error) {
	query := `
	SELECT
		"orders"."id",
		"orders"."total_cost",
		"orders"."updated_at",
		"orders"."status"
	FROM "orders"
	WHERE "orders"."user_id" = $1 AND "orders"."status" != $2;
	`

	var res []entities.OrderGatAllRes
	row, err := o.Db.Queryx(query, req.UserId, "")
	if err != nil {
		return nil, err
	}

	for row.Next() {
		var order entities.OrderGatAllRes
		err := row.Scan(
			&order.Id,
			&order.Total,
			&order.UpdatedAt,
			&order.Status,
		)

		if err != nil {
			return nil, err
		}

		res = append(res, order)
	}

	for i, v := range res {
		query := `
		SELECT
			"order_products"."quantity"
		FROM "order_products"
		WHERE "order_products"."order_id" = $1;
		`

		var quantity int
		row, err := o.Db.Queryx(query, v.Id)
		if err != nil {
			return nil, err
		}

		for row.Next() {
			err := row.Scan(
				&quantity,
			)

			if err != nil {
				return nil, err
			}

			res[i].Quantity += quantity
		}

		res[i].Quantity = quantity
		res[i].UpdatedAt = v.UpdatedAt[:10]

	}

	return &res, nil
}

func (o *OrderRepo) GetShippingId(user_id int) (int, error) {
	query := `
	SELECT shipping_id FROM orders WHERE user_id = $1;
	`

	var shipping_id int
	err := o.Db.QueryRowx(query, user_id).Scan(&shipping_id)
	if err != nil {
		return 0, err
	}

	return shipping_id, nil
}
