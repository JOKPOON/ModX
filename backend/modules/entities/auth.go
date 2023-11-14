package entities

import (
	"github.com/Bukharney/ModX/configs"
)

type AuthRepository interface {
	SignUsersAccessToken(req *UsersPassport) (string, error)
}

type AuthUsecase interface {
	Login(cfg *configs.Configs, req *UsersCredentials) (*UsersLoginRes, error)
}
