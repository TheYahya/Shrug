package redisrepo

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/domain/repository"
)

type urlrepo struct {
	db *redis.Client
}

// NewURLRepository implement urlRepository
func NewURLRepository(rdb *redis.Client) repository.UrlRepository {
	return &urlrepo{
		db: rdb,
	}
}

func (r *urlrepo) Store(url *entity.URL) (*entity.URL, error) {
	ctx := context.Background()
	b, err := json.Marshal(url)
	value := string(b)
	if err != nil {
		return nil, err
	}
	err2 := r.db.Set(ctx, url.Code, value, 0).Err()
	if err2 != nil {
		return nil, err2
	}
	
	return url, nil
}

func (r *urlrepo) FindByCode(code string) (*entity.URL, error) {
	ctx := context.Background()
	val, err := r.db.Get(ctx, code).Result()
	if err != nil {
		return nil, err
	}
	data := entity.URL{}
	json.Unmarshal([]byte(val), &data)
	return &data, nil
}
