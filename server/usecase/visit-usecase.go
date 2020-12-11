package usecase

import (
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
)

type VisitUsecase interface {
	VisitStore(visit *entity.Visit) (*entity.Visit, error)
	VisitUpdate(visit *entity.Visit) (*entity.Visit, error)
	VisitStoreBatch(visits []entity.Visit) ([]entity.Visit, error)
	VisitsFindByLinkID(id int64) ([]entity.Visit, error)
	VisitFindByLinkIDInOneHour(id int64) (*entity.Visit, error)
	VisitHistogramByDay(id int64, days int64) ([]entity.VisitStat, error)
	VisitStatsBrowsers(id int64) ([]entity.VisitStat, error)
	VisitStatsOS(id int64) ([]entity.VisitStat, error)
	VisitStatsCountryCode(id int64) ([]entity.VisitStat, error)
	VisitStatsCity(id int64) ([]entity.VisitStat, error)
	VisitStatsReferer(id int64) ([]entity.VisitStat, error)
}

type visitUsecase struct{}

var (
	visitRepo repository.VisitRepository
)

// NewVisitUsecase creates a new VisitUsecase
func NewVisitUsecase(repository repository.VisitRepository) VisitUsecase {
	visitRepo = repository
	return &visitUsecase{}
}

func (*visitUsecase) VisitStore(visit *entity.Visit) (*entity.Visit, error) {
	return visitRepo.VisitStore(visit)
}

func (*visitUsecase) VisitUpdate(visit *entity.Visit) (*entity.Visit, error) {
	return visitRepo.VisitUpdate(visit)
}

func (*visitUsecase) VisitStoreBatch(visits []entity.Visit) ([]entity.Visit, error) {
	return visitRepo.VisitStoreBatch(visits)
}

func (*visitUsecase) VisitsFindByLinkID(id int64) ([]entity.Visit, error) {
	return visitRepo.VisitFindByLinkID(id)
}

func (*visitUsecase) VisitFindByLinkIDInOneHour(id int64) (*entity.Visit, error) {
	return visitRepo.VisitFindByLinkIDInOneHour(id)
}

func (*visitUsecase) VisitHistogramByDay(id int64, days int64) ([]entity.VisitStat, error) {
	return visitRepo.VisitHistogramByDay(id, days)
}

func (*visitUsecase) VisitStatsBrowsers(id int64) ([]entity.VisitStat, error) {
	return visitRepo.VisitStatsBrowsers(id)
}

func (*visitUsecase) VisitStatsOS(id int64) ([]entity.VisitStat, error) {
	return visitRepo.VisitStatsOS(id)
}

func (*visitUsecase) VisitStatsCountryCode(id int64) ([]entity.VisitStat, error) {
	return visitRepo.VisitStatsCountryCode(id)
}

func (*visitUsecase) VisitStatsCity(id int64) ([]entity.VisitStat, error) {
	return visitRepo.VisitStatsCity(id)
}

func (*visitUsecase) VisitStatsReferer(id int64) ([]entity.VisitStat, error) {
	return visitRepo.VisitStatsReferer(id)
}
