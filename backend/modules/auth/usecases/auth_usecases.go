package usecases

import (
	"errors"
	"fmt"

	"github.com/Bukharney/ModX/configs"
	"github.com/Bukharney/ModX/modules/entities"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecases struct {
	AuthRepo entities.AuthRepository
	UserRepo entities.UsersRepository
}

func NewAuthUsecases(authRepo entities.AuthRepository, userRepo entities.UsersRepository) entities.AuthUsecase {
	return &AuthUsecases{AuthRepo: authRepo, UserRepo: userRepo}
}

func (a *AuthUsecases) Login(cfg *configs.Configs, req *entities.UsersCredentials) (*entities.UsersLoginRes, error) {
	user, err := a.UserRepo.GetUserByUsername(req.Username)
	if err != nil {
		return nil, errors.New("error, user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error, password is invalid")
	}

	token, err := a.AuthRepo.SignUsersAccessToken(user)
	if err != nil {
		return nil, errors.New("error, failed to sign access token")
	}
	res := &entities.UsersLoginRes{
		AccessToken: token,
	}
	return res, nil
}
