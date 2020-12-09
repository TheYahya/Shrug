package repository

import (
	"github.com/TheYahya/shrug/domain/entity"
)

type UserRepository interface {
	UserStore(user *entity.User) (*entity.User, error)
	UserUpdate(user *entity.User) (*entity.User, error)
	UserFindByEmail(email string) (*entity.User, error)
	UserFindByID(id int64) (*entity.User, error)
}
