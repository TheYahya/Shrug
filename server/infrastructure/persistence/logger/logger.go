package logger

import (
	"github.com/sirupsen/logrus"
)

// A Repo contains all loggerrepo needs
type Repo struct {
	Logger *logrus.Logger
}

// NewLogger implement LoggerRepo
func NewLogger() *Repo {
	logger := logrus.New()
	logger.SetFormatter(&logrus.TextFormatter{
		ForceColors:   true,
		FullTimestamp: true,
	})
	return &Repo{
		Logger: logger,
	}

}

// Info logs the infos :)
func (r Repo) Info(args ...interface{}) {
	r.Logger.Info(args...)
}

// Error for logging errors
func (r Repo) Error(args ...interface{}) {
	r.Logger.Error(args...)
}

// Warn for logging warnings
func (r Repo) Warn(args ...interface{}) {
	r.Logger.Warn(args...)
}

// Fatal for fatal errors
func (r Repo) Fatal(args ...interface{}) {
	r.Logger.Fatal(args...)
}

// Panic for log and panic
func (r Repo) Panic(args ...interface{}) {
	r.Logger.Panic(args...)
}
