package controllers

import (
	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/gin-gonic/gin"
)

type PaymentController struct {
	Cfg            *configs.Configs
	PaymentUsecase entities.PaymentUsecase
}

func NewPaymentControllers(
	r gin.IRoutes,
	cfg *configs.Configs,
	paymentUsecase entities.PaymentUsecase) {
	controllers := PaymentController{
		Cfg:            cfg,
		PaymentUsecase: paymentUsecase,
	}

	r.POST("/charge", controllers.Charge)
}

// @Summary Charge
// @Description Charge
// @Tags Payment
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param charge body entities.PaymentChargeReq true "Charge"
// @Success 200 {object} entities.PaymentChargeRes
// @Router /payment/charge [post]
func (p *PaymentController) Charge(c *gin.Context) {
	charge := new(entities.PaymentChargeReq)
	err := c.ShouldBind(charge)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	res, err := p.PaymentUsecase.Charge(charge)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, res)
}
