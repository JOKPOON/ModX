package usecases

import (
	"errors"
	"math"

	"github.com/Bukharney/ModX/modules/entities"
)

type ProductUsecases struct {
	ProductRepo entities.ProductRepository
	FileRepo    entities.FileRepository
}

func NewProductUsecases(productRepo entities.ProductRepository, fileRepo entities.FileRepository) entities.ProductUsecase {
	return &ProductUsecases{ProductRepo: productRepo, FileRepo: fileRepo}
}

func findMinPriceAndStock(data map[string]interface{}) (float64, float64, error) {
	minPrice := math.MaxFloat64
	totalStock := float64(0)

	if data["option_1"] == nil {
		return 0, 0, errors.New("invalid options")
	}

	for _, v := range data["option_1"].(map[string]interface{}) {
		if v.(map[string]interface{})["option_2"] == nil {
			return 0, 0, errors.New("invalid options")
		}

		for _, v2 := range v.(map[string]interface{})["option_2"].(map[string]interface{}) {
			if v2.(map[string]interface{})["price"].(float64) < minPrice {
				minPrice = v2.(map[string]interface{})["price"].(float64)
			}
			totalStock += v2.(map[string]interface{})["stock"].(float64)
		}
	}

	return minPrice, totalStock, nil
}

func (p *ProductUsecases) Create(req *entities.Product) (*entities.ProductCreateRes, error) {
	minPrice, totalStock, err := findMinPriceAndStock(req.Options)
	if err != nil {
		return nil, err
	}

	req.Price = int(minPrice)
	req.Stock = int(totalStock)
	req.Discount = 0

	res, err := p.ProductRepo.Create(req)
	if err != nil {
		return nil, err
	}

	return res, nil
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
