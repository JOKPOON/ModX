package usecases

import (
	"fmt"
	"log"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/omise/omise-go"
	"github.com/omise/omise-go/operations"
)

const (
	OmisePublicKey = "pkey_test_5xh7smyrjtw4ythtq7n"
	OmiseSecretKey = "skey_test_5xh7smzviv04nflksor"
)

type paymentUsecase struct {
	paymentRepo entities.PaymentRepository
}

func NewPaymentUsecase(paymentRepo entities.PaymentRepository) entities.PaymentUsecase {
	return &paymentUsecase{
		paymentRepo: paymentRepo,
	}
}

func (p *paymentUsecase) Charge(req *entities.PaymentChargeReq) (*entities.PaymentChargeRes, error) {
	client, _ := omise.NewClient(
		OmisePublicKey,
		OmiseSecretKey,
	)

	amount, err := p.paymentRepo.GetAmount(req.OrderId)
	if err != nil {
		return nil, fmt.Errorf("get amount failed: %v", err)
	}

	amount = amount * 100

	result := &omise.Charge{}
	err = client.Do(result, &operations.CreateCharge{
		Amount:      int64(amount),
		Currency:    "thb",
		Card:        req.Token,
		Description: "Charge for order ID: " + fmt.Sprint(req.OrderId),
	})
	if err != nil {
		return nil, fmt.Errorf("charge failed: %v", err)
	}

	if result.Paid && result.Amount == int64(amount) {
		log.Println("payment success")
		err = p.paymentRepo.UpdatePaymentStatus(fmt.Sprint(result.Status), req.OrderId)
		if err != nil {
			return nil, fmt.Errorf("update payment status failed: %v", err)
		}
	} else {
		log.Println("payment failed")
	}

	req.Charge = fmt.Sprint(result.ID)
	req.Amount = int(result.Amount)

	charge, err := p.paymentRepo.Charge(req)
	if err != nil {
		return nil, fmt.Errorf("charge failed: %v", err)
	}

	return charge, nil
}
