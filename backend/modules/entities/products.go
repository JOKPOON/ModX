package entities

type ProductRepository interface {
	Create(req *Product) (*ProductCreateRes, error)
}

type ProductUsecase interface {
	Create(req *Product) (*ProductCreateRes, error)
	Upload(req *FileUploadReq) (*FileUploadRes, error)
}

type Product struct {
	ProductId int      `json:"id" db:"id"`
	Title     string   `json:"title" db:"title"`
	Desc      string   `json:"desc" db:"desc"`
	Picture   []string `json:"picture" db:"picture"`
	Category  string   `json:"category" db:"category"`
	SubType   string   `json:"sub_type" db:"sub_type"`
	Rating    float32  `json:"rating" db:"rating"`
	Sold      int      `json:"sold" db:"sold"`
	Stock     int      `json:"stock" db:"stock"`
	Variants  []ProductVariant
}

type ProductVariant struct {
	Color string  `json:"color" db:"color"`
	Size  string  `json:"size" db:"size"`
	Model string  `json:"model" db:"model"`
	Price float32 `json:"price" db:"price"`
	Stock int     `json:"stock" db:"stock"`
}

type ProductCreateReq struct {
	Title    string   `json:"title" db:"title"`
	Desc     string   `json:"desc" db:"desc"`
	Picture  []string `json:"picture" db:"picture"`
	Category string   `json:"category" db:"category"`
	SubType  string   `json:"sub_type" db:"sub_type"`
}

type ProductCreateRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}
