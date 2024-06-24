package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

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

func NewProductControllers(
	r gin.IRoutes,
	cfg *configs.Configs,
	usersUsecase entities.UsersUsecase,
	productUsecase entities.ProductUsecase,
	fileUsecase entities.FileUsecase) {
	controllers := &ProductController{
		Cfg:            cfg,
		ProductUsecase: productUsecase,
		FileUsecase:    fileUsecase,
		UsersUsecase:   usersUsecase,
	}

	r.POST("/", controllers.Create, middlewares.JwtAuthentication())
	r.GET("/", controllers.GetAllProduct)
	r.GET("/:id", controllers.GetProduct)
	r.POST("/review", controllers.AddReview, middlewares.JwtAuthentication())
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 100

// @Summary Create Product
// @Description
// @Tags Products
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param product_data formData string true "{'title': 'string', 'desc': 'string', 'options': {'option_1':{'option':{'option_2':{'option':{'price': 0,'stock': 0}}}}, 'category': 'string'}"
// @Param file formData file true "Product Picture"
// @Success 200 {object} string
// @Router /product [post]
func (p *ProductController) Create(c *gin.Context) {
	var req entities.Product
	var data entities.ProductData
	product_data := c.PostForm("product_data")

	log.Println(product_data)
	err := json.Unmarshal([]byte(product_data), &data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error data": err.Error()})
		return
	}

	req.Title = data.Title
	req.Desc = data.Desc
	req.Options = data.Options
	req.Category = data.Category

	upload_res, err := p.UploadProductPicture(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	req.Picture = upload_res.FilePaths

	res, err := p.ProductUsecase.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": res.Message})
}

// @Summary Get All Product
// @Description Get All Product
// @Tags Products
// @Accept  json
// @Produce  json
// @Param id query string false "Id"
// @Param title query string false "Title"
// @Param category query string false "Category"
// @Param rating query string false "Rating"
// @Param limit query string false "Limit"
// @Param max_price query string false "Max Price"
// @Param min_price query string false "Min Price"
// @Param price_sort query string false "Price Sort"
// @Param search query string false "Search"
// @Param sort query string false "Sort"
// @Success 200 {object} entities.ProductQuery
// @Router /product [get]
func (p *ProductController) GetAllProduct(c *gin.Context) {
	var req entities.ProductQuery
	req.Id = c.Query("id")
	req.Title = c.Query("title")
	category := c.Query("category")
	req.Rating = c.Query("rating")
	req.Limit = c.Query("limit")
	req.MaxPrice = c.Query("max_price")
	req.MinPrice = c.Query("min_price")
	req.PriceSort = c.Query("price_sort")
	req.Search = c.Query("search")
	req.Sort = c.Query("sort")

	if category != "" {
		req.Category = strings.Split(category, ",")
	}

	log.Println(req.Category)
	res, err := p.ProductUsecase.GetAllProduct(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &res.Data)
}

// @Summary Get Product
// @Description Get Product
// @Tags Products
// @Accept  json
// @Produce  json
// @Param id path int true "Product ID"
// @Success 200 {object} entities.Product
// @Router /product/{id} [get]
func (p *ProductController) GetProduct(c *gin.Context) {
	var req entities.Product
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.Id = id

	res, err := p.ProductUsecase.GetProduct(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

// @Summary Add Review
// @Description Add Review
// @Tags Products
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param review body entities.Review true "Review"
// @Success 200 {object} string
// @Router /product/review [post]
func (p *ProductController) AddReview(c *gin.Context) {
	var req entities.Review
	err := c.ShouldBind(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	role, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.UserId = role.Id

	err = p.ProductUsecase.AddReview(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, err)
}

// @Summary Delete Product
// @Description Delete Product
// @Tags Products
// @Accept  json
// @Produce  json
// @Security Bearer
// @Param id path int true "Product ID"
// @Success 200 {object} string
// @Router /product/{id} [delete]
func (p *ProductController) DeleteProduct(c *gin.Context) {
	var req entities.Product
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.Id = id

	err = p.ProductUsecase.DeleteProduct(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, err)
}

func (p *ProductController) UploadProductPicture(c *gin.Context) (*entities.FileUploadRes, error) {
	var freq entities.FileUploadReq
	err := c.ShouldBind(&freq.File)
	if err != nil {
		return nil, err
	}

	role, err := middlewares.GetUserByToken(c)
	if err != nil {
		return nil, err
	}
	freq.Claims = role

	if err := c.Request.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		return nil, err
	}

	files := c.Request.MultipartForm.File["file"]
	freq.File = files

	res, err := p.FileUsecase.Upload(&freq, p.Cfg)
	if err != nil {
		return nil, err
	}

	return &res, nil
}
