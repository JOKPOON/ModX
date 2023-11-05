package server

import (
	"net/http"

	_usersController "github.com/Bukharney/ModX/modules/users/controllers"
	_usersRepo "github.com/Bukharney/ModX/modules/users/repositories"
	_usersUsecase "github.com/Bukharney/ModX/modules/users/usecases"

	_authController "github.com/Bukharney/ModX/modules/auth/controllers"
	_authRepo "github.com/Bukharney/ModX/modules/auth/repositories"
	_authUsecase "github.com/Bukharney/ModX/modules/auth/usecases"

	"github.com/gin-gonic/gin"
)

func (s *Server) MapHandlers() error {
	v1 := s.App.Group("/v1")

	// Users
	usersGroup := v1.Group("/users")
	usersRepo := _usersRepo.NewUsersRepo(s.DB)
	usersUsecase := _usersUsecase.NewUsersUsecases(usersRepo)
	_usersController.NewUsersControllers(usersGroup, usersUsecase)

	// Auth
	authGroup := v1.Group("/auth")
	authRepo := _authRepo.NewAuthRepo(s.DB)
	authUsecase := _authUsecase.NewAuthUsecases(authRepo, usersRepo)
	_authController.NewAuthControllers(authGroup, s.Cfg, authUsecase)

	s.App.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not Found"})
	})

	return nil
}
