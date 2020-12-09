package location

import (
	"github.com/ip2location/ip2location-go"
)

type LocationRepo struct {
	DB *ip2location.DB
}

// NewLocation return
func NewLocation(ip2locationDbPath string) *LocationRepo {
	db, err := ip2location.OpenDB(ip2locationDbPath)
	if err != nil {
		panic(err)
	}
	return &LocationRepo{
		DB: db,
	}
}

func (lr *LocationRepo) Close() {
	lr.DB.Close()
}
