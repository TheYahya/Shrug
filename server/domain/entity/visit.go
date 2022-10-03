package entity

import (
	"database/sql/driver"
	"encoding/json"

	"time"

	_ "github.com/lib/pq"
)

type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	valueString, err := json.Marshal(j)
	return string(valueString), err
}

func (j *JSONB) Scan(value interface{}) error {
	if err := json.Unmarshal(value.([]byte), &j); err != nil {
		return err
	}
	return nil
}

// Visit is visit struct
type Visit struct {
	ID        int64     `gorm:"primary_key;auto_increment" json:"id"`
	LinkID    int64     `gorm:"index:idx_link_id"`
	Link      Link      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	BrChrome  int64     `gorm:"default:0" json:"br_chrome"`
	BrFirefox int64     `gorm:"default:0" json:"br_firefox"`
	BrSafari  int64     `gorm:"default:0" json:"br_safari"`
	BrOpera   int64     `gorm:"default:0" json:"br_opera"`
	BrEdge    int64     `gorm:"default:0" json:"br_edge"`
	BrIE      int64     `gorm:"default:0" json:"br_ie"`
	BrOther   int64     `gorm:"default:0" json:"br_other"`
	OSAndroid int64     `gorm:"default:0" json:"os_android"`
	OSIOS     int64     `gorm:"default:0" json:"os_ios"`
	OSLinux   int64     `gorm:"default:0" json:"os_linux"`
	OSMac     int64     `gorm:"default:0" json:"os_mac"`
	OSWindows int64     `gorm:"default:0" json:"os_windows"`
	OSOther   int64     `gorm:"default:0" json:"os_other"`
	Country   JSONB     `gorm:"type:jsonb;DEFAULT:'{}'" json:"country"`
	City      JSONB     `gorm:"type:jsonb;DEFAULT:'{}'" json:"city"`
	Referer   JSONB     `gorm:"type:jsonb;DEFAULT:'{}'" json:"referer"`
	Total     int64     `json:"total"`
	CreatedAt time.Time `gorm:"index:idx_created_at,default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"index:idx_updated_at,default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type VisitQueue struct {
	LinkID    int64
	Browser   string
	OS        string
	Country   string
	City      string
	Referer   string
	CreatedAt time.Time
}

// VisitStat is a struct for showing stats
type VisitStat struct {
	Key   string `json:"key"`
	Value int64  `json:"value"`
}
