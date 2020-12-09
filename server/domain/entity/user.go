package entity

import "time"

// User is a user struct
type User struct {
	ID        int64     `gorm:"primary_key;auto_increment" json:"id"`
	Email     string    `gorm:"index,size:100;not null;unique" json:"email"`
	APIKey    string    `json:"apiKey"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}
