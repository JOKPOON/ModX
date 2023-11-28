package controllers

import (
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

	r.GET("/all", controllers.GetWhishlistItems, middlewares.JwtAuthentication())
	r.POST("/add", controllers.AddWhishlistItem, middlewares.JwtAuthentication())
	r.DELETE("/delete", controllers.DeleteWhishlistItem, middlewares.JwtAuthentication())
}

func (c *WishlistController) GetWhishlistItems(ctx *gin.Context) {
	role, err := middlewares.GetUserByToken(ctx)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
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

	req := &entities.WhishlistAddReq{
		UserId: role.Id,
	}

	err = ctx.BindJSON(req)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := c.WishlistUsecase.AddWishlistItem(req)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
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

	err = ctx.BindJSON(req)
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