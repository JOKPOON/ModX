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

	_paymentController "github.com/Bukharney/ModX/modules/payment/controllers"
	_paymentRepo "github.com/Bukharney/ModX/modules/payment/repositories"
	_paymentUsecase "github.com/Bukharney/ModX/modules/payment/usecases"

	_cartController "github.com/Bukharney/ModX/modules/cart/controllers"
	_cartRepo "github.com/Bukharney/ModX/modules/cart/repositories"
	_cartUsecase "github.com/Bukharney/ModX/modules/cart/usecases"

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

	// Payment
	paymentGroup := v1.Group("/payment")
	paymentRepo := _paymentRepo.NewPaymentRepo(s.DB)
	paymentUsecase := _paymentUsecase.NewPaymentUsecase(paymentRepo)
	_paymentController.NewPaymentControllers(paymentGroup, s.Cfg, paymentUsecase)

	// Product
	productGroup := v1.Group("/product")
	productRepo := _productRepo.NewProductRepo(s.DB)
	productUsecase := _productUsecase.NewProductUsecases(productRepo, fileRepo)
	_productController.NewProductControllers(productGroup, s.Cfg, usersUsecase, productUsecase, fileUsecase)

	// Cart
	cartGroup := v1.Group("/cart")
	cartRepo := _cartRepo.NewCartRepo(s.DB)
	cartUsecase := _cartUsecase.NewCartUsecase(cartRepo)
	_cartController.NewCartControllers(cartGroup, s.Cfg, usersUsecase, cartUsecase)

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
