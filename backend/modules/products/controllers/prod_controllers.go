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

	r.POST("/create", controllers.Create, middlewares.JwtAuthentication())
	r.GET("/all", controllers.GetAllProduct)
	r.GET("/get/:id", controllers.GetProduct)
	r.POST("/review", controllers.AddReview, middlewares.JwtAuthentication())
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 100

func (p *ProductController) Create(c *gin.Context) {
	var req entities.Product
	req.Title = c.PostForm("title")
	req.Desc = c.PostForm("desc")
	req.Category = c.PostForm("category")
	optionsStr := c.PostForm("options")

	upload_res, err := p.UploadProduct(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	req.Picture = upload_res.FilePaths

	var options entities.ProductOptions
	err = json.Unmarshal([]byte(optionsStr), &options)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.Options = options.Options

	res, err := p.ProductUsecase.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": res.Message})
}

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

func (p *ProductController) UploadProduct(c *gin.Context) (*entities.FileUploadRes, error) {
	var freq entities.FileUploadReq
	err := c.ShouldBind(&freq.File)
	if err != nil {
		return nil, err
	}

	if err := c.Request.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		return nil, err
	}

	files := c.Request.MultipartForm.File["file"]
	freq.File = files

	role, err := middlewares.GetUserByToken(c)
	if err != nil {
		return nil, err
	}

	freq.Claims = role

	res, err := p.FileUsecase.Upload(&freq)
	if err != nil {
		return nil, err
	}

	return &res, nil
}
