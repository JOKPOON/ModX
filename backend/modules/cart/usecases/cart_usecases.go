package usecases

import (
	"github.com/Bukharney/ModX/modules/entities"
)

type CartUsecases struct {
	CartRepo entities.CartRepository
}

func NewCartUsecase(cartRepo entities.CartRepository) entities.CartUsecase {
	return &CartUsecases{CartRepo: cartRepo}
}

func (c *CartUsecases) AddCartItem(req *entities.CartAddReq) (*entities.CartAddRes, error) {
	res, err := c.CartRepo.AddCartItem(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (c *CartUsecases) GetCartItems(req *entities.CartGetReq) (*entities.CartGetRes, error) {
	res, err := c.CartRepo.GetCartItems(req)
	if err != nil {
		return nil, err
	}

	for i, product := range res.Products {
		option_1 := product.Options["option_1"]
		option_2 := product.Options["option_2"]

		option, err := c.CartRepo.GetProductOptions(product.ProductId)
		if err != nil {
			return nil, err
		}

		for s, v := range option.Options["option_1"].(map[string]interface{}) {
			if s == option_1 {
				for s2, v2 := range v.(map[string]interface{})["option_2"].(map[string]interface{}) {
					if s2 == option_2 {
						res.Products[i].Price = int(v2.(map[string]interface{})["price"].(float64))
					}
				}
			}
		}

		res.Totals += res.Products[i].Price * res.Products[i].Quantity
		product_detail, err := c.CartRepo.GetProductDetails(product.ProductId)
		if err != nil {
			return nil, err
		}

		res.Products[i].ProductTitle = product_detail.Title
		res.Products[i].ProductImage = product_detail.Picture
	}

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (c *CartUsecases) DeleteCartItem(req *entities.CartDeleteReq) (*entities.CartDeleteRes, error) {
	res, err := c.CartRepo.DeleteCartItem(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
