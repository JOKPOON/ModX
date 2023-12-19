package controllers

import (
	"net/http"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type CartController struct {
	Cfg          *configs.Configs
	CartUsecase  entities.CartUsecase
	UsersUsecase entities.UsersUsecase
}

func NewCartControllers(
	r gin.IRoutes,
	cfg *configs.Configs,
	usersUsecase entities.UsersUsecase,
	cartUsecase entities.CartUsecase) {
	controllers := &CartController{
		Cfg:          cfg,
		CartUsecase:  cartUsecase,
		UsersUsecase: usersUsecase,
	}

	r.POST("/", controllers.AddCartItem, middlewares.JwtAuthentication())
	r.GET("/", controllers.GetCartItems, middlewares.JwtAuthentication())
	r.DELETE("/", controllers.DeleteCartItem, middlewares.JwtAuthentication())
}

// @Summary Get Cart Items
// @Description Get Cart Items
// @Tags Cart
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} entities.CartGetRes
// @Router /cart [get]
func (c *CartController) GetCartItems(ctx *gin.Context) {
	var req entities.CartGetReq

	role, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		return
	}

	req.UserId = role.Id

	res, err := c.CartUsecase.GetCartItems(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error get cart item": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

// @Summary Add Cart Item
// @Description Add Cart Item
// @Tags Cart
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param products body entities.CartAddReq true "Products"
// @Success 200 {object} entities.CartAddRes
// @Router /cart [post]
func (c *CartController) AddCartItem(ctx *gin.Context) {
	var req entities.CartAddReq
	err := ctx.ShouldBind(&req.Products)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		return
	}

	req.UserId = user.Id

	res, err := c.CartUsecase.AddCartItem(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

// @Summary Delete Cart Item
// @Description Delete Cart Item
// @Tags Cart
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param products body entities.CartDeleteReq true "Products"
// @Success 200 {object} entities.CartDeleteReq
// @Router /cart [delete]
func (c *CartController) DeleteCartItem(ctx *gin.Context) {
	var req entities.CartDeleteReq
	err := ctx.ShouldBind(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error bilding": err.Error()})
		return
	}

	user, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error get users": err.Error()})
		return
	}

	req.UserId = user.Id

	res, err := c.CartUsecase.DeleteCartItem(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)

}
