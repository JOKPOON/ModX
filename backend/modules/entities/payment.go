package entities

type PaymentRepository interface {
	Charge(req *PaymentChargeReq) (*PaymentChargeRes, error)
}

type PaymentChargeReq struct {
	Token string `json:"token"`
}

type PaymentChargeRes struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}
