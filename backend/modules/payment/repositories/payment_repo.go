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
	query := `
	INSERT INTO "payments"(
		"order_id",
		"token",
		"amount",
		"charge"
	)
	VALUES ($1, $2, $3, $4)
	RETURNING "id";
	`

	err := r.Db.QueryRowx(
		query,
		req.OrderId,
		req.Token,
		req.Amount,
		req.Charge,
	).Scan(&req.Id)
	if err != nil {
		return nil, err
	}

	res := &entities.PaymentChargeRes{
		Status:  "success",
		Message: "payment success",
	}

	return res, nil
}

func (r *PaymentRepo) GetAmount(orderId int) (int, error) {
	query := `SELECT total_cost FROM orders WHERE id = $1`
	var amount int
	err := r.Db.QueryRow(query, orderId).Scan(&amount)
	if err != nil {
		return 0, err
	}

	return amount, nil
}

func (r *PaymentRepo) UpdatePaymentStatus(paymentStatus string, orderId int) error {
	query := `UPDATE orders SET payment_status = $1, status = $3 WHERE id = $2`
	_, err := r.Db.Exec(query, paymentStatus, orderId, "pending")
	if err != nil {
		return err
	}

	return nil
}
