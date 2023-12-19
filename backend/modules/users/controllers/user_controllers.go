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

	r.POST("/", controllers.Register)
	r.GET("/", controllers.GetUserDetails, middlewares.JwtAuthentication())
	r.DELETE("/", controllers.DeleteAccount, middlewares.JwtAuthentication())
	r.POST("/change-password", controllers.ChangePassword, middlewares.JwtAuthentication())
	r.POST("/shipping", controllers.Shipping, middlewares.JwtAuthentication())
	r.GET("/shipping", controllers.GetShippingDetails, middlewares.JwtAuthentication())
	r.PUT("/shipping", controllers.UpdateShippingDetails, middlewares.JwtAuthentication())
}

// @Summary Register
// @Description Register
// @Tags Users
// @Accept  json
// @Produce  json
// @Param credentials body entities.UsersRegisterReq true "Credentials"
// @Success 200 {object} entities.UsersRegisterRes
// @Router /users/register [post]
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

// @Summary Create Shipping
// @Description Create Shipping
// @Tags Shipping
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param shipping body entities.UsersShippingReq true "Shipping"
// @Success 200 {object} entities.UsersShippingRes
// @Router /users/shipping [post]
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

// @Summary Get User Details
// @Description Get User Details
// @Tags Users
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} entities.UsersDataRes
// @Router /users [get]
func (u *UsersController) GetUserDetails(c *gin.Context) {
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
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

// @Summary Get Shipping Details
// @Description Get Shipping Details
// @Tags Shipping
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} entities.UsersShippingReq
// @Router /users/shipping [get]
func (u *UsersController) GetShippingDetails(c *gin.Context) {
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
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

// @Summary Update Shipping Details
// @Description Update Shipping Details
// @Tags Shipping
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param shipping body entities.UsersShippingReq true "Shipping"
// @Success 200 {object} entities.UsersShippingReq
// @Router /users/shipping [put]
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

// @Summary Delete Account
// @Description Delete Account
// @Tags Users
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} entities.UsersShippingRes
// @Router /users [delete]
func (u *UsersController) DeleteAccount(c *gin.Context) {
	user, err := middlewares.GetUserByToken(c)
	if err != nil {
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
