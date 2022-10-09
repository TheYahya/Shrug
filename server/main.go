package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"

	infraHttp "github.com/TheYahya/shrug/infra/http"
	"github.com/TheYahya/shrug/infra/http/response"
	"github.com/TheYahya/shrug/infra/persistence/location"
	postgresrepo "github.com/TheYahya/shrug/infra/persistence/postgres"
	"github.com/TheYahya/shrug/router"
	"github.com/TheYahya/shrug/usecase"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"go.uber.org/zap"
)

var (
	repositories *postgresrepo.PostgresRepositories
	linkUsecase  usecase.LinkUsecase
	userUsecase  usecase.UserUsecase
	visitUsecase usecase.VisitUsecase
	httpRouter   router.Router
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()
	logger.Info("starting...")

	dbHost, _ := getEnv("DB_HOST")
	dbPort, _ := getEnv("DB_PORT")
	dbName, _ := getEnv("DB_NAME")
	dbUser, _ := getEnv("DB_USER")
	dbPassword, _ := getEnv("DB_PASSWORD")
	ip2locationDbPath, _ := getEnv("IP2LOCATION_DB_PATH")

	repositories = postgresrepo.NewPostgresRepository(dbHost, dbPort, dbName, dbUser, dbPassword)
	defer repositories.Close()
	location := location.NewLocation(ip2locationDbPath)
	defer location.Close()
	linkUsecase = usecase.NewLinkUsecase(repositories.Link)
	userUsecase = usecase.NewUserUsecase(repositories.User)
	visitUsecase = usecase.NewVisitUsecase(repositories.Visit)

	linkHttp := infraHttp.NewLink(infraHttp.LinkDI{
		Uc:       linkUsecase,
		VisitUc:  visitUsecase,
		Location: location,
		Log:      logger,
	})

	userHttp := infraHttp.NewUser(infraHttp.UserDI{
		Uc:     userUsecase,
		LinkUc: linkUsecase,
		Log:    logger,
	})
	httpRouter = router.NewMuxRouter()

	r := chi.NewRouter()
	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	r.Use(cors.Handler)

	r.Get("/{code}", response.ErrorHandler(linkHttp.RedirectLink))

	buildHandler := http.FileServer(http.Dir("/client/public"))
	r.Handle("/", buildHandler)

	staticHandler := http.StripPrefix("/dist/", http.FileServer(http.Dir("/client/public/dist")))
	r.Handle("/dist/*", staticHandler)

	imagesHandler := http.StripPrefix("/images/", http.FileServer(http.Dir("/client/public/images")))
	r.Handle("/images/*", imagesHandler)

	r.Route("/api/v1", func(r chi.Router) {
		r.Use(router.JWTMiddleware)
		r.Get("/urls/{code}", response.ErrorHandler(linkHttp.GetLink))
		r.Post("/urls", response.ErrorHandler(linkHttp.AddLink))
		r.Patch("/urls", response.ErrorHandler(linkHttp.UpdateLink))
		r.Get("/urls", response.ErrorHandler(userHttp.GetLinks))
		r.Delete("/urls/{id}", response.ErrorHandler(linkHttp.DeleteLink))
		r.Get("/histogram/{id}", response.ErrorHandler(linkHttp.Histogram))
		r.Get("/browsers-stats/{id}", response.ErrorHandler(linkHttp.BrowsersStats))
		r.Get("/city-stats/{id}", response.ErrorHandler(linkHttp.CityStats))
		r.Get("/referer-stats/{id}", response.ErrorHandler(linkHttp.RefererStats))
		r.Get("/os-stats/{id}", response.ErrorHandler(linkHttp.OsStats))
		r.Get("/overview-stats/{id}", response.ErrorHandler(linkHttp.OverviewStats))
		r.Get("/users", response.ErrorHandler(userHttp.GetUser))
	})

	r.Post("/api/v1/google/auth", response.ErrorHandler(userHttp.GoogleAuth))

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
