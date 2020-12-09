package entity

import "time"

// Link is url struct
type Link struct {
	ID          int64 `gorm:"primary_key;auto_increment" json:"id"`
	UserID      int64
	User        User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	ShortCode   string    `gorm:"uniqueIndex" json:"short_code"`
	Link        string    `gorm:"text;not null;" json:"link"`
	VisitsCount int       `json:"visits_count"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}
