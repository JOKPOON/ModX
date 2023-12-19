package main

import (
	"errors"
	"log"
	"os"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/pkg/databases"
	"github.com/Bukharney/ModX/server"
)

// @title           ModX API
// @version         1.0
// @description     This is a ModX API server.
// @host 		  	localhost:8080
// @BasePath 	  	/v1
// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
func main() {
	cfg := new(configs.Configs)

	host, err := os.Hostname()
	if err != nil {
		log.Fatal(errors.New("failed to get hostname"))
	}

	log.Println(host)
	if host != "railway" {
		cfg.URL = "https://storage.googleapis.com/modx-product-image/"
		cfg.PostgreSQL.Host = "localhost"
		cfg.PostgreSQL.Port = "5432"
		cfg.PostgreSQL.Username = "postgres"
		cfg.PostgreSQL.Password = "postgres"
		cfg.PostgreSQL.Database = "ModX"
	} else {
		cfg.URL = "https://storage.googleapis.com/modx-product-image/"
		cfg.PostgreSQL.Host = os.Getenv("PGHOST")
		cfg.PostgreSQL.Port = os.Getenv("PGPORT")
		cfg.PostgreSQL.Username = os.Getenv("POSTGRES_USER")
		cfg.PostgreSQL.Password = os.Getenv("POSTGRES_PASSWORD")
		cfg.PostgreSQL.Database = os.Getenv("POSTGRES_DB")
	}

	db, err := databases.NewPostgreSQL(cfg)
	if err != nil {
		log.Fatal(err)
	}

	storage, err := databases.NewGoolgeCloudStorage(cfg)
	if err != nil {
		log.Fatal(err)
	}

	srv := server.NewServer(db, cfg, storage)

	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
}
