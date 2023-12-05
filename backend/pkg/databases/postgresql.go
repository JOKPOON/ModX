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
	"price" INT NOT NULL,
	"category" VARCHAR(255) NOT NULL,
	"discount" INT NOT NULL,
	"options" TEXT NOT NULL,
	"rating" INT NOT NULL,
	"sold" INT NOT NULL,
	"stock" INT NOT NULL,
	"picture" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "shippings" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"name" VARCHAR(255) NOT NULL,
	"tel" VARCHAR(255) NOT NULL,
	"address" VARCHAR(255) NOT NULL,
	"sub_dist" VARCHAR(255) NOT NULL,
	"district" VARCHAR(255) NOT NULL,
	"province" VARCHAR(255) NOT NULL,
	"zip" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"shipping_id" INT NOT NULL REFERENCES "shippings" ("id") ON DELETE CASCADE,
	"shipping_type" VARCHAR(255) NOT NULL,
	"shipping_cost" INT NOT NULL,
	"items_cost" INT NOT NULL,
	"total_cost" INT NOT NULL,
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
	"options" JSON NOT NULL,
	"price" INT NOT NULL,
	"quantity" INT NOT NULL,
	"is_reviewed" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "carts" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
	"options" VARCHAR(255) NOT NULL,
	"quantity" INT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "whishlist" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
	"options" VARCHAR(255) NOT NULL,
	"quantity" INT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
	"product_id" INT NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
	"order_product_id" INT NOT NULL REFERENCES "order_products" ("id") ON DELETE CASCADE,
	"rating" INT NOT NULL,
	"comment" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "payments" (
	"id" SERIAL PRIMARY KEY,
	"order_id" INT NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
	"token" TEXT NOT NULL,
	"amount" INT NOT NULL,
	"charge" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

func NewPostgreSQL(cfg *configs.Configs) (*sqlx.DB, error) {
	connectionUrl, err := utils.ConnectionUrlBuilder("postgres", cfg)
	if err != nil {
		return nil, err
	}

	log.Println("Connecting to PostgreSQL")

	log.Println(connectionUrl)
	db, err := sqlx.Connect("postgres", connectionUrl)
	if err != nil {
		return nil, errors.New("failed to connect to PostgreSQL")

	}

	db.MustExec(schema)

	log.Println("Connected to PostgreSQL")
	return db, nil
}
