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
// @host modx-production.up.railway.app
// @BasePath /v1
// @schemes https
// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
func main() {
	cfg := new(configs.Configs)

	mustGetenv := func(k string) string {
		v := os.Getenv(k)
		if v == "" {
			log.Fatalf("missing env var %s", k)
		}
		return v
	}

	host, err := os.Hostname()
	if err != nil {
		log.Fatal(errors.New("failed to get hostname"))
	}

	if host != "railway" {
		cfg.GCS.URL = "https://storage.googleapis.com/modx-product-image/"
		cfg.PostgreSQL.Host = "postgres"
		cfg.PostgreSQL.Port = "5432"
		cfg.PostgreSQL.Username = "postgres"
		cfg.PostgreSQL.Password = "junepoon"
		cfg.PostgreSQL.Database = "ModX"
	} else {
		cfg.GCS.URL = "https://storage.googleapis.com/modx-product-image/"
		cfg.PostgreSQL.Host = mustGetenv("PGHOST")
		cfg.PostgreSQL.Port = mustGetenv("PGPORT")
		cfg.PostgreSQL.Username = mustGetenv("POSTGRES_USER")
		cfg.PostgreSQL.Password = mustGetenv("POSTGRES_PASSWORD")
		cfg.PostgreSQL.Database = mustGetenv("POSTGRES_DB")
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
	err = srv.Run()
	if err != nil {
		log.Fatal(err)
	}
}
