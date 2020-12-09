package postgresrepo

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"shrug/domain/entity"
	"shrug/domain/repository"
)

type PostgresRepositories struct {
	Link  repository.LinkRepository
	User  repository.UserRepository
	Visit repository.VisitRepository
	db    *gorm.DB
}

func GetConnection(dbhost string, dbport string, dbname string, dbuser string, dbpass string) *gorm.DB {
	var err error

	dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", dbhost, dbport, dbuser, dbname, dbpass)
	instance, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: nil,
	})

	if err != nil {
		fmt.Println("Connection Failed to Open")
	}
	// instance.LogMode(true)
	return instance
}

// NewPostgresRepository implement urlRepository
func NewPostgresRepository(dbhost string, dbport string, dbname string, dbuser string, dbpass string) *PostgresRepositories {
	db := GetConnection(dbhost, dbport, dbname, dbuser, dbpass)

	err1 := db.AutoMigrate(&entity.User{}, &entity.Link{}, &entity.Visit{})
	if err1 != nil {
		panic(err1)
	}
	return &PostgresRepositories{
		User:  NewUserRepository(db),
		Link:  NewLinkRepository(db),
		Visit: NewVisitRepository(db),
		db:    db,
	}
}

func (r *PostgresRepositories) Close() error {
	// return r.db.Close()
	return nil
}

func (r *PostgresRepositories) Automigrate() error {
	return r.db.AutoMigrate(&entity.Link{}, &entity.User{}, &entity.Visit{})
}
