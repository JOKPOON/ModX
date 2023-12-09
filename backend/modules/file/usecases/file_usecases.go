package usecases

import (
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/Bukharney/ModX/pkg/utils"
)

const MAX_UPLOAD_SIZE = 1024 * 1024 * 20

type FileUsecase struct {
	UserRepo entities.UsersRepository
	FileRepo entities.FileRepository
	Cfg      *configs.Configs
	Storage  *storage.Client
}

func NewFileUsecase(userRepo entities.UsersRepository, fileRepo entities.FileRepository, cfg *configs.Configs, storage *storage.Client) entities.FileUsecase {
	return &FileUsecase{
		UserRepo: userRepo,
		FileRepo: fileRepo,
		Cfg:      cfg,
		Storage:  storage,
	}
}

func (f *FileUsecase) Upload(req *entities.FileUploadReq) (entities.FileUploadRes, error) {
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
			log.Writer(),
			"modx-product-image",
			fileName,
			file,
		)
		if err != nil {
			return res, fmt.Errorf("error, failed to upload file" + err.Error())
		}

		file.Close()

		FileName = append(FileName, fileName)
	}

	res = entities.FileUploadRes{
		FilePaths: FileName,
	}

	return res, nil
}

func (f *FileUsecase) StreamFileUpload(w io.Writer, bucket, object string, file multipart.File) error {
	// bucket := "bucket-name"
	// object := "object-name"
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("storage.NewClient: %w", err)
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()

	// Upload an object with storage.Writer.
	wc := client.Bucket(bucket).Object(object).NewWriter(ctx)
	wc.ChunkSize = 0 // note retries are not supported for chunk size 0.

	wc.CacheControl = "Cache-Control:no-cache, max-age=0"
	wc.ContentType = "image/jpeg"

	if _, err = io.Copy(wc, file); err != nil {
		return fmt.Errorf("io.Copy: %w", err)
	}
	// Data can continue to be added to the file until the writer is closed.
	if err := wc.Close(); err != nil {
		return fmt.Errorf("Writer.Close: %w", err)
	}
	fmt.Fprintf(w, "%v uploaded to %v.\n", object, bucket)

	return nil
}
