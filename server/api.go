package main

import (
	"log"
	"net/http"
	"regexp"
	"strconv"
	"sync"
	"encoding/json"
	"./errs"
)

func (a App) Run() {
	http.HandleFunc("/", Serve)

	log.Println("Starting HTTP server...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// Serve is the root handler, routing paths and supporting path parameters.
// Based on https://benhoyt.com/writings/go-routing/
func Serve(w http.ResponseWriter, r *http.Request) {
	var handler func(http.ResponseWriter, *http.Request, int)
	var id int

	p := r.URL.Path
	switch {
	case match(p, "/api/v0/login/"):
		handler = apiLogin
	case match(p, "/api/v0/logout/"):
		handler = apiLogout
	case match(p, "/api/v0/sensor/"):
		handler = apiSensor
	case match(p, "/api/v0/sensor/([0-9]+)/data", &id):
		handler = apiSensorData
	case match(p, "/api/v0/sensor/([0-9]+)/data/add", &id):
		handler = apiSensorDataAdd
	case match(p, "/api/v0/sensor/add"):
		handler = apiSensorAdd
	case match(p, "/api/v0/user/"):
		handler = apiUser
	case match(p, "/api/v0/user/([0-9]+)/data/", &id):
		handler = apiUserData
	case match(p, "/api/v0/user/add"):
		handler = apiUserAdd
	default:
		http.NotFound(w,r)
		return
	}
	handler(w,r,id)
}

// apiLogin is the handler for `/api/v0/login/`.
func apiLogin(w http.ResponseWriter, r *http.Request, id int) {

}

// apiLogout is the handler for `/api/v0/logout/`.
func apiLogout(w http.ResponseWriter, r *http.Request, id int) {

}

// apiSensor is the handler for `/api/v0/sensor/`.
// Returns a list with the existing sensors.
func apiSensor(w http.ResponseWriter, r *http.Request, id int) {

}

// apiSensorData is the handler for `/api/v0/sensor/([0-9]+)/data/`.
// Returns data of sensor `ID`.
// TODO: don't return everything at once, implement chunked requests
func apiSensorData(w http.ResponseWriter, r *http.Request, id int) {
	// Check if ID is valid
	exists, s := a.ExistsSensor(id)
	if !exists {
		http.NotFound(w,r)
		return
	}
	// Get data from DB
	data, err := a.ListDataEntries(s)
	errs.F_err(err)
	// Marshall data to JSON
	ret, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.Write(ret)
}

// apiSensorDataAdd is the handler for `/api/v0/sensor/([0-9]+)/data/add`.
// Add sensor data reading.
func apiSensorDataAdd(w http.ResponseWriter, r *http.Request, id int) {
	log.Println(r.URL.Path,id)
}

// apiSensor add is the handler for `/api/v0/sensor/add`.
// Add new sensor.
func apiSensorAdd(w http.ResponseWriter, r *http.Request, id int) {

}

// apiUser is the handler for `/api/v0/user/`.
// Returns a list with the existing users.
func apiUser(w http.ResponseWriter, r *http.Request, id int) {

}

// apiUserData is the handler for `/api/v0/user/([0-9]+)/data/`.
// Get user data.
func apiUserData(w http.ResponseWriter, r *http.Request, id int) {
	log.Println(r.URL.Path,id)
}

// apiUserAdd is the handler for `/api/v0/user/add`.
// Add user.
func apiUserAdd(w http.ResponseWriter, r *http.Request, id int) {

}

// match reports whether path matches regex ^pattern$, and if it matches,
// assigns any capture groups to the *string or *int vars.
// Based on https://benhoyt.com/writings/go-routing/
func match(path, pattern string, vars ...interface{}) bool {
	regex := mustCompileCached(pattern)
	matches := regex.FindStringSubmatch(path)
	if len(matches) <= 0 {
		return false
	}
	for i, match := range matches[1:] {
		switch p := vars[i].(type) {
		case *string:
			*p = match
		case *int:
			n, err := strconv.Atoi(match)
			if err != nil {
				return false
			}
			*p = n
		default:
			panic("vars must be *string or *int")
		}
	}
	return true
}

var (
	regexen = make(map[string]*regexp.Regexp)
	relock sync.Mutex
)

// mustCompileCached is a concurrency-safe regex compiler, where regexes are
// only compiled the first time they are used.
// Based on https://benhoyt.com/writings/go-routing/
func mustCompileCached(pattern string) *regexp.Regexp {
	relock.Lock()
	defer relock.Unlock()

	regex := regexen[pattern]
	if regex == nil {
		regex = regexp.MustCompile("^" + pattern + "$")
		regexen[pattern] = regex
	}
	return regex
}
