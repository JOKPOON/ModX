package controllers

import (
	"net/http"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

type FileController struct {
	Cfg         *configs.Configs
	FileUsecase entities.FileUsecase
}

func NewFileControllers(r gin.IRoutes, cfg *configs.Configs, fileUsecase entities.FileUsecase) {
	controllers := &FileController{
		Cfg:         cfg,
		FileUsecase: fileUsecase,
	}

	r.POST("/upload", controllers.Upload, middlewares.JwtAuthentication())
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 100

func (f *FileController) Upload(c *gin.Context) {
	var req entities.FileUploadReq
	err := c.ShouldBind(&req.File)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.Request.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	files := c.Request.MultipartForm.File["file"]
	req.File = files

	role, err := middlewares.GetUserByToken(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Claims = role

	res, err := f.FileUsecase.Upload(&req, f.Cfg)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}
