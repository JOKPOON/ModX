package entities

type ProductRepository interface {
	Create(req *ProductWithVariants) (*ProductCreateRes, error)
	GetAll(req *ProductQuery) (*AllProductRes, error)
}

type ProductUsecase interface {
	Create(req *ProductWithVariants) (*ProductCreateRes, error)
	Upload(req *FileUploadReq) (*FileUploadRes, error)
	GetAllProduct(req *ProductQuery) (*AllProductRes, error)
}

type Product struct {
	Id       int      `json:"id" db:"id"`
	Title    string   `json:"title" db:"title"`
	Price    int      `json:"price" db:"price"`
	Desc     string   `json:"desc" db:"desc"`
	Picture  []string `json:"picture" db:"picture"`
	Category string   `json:"category" db:"category"`
	SubType  string   `json:"sub_type" db:"sub_type"`
	Rating   int      `json:"rating" db:"rating"`
	Sold     int      `json:"sold" db:"sold"`
	Stock    int      `json:"stock" db:"stock"`
	Created  string   `json:"created" db:"created_at"`
	Updated  string   `json:"updated" db:"updated_at"`
}

type ProductWithVariants struct {
	Product Product          `json:"product"`
	Variant []ProductVariant `json:"variant"`
}

type ProductVariant struct {
	Id        int    `json:"id" db:"id"`
	ProductId int    `json:"product_id" db:"product_id"`
	Color     string `json:"color" db:"color"`
	Size      string `json:"size" db:"size"`
	Model     string `json:"model" db:"model"`
	Price     int    `json:"price" db:"price"`
	Stock     int    `json:"stock" db:"stock"`
}

type ProductCreate struct {
	Title    string   `json:"title" db:"title"`
	Desc     string   `json:"desc" db:"desc"`
	Category string   `json:"category" db:"category"`
	SubType  string   `json:"sub_type" db:"sub_type"`
	Picture  []string `json:"picture" db:"picture"`
}

type ProductCreateRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type AllProductRes struct {
	Data []Product `json:"data"`
}

type AllProductReq struct {
	Id       int    `json:"id" db:"id"`
	Title    string `json:"title" db:"title"`
	Desc     string `json:"desc" db:"description"`
	Price    int    `json:"price" db:"price"`
	Picture  string `json:"picture" db:"picture"`
	Category string `json:"category" db:"category"`
	SubType  string `json:"sub_type" db:"sub_type"`
	Rating   int    `json:"rating" db:"rating"`
	Sold     int    `json:"sold" db:"sold"`
	Stock    int    `json:"stock" db:"stock"`
	Created  string `json:"created" db:"created_at"`
	Updated  string `json:"updated" db:"updated_at"`
}

type ProductQuery struct {
	Id        string `json:"id" db:"id"`
	Title     string `json:"title" db:"title"`
	Category  string `json:"category" db:"category"`
	SubType   string `json:"sub_type" db:"sub_type"`
	Rating    string `json:"rating" db:"rating"`
	Limit     string `json:"limit" db:"limit"`
	MinPrice  string `json:"min_price" db:"min_price"`
	MaxPrice  string `json:"max_price" db:"max_price"`
	PriceSort string `json:"price_sort" db:"price_sort"`
	Search    string `json:"search" db:"search"`
}
