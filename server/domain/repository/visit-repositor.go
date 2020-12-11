package repository

import (
	"github.com/TheYahya/shrug/domain/entity"
)

type VisitRepository interface {
	VisitStore(visit *entity.Visit) (*entity.Visit, error)
	VisitUpdate(visit *entity.Visit) (*entity.Visit, error)
	VisitStoreBatch(visits []entity.Visit) ([]entity.Visit, error)
	VisitFindByLinkID(id int64) ([]entity.Visit, error)
	VisitFindByLinkIDInOneHour(id int64) (*entity.Visit, error)
	VisitHistogramByDay(id int64, days int64) ([]entity.VisitStat, error)
	VisitStatsBrowsers(id int64) ([]entity.VisitStat, error)
	VisitStatsOS(id int64) ([]entity.VisitStat, error)
	VisitStatsCountryCode(id int64) ([]entity.VisitStat, error)
	VisitStatsCity(id int64) ([]entity.VisitStat, error)
	VisitStatsReferer(id int64) ([]entity.VisitStat, error)
}
