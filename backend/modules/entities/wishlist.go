package entities

type WishlistRepository interface {
	GetWishlistItems(req *WhishlistGetReq) (*WhishlistGetRes, error)
	AddWishlistItem(req *WhishlistAddReq) (*WhishlistAddRes, error)
	GetProductOptions(productId int) (*ProductOptions, error)
	DeleteWishlistItem(req *WhishlistDeleteReq) (*WhishlistDeleteRes, error)
	GetProductDetails(productId int) (*ProductGetByIdRes, error)
}

type WishlistUsecase interface {
	GetWishlistItems(req *WhishlistGetReq) (*WhishlistGetRes, error)
	AddWishlistItem(req *WhishlistAddReq) (*WhishlistAddRes, error)
	DeleteWishlistItem(req *WhishlistDeleteReq) (*WhishlistDeleteRes, error)
}

type Whishlist struct {
	Id           int               `json:"id" db:"id"`
	UserId       int               `json:"user_id" db:"user_id"`
	ProductId    int               `json:"product_id" db:"product_id" binding:"required"`
	Quantity     int               `json:"quantity" db:"quantity" binding:"required"`
	Options      map[string]string `json:"options" db:"options" binding:"required"`
	Price        int               `json:"price"`
	ProductTitle string            `json:"product_title"`
	ProductImage string            `json:"product_image"`
	CreatedAt    string            `json:"created_at" db:"created_at"`
	UpdatedAt    string            `json:"updated_at" db:"updated_at"`
}

type WhishlistAddReq struct {
	UserId   int       `json:"user_id"`
	Products Whishlist `json:"products" binding:"required"`
}

type WhishlistAddRes struct {
	Id int `json:"id"`
}

type WhishlistGetReq struct {
	UserId int `json:"user_id"`
}

type WhishlistGetRes struct {
	Products []Whishlist `json:"products"`
	Totals   int         `json:"totals"`
}

type WhishlistDeleteReq struct {
	UserId int `json:"user_id"`
	Id     int `json:"id"`
}

type WhishlistDeleteRes struct {
	Id int `json:"id"`
}
