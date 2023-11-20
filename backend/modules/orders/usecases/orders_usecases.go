package usecases

import (
	"github.com/Bukharney/ModX/modules/entities"
)

type OrderUsecases struct {
	OrderRepo entities.OrderRepository
	UserRepo  entities.UsersRepository
}

func NewOrderUsecases(orderRepo entities.OrderRepository, userRepo entities.UsersRepository) entities.OrderUsecase {
	return &OrderUsecases{
		OrderRepo: orderRepo,
		UserRepo:  userRepo,
	}
}

func (o *OrderUsecases) Create(req *entities.OrderCreateReq) (*entities.OrderCreateRes, error) {
	req.ItemCost = 0
	items_count := 0
	products := req.OrderProducts
	for _, v := range products {
		for _, item := range v.OrderItems {
			variant, err := o.OrderRepo.GetProductVariantById(item.ProductVariantId)
			if err != nil {
				return nil, err
			}

			req.ItemCost += variant.Price * item.Quantity
			items_count += item.Quantity
		}
	}

	req.ShippingCost = 0
	if req.ShippingType == "Self Pickup" {
		req.ShippingCost = 0
	} else {
		for items_count > 0 {
			req.ShippingCost += 5000
			items_count -= 10
		}
	}

	req.TotalCost = req.ItemCost + req.ShippingCost

	order, err := o.OrderRepo.CreateOrder(req)
	if err != nil {
		return nil, err
	}

	res, err := o.OrderRepo.Create(order)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (o *OrderUsecases) Update(req *entities.OrderUpdateReq) error {
	return nil
}
