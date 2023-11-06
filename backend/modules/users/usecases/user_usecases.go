package usecases

import (
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

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}
