package usecases

import (
	"fmt"
	"strings"

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

	for _, v := range req.Variant {
		req.Product.Stock += v.Stock
	}

	return p.ProductRepo.Create(req)
}

func (p *ProductUsecases) GetAllProduct(req *entities.ProductQuery) (*entities.AllProductRes, error) {

	res, err := p.ProductRepo.GetAll(req)
	if err != nil {
		return nil, err
	}

	n_res := new(entities.Product)
	n_res.Id = res.Id
	n_res.Title = res.Title
	n_res.Desc = res.Desc
	n_res.Category = res.Category
	n_res.SubType = res.SubType
	n_res.Rating = res.Rating
	n_res.Sold = res.Sold
	n_res.Stock = res.Stock
	n_res.Created = res.Created
	n_res.Updated = res.Updated

	picture := strings.Split(res.Picture, ",")

	for i, v := range picture {
		picture[i] = fmt.Sprintf("http://localhost:8080/static/products/%s", v)
	}

	n_res.Picture = picture

	return_res := new(entities.AllProductRes)
	return_res.Data = append(return_res.Data, *n_res)

	return return_res, nil
}

func (p *ProductUsecases) Upload(req *entities.FileUploadReq) (*entities.FileUploadRes, error) {
	return nil, nil
}
