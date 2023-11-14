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
	"desc" VARCHAR(255) NOT NULL,
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
