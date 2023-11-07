package server

import (
	"errors"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/pkg/utils"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Server struct {
	App *gin.Engine
	Cfg *configs.Configs
	DB  *sqlx.DB
}

func NewServer(cfg *configs.Configs, db *sqlx.DB) *Server {
	return &Server{
		App: gin.Default(),
		Cfg: cfg,
		DB:  db,
	}
}

func (s *Server) Run() error {
	err := s.MapHandlers()
	if err != nil {
		return errors.New("failed to map handlers")
	}

	err = s.FileServer()
	if err != nil {
		return errors.New("failed to run file server")
	}

	ginConectionUrl, err := utils.ConnectionUrlBuilder("gin", s.Cfg)
	if err != nil {
		return errors.New("failed to build gin connection url")
	}

	err = s.App.Run(ginConectionUrl)
	if err != nil {
		return errors.New("failed to run gin")
	}

	return nil
}
