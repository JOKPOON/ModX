package usecases

import (
	"github.com/Bukharney/ModX/modules/entities"
)

type ProductUsecases interface {
	Create(req *entities.Product) (*entities.ProductCreateRes, error)
	Upload(req *entities.FileUploadReq) (*entities.FileUploadRes, error)
}

type productUsecases struct {
	ProductRepo entities.ProductRepository
	FileRepo    entities.FileRepository
}

func NewProductUsecases(productRepo entities.ProductRepository) ProductUsecases {
	return &productUsecases{ProductRepo: productRepo}
}

func (p *productUsecases) Create(req *entities.Product) (*entities.ProductCreateRes, error) {
	return p.ProductRepo.Create(req)
}

func (p *productUsecases) Upload(req *entities.FileUploadReq) (*entities.FileUploadRes, error) {
	return p.FileRepo.Upload(req)
}
