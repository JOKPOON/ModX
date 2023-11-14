package repositories

import (
	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type PaymentRepo struct {
	Db *sqlx.DB
}

func NewPaymentRepo(db *sqlx.DB) entities.PaymentRepository {
	return &PaymentRepo{Db: db}
}

func (r *PaymentRepo) Charge(req *entities.PaymentChargeReq) (*entities.PaymentChargeRes, error) {
	return nil, nil
}
