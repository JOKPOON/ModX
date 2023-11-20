package entities

type PaymentRepository interface {
	Charge(req *PaymentChargeReq) (*PaymentChargeRes, error)
	GetAmount(orderId int) (int, error)
	UpdatePaymentStatus(paymentStatus string, orderId int) error
}

type PaymentUsecase interface {
	Charge(req *PaymentChargeReq) (*PaymentChargeRes, error)
}

type PaymentChargeReq struct {
	Id      int    `json:"id"`
	Token   string `json:"token" binding:"required"`
	OrderId int    `json:"order_id" binding:"required"`
	Amount  int    `json:"amount"`
	Charge  string `json:"charge"`
}

type PaymentChargeRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}
