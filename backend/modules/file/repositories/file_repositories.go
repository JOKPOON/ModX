package repositories

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10

type FileRepo struct {
	Db *sqlx.DB
}

func NewFileRepo(db *sqlx.DB) entities.FileRepository {
	return &FileRepo{Db: db}
}

func (f *FileRepo) Upload(req *entities.FileUploadReq) (entities.FileUploadRes, error) {

	res := entities.FileUploadRes{
		Status: "failed",
	}

	files := req.File
	FileName := []string{}
	for _, fileHeader := range files {

		if fileHeader.Size > MAX_UPLOAD_SIZE {
			return res, fmt.Errorf("file too large")
		}

		file, err := fileHeader.Open()

		if err != nil {
			return res, fmt.Errorf("error, failed to open file")
		}

		defer file.Close()

		buff := make([]byte, 512)
		_, err = file.Read(buff)
		if err != nil {
			return res, fmt.Errorf("error, failed to read file")
		}

		filetype := http.DetectContentType(buff)
		if filetype != "image/jpeg" && filetype != "image/png" {
			return res, fmt.Errorf("the provided file format is not allowed. Please upload a JPEG or PNG image")
		}

		_, err = file.Seek(0, io.SeekStart)
		if err != nil {
			return res, fmt.Errorf("error, failed to seek file")
		}

		fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), fileHeader.Filename)

		err = os.MkdirAll("./static/products/", os.ModePerm)
		if err != nil {
			return res, fmt.Errorf("error, failed to create directory")
		}

		dst, err := os.Create(fmt.Sprintf("./static/products/%s", fileName))
		if err != nil {
			return res, fmt.Errorf("error, failed to create file")
		}

		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			return res, fmt.Errorf("error, failed to copy file")
		}

		FileName = append(FileName, fileName)
	}

	res = entities.FileUploadRes{
		Status:    "success",
		FilePaths: FileName,
	}

	return res, nil
}
