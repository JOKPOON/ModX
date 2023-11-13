package controllers

import (
	"net/http"
	"strconv"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type ProductController struct {
	Cfg            *configs.Configs
	ProductUsecase entities.ProductUsecase
	FileUsecase    entities.FileUsecase
}

func NewProductControllers(r gin.IRoutes, cfg *configs.Configs, productUsecase entities.ProductUsecase, fileUsecase entities.FileUsecase) {
	controllers := &ProductController{
		Cfg:            cfg,
		ProductUsecase: productUsecase,
		FileUsecase:    fileUsecase,
	}

	r.POST("/create", controllers.Create, middlewares.JwtAuthentication())
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 100

func (p *ProductController) Upload(c *gin.Context) (*entities.FileUploadRes, error) {
	return nil, nil
}

func (p *ProductController) Create(c *gin.Context) {
	var freq entities.FileUploadReq

	if err := c.Request.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": c.Request.Body})
		return
	}

	files := c.Request.MultipartForm.File["file"]
	freq.File = files

	res, err := p.FileUsecase.Upload(&freq)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req entities.Product

	req.Picture = res.FilePaths

	req.Title = c.PostForm("title")
	req.Desc = c.PostForm("desc")
	req.Category = c.PostForm("category")
	req.SubType = c.PostForm("sub_type")

	var variants []entities.ProductVariant

	for _, v := range c.PostFormArray("variants") {
		variants = append(variants, entities.ProductVariant{
			Price: float32(convert(v)),
			Stock: convert(v),
			Color: v,
			Size:  v,
			Model: v,
		})
	}

	req.Variants = variants

	nres, err := p.ProductUsecase.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, nres)
}

func convert(v string) int {
	i, _ := strconv.Atoi(v)
	return i
}
