package middlewares

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/Bukharney/ModX/modules/entities"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func JwtAuthentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		notAuth := []string{"/login"}
		requestPath := c.Request.URL.Path

		for _, value := range notAuth {
			if value == requestPath {
				c.Next()
				return
			}
		}

		tokenHeader := c.Request.Header.Get("Authorization")

		if tokenHeader == "" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Missing auth token",
			})
			c.Abort()
			return
		}

		splitted := strings.Split(tokenHeader, " ")
		if len(splitted) != 2 {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Invalid/Malformed auth token",
			})
			c.Abort()
			return
		}

		tokenPart := splitted[1]
		tk := &entities.UsersClaims{}

		token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil {
			c.JSON(http.StatusForbidden, gin.H{
				"error": err.Error(),
			})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Token is not valid",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func GetUserByToken(c *gin.Context) (*entities.UsersClaims, error) {
	tokenHeader := c.Request.Header.Get("Authorization")

	if tokenHeader == "" {
		return nil, errors.New("error, missing auth token")
	}

	splitted := strings.Split(tokenHeader, " ")
	if len(splitted) != 2 {
		return nil, errors.New("error, invalid/malformed auth token")
	}

	tokenPart := splitted[1]

	tk := &entities.UsersClaims{}

	if tokenPart == "" {
		return nil, errors.New("error, missing auth token")
	}

	_, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	return tk, err
}

func RefreshToken(c *gin.Context) {
	tokenHeader := c.Request.Header.Get("Authorization")
	splitted := strings.Split(tokenHeader, " ")
	tokenPart := splitted[1]
	tk := &entities.UsersClaims{}
	token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if token.Valid {
		c.JSON(http.StatusOK, gin.H{
			"token": tk,
		})
	} else {
		c.JSON(http.StatusForbidden, gin.H{
			"error": err,
		})
	}
}
