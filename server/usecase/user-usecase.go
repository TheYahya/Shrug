package usecase

import (
	"github.com/theyahya/random-string"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
)

type UserUsecase interface {
	UserStore(user *entity.User) (*entity.User, error)
	UserUpdate(user *entity.User) (*entity.User, error)
	UserFindByEmail(email string) (*entity.User, error)
	UserFindByID(id int64) (*entity.User, error)
}

type userUsecase struct{}

var (
	userRepo repository.UserRepository
)

// NewUserUsecase creates a new UserUsecase
func NewUserUsecase(repository repository.UserRepository) UserUsecase {
	userRepo = repository
	return &userUsecase{}
}

func (*userUsecase) UserStore(user *entity.User) (*entity.User, error) {
	user.APIKey = randomstring.New().Generate(64)
	return userRepo.UserStore(user)
}

func (*userUsecase) UserUpdate(user *entity.User) (*entity.User, error) {
	return nil, nil
}

func (*userUsecase) UserFindByEmail(email string) (*entity.User, error) {
	return userRepo.UserFindByEmail(email)
}

func (*userUsecase) UserFindByID(id int64) (*entity.User, error) {
	return userRepo.UserFindByID(id)
}
