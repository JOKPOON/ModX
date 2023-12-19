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

	r.POST("/", controllers.Create, middlewares.JwtAuthentication())
	r.PUT("/", controllers.Update, middlewares.JwtAuthentication())
	r.GET("/", controllers.GetAll, middlewares.JwtAuthentication())
	r.GET("/:id", controllers.Get, middlewares.JwtAuthentication())
}

// @Summary Create Order
// @Description Create Order
// @Tags Order
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param order body entities.OrderCreateReq true "Order"
// @Success 200 {object} entities.OrderCreateRes
// @Router /order [post]
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

// @Summary Update Order
// @Description Update Order
// @Tags Order
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param order body entities.OrderUpdateReq true "Order"
// @Success 200 {object} string
// @Router /order [put]
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

// @Summary Get All Orders
// @Description Get All Orders
// @Tags Order
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} []entities.OrderGetAllRes
// @Router /order [get]
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

// @Summary Get Order
// @Description Get Order
// @Tags Order
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param id path int true "Order ID"
// @Success 200 {object} []entities.OrderGetRes
// @Router /order/{id} [get]
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
