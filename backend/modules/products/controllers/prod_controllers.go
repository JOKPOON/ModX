package controllers

import (
	"net/http"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/modules/products/usecases"
	"github.com/gin-gonic/gin"
)

type ProductController struct {
	ProductUsecases usecases.ProductUsecases
}

func NewProductController(productUsecases usecases.ProductUsecases) *ProductController {
	return &ProductController{ProductUsecases: productUsecases}
}

func (p *ProductController) Upload(c *gin.Context) (*entities.FileUploadRes, error) {
	var req entities.FileUploadReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return nil, err
	}

	res, err := p.ProductUsecases.Upload(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return nil, err
	}

	return res, nil
}

func (p *ProductController) Create(c *gin.Context) {
	var req entities.Product

	file, err := p.Upload(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Picture = file.FilePaths

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := p.ProductUsecases.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, res)
}
