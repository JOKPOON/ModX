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
	r.GET("/refresh-token", controllers.RefreshToken)
}

// @Summary Login
// @Description Login
// @Tags Auth
// @Accept  json
// @Produce  json
// @Param credentials body entities.UsersCredentials true "Credentials"
// @Success 200 {object} entities.UsersLoginRes
// @Router /auth/login [post]
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

// @Summary Auth Test
// @Description Auth Test
// @Tags Auth
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} string
// @Router /auth/auth-test [get]
func (a *AuthController) AuthTest(c *gin.Context) {
	tk, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, tk)
}

// @Summary Refresh Token
// @Description Refresh Token
// @Tags Auth
// @Accept  json
// @Produce  json
// @Success 200 {object} string
// @Router /auth/refresh-token [get]
func (a *AuthController) RefreshToken(c *gin.Context) {
	middlewares.RefreshToken(c)
}
