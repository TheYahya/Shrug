package postgresrepo

import (
	"errors"
	"gorm.io/gorm"
	// "github.com/jinzhu/gorm"
	// _ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
)

type userrepo struct {
	db *gorm.DB
}

// NewUserRepository implement urlRepository
func NewUserRepository(db *gorm.DB) repository.UserRepository {
	return &userrepo{db}
}

func (u *userrepo) UserStore(user *entity.User) (*entity.User, error) {
	if err := u.db.Create(user).Error; err != nil {
		return nil, errors.New("failed to create the user")
	}
	return user, nil
}

func (u *userrepo) UserUpdate(user *entity.User) (*entity.User, error) {
	return nil, nil
}

func (u *userrepo) UserFindByEmail(email string) (*entity.User, error) {
	var user entity.User

	if u.db.First(&user, "email = ?", email).Error != nil {
		return nil, errors.New("failed to found the user")
	}
	return &user, nil
}

func (u *userrepo) UserFindByID(id int64) (*entity.User, error) {
	var user entity.User

	if u.db.First(&user, "id = ?", id).Error != nil {
		return nil, errors.New("failed to found the user")
	}
	return &user, nil
}
