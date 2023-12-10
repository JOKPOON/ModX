package entities

type ReviewRepository interface {
	GetReviews(req *Review) ([]*Review, error)
	AddReview(req *Review) error
	UpdateReview(req *Review) error
	DeleteReview(req *Review) error
}

type ReviewUsecase interface {
	GetReviews(req *Review) ([]*Review, error)
	AddReview(req *Review) error
	UpdateReview(req *Review) error
	DeleteReview(req *Review) error
}

type Review struct {
	Id        int    `json:"id" db:"id"`
	ItemId    int    `json:"item_id" db:"item_id" binding:"required"`
	ProductId int    `json:"product_id" db:"product_id" binding:"required"`
	UserId    int    `json:"user_id" db:"user_id" `
	Comment   string `json:"comment" db:"comment" binding:"required"`
	Rating    int    `json:"rating" db:"rating" binding:"required"`
	CreatedAt string `json:"created_at" db:"created_at"`
	UpdatedAt string `json:"updated_at" db:"updated_at"`
}

type ReviewRes struct {
	Id        int    `json:"id"`
	UserId    int    `json:"user_id" db:"user_id" `
	Name      string `json:"name"`
	Comment   string `json:"comment"`
	Rating    int    `json:"rating"`
	CreatedAt string `json:"created_at"`
}

type ReviewReq struct {
	ProductID int `json:"product_id" binding:"required"`
}

type ReviewResList struct {
	Reviews []*ReviewRes `json:"reviews"`
}
