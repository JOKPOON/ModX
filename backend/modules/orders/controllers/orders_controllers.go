package controllers

import (
	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"

	"github.com/Bukharney/ModX/modules/entities"
)

type OrderController struct {
	Cfg           *configs.Configs
	OrderUsecases entities.OrderUsecase
	UserUsecases  entities.UsersUsecase
}

func NewOrderControllers(r gin.IRoutes, cfg *configs.Configs, userUsecase entities.UsersUsecase, orderUsecases entities.OrderUsecase) {
	controllers := &OrderController{
		Cfg:           cfg,
		OrderUsecases: orderUsecases,
		UserUsecases:  userUsecase,
	}

	r.POST("/create", controllers.Create, middlewares.JwtAuthentication())
}

func (o *OrderController) Create(c *gin.Context) {
	var req entities.OrderCreateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	req.UserId = user.Id

	res, err := o.OrderUsecases.Create(&req)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, res)

}

func (o *OrderController) Update(c *gin.Context) {

}
