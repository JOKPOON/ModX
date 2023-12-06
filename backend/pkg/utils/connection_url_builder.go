package utils

import (
	"errors"
	"fmt"

	"github.com/Bukharney/ModX/configs"
)

func ConnectionUrlBuilder(s string, cfg *configs.Configs) (string, error) {
	var connectionUrl string

	switch s {
	case "postgres":
		connectionUrl = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			cfg.PostgreSQL.Host,
			cfg.PostgreSQL.Port,
			cfg.PostgreSQL.Username,
			cfg.PostgreSQL.Password,
			cfg.PostgreSQL.Database,
		)
	case "gin":
		connectionUrl = fmt.Sprintf("%s:%s",
			cfg.App.Host,
			cfg.App.Port,
		)
	default:
		return "", errors.New("invalid connection url")
	}

	return connectionUrl, nil
}
