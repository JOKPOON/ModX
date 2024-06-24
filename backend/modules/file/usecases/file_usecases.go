package usecases

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/utils"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
)

const MAX_UPLOAD_SIZE = 1024 * 1024 * 20

type FileUsecase struct {
	UserRepo entities.UsersRepository
	FileRepo entities.FileRepository
	Cfg      *configs.Configs
	S3       *s3.S3
}

func NewFileUsecase(userRepo entities.UsersRepository, fileRepo entities.FileRepository, cfg *configs.Configs, storage *s3.S3) entities.FileUsecase {
	return &FileUsecase{
		UserRepo: userRepo,
		FileRepo: fileRepo,
		Cfg:      cfg,
		S3:       storage,
	}
}

func (f *FileUsecase) Upload(req *entities.FileUploadReq, cfg *configs.Configs) (entities.FileUploadRes, error) {
	res := entities.FileUploadRes{
		Status: "failed",
	}
	user, err := f.UserRepo.GetUserByUsername(req.Claims.Username)
	if err != nil {
		return res, fmt.Errorf("error, user not found")
	}

	if user.Roles != "admin" {
		return res, fmt.Errorf("error, user not authorized")
	}

	files := req.File
	FileName := []string{}
	for _, fileHeader := range files {
		log.Println(fileHeader.Filename)

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

		fileName := utils.RandomString(16)

		err = f.StreamFileUpload(
			f.S3,
			fileName,
			file,
			cfg,
		)
		if err != nil {
			return res, fmt.Errorf("error, failed to upload file" + err.Error())
		}
		FileName = append(FileName, fileName)
		file.Close()
	}

	res = entities.FileUploadRes{
		FilePaths: FileName,
	}

	return res, nil
}

func (f *FileUsecase) StreamFileUpload(svc *s3.S3, fileName string, file multipart.File, cfg *configs.Configs) error {
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		fmt.Fprintln(os.Stderr, "Error reading file:", err)
		return err
	}

	fmt.Println("Uploading file to S3...")
	fmt.Println(cfg.S3.BucketName)

	_, err := svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String("modx-image"),
		Key:    aws.String(fileName),
		Body:   bytes.NewReader(buf.Bytes()),
	})
	if err != nil {
		fmt.Println("Error uploading file:", err)
		return err
	}

	return nil
}
