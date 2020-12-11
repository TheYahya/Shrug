package postgresrepo

import (
	"errors"
	// "github.com/jinzhu/gorm"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
	"gorm.io/gorm"
)

type visitrepo struct {
	db *gorm.DB
}

// NewVisitRepository implement visitRepository
func NewVisitRepository(db *gorm.DB) repository.VisitRepository {
	return &visitrepo{db}
}

func (v *visitrepo) VisitStore(visit *entity.Visit) (*entity.Visit, error) {
	if err := v.db.Create(visit).Error; err != nil {
		return nil, errors.New("failed to create the visit")
	}
	return visit, nil
}

func (v *visitrepo) VisitUpdate(visit *entity.Visit) (*entity.Visit, error) {

	if err := v.db.Model(entity.Visit{}).Where("id = ?", visit.ID).Updates(visit).Error; err != nil {
		return nil, errors.New("failed to create the visit")
	}

	return visit, nil
}

func (v *visitrepo) VisitStoreBatch(visits []entity.Visit) ([]entity.Visit, error) {
	v.db.Create(&visits)
	return visits, nil
}

func (v *visitrepo) VisitFindByLinkID(id int64) ([]entity.Visit, error) {
	var visits []entity.Visit

	if v.db.Preload("Link").Order("id desc").Where("link_id = ?", id).Find(&visits).Error != nil {
		return nil, errors.New("failed to found the url")
	}

	return visits, nil
}

func (v *visitrepo) VisitFindByLinkIDInOneHour(id int64) (*entity.Visit, error) {
	var visit entity.Visit

	if v.db.Preload("Link").Where("link_id = ? AND date_trunc('hour', created_at) = date_trunc('hour', NOW())", id).First(&visit).Error != nil {
		return nil, errors.New("failed to found the visit")
	}

	return &visit, nil
}

func (v *visitrepo) VisitHistogramByDay(id int64, days int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat

	v.db.Raw(`SELECT d.date as key, SUM(v.total) as value
	FROM (SELECT to_char(date_trunc('day', (current_date - offs)), 'MM-DD') AS date
		  FROM generate_series(0, ?, 1) AS offs
		 ) d LEFT OUTER JOIN
		 (SELECT * FROM visits WHERE link_id = ?) v
		 ON d.date = to_char(date_trunc('day', v.created_at), 'MM-DD')
	GROUP BY d.date
	ORDER BY d.date;`, days, id).Scan(&stats)

	return stats, nil
}

func (v *visitrepo) VisitStatsCountryCode(id int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat
	v.db.Raw(`SELECT country_code AS key, COUNT(country_code) AS value FROM visits WHERE link_id = ? GRPUP BY country_code GROUP BY value desc;`, id).Scan(&stats)
	return stats, nil
}

func (v *visitrepo) VisitStatsCity(id int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat
	v.db.Raw(`SELECT p.city AS key, SUM(p.count::numeric) AS value FROM visits b, jsonb_each(b.city) p(city, count) WHERE link_id = ? GROUP  BY p.city;`, id).Scan(&stats)
	return stats, nil
}

func (v *visitrepo) VisitStatsReferer(id int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat
	v.db.Raw(`SELECT p.referer AS key, SUM(p.count::numeric) AS value FROM visits b, jsonb_each(b.referer) p(referer, count) WHERE link_id = ? GROUP  BY p.referer;`, id).Scan(&stats)
	return stats, nil
}

func (v *visitrepo) VisitStatsBrowsers(id int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat
	v.db.Raw(`SELECT key AS key, value AS value FROM 
	(SELECT SUM(br_chrome) AS Chrome, SUM(br_firefox) AS Firefox, SUM(br_opera) AS Opera, SUM(br_edge) AS Edge, SUM(br_ie) AS IE, SUM(br_other) AS Others FROM visits 
	WHERE link_id=?  GROUP BY link_id) c, lateral json_each(row_to_json(c));`, id).Scan(&stats)
	return stats, nil
}

func (v *visitrepo) VisitStatsOS(id int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat
	v.db.Raw(`SELECT key AS key, value AS value FROM 
	(SELECT SUM(os_android) AS Android, SUM(osios) AS IOS, SUM(os_linux) AS Linux, SUM(os_mac) AS Mac, SUM(os_windows) AS Window, SUM(os_other) AS Others FROM visits 
	WHERE link_id=? GROUP BY link_id) c, lateral json_each(row_to_json(c));`, id).Scan(&stats)
	return stats, nil
}
