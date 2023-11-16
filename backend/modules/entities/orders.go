package entities

type Order struct {
	Id           int         `json:"id" db:"id"`
	ShippingType string      `json:"shipping_type" db:"shipping_type"`
	ShippingCost float32     `json:"shipping_cost" db:"shipping_cost"`
	ItemCost     float32     `json:"item_cost" db:"item_cost"`
	Total        float32     `json:"total" db:"total"`
	Status       string      `json:"status" db:"status"`
	Shipping     Shipping    `json:"shipping" `
	Items        []OrderItem `json:"items"`
}

type Shipping struct {
	ID      int    `json:"id"`
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

type OrderRepository interface {
	Create(req *OrderCreateReq) (*OrderCreateRes, error)
	Update(req *OrderUpdateReq) error
}

type OrderUsecase interface {
	Create(req *OrderCreateReq) (*OrderCreateRes, error)
	Update(req *OrderUpdateReq) error
}

type OrderItem struct {
	OrderId          int            `json:"order_id"`
	ProductVariantId ProductVariant `json:"product_variant"`
	Quantity         int            `json:"quantity"`
}

type OrderCreateReq struct {
	Id            int             `json:"id"`
	ShippingId    int             `json:"shipping_id"`
	ShippingType  int             `json:"shipping_type"`
	ShippingCost  int             `json:"shipping_cost"`
	ItemCost      int             `json:"item_cost"`
	TotalCost     int             `json:"total_cost"`
	PaymentType   int             `json:"payment_type"`
	PaymentStatus string          `json:"payment_status"`
	Status        string          `json:"status"`
	OrderProducts []OrderProducts `json:"order_products"`
}

type OrderProducts struct {
	ProductId  int          `json:"product_id"`
	OrderItems []OrderItems `json:"order_items"`
}

type OrderItems struct {
	Id               int `json:"id"`
	ProductVariantId int `json:"product_variant_id"`
	Quantity         int `json:"quantity"`
}

type OrderCreateRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type OrderUpdateReq struct {
	Id            int64  `json:"id"`
	PaymentStatus string `json:"payment_status"`
	Status        string `json:"status"`
}

type OrderUpdateRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type OrderQuery struct {
	Id               int    `json:"id"`
	UserId           int    `json:"user_id"`
	ShippingId       int    `json:"shipping_id"`
	ProductVariousId int    `json:"product_various_id"`
	ProductId        int    `json:"product_id"`
	PaymentStatus    string `json:"payment_status"`
	Status           string `json:"status"`
}

type OrderGetByIdRes struct {
	Id            int                   `json:"id"`
	PaymentStatus string                `json:"payment_status"`
	Status        string                `json:"status"`
	OrderItems    []OrderItemGetByIdRes `json:"order_items"`
	Shipping      Shipping              `json:"shipping"`
}

type OrderItemGetByIdRes struct {
	Product ProductGetByIdRes `json:"product"`
	Item    []ItemGetByIdRes  `json:"product_item"`
}

type ItemGetByIdRes struct {
	Quantity int    `json:"quantity"`
	Price    int    `json:"price"`
	Color    string `json:"color"`
	Size     string `json:"size"`
	Model    string `json:"model"`
}

type ProductGetByIdRes struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Picture string `json:"picture"`
}
