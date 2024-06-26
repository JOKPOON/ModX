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
// @host modx.bukharney.tech/api
// @BasePath /v1
// @schemes https
// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
func main() {
	cfg := new(configs.Configs)

	mustGetenv := func(key string) string {
		v := os.Getenv(key)
		if v == "" {
			log.Fatalf("missing env var %s", key)
		}
		return v
	}

	cfg.S3.URL = mustGetenv("AWS_S3_URL")
	cfg.S3.BucketName = mustGetenv("AWS_S3_BUCKET_NAME")
	cfg.AWS.AccessKeyID = mustGetenv("AWS_ACCESS_KEY")
	cfg.AWS.SecretAccessKey = mustGetenv("AWS_SECRET_ACCESS_KEY")
	cfg.AWS.Region = mustGetenv("AWS_REGION")
	cfg.PostgreSQL.Host = mustGetenv("POSTGRES_HOST")
	cfg.PostgreSQL.Port = mustGetenv("POSTGRES_PORT")
	cfg.PostgreSQL.Username = mustGetenv("POSTGRES_USER")
	cfg.PostgreSQL.Password = mustGetenv("POSTGRES_PASSWORD")
	cfg.PostgreSQL.Database = mustGetenv("POSTGRES_DB")
	cfg.Omi.PublicKey = mustGetenv("OMISE_PUBLIC_KEY")
	cfg.Omi.SecretKey = mustGetenv("OMISE_SECRET_KEY")

	db, err := databases.NewPostgreSQL(cfg)
	if err != nil {
		log.Fatal(err)
	}

	storage, err := databases.NewAwsS3(cfg)
	if err != nil {
		log.Fatal(err)
	}

	srv := server.NewServer(db, cfg, storage)
	err = srv.Run()
	if err != nil {
		log.Fatal(err)
	}
}
