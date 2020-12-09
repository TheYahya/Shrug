package main

import (
	"errors"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"net/http"
	"os"
	"shrug/infrastructure/persistence/location"
	"shrug/infrastructure/persistence/logger"
	"shrug/infrastructure/persistence/postgres"
	"shrug/infrastructure/persistence/queue"
	"shrug/interfaces"
	"shrug/interfaces/response"
	"shrug/router"
	"shrug/usecase"
	"time"
)

var (
	log           *logger.Repo
	repositories  *postgresrepo.PostgresRepositories
	linkUsecase   usecase.LinkUsecase
	userUsecase   usecase.UserUsecase
	visitUsecase  usecase.VisitUsecase
	urlInterface  interfaces.LinkInterface
	userInterface interfaces.UserInterface
	httpRouter    router.Router
)

func main() {
	log = logger.NewLogger()
	log.Info("Starting...")

	dbHost, _ := getEnv("DB_HOST")
	dbPort, _ := getEnv("DB_PORT")
	dbName, _ := getEnv("DB_NAME")
	dbUser, _ := getEnv("DB_USER")
	dbPassword, _ := getEnv("DB_PASSWORD")
	ip2locationDbPath, _ := getEnv("IP2LOCATION_DB_PATH")

	errChan := make(chan<- error)
	redistHost, _ := getEnv("REDIS_HOST")
	redisPort, _ := getEnv("REDIS_PORT")

	repositories = postgresrepo.NewPostgresRepository(dbHost, dbPort, dbName, dbUser, dbPassword)
	redisQueue := redisqueue.NewRedisQueue(redistHost, redisPort, errChan)
	location := location.NewLocation(ip2locationDbPath)
	defer location.Close()
	linkUsecase = usecase.NewLinkUsecase(repositories.Link)
	userUsecase = usecase.NewUserUsecase(repositories.User)
	visitUsecase = usecase.NewVisitUsecase(repositories.Visit)
	urlInterface = interfaces.NewLinkInterface(linkUsecase, visitUsecase, redisQueue, location)
	userInterface = interfaces.NewUserInterface(userUsecase)
	httpRouter = router.NewMuxRouter()

	r := chi.NewRouter()
	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	r.Use(cors.Handler)

	r.Get("/{code}", response.ErrorHandler(urlInterface.RedirectLink))

	buildHandler := http.FileServer(http.Dir("/client/public"))
	r.Handle("/", buildHandler)

	staticHandler := http.StripPrefix("/dist/", http.FileServer(http.Dir("/client/public/dist")))
	r.Handle("/dist/*", staticHandler)

	imagesHandler := http.StripPrefix("/images/", http.FileServer(http.Dir("/client/public/images")))
	r.Handle("/images/*", imagesHandler)

	r.Route("/api/v1", func(r chi.Router) {
		r.Use(router.JWTMiddleware)
		r.Get("/urls/{code}", response.ErrorHandler(urlInterface.GetLink))
		r.Post("/urls", response.ErrorHandler(urlInterface.AddLink))
		r.Get("/urls", response.ErrorHandler(userInterface.GetLinks))
		r.Delete("/urls/{id}", response.ErrorHandler(urlInterface.DeleteLink))
		r.Get("/histogram/{id}", response.ErrorHandler(urlInterface.Histogram))
		r.Get("/browsers-stats/{id}", response.ErrorHandler(urlInterface.BrowsersStats))
		r.Get("/os-stats/{id}", response.ErrorHandler(urlInterface.OsStats))
		r.Get("/overview-stats/{id}", response.ErrorHandler(urlInterface.OverviewStats))
		r.Get("/users", response.ErrorHandler(userInterface.GetUser))
	})

	r.Post("/api/v1/google/auth", response.ErrorHandler(userInterface.GoogleAuth))

	taskQueue := redisQueue.ViewsQueue

	StartConsumingErr := taskQueue.StartConsuming(100, time.Second)
	if StartConsumingErr != nil {
		panic(StartConsumingErr)
	}

	viewsConsumer := redisQueue.NewRedisConsumer(linkUsecase, visitUsecase)
	taskQueue.AddConsumer("views", viewsConsumer)

	port, err := getEnv("PORT")
	if err != nil {
		port = "8000"
	}

	http.ListenAndServe(":"+port, r)
}

func getEnv(key string) (string, error) {
	value := os.Getenv(key)
	if value == "" {
		return "", errors.New(fmt.Sprintf("Fail to load %s.", key))
	}
	return value, nil
}
