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
