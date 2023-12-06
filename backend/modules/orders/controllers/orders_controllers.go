package controllers

import (
	"strconv"

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
	r.POST("/update", controllers.Update, middlewares.JwtAuthentication())
	r.GET("/", controllers.GetAll, middlewares.JwtAuthentication())
	r.GET("/:id", controllers.Get, middlewares.JwtAuthentication())
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
	var req entities.OrderUpdateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		return
	}

	if user.Role != "admin" {
		c.JSON(400, gin.H{
			"message": "permission denied",
		})
		return
	}

	err = o.OrderUsecases.Update(&req)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "success",
	})
}

func (o *OrderController) GetAll(c *gin.Context) {
	var req entities.OrderGetAllReq

	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		return
	}

	req.UserId = user.Id

	res, err := o.OrderUsecases.GetAll(&req)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, res)
}

func (o *OrderController) Get(c *gin.Context) {
	var req entities.OrderGetReq

	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		return
	}

	req.UserId = user.Id

	id := c.Param("id")
	req.Id, err = strconv.Atoi(id)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	res, err := o.OrderUsecases.Get(&req)
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, res)
}
