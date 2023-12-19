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

// @Summary Get Wishlist Items
// @Description Get Wishlist Items
// @Tags Wishlist
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} entities.WhishlistGetRes
// @Router /wishlist [get]
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

// @Summary Add Wishlist Item
// @Description Add Wishlist Item
// @Tags Wishlist
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param wishlist body entities.WhishlistAddReq true "Wishlist"
// @Success 200 {object} entities.WhishlistAddRes
// @Router /wishlist [post]
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

// @Summary Delete Wishlist Item
// @Description Delete Wishlist Item
// @Tags Wishlist
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param id path int true "Id"
// @Success 200 {object} entities.WhishlistDeleteRes
// @Router /wishlist/{id} [delete]
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
