package controllers

import (
	"log"
	"net/http"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type UsersController struct {
	Cfg          *configs.Configs
	UsersUsecase entities.UsersUsecase
	AuthUsecase  entities.AuthUsecase
}

func NewUsersControllers(r gin.IRoutes, usersUsecase entities.UsersUsecase, authUsecase entities.AuthUsecase) {
	controllers := &UsersController{
		UsersUsecase: usersUsecase,
		AuthUsecase:  authUsecase,
	}

	r.POST("/register", controllers.Register)
	r.POST("/change-password", middlewares.JwtAuthentication(), controllers.ChangePassword)
	r.POST("/shipping", controllers.Shipping, middlewares.JwtAuthentication())
	r.GET("/details", controllers.GetUserDetails, middlewares.JwtAuthentication())
	r.GET("/shipping", controllers.GetShippingDetails, middlewares.JwtAuthentication())
	r.DELETE("/delete-account", controllers.DeleteAccount, middlewares.JwtAuthentication())
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

	user := &entities.UsersCredentials{
		Username: req.Username,
		Password: req.Password,
	}

	res, err := u.UsersUsecase.Register(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	token, err := u.AuthUsecase.Login(u.Cfg, user)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	res.AccessToken = token.AccessToken

	c.JSON(http.StatusOK, res)
}

func (u *UsersController) ChangePassword(c *gin.Context) {
	claims, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	req := new(entities.UsersChangePasswordReq)
	err = c.ShouldBind(req)
	req.Username = claims.Username
	req.Id = claims.Id
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := u.UsersUsecase.ChangePassword(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (u *UsersController) Shipping(c *gin.Context) {
	req := new(entities.UsersShippingReq)
	err := c.ShouldBind(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	req.UserId = user.Id

	res, err := u.UsersUsecase.CreateUserShipping(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (u *UsersController) GetUserDetails(c *gin.Context) {
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := u.UsersUsecase.GetUserDetails(*user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (u *UsersController) GetShippingDetails(c *gin.Context) {
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := u.UsersUsecase.GetShippingDetails(*user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (u *UsersController) UpdateShippingDetails(c *gin.Context) {
	req := new(entities.UsersShippingReq)
	err := c.ShouldBind(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	req.UserId = user.Id

	res, err := u.UsersUsecase.UpdateShippingDetails(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (u *UsersController) DeleteAccount(c *gin.Context) {
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	res, err := u.UsersUsecase.DeleteAccount(*user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
