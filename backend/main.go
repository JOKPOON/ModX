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
			log.Fatalf("Fatal Error in connect_unix.go: %s environment variable not set.\n", k)
		}
		return v
	}

	var (
		db_user     = mustGetenv("DB_USER")
		db_password = mustGetenv("DB_PASS")
		db_host     = mustGetenv("INSTANCE_UNIX_SOCKET")
		db_name     = mustGetenv("DB_NAME")
	)

	host, err := os.Hostname()
	if err != nil {
		log.Fatal(errors.New("failed to get hostname"))
	}

	if host != "railway" {
		cfg.URL = "https://storage.googleapis.com/modx-product-image/"
		cfg.PostgreSQL.Host = db_host
		cfg.PostgreSQL.Port = "5432"
		cfg.PostgreSQL.Username = db_user
		cfg.PostgreSQL.Password = db_password
		cfg.PostgreSQL.Database = db_name
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
	err = srv.Run()
	if err != nil {
		log.Fatal(err)
	}
}
