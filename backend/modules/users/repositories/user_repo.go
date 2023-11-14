package repositories

import (
	"errors"
	"fmt"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/jmoiron/sqlx"
)

type UserRepo struct {
	Db *sqlx.DB
}

func NewUsersRepo(db *sqlx.DB) entities.UsersRepository {
	return &UserRepo{Db: db}
}

func (r *UserRepo) Register(req *entities.UsersRegisterReq) (*entities.UsersRegisterRes, error) {
	query := `
	INSERT INTO "users"(
		"username",
		"email",
		"password",
		"roles"
	)
	VALUES ($1, $2, $3, $4)
	RETURNING "id", "username";
	`

	// Initail a user object
	user := new(entities.UsersRegisterRes)

	// Query part
	rows, err := r.Db.Queryx(query, req.Username, req.Email, req.Password, "user")
	if err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error, failed to query")
	}

	for rows.Next() {
		if err := rows.StructScan(user); err != nil {
			fmt.Println(err.Error())
			return nil, errors.New("error, failed to scan")
		}
	}
	return user, nil
}

func (r *UserRepo) ChangePassword(req *entities.UsersChangePasswordReq) (*entities.UsersChangePasswordRes, error) {
	query := `
	UPDATE "users"
	SET "password" = $1
	WHERE "id" = $2;
	`

	// Initail a user object
	user := new(entities.UsersChangePasswordRes)

	// Query part
	rows, err := r.Db.Queryx(query, req.NewPassword, req.Id)
	if err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error, failed to query")
	} else {
		user.Success = true
	}

	for rows.Next() {
		if err := rows.StructScan(user); err != nil {
			fmt.Println(err.Error())
			return nil, errors.New("error, failed to scan")
		}
	}
	return user, nil
}

func (r *UserRepo) GetUserByUsername(username string) (*entities.UsersPassport, error) {
	query := `
	SELECT
	"id",
	"username",
	"password",
	"roles"
	FROM "users"
	WHERE "username" = $1;
	`
	res := new(entities.UsersPassport)
	if err := r.Db.Get(res, query, username); err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error, user not found")
	}
	return res, nil
}
