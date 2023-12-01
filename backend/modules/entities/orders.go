package entities

type OrderRepository interface {
	Create(req *OrderCreateReq) (*OrderCreateRes, error)
	Update(req *OrderUpdateReq) error
	CreateOrder(req *OrderCreateReq) (*OrderCreateRes, error)
	GetProductOptions(product_id int) (*ProductOptions, error)
	GetAll(req *OrderGetAllReq) (*[]OrderGatAllRes, error)
}

type OrderUsecase interface {
	Create(req *OrderCreateReq) (*OrderCreateRes, error)
	Update(req *OrderUpdateReq) error
	GetAll(req *OrderGetAllReq) (*[]OrderGatAllRes, error)
}

type Shipping struct {
	Id      int    `json:"id"`
	UserId  int    `json:"user_id"`
	Name    string `json:"name"`
	Tel     string `json:"tel"`
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	Zip     string `json:"zip"`
	Contry  string `json:"contry"`
	IsDef   bool   `json:"is_def"`
}

type Order struct {
	Id            int             `json:"id" db:"id"`
	ShippingType  string          `json:"shipping_type" db:"shipping_type"`
	ShippingCost  int             `json:"shipping_cost" db:"shipping_cost"`
	ItemCost      int             `json:"item_cost" db:"item_cost"`
	Total         int             `json:"total" db:"total"`
	Status        string          `json:"status" db:"status"`
	Shipping      Shipping        `json:"shipping" `
	OrderProducts []OrderProducts `json:"order_products"`
	UpdatedAt     string          `json:"updated_at" db:"updated_at"`
}

type OrderGetAllReq struct {
	UserId    int `json:"user_id"`
	ProductId int `json:"product_id"`
}

type OrderGatAllRes struct {
	Id        int    `json:"id" db:"id"`
	Quantity  int    `json:"quantity" db:"quantity"`
	Total     int    `json:"total" db:"total_cost"`
	Status    string `json:"status" db:"status"`
	UpdatedAt string `json:"updated_at" db:"updated_at"`
}

type OrderProducts struct {
	Id        int               `json:"id"`
	ProductId int               `json:"product_id"`
	Options   map[string]string `json:"options"`
	Price     int               `json:"price"`
	Quantity  int               `json:"quantity"`
}

type OrderCreateReq struct {
	Id            int             `json:"id"`
	UserId        int             `json:"user_id"`
	ShippingId    int             `json:"shipping_id"`
	ShippingType  string          `json:"shipping_type"`
	ShippingCost  int             `json:"shipping_cost"`
	ItemCost      int             `json:"item_cost"`
	TotalCost     int             `json:"total_cost"`
	PaymentType   int             `json:"payment_type"`
	PaymentStatus string          `json:"payment_status"`
	Status        string          `json:"status"`
	Quantity      int             `json:"quantity"`
	OrderProducts []OrderProducts `json:"order_products"`
}

type OrderCreateRes struct {
	OrderId int `json:"order_id"`
}

type OrderUpdateReq struct {
	Id            int    `json:"id"`
	PaymentStatus string `json:"payment_status"`
	Status        string `json:"status"`
}

type OrderUpdateRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ProductGetByIdRes struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	Picture  string `json:"picture"`
	Discount int    `json:"discount"`
}
