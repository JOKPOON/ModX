package usecases

import (
	"fmt"

	"github.com/Bukharney/ModX/modules/entities"
)

type FileUsecase struct {
	FileRepo entities.FileRepository
	UserRepo entities.UsersRepository
}

func NewFileUsecase(userRepo entities.UsersRepository, fileRepo entities.FileRepository) entities.FileUsecase {
	return &FileUsecase{UserRepo: userRepo, FileRepo: fileRepo}
}

func (f *FileUsecase) Upload(fuq *entities.FileUploadReq) (entities.FileUploadRes, error) {
	res := entities.FileUploadRes{
		Status: "failed",
	}
	user, err := f.UserRepo.GetUserByUsername(fuq.Claims.Username)
	if err != nil {
		return res, fmt.Errorf("error, user not found")
	}

	if user.Roles != "admin" {
		return res, fmt.Errorf("error, user not authorized")
	}

	res, err = f.FileRepo.Upload(fuq)
	if err != nil {
		return res, err
	}

	return res, nil

}
