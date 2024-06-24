package entities

import (
	"mime/multipart"

	"github.com/Bukharney/ModX/configs"
)

type FileUsecase interface {
	Upload(req *FileUploadReq, cfg *configs.Configs) (FileUploadRes, error)
}

type FileRepository interface {
	Upload(req *FileUploadReq) (FileUploadRes, error)
}

type FileUploadReq struct {
	Claims *UsersClaims            `json:"claims"`
	File   []*multipart.FileHeader `form:"file"`
}

type FileUploadRes struct {
	Status    string   `json:"status"`
	FilePaths []string `json:"file_paths" db:"file_paths"`
}
