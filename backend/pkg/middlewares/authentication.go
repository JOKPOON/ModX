package middlewares

import (
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
				"error": "Malformed authentication token",
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

func GetUserByToken(c *gin.Context) entities.UsersClaims {
	tokenHeader := c.Request.Header.Get("Authorization")
	splitted := strings.Split(tokenHeader, " ")
	tokenPart := splitted[1]
	tk := &entities.UsersClaims{}
	token, _ := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if token.Valid {
		return *tk
	}
	return entities.UsersClaims{}
}
