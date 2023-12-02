package usecases

import (
	"github.com/Bukharney/ModX/modules/entities"
)

type WishlistUsecases struct {
	WishlistRepo entities.WishlistRepository
}

func NewWishlistUsecases(wishlistRepo entities.WishlistRepository) entities.WishlistUsecase {
	return &WishlistUsecases{
		WishlistRepo: wishlistRepo,
	}
}

func (u *WishlistUsecases) GetWishlistItems(req *entities.WhishlistGetReq) (*entities.WhishlistGetRes, error) {
	res, err := u.WishlistRepo.GetWishlistItems(req)
	if err != nil {
		return nil, err
	}

	for i, product := range res.Products {
		options, err := u.WishlistRepo.GetProductOptions(product.ProductId)
		if err != nil {
			return nil, err
		}

		if option1, ok := options.Options["option_1"].(map[string]interface{}); ok {
			if option2, ok := option1[product.Options["option_1"]].(map[string]interface{})["option_2"].(map[string]interface{}); ok {
				if price, ok := option2[product.Options["option_2"]].(map[string]interface{})["price"].(float64); ok {
					product.Price = int(price)
				}
			}
		}

		res.Products[i] = product

		product_detail, err := u.WishlistRepo.GetProductDetails(product.ProductId)
		if err != nil {
			return nil, err
		}

		res.Products[i].ProductTitle = product_detail.Title
		res.Products[i].ProductImage = product_detail.Picture

	}

	return res, nil
}

func (u *WishlistUsecases) AddWishlistItem(req *entities.WhishlistAddReq) (*entities.WhishlistAddRes, error) {
	res, err := u.WishlistRepo.AddWishlistItem(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (u *WishlistUsecases) DeleteWishlistItem(req *entities.WhishlistDeleteReq) (*entities.WhishlistDeleteRes, error) {
	res, err := u.WishlistRepo.DeleteWishlistItem(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
