package controllers

import (
	"strconv"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type WishlistController struct {
	Cfg             *configs.Configs
	WishlistUsecase entities.WishlistUsecase
	UsersUsecase    entities.UsersUsecase
}

func NewWishlistControllers(
	r gin.IRoutes,
	cfg *configs.Configs,
	usersUsecase entities.UsersUsecase,
	wishlistUsecase entities.WishlistUsecase) {
	controllers := &WishlistController{
		Cfg:             cfg,
		WishlistUsecase: wishlistUsecase,
		UsersUsecase:    usersUsecase,
	}

	r.GET("/", controllers.GetWhishlistItems, middlewares.JwtAuthentication())
	r.POST("/", controllers.AddWhishlistItem, middlewares.JwtAuthentication())
	r.DELETE("/:id", controllers.DeleteWhishlistItem, middlewares.JwtAuthentication())
}

func (c *WishlistController) GetWhishlistItems(ctx *gin.Context) {
	role, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		return
	}

	req := &entities.WhishlistGetReq{
		UserId: role.Id,
	}

	res, err := c.WishlistUsecase.GetWishlistItems(req)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(200, res)
}

func (c *WishlistController) AddWhishlistItem(ctx *gin.Context) {
	role, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	var req entities.WhishlistAddReq
	err = ctx.ShouldBind(&req.Products)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error bind": err.Error(),
		})
		return
	}

	req.UserId = role.Id

	res, err := c.WishlistUsecase.AddWishlistItem(&req)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error add": err.Error(),
		})
		return
	}

	ctx.JSON(200, res)
}

func (c *WishlistController) DeleteWhishlistItem(ctx *gin.Context) {
	role, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	req := &entities.WhishlistDeleteReq{
		UserId: role.Id,
	}

	id := ctx.Param("id")
	req.Id, err = strconv.Atoi(id)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := c.WishlistUsecase.DeleteWishlistItem(req)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(200, res)
}
