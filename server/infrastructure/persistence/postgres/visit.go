package postgresrepo

import (
	"errors"
	// "github.com/jinzhu/gorm"
	"gorm.io/gorm"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
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

	v.db.Raw(`select country_code as key, count(country_code) as value from visits WHERE link_id = ? group by country_code order by value desc;`, id).Scan(&stats)

	return stats, nil
}

func (v *visitrepo) VisitStatsCity(id int64) ([]entity.VisitStat, error) {
	var stats []entity.VisitStat

	v.db.Raw(`SELECT p.city AS key, sum(p.count::numeric) AS value FROM  visits b, jsonb_each(b.city) p(city, count) where link_id = ? GROUP  BY p.city;`, id).Scan(&stats)

	return stats, nil
}

func (v *visitrepo) VisitStatsBrowsers(id int64) ([]entity.VisitStat, error) {
	// var count int64
	var stats []entity.VisitStat

	v.db.Raw(`select key as key, value  as value from (select sum(br_chrome) as Chrome, sum(br_firefox) as Firefox, sum(br_opera) as Opera, sum(br_edge) as Edge, sum(br_ie) as IE, sum(br_other) as Others from  visits where link_id=?  group by link_id) c, lateral json_each(row_to_json(c));`, id).Scan(&stats)

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser = ?", id, "chrome").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Chrome",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser = ?", id, "firefox").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Firefox",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser = ?", id, "safari").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Safari",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser = ?", id, "edge").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Edge",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser = ?", id, "ie").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "IE",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser = ?", id, "opera").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Opera",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND browser <> ? AND browser <> ? AND browser <> ? AND browser <> ? AND browser <> ? AND browser <> ?", id, "chrome", "firefox", "safari", "edge", "ie", "opera").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Other",
	// 	Value: count,
	// })

	return stats, nil
}

func (v *visitrepo) VisitStatsOS(id int64) ([]entity.VisitStat, error) {
	// var count int64
	var stats []entity.VisitStat

	v.db.Raw(`select key as key, value  as value from (select sum(os_android) as Android, sum(osios) as IOS, sum(os_linux) as Linux, sum(os_mac) as Mac, sum(os_windows) as Window, sum(os_other) as Others from visits where link_id=? group by link_id) c, lateral json_each(row_to_json(c));`, id).Scan(&stats)

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND os LIKE ?", id, "%mac%").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Mac",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND os LIKE ?", id, "%android%").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Android",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND os LIKE ?", id, "%linux%").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Linux",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND os LIKE ?", id, "%indows%").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Windows",
	// 	Value: count,
	// })

	// v.db.Model(&entity.Visit{}).Where("link_id = ? AND os NOT LIKE ? AND os NOT LIKE ? AND os NOT LIKE ? AND os NOT LIKE ? ", id, "%mac%", "%android%", "%linux%", "%indows%").Count(&count)
	// stats = append(stats, entity.VisitStat{
	// 	Key:   "Other",
	// 	Value: count,
	// })

	return stats, nil
}
