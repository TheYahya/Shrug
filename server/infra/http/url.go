package http

import (
	"encoding/json"
	"errors"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/TheYahya/shrug/domain/entity"
	httpResponse "github.com/TheYahya/shrug/infra/http/response"
	"github.com/TheYahya/shrug/infra/persistence/location"
	"github.com/TheYahya/shrug/usecase"
	"github.com/go-chi/chi"
	"github.com/mssola/user_agent"
	"go.uber.org/zap"
)

// Linkdecleration
type Link interface {
	AddLink(response http.ResponseWriter, request *http.Request) error
	UpdateLink(response http.ResponseWriter, request *http.Request) error
	GetLink(response http.ResponseWriter, request *http.Request) error
	DeleteLink(response http.ResponseWriter, request *http.Request) error
	RedirectLink(response http.ResponseWriter, request *http.Request) error
	Histogram(response http.ResponseWriter, request *http.Request) error
	BrowsersStats(response http.ResponseWriter, request *http.Request) error
	OsStats(response http.ResponseWriter, request *http.Request) error
	OverviewStats(response http.ResponseWriter, request *http.Request) error
	CityStats(response http.ResponseWriter, request *http.Request) error
	RefererStats(response http.ResponseWriter, request *http.Request) error
}

type (
	LinkDI struct {
		Uc       usecase.LinkUsecase
		VisitUc  usecase.VisitUsecase
		Location *location.LocationRepo
		Log      *zap.Logger
	}

	link struct {
		uc       usecase.LinkUsecase
		visitUc  usecase.VisitUsecase
		location *location.LocationRepo
		log      *zap.Logger
	}
)

// NewLinkInterface returns a urlInterface
func NewLink(di LinkDI) Link {
	return &link{
		uc:       di.Uc,
		visitUc:  di.VisitUc,
		location: di.Location,
		log:      di.Log,
	}
}

func getIP(r *http.Request) (string, error) {
	//Get IP from the X-REAL-IP header
	ip := r.Header.Get("X-REAL-IP")
	netIP := net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}

	//Get IP from X-FORWARDED-FOR header
	ips := r.Header.Get("X-FORWARDED-FOR")
	splitIps := strings.Split(ips, ",")
	for _, ip := range splitIps {
		netIP := net.ParseIP(ip)
		if netIP != nil {
			return ip, nil
		}
	}

	//Get IP from RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "", err
	}
	netIP = net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}
	return "", errors.New("No valid ip found")
}

func isURL(str string) bool {
	u, err := url.Parse(str)
	return err == nil && u.Scheme != "" && u.Host != ""
}

func (l *link) hasPermission(userID int64, linkID int64) bool {
	link, err := l.uc.FindByID(linkID)
	if err != nil {
		return false
	}

	if userID != link.UserID {
		return false
	}

	return true
}

func (l *link) AddLink(response http.ResponseWriter, request *http.Request) error {
	response.Header().Set("Content-Type", "application/json")
	var link entity.Link

	link.UserID = request.Context().Value("userId").(int64)
	err := json.NewDecoder(request.Body).Decode(&link)
	if err != nil {
		return errors.New("Error unmarshalling data")
	}

	if isURL(link.Link) == false {
		link.Link = "http://" + link.Link
	}

	if isURL(link.Link) == false {
		return errors.New("It's not a URL")
	}

	if link.ShortCode != "" {
		result, err := l.uc.StoreWithCode(&link)
		if err != nil {
			return errors.New(err.Error())
		}
		res := httpResponse.New(true, "", result)
		res.Done(response, http.StatusOK)
		return nil
	}

	result, err := l.uc.Store(&link)
	if err != nil {
		return errors.New("Faild to save the url")
	}

	res := httpResponse.New(true, "", result)
	return res.Done(response, http.StatusOK)
}

