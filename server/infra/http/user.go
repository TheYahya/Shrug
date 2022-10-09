package http

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/TheYahya/shrug/domain/entity"
	httpResponse "github.com/TheYahya/shrug/infra/http/response"
	"github.com/TheYahya/shrug/usecase"
	"github.com/dgrijalva/jwt-go"
	"go.uber.org/zap"
	"google.golang.org/api/oauth2/v2"
)

// Userdecleration
type User interface {
	GetLinks(response http.ResponseWriter, request *http.Request) error
	GoogleAuth(response http.ResponseWriter, request *http.Request) error
	GetUser(response http.ResponseWriter, request *http.Request) error
}

type (
	UserDI struct {
		Uc     usecase.UserUsecase
		LinkUc usecase.LinkUsecase
		Log    *zap.Logger
	}

	user struct {
		uc     usecase.UserUsecase
		linkUc usecase.LinkUsecase
		log    *zap.Logger
	}
)

// NewUser returns a user
func NewUser(di UserDI) User {
	return &user{
		uc:     di.Uc,
		linkUc: di.LinkUc,
		log:    di.Log,
	}
}

func (u *user) GetLinks(response http.ResponseWriter, request *http.Request) error {
	response.Header().Set("Content-Type", "application/json")

	userID := request.Context().Value("userId").(int64)
	user, err := u.uc.UserFindByID(userID)
	if err != nil {
		return errors.New("Error unmarshalling data")
	}

	offset, _ := strconv.Atoi(request.URL.Query().Get("offset"))
	limit, _ := strconv.Atoi(request.URL.Query().Get("limit"))
	search := request.URL.Query().Get("search")

	if offset <= 0 {
		offset = 0
	}
	if limit <= 0 {
		limit = 10
	}

	total64, err := u.linkUc.LinksCount(user, search)
	if err != nil {
		return err
	}
	s := strconv.FormatInt(total64, 10)
	total, _ := strconv.Atoi(s)

	if offset >= total {
		offset -= limit
	}

	urls, err := u.linkUc.Links(user, offset, limit, search)
	if err != nil {
		return err
	}

	res := httpResponse.New(true, "", httpResponse.DataPagination{
		Pagination: httpResponse.Pagination{
			Total:  total,
			Offset: offset,
			Limit:  limit,
		},
		Data: urls,
	})
	return res.Done(response, http.StatusOK)
}

type accessToken struct {
	AccessToken string `json:"access_token"`
}

type claims struct {
	ID int64 `json:"id"`
	jwt.StandardClaims
}

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

func (u *user) GoogleAuth(response http.ResponseWriter, request *http.Request) error {
	response.Header().Set("Content-Type", "application/json")

	var at accessToken
	accessTokenErr := json.NewDecoder(request.Body).Decode(&at)
	if accessTokenErr != nil {
		return errors.New("Error unmarshalling data")
	}

	var httpClient = &http.Client{}

	oauth2Service, err := oauth2.New(httpClient)
	tokenInfoCall := oauth2Service.Tokeninfo()
	tokenInfoCall.AccessToken(at.AccessToken)
	tokenInfo, err := tokenInfoCall.Do()
	if err != nil {
		return err
	}

	userEmail := tokenInfo.Email
	user, err := u.uc.UserFindByEmail(userEmail)
	if err != nil {
		var newUser entity.User
		newUser.Email = tokenInfo.Email
		user, _ = u.uc.UserStore(&newUser)
		user = &newUser
	}

	expirationTime := time.Now().Add(7 * 24 * 60 * time.Minute)
	// Create the JWT claims, which includes the username and expiry time
	claims := &claims{
		ID: user.ID,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return err
	}

	res := map[string]string{
		"jwtToken": tokenString,
		"email":    user.Email,
	}

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(res)
}

func (u *user) GetUser(response http.ResponseWriter, request *http.Request) error {
	response.Header().Set("Content-Type", "application/json")

	userID := request.Context().Value("userId").(int64)
	user, err := u.uc.UserFindByID(userID)
	if err != nil {
		return errors.New("Error unmarshalling data")
	}

	if user == nil {
		return errors.New("User not found")
	}

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(user)
}
