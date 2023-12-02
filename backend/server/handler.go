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

	_wishlistController "github.com/Bukharney/ModX/modules/wishlist/controllers"
	_wishlistRepo "github.com/Bukharney/ModX/modules/wishlist/repositories"
	_wishlistUsecase "github.com/Bukharney/ModX/modules/wishlist/usecases"

	"github.com/gin-gonic/gin"
)

func (s *Server) MapHandlers() error {
	v1 := s.App.Group("/v1")

	usersGroup := v1.Group("/users")
	authGroup := v1.Group("/auth")
	fileGroup := v1.Group("/file")
	orderGroup := v1.Group("/order")
	paymentGroup := v1.Group("/payment")
	productGroup := v1.Group("/product")
	cartGroup := v1.Group("/cart")
	wishlistGroup := v1.Group("/wishlist")

	usersRepo := _usersRepo.NewUsersRepo(s.DB)
	authRepo := _authRepo.NewAuthRepo(s.DB)
	fileRepo := _fileRepo.NewFileRepo(s.DB)
	orderRepo := _orderRepo.NewOrderRepo(s.DB)
	paymentRepo := _paymentRepo.NewPaymentRepo(s.DB)
	productRepo := _productRepo.NewProductRepo(s.DB)
	cartRepo := _cartRepo.NewCartRepo(s.DB)
	wishlistRepo := _wishlistRepo.NewWishlistRepo(s.DB)

	authUsecase := _authUsecase.NewAuthUsecases(authRepo, usersRepo)
	usersUsecase := _usersUsecase.NewUsersUsecases(usersRepo)
	fileUsecase := _fileUsecase.NewFileUsecase(usersRepo, fileRepo)
	orderUsecase := _orderUsecase.NewOrderUsecases(orderRepo, usersRepo)
	paymentUsecase := _paymentUsecase.NewPaymentUsecase(paymentRepo)
	productUsecase := _productUsecase.NewProductUsecases(productRepo, fileRepo)
	cartUsecase := _cartUsecase.NewCartUsecase(cartRepo)
	wishlistUsecase := _wishlistUsecase.NewWishlistUsecases(wishlistRepo)

	_usersController.NewUsersControllers(usersGroup, usersUsecase, authUsecase)
	_authController.NewAuthControllers(authGroup, s.Cfg, authUsecase)
	_fileController.NewFileControllers(fileGroup, s.Cfg, fileUsecase)
	_orderController.NewOrderControllers(orderGroup, s.Cfg, usersUsecase, orderUsecase)
	_paymentController.NewPaymentControllers(paymentGroup, s.Cfg, paymentUsecase)
	_productController.NewProductControllers(productGroup, s.Cfg, usersUsecase, productUsecase, fileUsecase)
	_cartController.NewCartControllers(cartGroup, s.Cfg, usersUsecase, cartUsecase)
	_wishlistController.NewWishlistControllers(wishlistGroup, s.Cfg, usersUsecase, wishlistUsecase)

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
