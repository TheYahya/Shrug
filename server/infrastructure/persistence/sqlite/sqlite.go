package reposqlite

import (
	"errors"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
)

type repo struct {
	db *gorm.DB
}

// NewSqliteRepository creates a new firebase repo
func NewSqliteRepository() repository.UrlRepository {
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
	}

	err1 := db.AutoMigrate(&entity.URL{}).Error
	if err1 != nil {
		panic("failded to migrate")
	}
	return &repo{db}
}

func (r *repo) Store(url *entity.URL) (*entity.URL, error) {
	r.db.Create(url)
	return url, nil
}

func (r *repo) FindByCode(code string) (*entity.URL, error) {
	var url entity.URL

	if r.db.First(&url, "code = ?", code).Error != nil {
		return nil, errors.New("failed to found the url")
	}
	return &url, nil
}
