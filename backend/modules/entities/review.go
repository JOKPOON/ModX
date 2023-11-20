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
	ID        int64   `json:"id"`
	ProductID int64   `json:"product_id"`
	UserID    int64   `json:"user_id"`
	Comment   string  `json:"comment"`
	Rating    float64 `json:"rating"`
}

type ReviewRes struct {
	ID        int64   `json:"id"`
	ProductID int64   `json:"product_id"`
	UserID    int64   `json:"user_id"`
	Comment   string  `json:"comment"`
	Rating    float64 `json:"rating"`
}

type ReviewReq struct {
	ProductID int64 `json:"product_id" binding:"required"`
}

type ReviewResList struct {
	Reviews []*ReviewRes `json:"reviews"`
}
