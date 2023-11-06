package main

import (
	"errors"
	"log"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/server"
	"github.com/Bukharney/ModX/pkg/databases"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	cfg := new(configs.Configs)

	cfg.App.Host = "localhost"
	cfg.App.Port = "8080"

	cfg.PostgreSQL.Host = "localhost"
	cfg.PostgreSQL.Port = "5432"
	cfg.PostgreSQL.SSLMode = "disable"
	cfg.PostgreSQL.Protocol = "tcp"
	cfg.PostgreSQL.Username = "postgres"
	cfg.PostgreSQL.Password = "postgres"
	cfg.PostgreSQL.Database = "ModX"

	db, err := databases.NewPostgreSQL(cfg)
	if err != nil {
		log.Fatal(errors.New("failed to connect to PostgreSQL"))
	}

	srv := server.NewServer(cfg, db)

	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
}
