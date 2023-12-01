package entities

type CartRepository interface {
	GetCartItems(req *CartGetReq) (*CartGetRes, error)
	AddCartItem(req *CartAddReq) (*CartAddRes, error)
	GetProductOptions(productId int) (*ProductOptions, error)
	DeleteCartItem(req *CartDeleteReq) (*CartDeleteRes, error)
	GetProductDetails(productId int) (*ProductGetByIdRes, error)
}

type CartUsecase interface {
	GetCartItems(req *CartGetReq) (*CartGetRes, error)
	AddCartItem(req *CartAddReq) (*CartAddRes, error)
	DeleteCartItem(req *CartDeleteReq) (*CartDeleteRes, error)
}

type Cart struct {
	Id       int           `json:"id"`
	UserId   int           `json:"user_id"`
	Total    int           `json:"total"`
	Products []CartProduct `json:"products"`
}

type CartProduct struct {
	Id           int               `json:"id"`
	ProductId    int               `json:"product_id" binding:"required"`
	Options      map[string]string `json:"options" binding:"required"`
	Quantity     int               `json:"quantity" binding:"required"`
	Price        int               `json:"price"`
	Discount     int               `json:"discount"`
	ProductTitle string            `json:"product_title"`
	ProductImage string            `json:"product_image"`
}

type CartAddReq struct {
	UserId   int         `json:"user_id"`
	Products CartProduct `json:"products" binding:"required"`
}

type CartAddRes struct {
	Id int `json:"id"`
}

type CartGetReq struct {
	UserId int `json:"user_id"`
}

type CartGetRes struct {
	Products []CartProduct `json:"products"`
	Totals   int           `json:"totals"`
}

type CartDeleteReq struct {
	UserId int   `json:"user_id"`
	CartId []int `json:"cart_id"`
}

type CartDeleteRes struct {
	Id int `json:"id"`
}
