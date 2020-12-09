package repository

import (
	"github.com/TheYahya/shrug/domain/entity"
)

type LinkRepository interface {
	Store(link *entity.Link) (*entity.Link, error)
	Update(link *entity.Link) (*entity.Link, error)
	FindByShortCode(shortCode string) (*entity.Link, error)
	FindByID(id int64) (*entity.Link, error)
	Visit(link *entity.Link, increasedBy int) (*entity.Link, error)
	Delete(id int64) error
	Links(user *entity.User, offset int, limit int, search string) ([]entity.Link, error)
	LinksCount(user *entity.User, search string) (int64, error)
}
