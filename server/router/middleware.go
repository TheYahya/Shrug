package router

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	httpResponse "github.com/TheYahya/shrug/infra/http/response"
	"github.com/dgrijalva/jwt-go"
)

// JWTMiddleware is to authorize the user
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			res := httpResponse.New(false, "Malformed token", nil)
			res.Done(w, http.StatusUnauthorized)
			return
		} else {
			jwtToken := authHeader[1]
			token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				return []byte(os.Getenv("JWT_SECRET_KEY")), nil
			})

			if err != nil {
				res := httpResponse.New(false, "Unauthorized", nil)
				res.Done(w, http.StatusUnauthorized)
				return
			}

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				userID := int64(claims["id"].(float64))
				ctx := context.WithValue(r.Context(), "userId", userID)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				res := httpResponse.New(false, "Unauthorized", nil)
				res.Done(w, http.StatusUnauthorized)
				return
			}
		}
	})
}
