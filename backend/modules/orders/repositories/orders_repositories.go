package repositories

import (
	"github.com/jmoiron/sqlx"

	"github.com/Bukharney/ModX/modules/entities"
)

type OrderRepo struct {
	Db *sqlx.DB
}

func NewOrderRepo(db *sqlx.DB) *OrderRepo {
	return &OrderRepo{Db: db}
}

func (o *OrderRepo) CreateOrder(req *entities.OrderCreateReq) (*entities.OrderCreateReq, error) {
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
	).Scan(&req.Id)
	if err != nil {
		return nil, err
	}

	return req, nil
}

func (o *OrderRepo) Create(req *entities.OrderCreateReq) (*entities.OrderCreateRes, error) {
	for _, v := range req.OrderProducts {
		query := `
		INSERT INTO "order_products"(
			"order_id",
			"product_id"
		)

		VALUES ($1, $2)
		RETURNING "id";
		`

		order_items := entities.OrderItems{}
		err := o.Db.QueryRowx(
			query,
			req.Id,
			v.ProductId,
		).Scan(&order_items.Id)

		if err != nil {
			return nil, err
		}

		query = `
		SELECT
			"product_variants"."id",
			"product_variants"."product_id",
			"product_variants"."price",
			"product_variants"."color",
			"product_variants"."size",
			"product_variants"."model"
		FROM "product_variants"
		WHERE "product_variants"."id" = $1;
		`

		product := entities.ProductVariant{}
		for _, v := range v.OrderItems {
			err = o.Db.QueryRowx(query, v.ProductVariantId).StructScan(&product)
			if err != nil {
				return nil, err
			}
		}

		for _, v := range v.OrderItems {
			query = `
			INSERT INTO "items"(
				"order_products_id",
				"quantity",
				"price",
				"color",
				"size",
				"model"
			)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING "id";
			`

			items := new(entities.OrderItems)
			err = o.Db.QueryRowx(
				query,
				order_items.Id,
				v.Quantity,
				product.Price,
				product.Color,
				product.Size,
				product.Model,
			).Scan(&items.Id)

			if err != nil {
				return nil, err
			}
		}

	}

	return &entities.OrderCreateRes{
		Status:  "success",
		Message: "order created",
	}, nil

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

	err = o.Db.QueryRowx(query, order.Shipping.ID).StructScan(order.Shipping)
	if err != nil {
		return nil, err
	}

	return order, nil

}
