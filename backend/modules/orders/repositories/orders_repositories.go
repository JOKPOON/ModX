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
	err := o.Db.QueryRowx(
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

func (o *OrderRepo) GetOrderById(id int64) (*entities.OrderGetByIdRes, error) {
	query := `
	SELECT 
		"orders"."id",
		"orders"."payment_status",
		"orders"."status",
	FROM "orders"
	WHERE "orders"."id" = $1;		
	`

	order := new(entities.OrderGetByIdRes)
	err := o.Db.QueryRowx(query, id).StructScan(order)
	if err != nil {
		return nil, err
	}

	query = `
	SELECT
		"order_items"."id",
		"order_items"."order_id",
		"order_items"."product_id"
	FROM "order_items"
	WHERE "order_items"."order_id" = $1;
	`

	type OrderItems struct {
		Id        int64 `db:"id"`
		OrderId   int64 `db:"order_id"`
		ProductId int64 `db:"product_id"`
	}

	order_product := []entities.OrderItemGetByIdRes{}
	orderItems := []OrderItems{}
	err = o.Db.Select(&orderItems, query, order.Id)
	if err != nil {
		return nil, err
	}

	query = `
	SELECT
		"products"."id",
		"products"."title"
		"products"."picture"
	FROM "products"
	WHERE "products"."id" = $1;
	`

	products := entities.ProductGetByIdRes{}
	for _, v := range orderItems {
		err = o.Db.QueryRowx(query, v.ProductId).StructScan(&products)
		if err != nil {
			return nil, err
		}

		query1 := `
		SELECT
			"items"."order_product_id",
			"items"."quantity",
			"items"."price",
			"items"."color",
			"items"."size",
			"items"."model"
		FROM "items"
		WHERE "items"."order_product_id" = $1;
		`

		items := []entities.ItemGetByIdRes{}
		err = o.Db.Select(&items, query1, v.Id)
		if err != nil {
			return nil, err
		}

		order_product = append(order_product, entities.OrderItemGetByIdRes{
			Product: products,
			Item:    items,
		})
	}

	order.OrderItems = order_product

	query = `
	SELECT
		"shippings"."id",
		"shippings"."user_id",
		"shippings"."name",
		"shippings"."address",
		"shippings"."city",
		"shippings"."province",
		"shippings"."postal_code",
		"shippings"."phone"
	FROM "shippings"
	WHERE "shippings"."id" = $1;
	`

	err = o.Db.QueryRowx(query, order.Shipping.Id).StructScan(order.Shipping)
	if err != nil {
		return nil, err
	}

	return order, nil

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
