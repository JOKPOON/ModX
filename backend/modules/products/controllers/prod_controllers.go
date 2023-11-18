package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type ProductController struct {
	Cfg            *configs.Configs
	ProductUsecase entities.ProductUsecase
	FileUsecase    entities.FileUsecase
	UsersUsecase   entities.UsersUsecase
}

func NewProductControllers(r gin.IRoutes, cfg *configs.Configs, usersUsecase entities.UsersUsecase, productUsecase entities.ProductUsecase, fileUsecase entities.FileUsecase) {
	controllers := &ProductController{
		Cfg:            cfg,
		ProductUsecase: productUsecase,
		FileUsecase:    fileUsecase,
		UsersUsecase:   usersUsecase,
	}

	r.POST("/create", controllers.Create, middlewares.JwtAuthentication())
	r.GET("/all", controllers.GetAllProduct)
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 100

func (p *ProductController) Upload(c *gin.Context) (*entities.FileUploadRes, error) {
	return nil, nil
}

func (p *ProductController) Create(c *gin.Context) {
	var freq entities.FileUploadReq
	err := c.ShouldBind(&freq.File)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.Request.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	files := c.Request.MultipartForm.File["file"]
	freq.File = files

	role, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	freq.Claims = &role

	res, err := p.FileUsecase.Upload(&freq)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req entities.ProductWithVariants
	req.Product.Picture = res.FilePaths
	req.Variant = getVariants(c)
	req.Product.Title = c.PostForm("title")
	req.Product.Desc = c.PostForm("desc")
	req.Product.Category = c.PostForm("category")
	req.Product.SubType = c.PostForm("sub_type")

	nres, err := p.ProductUsecase.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, nres)
}

func (p *ProductController) GetAllProduct(c *gin.Context) {

	var req entities.ProductQuery
	req.Id = c.Query("id")
	req.Title = c.Query("title")
	req.Category = c.Query("category")
	req.SubType = c.Query("sub_type")
	req.Rating = c.Query("rating")
	req.Limit = c.Query("limit")
	req.MaxPrice = c.Query("max_price")
	req.MinPrice = c.Query("min_price")
	req.PriceSort = c.Query("price_sort")
	req.Search = c.Query("search")

	res, err := p.ProductUsecase.GetAllProduct(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func getVariants(c *gin.Context) []entities.ProductVariant {
	jsonData := c.PostForm("json_data")
	var jsonDataMap []entities.ProductVariant
	if err := json.Unmarshal([]byte(jsonData), &jsonDataMap); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return nil
	}
	return jsonDataMap
}