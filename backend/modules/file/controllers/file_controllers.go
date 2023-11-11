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

func (f *FileController) Upload(c *gin.Context) {
	var req entities.FileUploadReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := f.FileUsecase.Upload(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}
