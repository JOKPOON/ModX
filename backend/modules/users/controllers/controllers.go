package controllers

import (
	"net/http"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/gin-gonic/gin"
)

type UsersController struct {
	Cfg          *configs.Configs
	UsersUsecase entities.UsersUsecase
}

func NewUsersControllers(r gin.IRoutes, usersUsecase entities.UsersUsecase) {
	controllers := &UsersController{
		UsersUsecase: usersUsecase,
	}

	r.POST("/register", controllers.Register)
}

func (u *UsersController) Register(c *gin.Context) {
	req := new(entities.UsersRegisterReq)
	err := c.ShouldBind(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := u.UsersUsecase.Register(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
