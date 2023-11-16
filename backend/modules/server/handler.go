package server

import (
	"net/http"

	_usersController "github.com/Bukharney/ModX/modules/users/controllers"
	_usersRepo "github.com/Bukharney/ModX/modules/users/repositories"
	_usersUsecase "github.com/Bukharney/ModX/modules/users/usecases"

	_authController "github.com/Bukharney/ModX/modules/auth/controllers"
	_authRepo "github.com/Bukharney/ModX/modules/auth/repositories"
	_authUsecase "github.com/Bukharney/ModX/modules/auth/usecases"

	_productController "github.com/Bukharney/ModX/modules/products/controllers"
	_productRepo "github.com/Bukharney/ModX/modules/products/repositories"
	_productUsecase "github.com/Bukharney/ModX/modules/products/usecases"

	_fileController "github.com/Bukharney/ModX/modules/file/controllers"
	_fileRepo "github.com/Bukharney/ModX/modules/file/repositories"
	_fileUsecase "github.com/Bukharney/ModX/modules/file/usecases"

	_orderController "github.com/Bukharney/ModX/modules/orders/controllers"
	_orderRepo "github.com/Bukharney/ModX/modules/orders/repositories"
	_orderUsecase "github.com/Bukharney/ModX/modules/orders/usecases"

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

	// File
	fileGroup := v1.Group("/file")
	fileRepo := _fileRepo.NewFileRepo(s.DB)
	fileUsecase := _fileUsecase.NewFileUsecase(usersRepo, fileRepo)
	_fileController.NewFileControllers(fileGroup, s.Cfg, fileUsecase)

	// Order
	orderGroup := v1.Group("/order")
	orderRepo := _orderRepo.NewOrderRepo(s.DB)
	orderUsecase := _orderUsecase.NewOrderUsecases(orderRepo, usersRepo)
	_orderController.NewOrderControllers(orderGroup, s.Cfg, usersUsecase, orderUsecase)

	// Product
	productGroup := v1.Group("/product")
	productRepo := _productRepo.NewProductRepo(s.DB)
	productUsecase := _productUsecase.NewProductUsecases(productRepo, fileRepo)
	_productController.NewProductControllers(productGroup, s.Cfg, usersUsecase, productUsecase, fileUsecase)

	s.App.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not Found"})
	})

	return nil
}

func (s *Server) FileServer() error {
	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("./static/"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	s.App.GET("/static/*filepath", func(c *gin.Context) {
		mux.ServeHTTP(c.Writer, c.Request)
	})

	s.App.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not Found"})
	})

	return nil
}
