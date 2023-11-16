package usecases

import (
	"github.com/Bukharney/ModX/modules/entities"
)

type OrderUsecases struct {
	OrderRepo entities.OrderRepository
}

func NewOrderUsecases(orderRepo entities.OrderRepository) entities.OrderUsecase {
	return &OrderUsecases{
		OrderRepo: orderRepo,
	}
}

func (o *OrderUsecases) Create(req *entities.OrderCreateReq) (*entities.OrderCreateRes, error) {
	res, err := o.OrderRepo.Create(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (o *OrderUsecases) Update(req *entities.OrderUpdateReq) error {
	return nil
}
