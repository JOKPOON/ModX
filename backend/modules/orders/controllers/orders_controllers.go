package controllers

import (
	"github.com/Bukharney/ModX/configs"
	"github.com/gin-gonic/gin"

	"github.com/Bukharney/ModX/modules/entities"
)

type OrderController struct {
	Cfg           *configs.Configs
	OrderUsecases entities.OrderUsecase
}

func NewOrderControllers(r gin.IRoutes, cfg *configs.Configs, orderUsecases entities.OrderUsecase) {
	controllers := &OrderController{
		Cfg:           cfg,
		OrderUsecases: orderUsecases,
	}

	r.POST("/create", controllers.Create)
}

func (o *OrderController) Create(c *gin.Context) {
	var req entities.OrderCreateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"message": "error, bad request blind json",
		})
		return
	}

	res, err := o.OrderUsecases.Create(&req)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "success",
		"data":    res,
	})

}

func (o *OrderController) Update(c *gin.Context) {

}
