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

func (c *CartUsecases) AddCartItem(req *entities.Cart) error {
	// for i, item := range req.Items {
	// 	err := c.CartRepo.GetProductVariantById(&item.ProductVariant)
	// 	if err != nil {
	// 		return err
	// 	}

	// 	req.Items[i].ProductVariant = item.ProductVariant
	// 	req.Total += item.Quantity * item.ProductVariant.Price
	// }

	// return c.CartRepo.AddCartItem(req)
	return nil
}

func (c *CartUsecases) GetCartItems(req *entities.Cart) (*entities.Cart, error) {
	// cart, err := c.CartRepo.GetCartItems(req)
	// if err != nil {
	// 	return nil, err
	// }
	// for i, item := range cart.Items {
	// 	err := c.CartRepo.GetProductVariantById(&item.ProductVariant)
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	cart.Items[i].ProductVariant = item.ProductVariant
	// 	cart.Total += item.Quantity * item.ProductVariant.Price
	// }

	return nil, nil
}

func (c *CartUsecases) DeleteCartItem(req *entities.CartDeleteReq) error {
	err := c.CartRepo.DeleteCartItem(req)
	return err
}
