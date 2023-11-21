package entities

type CartRepository interface {
	GetCartItems(req *Cart) (*Cart, error)
	AddCartItem(req *Cart) error
	DeleteCartItem(req *CartDeleteReq) error
}

type CartUsecase interface {
	GetCartItems(req *Cart) (*Cart, error)
	AddCartItem(req *Cart) error
	DeleteCartItem(req *CartDeleteReq) error
}

type Cart struct {
	Id        int               `json:"id"`
	UserId    int               `json:"user_id"`
	Total     int               `json:"total"`
	ProductId int               `json:"product_id"`
	Items     []CartProductItem `json:"items"`
}

type CartProductItem struct {
	Quantity int `json:"quantity"`
}

type CartRes struct {
	ID        int `json:"id"`
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
	Price     int `json:"price"`
	Total     int `json:"total"`
}

type CartDeleteReq struct {
	Id int `json:"id"`
}
