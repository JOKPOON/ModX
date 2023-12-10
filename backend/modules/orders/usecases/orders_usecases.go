package usecases

import (
	"errors"
	"log"

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
	req.ShippingCost = 0
	req.TotalCost = 0

	log.Println(req.OrderProducts)
	for i, product := range req.OrderProducts {
		log.Println(product)
		option_1 := product.Options["option_1"]
		option_2 := product.Options["option_2"]

		option, err := o.OrderRepo.GetProductOptions(product.ProductId)
		if err != nil {
			return nil, err
		}

		if option.Options["option_1"] == nil {
			return nil, errors.New("invalid options 1")
		}

		for s, v := range option.Options["option_1"].(map[string]interface{}) {
			if s == option_1 {
				if v.(map[string]interface{})["option_2"] == nil {
					product.Price = int(v.(map[string]interface{})["price"].(float64))
				} else {
					for s2, v2 := range v.(map[string]interface{})["option_2"].(map[string]interface{}) {
						if s2 == option_2 {
							product.Price = int(v2.(map[string]interface{})["price"].(float64))
							if int(v2.(map[string]interface{})["stock"].(float64)) < product.Quantity {
								return nil, errors.New("stock not enough")
							}
						}

					}
				}
			}
		}

		dis, err := o.OrderRepo.GetProductDiscount(product.ProductId)
		if err != nil {
			return nil, err
		}

		log.Println(dis, product.Price, product.Quantity)
		req.OrderProducts[i].Price = (product.Price - dis) * product.Quantity
		req.ItemCost += req.OrderProducts[i].Price * 100
		req.ShippingCost += 10 * product.Quantity * 100
	}

	req.TotalCost = req.ItemCost + req.ShippingCost

	order, err := o.OrderRepo.CreateOrder(req)
	if err != nil {
		return nil, err
	}

	req.Id = order.OrderId

	res, err := o.OrderRepo.Create(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (o *OrderUsecases) Update(req *entities.OrderUpdateReq) error {
	err := o.OrderRepo.Update(req)
	if err != nil {
		return err
	}

	return nil
}

func (o *OrderUsecases) GetAll(req *entities.OrderGetAllReq) (*[]entities.OrderGetAllRes, error) {
	res, err := o.OrderRepo.GetAll(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (o *OrderUsecases) Get(req *entities.OrderGetReq) (*[]entities.OrderGetRes, error) {
	res, err := o.OrderRepo.Get(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}
