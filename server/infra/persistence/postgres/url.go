package postgresrepo

import (
	"errors"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
	"gorm.io/gorm"
)

type linkrepo struct {
	db *gorm.DB
}

// NewLinkRepository implement urlRepository
func NewLinkRepository(db *gorm.DB) repository.LinkRepository {
	return &linkrepo{db}
}

func (r *linkrepo) Store(link *entity.Link) (*entity.Link, error) {
	if err := r.db.Create(link).Error; err != nil {
		return nil, errors.New("unable to create user")
	}
	if err := r.db.Preload("User").First(&link).Error; err != nil {
		return nil, errors.New("unable to fetch user")
	}
	return link, nil
}

func (r *linkrepo) Update(link *entity.Link) (*entity.Link, error) {
	if err := r.db.Model(&entity.Link{}).Where("id = ?", link.ID).Updates(link).Error; err != nil {
		return nil, errors.New("can't update the link")
	}
	return link, nil
}

func (r *linkrepo) FindByShortCode(shortCode string) (*entity.Link, error) {
	var link entity.Link

	if r.db.Preload("User").First(&link, "short_code = ?", shortCode).Error != nil {
		return nil, errors.New("failed to found the url")
	}
	return &link, nil
}

func (r *linkrepo) FindByID(id int64) (*entity.Link, error) {
	var link entity.Link

	if r.db.Preload("User").First(&link, "id = ?", id).Error != nil {
		return nil, errors.New("failed to found the url")
	}
	return &link, nil
}

func (r *linkrepo) Visit(link *entity.Link, increasedBy int) (*entity.Link, error) {
	r.db.Model(entity.Link{}).Where("id = ?", link.ID).Update("visits_count", gorm.Expr("visits_count + ?", increasedBy))
	return r.FindByID(link.ID)
}

func (r *linkrepo) Delete(id int64) error {
	if err := r.db.Delete(&entity.Link{}, id).Error; err != nil {
		return errors.New("unable to delete the link")
	}
	return nil
}

func (r *linkrepo) Links(user *entity.User, offset int, limit int, search string) ([]entity.Link, error) {
	var links []entity.Link

	if search != "" {
		if r.db.Preload("User").Order("created_at desc").Where("user_id = ?", user.ID).Where("link LIKE ?", "%"+search+"%").Offset(offset).Limit(limit).Find(&links).Error != nil {
			return nil, errors.New("failed to found the url")
		}

		return links, nil
	}

	if r.db.Preload("User").Order("created_at desc").Where("user_id = ?", user.ID).Offset(offset).Limit(limit).Find(&links).Error != nil {
		return nil, errors.New("failed to found the url")
	}

	return links, nil
}

func (r *linkrepo) LinksCount(user *entity.User, search string) (int64, error) {
	var count int64

	if search != "" {
		if r.db.Model(entity.Link{}).Where("user_id = ?", user.ID).Where("link LIKE ?", "%"+search+"%").Count(&count).Error != nil {
			return 0, errors.New("failed to found the url")
		}
		return count, nil
	}

	if r.db.Model(entity.Link{}).Where("user_id = ?", user.ID).Count(&count).Error != nil {
		return 0, errors.New("failed to found the url")
	}

	return count, nil
}
