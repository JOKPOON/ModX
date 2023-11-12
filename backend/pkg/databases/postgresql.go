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