func (l *link) UpdateLink(response http.ResponseWriter, request *http.Request) error {
	response.Header().Set("Content-Type", "application/json")
	var link entity.Link
	err := json.NewDecoder(request.Body).Decode(&link)
	if err != nil {
		return errors.New("Error unmarshalling data")
	}

	result, err := l.uc.FindByID(link.ID)
	if err != nil {
		return err
	}

	userID := request.Context().Value("userId").(int64)
	if userID != result.UserID {
		return errors.New("Unauthorized")
	}

	if isURL(link.Link) == false {
		link.Link = "http://" + link.Link
	}

	if isURL(link.Link) == false {
		return errors.New("It's not a URL")
	}

	result.ShortCode = link.ShortCode
	result.Link = link.Link
	result.UpdatedAt = time.Now()
	updatedLink, err := l.uc.Update(result)
	if err != nil {
		return err
	}

	res := httpResponse.New(true, "", updatedLink)
	return res.Done(response, http.StatusOK)
}

func (l *link) GetLink(response http.ResponseWriter, request *http.Request) error {
	code := chi.URLParam(request, "code")
	result, err := l.uc.FindByShortCode(code)
	if err != nil {
		return err
	}
	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(result)

}

func (l *link) DeleteLink(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return errors.New("Id isn't right")
	}

	result, err := l.uc.FindByID(id)
	if err != nil {
		return err
	}

	userID := request.Context().Value("userId").(int64)
	if userID != result.UserID {
		return errors.New("Unauthorized")
	}

	err2 := l.uc.Delete(result.ID)
	if err2 != nil {
		return err2
	}

	res := httpResponse.New(true, "Deleted", nil)
	return res.Done(response, http.StatusOK)

}

func (l *link) RedirectLink(response http.ResponseWriter, request *http.Request) error {
	code := chi.URLParam(request, "code")
	link, err := l.uc.FindByShortCode(code)
	if err != nil {
		return err
	}

	ip, _ := getIP(request)

	countryCode := ""
	city := ""

	noErrorFindingLocation := false
	if err != nil {
		noErrorFindingLocation = true
	}
	results, err := l.location.DB.Get_all(ip)
	if err != nil {
		noErrorFindingLocation = true
	}

	if noErrorFindingLocation == false {
		// country = results.Country_long
		countryCode = results.Country_short
		// region = results.Region
		city = results.City
	}

	ua := user_agent.New(request.UserAgent())
	browser, _ := ua.Browser()

	refererPage := request.Header.Get("Referer")
	refererSite := "Direct"
	ref, err := url.Parse(refererPage)
	if err == nil {
		refererSite = ref.Host
	}

	visitQueue := &entity.VisitQueue{
		LinkID:    link.ID,
		Browser:   strings.ToLower(browser),
		OS:        strings.ToLower(ua.OS()),
		Country:   countryCode,
		City:      city,
		Referer:   refererSite,
		CreatedAt: time.Now(),
	}

	//redsQueue.PushVisit(visitQueue)
	vq := visitQueue

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

	visit, err := l.visitUc.VisitFindByLinkIDInOneHour(vq.LinkID)
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

		l.visitUc.VisitStore(visit)
	} else {
		// Update the one

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

		visit.UpdatedAt = time.Now()
		l.visitUc.VisitUpdate(visit)
	}

	newLink, _ := l.uc.FindByID(vq.LinkID)
	l.uc.Visit(newLink, 1)

	http.Redirect(response, request, link.Link, http.StatusSeeOther)
	return nil
}

func (l *link) Histogram(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return err
	}
	if l.hasPermission(request.Context().Value("userId").(int64), id) != true {
		return errors.New("Unauthorized")
	}
	result, err := l.visitUc.VisitHistogramByDay(id, 30)
	if err != nil {
		return err
	}

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(result)

}

func (l *link) BrowsersStats(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return err
	}
	if l.hasPermission(request.Context().Value("userId").(int64), id) != true {
		return errors.New("Unauthorized")
	}
	result, err := l.visitUc.VisitStatsBrowsers(id)
	if err != nil {
		return err
	}

	res := httpResponse.New(true, "", result)

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(res)
}

func (l *link) CityStats(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return err
	}

	if l.hasPermission(request.Context().Value("userId").(int64), id) != true {
		return errors.New("Unauthorized")
	}

	result, err := l.visitUc.VisitStatsCity(id)
	if err != nil {
		return err
	}

	res := httpResponse.New(true, "", result)

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(res)
}

