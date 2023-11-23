package usecases

import (
	"log"

	"github.com/Bukharney/ModX/modules/entities"
)

type ProductUsecases struct {
	ProductRepo entities.ProductRepository
	FileRepo    entities.FileRepository
}

func NewProductUsecases(productRepo entities.ProductRepository, fileRepo entities.FileRepository) entities.ProductUsecase {
	return &ProductUsecases{ProductRepo: productRepo, FileRepo: fileRepo}
}

func (p *ProductUsecases) Create(req *entities.ProductWithVariants) (*entities.ProductCreateRes, error) {
	minPrice := req.Variant[0].Price
	log.Println(minPrice)
	for _, v := range req.Variant {
		if v.Price < minPrice {
			minPrice = v.Price
		}
		req.Product.Stock += v.Stock
	}

	req.Product.Price = minPrice
	return p.ProductRepo.Create(req)
}

func (p *ProductUsecases) GetAllProduct(req *entities.ProductQuery) (*entities.AllProductRes, error) {
	res, err := p.ProductRepo.GetAll(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (p *ProductUsecases) GetProduct(req *entities.Product) (*entities.Product, error) {
	res := new(entities.Product)
	res, err := p.ProductRepo.GetProduct(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (p *ProductUsecases) DeleteProduct(req *entities.Product) error {
	err := p.ProductRepo.DeleteProduct(req)
	if err != nil {
		return err
	}

	return nil
}

func (p *ProductUsecases) AddReview(req *entities.Review) error {
	err := p.ProductRepo.AddReview(req)
	if err != nil {
		return err
	}

	return nil
}
