package controllers

import (
	"net/http"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	Cfg         *configs.Configs
	AuthUsecase entities.AuthUsecase
}

func NewAuthControllers(r gin.IRoutes, cfg *configs.Configs, authUsecase entities.AuthUsecase) {
	controllers := &AuthController{
		Cfg:         cfg,
		AuthUsecase: authUsecase,
	}

	r.POST("/login", controllers.Login)
	r.GET("/auth-test", middlewares.JwtAuthentication(), controllers.AuthTest)
}

func (a *AuthController) Login(c *gin.Context) {
	req := new(entities.UsersCredentials)
	err := c.ShouldBind(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := a.AuthUsecase.Login(a.Cfg, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (a *AuthController) AuthTest(c *gin.Context) {
	tk := c.MustGet("token").(*entities.UsersClaims)
	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"token":   tk,
	})
}
