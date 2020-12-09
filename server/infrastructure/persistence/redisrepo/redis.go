package redisrepo

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/TheYahya/shrug/domain/repository"
)

type RedisRepositories struct {
	URL repository.UrlRepository
	db  *redis.Client
}

// NewRedisRepository implement urlRepository
func NewRedisRepository() *RedisRepositories {
	var ctx = context.Background()
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	pong, err := rdb.Ping(ctx).Result()
	fmt.Println(pong, err)
	return &RedisRepositories{
		URL: NewURLRepository(rdb),
		db:  rdb,
	}
}

func (r *RedisRepositories) Close() error {
	return nil
}

func (r *RedisRepositories) Automigrate() error {
	return nil
}
