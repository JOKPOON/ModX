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
	ID        int    `json:"id"`
	ProductId int    `json:"product_id"`
	UserId    int    `json:"user_id"`
	Comment   string `json:"comment"`
	Rating    int    `json:"rating"`
}

type ReviewRes struct {
	ID        int    `json:"id"`
	ProductID int    `json:"product_id"`
	UserID    int    `json:"user_id"`
	Comment   string `json:"comment"`
	Rating    int    `json:"rating"`
}

type ReviewReq struct {
	ProductID int `json:"product_id" binding:"required"`
}

type ReviewResList struct {
	Reviews []*ReviewRes `json:"reviews"`
}
