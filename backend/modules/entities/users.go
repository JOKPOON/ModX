package entities

import "github.com/golang-jwt/jwt/v4"

type UsersUsecase interface {
	Register(req *UsersRegisterReq) (*UsersRegisterRes, error)
	ChangePassword(req *UsersChangePasswordReq) (*UsersChangePasswordRes, error)
}

type UsersRepository interface {
	Register(req *UsersRegisterReq) (*UsersRegisterRes, error)
	GetUserByUsername(username string) (*UsersPassport, error)
	ChangePassword(req *UsersChangePasswordReq) (*UsersChangePasswordRes, error)
}

type UsersCredentials struct {
	Username string `json:"username" db:"username" form:"username" binding:"required"`
	Password string `json:"password" db:"password" form:"password" binding:"required"`
}

type UsersPassport struct {
	Id       int    `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
	Roles    string `json:"roles" db:"roles"`
}

type UsersClaims struct {
	Id       int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type UsersRegisterReq struct {
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
	Email    string `json:"email" db:"email"`
}

type UsersChangePasswordReq struct {
	Id          int    `json:"id" db:"id"`
	Username    string `json:"username" db:"username"`
	OldPassword string `json:"old_password" db:"old_password"`
	NewPassword string `json:"new_password" db:"new_password"`
}

type UsersRegisterRes struct {
	Id       uint64 `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
}

type UsersLoginRes struct {
	AccessToken string `json:"access_token"`
}

type UsersChangePasswordRes struct {
	Success bool `json:"success"`
}