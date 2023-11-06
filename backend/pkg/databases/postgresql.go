package databases

import (
	"errors"
	"log"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/pkg/utils"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func NewPostgreSQL(cfg *configs.Configs) (*sqlx.DB, error) {
	connectionUrl, err := utils.ConnectionUrlBuilder("postgres", cfg)
	if err != nil {
		return nil, err
	}

	db, err := sqlx.Connect("postgres", connectionUrl)
	if err != nil {
		return nil, errors.New("failed to connect to PostgreSQL")

	}

	log.Println("Connected to PostgreSQL")
	return db, nil
}
