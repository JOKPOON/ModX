package usecases

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/Bukharney/ModX/modules/entities"
)

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10

type FileUsecase struct {
	UserRepo entities.UsersRepository
}

func NewFileUsecase(userRepo entities.UsersRepository) entities.FileUsecase {
	return &FileUsecase{UserRepo: userRepo}
}

func (f *FileUsecase) Upload(fuq *entities.FileUploadReq) (*entities.FileUploadRes, error) {

	user, err := f.UserRepo.GetUserByUsername(fuq.Claims.Username)
	if err != nil {
		return nil, fmt.Errorf("error, user not found")
	}

	if user.Roles != "admin" {
		return nil, fmt.Errorf("error, user not authorized")
	}

	files := fuq.File
	FileName := []string{}
	for _, fileHeader := range files {

		if fileHeader.Size > MAX_UPLOAD_SIZE {
			return nil, fmt.Errorf("file too large")
		}

		file, err := fileHeader.Open()

		if err != nil {
			return nil, fmt.Errorf("error, failed to open file")
		}

		defer file.Close()

		buff := make([]byte, 512)
		_, err = file.Read(buff)
		if err != nil {
			return nil, err
		}

		filetype := http.DetectContentType(buff)
		if filetype != "image/jpeg" && filetype != "image/png" {
			return nil, fmt.Errorf("the provided file format is not allowed. Please upload a JPEG or PNG image")
		}

		_, err = file.Seek(0, io.SeekStart)
		if err != nil {
			return nil, fmt.Errorf("error, failed to seek file")
		}

		fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), fileHeader.Filename)

		err = os.MkdirAll("./static/products/", os.ModePerm)
		if err != nil {
			return nil, fmt.Errorf("error, failed to create directory")
		}

		dst, err := os.Create(fmt.Sprintf("./static/products/%s", fileName))
		if err != nil {
			return nil, fmt.Errorf("error, failed to create file")
		}

		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			return nil, fmt.Errorf("error, failed to copy file")
		}

		FileName = append(FileName, fileName)
	}

	res := &entities.FileUploadRes{
		Status:    "success",
		FilePaths: FileName,
	}

	return res, nil

}
