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

func NewProductUsecases(productRepo entities.ProductRepository, fileRepo entities.FileRepository) ProductUsecases {
	return &productUsecases{ProductRepo: productRepo, FileRepo: fileRepo}
}

func (p *productUsecases) Create(req *entities.Product) (*entities.ProductCreateRes, error) {
	var variants []entities.ProductVariant

	req.Stock = 0
	for _, v := range req.Variants {
		variants = append(variants, entities.ProductVariant{
			Price: v.Price,
			Stock: v.Stock,
			Color: v.Color,
			Size:  v.Size,
			Model: v.Model,
		})

		req.Stock += v.Stock
	}

	req.Variants = variants

	return p.ProductRepo.Create(req)
}

func (p *productUsecases) Upload(req *entities.FileUploadReq) (*entities.FileUploadRes, error) {
	return nil, nil
}