func (l *link) RefererStats(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return err
	}

	if l.hasPermission(request.Context().Value("userId").(int64), id) != true {
		return errors.New("Unauthorized")
	}

	result, err := l.visitUc.VisitStatsReferer(id)
	if err != nil {
		return err
	}

	res := httpResponse.New(true, "", result)

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(res)
}

func (l *link) OsStats(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return err
	}
	if l.hasPermission(request.Context().Value("userId").(int64), id) != true {
		return errors.New("Unauthorized")
	}
	result, err := l.visitUc.VisitStatsOS(id)
	if err != nil {
		return err
	}

	res := httpResponse.New(true, "", result)

	response.WriteHeader(http.StatusOK)
	return json.NewEncoder(response).Encode(res)

}

func (l *link) OverviewStats(response http.ResponseWriter, request *http.Request) error {
	stringID := chi.URLParam(request, "id")
	id, err := strconv.ParseInt(stringID, 10, 64)
	if err != nil {
		return err
	}

	if l.hasPermission(request.Context().Value("userId").(int64), id) != true {
		return errors.New("Unauthorized")
	}

	link, err := l.uc.FindByID(id)
	if err != nil {
		return err
	}

	os, err := l.visitUc.VisitStatsOS(id)
	if err != nil {
		return err
	}

	br, err := l.visitUc.VisitStatsBrowsers(id)
	if err != nil {
		return err
	}

	views, err := l.visitUc.VisitHistogramByDay(id, 2)
	if err != nil {
		return err
	}

	visitsByCity, err := l.visitUc.VisitStatsCity(id)
	if err != nil {
		return err
	}

	topOS := entity.VisitStat{"", 0}
	if len(os) > 0 {
		topOS = os[0]
	}
	for _, i := range os {
		if i.Value > topOS.Value {
			topOS = i
		}
	}

	topBr := entity.VisitStat{"", 0}
	if len(br) > 0 {
		topBr = br[0]
	}
	for _, i := range br {
		if i.Value > topBr.Value {
			topBr = i
		}
	}

	totalViewsPercent := int64(0)
	if len(views) > 1 && link.VisitsCount != 0 {
		totalViewsPercent = views[1].Value * 100 / int64(link.VisitsCount)
	}

	topLocation := "No data"
	topLocationPercent := "0"
	if len(visitsByCity) > 0 {
		topLocation = visitsByCity[0].Key
		topLocationPercent = strconv.FormatInt(visitsByCity[0].Value*100/int64(link.VisitsCount), 10)
	}

	if topLocation == "" {
		topLocation = "No data"
	}

	topOSPercent := "0"
	if topOS.Value != 0 {
		topOSPercent = strconv.FormatInt(topOS.Value*100/int64(link.VisitsCount), 10)
	}

	topBrPercent := "0"
	if topBr.Value != 0 {
		topBrPercent = strconv.FormatInt(topBr.Value*100/int64(link.VisitsCount), 10)
	}

	topLocationPercent = "0"
	if len(visitsByCity) > 0 {
		topLocationPercent = strconv.FormatInt(visitsByCity[0].Value, 10)
	}
	result := map[string]string{
		"code":                 link.ShortCode,
		"link":                 link.Link,
		"total_views":          strconv.Itoa(link.VisitsCount),
		"total_views_percent":  strconv.FormatInt(totalViewsPercent, 10),
		"top_os":               topOS.Key,
		"top_os_count":         strconv.FormatInt(topOS.Value, 10),
		"top_os_percent":       topOSPercent,
		"top_browser":          topBr.Key,
		"top_browser_count":    strconv.FormatInt(topBr.Value, 10),
		"top_browser_percent":  topBrPercent,
		"top_location":         topLocation,
		"top_location_count":   topLocationPercent,
		"top_location_percent": topLocationPercent,
	}
	res := httpResponse.New(true, "", result)
	return res.Done(response, http.StatusOK)
}
