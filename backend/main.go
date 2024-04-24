package main

import (
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

	cfg.GCS.URL = mustGetenv("GCLOUD_STORAGE_URL")
	cfg.PostgreSQL.Host = mustGetenv("POSTGRES_HOST")
	cfg.PostgreSQL.Port = mustGetenv("POSTGRES_PORT")
	cfg.PostgreSQL.Username = mustGetenv("POSTGRES_USER")
	cfg.PostgreSQL.Password = mustGetenv("POSTGRES_PASSWORD")
	cfg.PostgreSQL.Database = mustGetenv("POSTGRES_DB")

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
