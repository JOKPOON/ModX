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
