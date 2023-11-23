package entities

type ProductRepository interface {
	Create(req *Product) (*ProductCreateRes, error)
	GetAll(req *ProductQuery) (*AllProductRes, error)
	GetProduct(req *Product) (*Product, error)
	AddReview(req *Review) error
	DeleteProduct(req *Product) error
}

type ProductUsecase interface {
	Create(req *Product) (*ProductCreateRes, error)
	GetAllProduct(req *ProductQuery) (*AllProductRes, error)
	GetProduct(req *Product) (*Product, error)
	AddReview(req *Review) error
	DeleteProduct(req *Product) error
}

type Product struct {
	Id       int                    `json:"id" db:"id"`
	Title    string                 `json:"title" db:"title"`
	Price    int                    `json:"price" db:"price"`
	Discount int                    `json:"discount" db:"discount"`
	Desc     string                 `json:"desc" db:"description"`
	Picture  []string               `json:"picture" db:"picture"`
	Options  map[string]interface{} `json:"options" db:"options"`
	Category string                 `json:"category" db:"category"`
	Rating   int                    `json:"rating" db:"rating"`
	Sold     int                    `json:"sold" db:"sold"`
	Stock    int                    `json:"stock" db:"stock"`
	Reviews  []Review               `json:"review"`
	Created  string                 `json:"created" db:"created_at"`
	Updated  string                 `json:"updated" db:"updated_at"`
}

type ProductRes struct {
	Id       int    `json:"id" db:"id"`
	Title    string `json:"title" db:"title"`
	Price    int    `json:"price" db:"price"`
	Discount int    `json:"discount" db:"discount"`
	Desc     string `json:"desc" db:"description"`
	Picture  string `json:"picture" db:"picture"`
	Options  string `json:"options" db:"options"`
	Category string `json:"category" db:"category"`
	Rating   int    `json:"rating" db:"rating"`
	Sold     int    `json:"sold" db:"sold"`
	Stock    int    `json:"stock" db:"stock"`
	Created  string `json:"created" db:"created_at"`
	Updated  string `json:"updated" db:"updated_at"`
}

type ProductCreateRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type AllProductRes struct {
	Data []AllProduct `json:"data"`
}

type AllProduct struct {
	Id       int    `json:"id" db:"id"`
	Title    string `json:"title" db:"title"`
	Price    int    `json:"price" db:"price"`
	Picture  string `json:"picture" db:"picture"`
	Rating   int    `json:"rating" db:"rating"`
	Sold     int    `json:"sold" db:"sold"`
	Discount int    `json:"discount" db:"discount"`
}

type ProductQuery struct {
	Id        string   `json:"id" db:"id"`
	Title     string   `json:"title" db:"title"`
	Category  []string `json:"category" db:"category"`
	Rating    string   `json:"rating" db:"rating"`
	Limit     string   `json:"limit" db:"limit"`
	MinPrice  string   `json:"min_price" db:"min_price"`
	MaxPrice  string   `json:"max_price" db:"max_price"`
	PriceSort string   `json:"price_sort" db:"price_sort"`
	Search    string   `json:"search" db:"search"`
}

type ProductOptions struct {
	Options map[string]interface{} `json:"options" db:"options"`
}
