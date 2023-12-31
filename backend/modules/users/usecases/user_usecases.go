package usecases

import (
	"errors"
	"fmt"

	"github.com/Bukharney/ModX/modules/entities"
	"golang.org/x/crypto/bcrypt"
)

type UsersUsecases struct {
	UsersRepo entities.UsersRepository
}

func NewUsersUsecases(usersRepo entities.UsersRepository) entities.UsersUsecase {
	return &UsersUsecases{UsersRepo: usersRepo}
}

func (a *UsersUsecases) Register(req *entities.UsersRegisterReq) (*entities.UsersRegisterRes, error) {
	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	req.Password = hashedPassword

	user, err := a.UsersRepo.Register(req)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (a *UsersUsecases) ChangePassword(req *entities.UsersChangePasswordReq) (*entities.UsersChangePasswordRes, error) {

	user, err := a.UsersRepo.GetUserByUsername(req.Username)
	if err != nil {
		return nil, errors.New("error, user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error, password is invalid")
	}

	hashedPassword, err := hashPassword(req.NewPassword)
	if err != nil {
		return nil, err
	}

	req.NewPassword = hashedPassword

	res, err := a.UsersRepo.ChangePassword(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}

func (a *UsersUsecases) GetUserByUsername(username string) (*entities.UsersPassport, error) {
	user, err := a.UsersRepo.GetUserByUsername(username)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (a *UsersUsecases) CreateUserShipping(req *entities.UsersShippingReq) (*entities.UsersShippingRes, error) {
	res, err := a.UsersRepo.CreateUserShipping(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (a *UsersUsecases) GetUserDetails(user entities.UsersClaims) (*entities.UsersDataRes, error) {
	res, err := a.UsersRepo.GetUserByUsername(user.Username)
	if err != nil {
		return nil, err
	}

	return &entities.UsersDataRes{
		Id:       res.Id,
		Username: res.Username,
		Email:    res.Email,
	}, nil
}

func (a *UsersUsecases) GetShippingDetails(user entities.UsersClaims) (*entities.UsersShippingReq, error) {
	res, err := a.UsersRepo.GetShippingDetails(user.Id)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (a *UsersUsecases) UpdateShippingDetails(req *entities.UsersShippingReq) (*entities.UsersShippingRes, error) {
	shipping, err := a.UsersRepo.GetShippingDetails(req.UserId)
	if err != nil {
		return nil, err
	}

	if shipping.UserId != req.UserId {
		res, err := a.UsersRepo.CreateUserShipping(req)
		if err != nil {
			return nil, err
		}

		return res, nil
	}

	res, err := a.UsersRepo.UpdateShippingDetails(req)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (a *UsersUsecases) DeleteAccount(user entities.UsersClaims) (*entities.UsersShippingRes, error) {
	res, err := a.UsersRepo.DeleteAccount(user.Id)
	if err != nil {
		return nil, err
	}

	return res, nil
}
