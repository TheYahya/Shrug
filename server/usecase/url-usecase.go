package usecase

import (
	"errors"

	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
	randomstring "github.com/theyahya/random-string"
)

type LinkUsecase interface {
	Store(link *entity.Link) (*entity.Link, error)
	Update(link *entity.Link) (*entity.Link, error)
	StoreWithCode(link *entity.Link) (*entity.Link, error)
	FindByShortCode(code string) (*entity.Link, error)
	FindByID(id int64) (*entity.Link, error)
	Visit(link *entity.Link, increasedBy int) (*entity.Link, error)
	Delete(id int64) error
	Links(user *entity.User, offset int, limit int, search string) ([]entity.Link, error)
	LinksCount(user *entity.User, search string) (int64, error)
}

type usecase struct{}

var (
	repo repository.LinkRepository
)

// NewURLUsecase creates a new UrlUsecase
func NewLinkUsecase(repository repository.LinkRepository) LinkUsecase {
	repo = repository
	return &usecase{}
}

func (u *usecase) Store(link *entity.Link) (*entity.Link, error) {
	Code := randomstring.New().Generate(6)

	// Check if it's already exists in DB
	theLink, _ := repo.FindByShortCode(Code)
	if theLink != nil {
		return u.Store(link)
	}

	link.ShortCode = Code
	return repo.Store(link)
}

func (u *usecase) Update(link *entity.Link) (*entity.Link, error) {
	if link.ShortCode == "" {
		return nil, errors.New("code can't be empty")
	}
	return repo.Update(link)
}

func (u *usecase) StoreWithCode(link *entity.Link) (*entity.Link, error) {
	// Check if it's already exists in DB
	theLink, _ := repo.FindByShortCode(link.ShortCode)
	if theLink != nil {
		return nil, errors.New("the `" + theLink.ShortCode + "` address already taken")
	}

	return repo.Store(link)
}

func (*usecase) FindByShortCode(code string) (*entity.Link, error) {
	return repo.FindByShortCode(code)
}

func (*usecase) FindByID(id int64) (*entity.Link, error) {
	return repo.FindByID(id)
}

func (*usecase) Visit(link *entity.Link, increasedBy int) (*entity.Link, error) {
	return repo.Visit(link, increasedBy)
}

func (*usecase) Delete(id int64) error {
	return repo.Delete(id)
}

func (*usecase) Links(user *entity.User, offset int, limit int, search string) ([]entity.Link, error) {
	return repo.Links(user, offset, limit, search)
}

func (*usecase) LinksCount(user *entity.User, search string) (int64, error) {
	return repo.LinksCount(user, search)
}
