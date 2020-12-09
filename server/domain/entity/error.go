package entity

// Error is a error struct
type Error struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}
