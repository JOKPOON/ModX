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
	UserUsecase entities.UsersRepository
}

func NewFileUsecase(userRepo entities.UsersRepository) entities.FileUsecase {
	return &FileUsecase{UserUsecase: userRepo}
}

func (f *FileUsecase) Upload(fuq *entities.FileUploadReq) (*entities.FileUploadRes, error) {
	files := fuq.File
	filesName := make([]string, len(files))
	for _, fileHeader := range files {

		if fileHeader.Size > MAX_UPLOAD_SIZE {
			return nil, fmt.Errorf("file too large")
		}

		file, err := fileHeader.Open()

		if err != nil {
			return nil, err
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
			return nil, err
		}

		fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), fileHeader.Filename)

		err = os.MkdirAll("./static/products/", os.ModePerm)
		if err != nil {
			return nil, err
		}

		dst, err := os.Create(fmt.Sprintf("./static/products/%s", fileName))
		if err != nil {
			return nil, err
		}

		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			return nil, err
		}

		filesName = append(filesName, fileName)
	}

	res := &entities.FileUploadRes{
		FileName: filesName,
	}

	return res, nil

}
