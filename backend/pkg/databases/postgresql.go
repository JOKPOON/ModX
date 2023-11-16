package databases

import (
	"errors"
	"log"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/pkg/utils"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var schema = `
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(255) UNIQUE NOT NULL,
	"email" VARCHAR(255) UNIQUE NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"roles" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" SERIAL PRIMARY KEY,
	"title" VARCHAR(255) NOT NULL,
	"description" VARCHAR(255) NOT NULL,
	"price" FLOAT NOT NULL,
	"category" VARCHAR(255) NOT NULL,
	"sub_type" VARCHAR(255) NOT NULL,
	"sold" INT NOT NULL,
	"stock" INT NOT NULL,
	"picture" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "product_variants" (
    "id" SERIAL PRIMARY KEY,
    "product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
    "price" FLOAT NOT NULL,
    "stock" INT NOT NULL,
    "color" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "composite_key" UNIQUE ("product_id", "color", "size", "model")
);

CREATE TABLE IF NOT EXISTS "shippings" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"address" VARCHAR(255) NOT NULL,
	"city" VARCHAR(255) NOT NULL,
	"province" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"shipping_id" INT NOT NULL REFERENCES "shippings" ("id") ON DELETE CASCADE,
	"shipping_type" VARCHAR(255) NOT NULL,
	"shipping_cost" FLOAT NOT NULL,
	"items_cost" FLOAT NOT NULL,
	"total_cost" FLOAT NOT NULL,
	"payment_type" VARCHAR(255) NOT NULL,
	"payment_status" VARCHAR(255) NOT NULL,
	"status" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "order_products" (
    "id" SERIAL PRIMARY KEY,
    "order_id" INT NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
    "product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
    CONSTRAINT "order_products_key" UNIQUE ("order_id", "product_id")
);

CREATE TABLE IF NOT EXISTS "items" (
	"id" SERIAL PRIMARY KEY,
	"order_products_id" INT NOT NULL REFERENCES "order_products" ("id") ON DELETE CASCADE,
	"quantity" INT NOT NULL,
	"price" FLOAT NOT NULL,
	"color" VARCHAR(255) NOT NULL,
	"size" VARCHAR(255) NOT NULL,
	"model" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "carts" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"product_variant_id" INT NOT NULL REFERENCES "product_variants" ("id") ON DELETE CASCADE,
	"quantity" INT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
	"rating" FLOAT NOT NULL,
	"comment" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

func NewPostgreSQL(cfg *configs.Configs) (*sqlx.DB, error) {
	connectionUrl, err := utils.ConnectionUrlBuilder("postgres", cfg)
	if err != nil {
		return nil, err
	}

	db, err := sqlx.Connect("postgres", connectionUrl)
	if err != nil {
		return nil, errors.New("failed to connect to PostgreSQL")

	}

	db.MustExec(schema)

	log.Println("Connected to PostgreSQL")
	return db, nil
}
