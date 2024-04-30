package server

import (
	"errors"

	"cloud.google.com/go/storage"
	"github.com/Bukharney/ModX/configs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"

	_ "github.com/Bukharney/ModX/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Server struct {
	App     *gin.Engine
	Cfg     *configs.Configs
	DB      *sqlx.DB
	Storage *storage.Client
}

func NewServer(db *sqlx.DB, cfg *configs.Configs, storage *storage.Client) *Server {
	return &Server{
		App:     gin.Default(),
		DB:      db,
		Cfg:     cfg,
		Storage: storage,
	}
}

func (s *Server) Run() error {
	gin.SetMode(gin.ReleaseMode)

	s.App.Use(cors.New(
		cors.Config{
			AllowOrigins:     []string{"*", "http://localhost:5173"},
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"*"},
			AllowCredentials: false,
			MaxAge:           12 * 3600,
		},
	))

	s.App.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	err := s.MapHandlers()
	if err != nil {
		return errors.New("failed to map handlers")
	}

	err = s.App.Run()
	if err != nil {
		return errors.New("failed to run server")
	}

	return nil
}
