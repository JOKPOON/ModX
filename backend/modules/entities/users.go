package entities

import "github.com/golang-jwt/jwt/v4"

type UsersUsecase interface {
	Register(req *UsersRegisterReq) (*UsersRegisterRes, error)
	CreateUserShipping(req *UsersShippingReq) (*UsersShippingRes, error)
	ChangePassword(req *UsersChangePasswordReq) (*UsersChangePasswordRes, error)
}

type UsersRepository interface {
	Register(req *UsersRegisterReq) (*UsersRegisterRes, error)
	GetUserByUsername(username string) (*UsersPassport, error)
	ChangePassword(req *UsersChangePasswordReq) (*UsersChangePasswordRes, error)
	CreateUserShipping(req *UsersShippingReq) (*UsersShippingRes, error)
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
	Username string `json:"username" db:"username" binding:"required"`
	Password string `json:"password" db:"password" binding:"required"`
	Email    string `json:"email" db:"email" binding:"required"`
}

type UsersChangePasswordReq struct {
	Id          int    `json:"id" db:"id"`
	Username    string `json:"username" db:"username"`
	OldPassword string `json:"old_password" db:"old_password"`
	NewPassword string `json:"new_password" db:"new_password"`
}

type UsersRegisterRes struct {
	Id          uint64 `json:"id" db:"id"`
	Username    string `json:"username" db:"username"`
	AccessToken string `json:"token"`
}

type UsersLoginRes struct {
	AccessToken string `json:"token"`
}

type UsersChangePasswordRes struct {
	Success bool `json:"success"`
}

type UsersShippingReq struct {
	UserId   int    `json:"user_id" db:"user_id"`
	Name     string `json:"name" db:"name" binding:"required"`
	Tel      string `json:"tel" db:"tel" binding:"required"`
	Addr     string `json:"addr" db:"addr" binding:"required"`
	District string `json:"district" db:"district" binding:"required"`
	Province string `json:"province" db:"province" binding:"required"`
	Zip      string `json:"zip" db:"zip" binding:"required"`
	IsDef    bool   `json:"is_def" db:"is_def" binding:"required"`
}

type UsersShippingRes struct {
	Success bool `json:"success"`
}
