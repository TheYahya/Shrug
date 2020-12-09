package redisqueue

import (
	"encoding/json"
	"fmt"
	"github.com/adjust/rmq/v3"
	"github.com/TheYahya/shrug/domain/entity"
	"github.com/TheYahya/shrug/usecase"
	"strings"
	"time"
)

// RedisQueue is
type RedisQueue struct {
	Connection rmq.Connection
	ViewsQueue rmq.Queue
}

type Consumer struct {
	name         string
	count        int
	before       time.Time
	LinkUsecase  usecase.LinkUsecase
	VisitUsecase usecase.VisitUsecase
}

// NewRedisQueue return
func NewRedisQueue(host string, port string, errChan chan<- error) *RedisQueue {
	connection, err := rmq.OpenConnection("my_service", "tcp", fmt.Sprintf("%s:%s", host, port), 1, errChan)
	if err != nil {
		panic(err)
	}

	viewsQueue, errViewsQueue := connection.OpenQueue("views")
	if errViewsQueue != nil {
		panic(errViewsQueue)
	}

	return &RedisQueue{
		Connection: connection,
		ViewsQueue: viewsQueue,
	}
}

// PushVisit push visit to the queue
func (RQ *RedisQueue) PushVisit(visit *entity.VisitQueue) (*entity.VisitQueue, error) {
	task, err := json.Marshal(visit)
	if err != nil {
		return nil, err
	}

	taskError := RQ.ViewsQueue.PublishBytes(task)
	if taskError != nil {
		return nil, taskError
	}

	return visit, nil
}

func (RQ *RedisQueue) NewRedisConsumer(linkUsecase usecase.LinkUsecase, visitUsecase usecase.VisitUsecase) *Consumer {
	return &Consumer{
		LinkUsecase:  linkUsecase,
		VisitUsecase: visitUsecase,
	}
}

func (consumer *Consumer) Consume(delivery rmq.Delivery) {
	var vq entity.VisitQueue
	if err := json.Unmarshal([]byte(delivery.Payload()), &vq); err != nil {
		// handle json error
		if err := delivery.Reject(); err != nil {
			// handle reject error
		}
		return
	}

	var (
		brChrome  int64
		brFirefox int64
		brSafari  int64
		brOpera   int64
		brEdge    int64
		brIE      int64
		brOther   int64

		OSAndroid int64
		OSIOS     int64
		OSLinux   int64
		OSMac     int64
		OSWindows int64
		OSOther   int64
	)
	fmt.Println(vq.Browser)
	switch vq.Browser {
	case "chrome":
		brChrome = 1
		break
	case "chromium":
		brChrome = 1
		break
	case "firefox":
		brFirefox = 1
		break
	case "safari":
		brSafari = 1
		break
	case "opera":
		brOpera = 1
		break
	case "edge":
		brEdge = 1
		break
	case "internet explorer":
		brIE = 1
		break
	default:
		brOther = 1
	}

	fmt.Println(vq.OS)
	if strings.Contains(vq.OS, "android") {
		OSAndroid = 1
	} else if strings.Contains(vq.OS, "ios") {
		OSIOS = 1
	} else if strings.Contains(vq.OS, "linux") {
		OSLinux = 1
	} else if strings.Contains(vq.OS, "mac") {
		OSMac = 1
	} else if strings.Contains(vq.OS, "indows") {
		OSWindows = 1
	} else {
		OSOther = 1
	}

	visit, err := consumer.VisitUsecase.VisitFindByLinkIDInOneHour(vq.LinkID)
	fmt.Println("err")
	fmt.Println(err)
	fmt.Println(vq.Country)
	fmt.Println(vq)
	if vq.Country == "" {
		vq.Country = "Unknown"
	}
	if vq.City == "" {
		vq.City = "Unknown"
	}
	if vq.Referer == "" {
		vq.Referer = "Unknown"
	}
	if err != nil {
		// Insert a new one
		fmt.Println("new one")
		visit = &entity.Visit{}

		visit.LinkID = vq.LinkID

		visit.BrChrome = visit.BrChrome + brChrome
		visit.BrFirefox = visit.BrFirefox + brFirefox
		visit.BrSafari = visit.BrSafari + brSafari
		visit.BrOpera = visit.BrOpera + brOpera
		visit.BrEdge = visit.BrEdge + brEdge
		visit.BrIE = visit.BrIE + brIE
		visit.BrOther = visit.BrOther + brOther

		visit.OSAndroid = visit.OSAndroid + OSAndroid
		visit.OSIOS = visit.OSIOS + OSIOS
		visit.OSLinux = visit.OSLinux + OSLinux
		visit.OSMac = visit.OSMac + OSMac
		visit.OSWindows = visit.OSWindows + OSWindows
		visit.OSOther = visit.OSOther + OSOther

		visit.Country = entity.JSONB{vq.Country: 1}
		visit.City = entity.JSONB{vq.City: 1}
		visit.Referer = entity.JSONB{vq.Referer: 1}

		visit.Total = 1

		visit.CreatedAt = time.Now()
		visit.UpdatedAt = time.Now()

		consumer.VisitUsecase.VisitStore(visit)
	} else {
		// Update the one
		fmt.Println("update one")
		fmt.Println(visit)

		visit.BrChrome = visit.BrChrome + brChrome
		visit.BrFirefox = visit.BrFirefox + brFirefox
		visit.BrSafari = visit.BrSafari + brSafari
		visit.BrOpera = visit.BrOpera + brOpera
		visit.BrEdge = visit.BrEdge + brEdge
		visit.BrIE = visit.BrIE + brIE
		visit.BrOther = visit.BrOther + brOther

		visit.OSAndroid = visit.OSAndroid + OSAndroid
		visit.OSIOS = visit.OSIOS + OSIOS
		visit.OSLinux = visit.OSLinux + OSLinux
		visit.OSMac = visit.OSMac + OSMac
		visit.OSWindows = visit.OSWindows + OSWindows
		visit.OSOther = visit.OSOther + OSOther

		visit.Total = visit.Total + 1

		country := visit.Country
		if country[vq.Country] != nil {
			country[vq.Country] = country[vq.Country].(float64) + 1
		} else {
			country[vq.Country] = 1
		}
		visit.Country = country

		city := visit.City
		if city[vq.City] != nil {
			city[vq.City] = city[vq.City].(float64) + 1
		} else {
			city[vq.City] = 1
		}
		visit.City = city

		referer := visit.Referer
		if referer[vq.Referer] != nil {
			referer[vq.Referer] = referer[vq.Referer].(float64) + 1
		} else {
			referer[vq.Referer] = 1
		}
		visit.Referer = referer

		fmt.Println(visit.Country)

		visit.UpdatedAt = time.Now()

		consumer.VisitUsecase.VisitUpdate(visit)
	}

	// visit := &entity.Visit{
	// 	LinkID: vq.LinkID,
	// 	// BrChrome: vq.Browser,
	// }
	fmt.Println(visit)
	// consumer.VisitUsecase.VisitStoreBatch(visits)
	link, _ := consumer.LinkUsecase.FindByID(vq.LinkID)
	consumer.LinkUsecase.Visit(link, 1)
	// fmt.Printf("performing visit %s", vq)
	if err := delivery.Ack(); err != nil {
		// handle ack error
	}
}
