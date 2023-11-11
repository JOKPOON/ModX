package entities

import "mime/multipart"

type FileUsecase interface {
	Upload(req *FileUploadReq) (*FileUploadRes, error)
}

type FileRepository interface {
	Upload(req *FileUploadReq) (*FileUploadRes, error)
}

type FileUploadReq struct {
	File []*multipart.FileHeader `json:"file" db:"file"`
}

type FileUploadRes struct {
	FileName []string `json:"file_name" db:"file_name"`
}
