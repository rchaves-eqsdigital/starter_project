package main

import (
	"./errs"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"sync"
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
	case match(p, "/api/v0/login"):
		handler = apiLogin
	case match(p, "/api/v0/logout"):
		handler = apiLogout
	case match(p, "/api/v0/sensor"):
		handler = apiSensor
	case match(p, "/api/v0/sensor/([0-9]+)/data", &id):
		handler = apiSensorData
	case match(p, "/api/v0/sensor/([0-9]+)/data/add", &id):
		handler = apiSensorDataAdd
	case match(p, "/api/v0/sensor/add"):
		handler = apiSensorAdd
	case match(p, "/api/v0/sensor/edit"):
		handler = apiSensorEdit
	case match(p, "/api/v0/user"):
		handler = apiUser
	case match(p, "/api/v0/user/([0-9]+)/data", &id):
		handler = apiUserData
	case match(p, "/api/v0/user/add"):
		handler = apiUserAdd
	case match(p, "/api/v0/user/edit"):
		handler = apiUserEdit
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
	data, err := a.ListSensors()
	errs.F_err(err)
	log.Printf("[%s] returning %T of len %d",r.URL.Path,data,len(data))
	sendAsJson(w,data)
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
	data, err := a.ListDataEntries(s) // []DataEntry
	errs.F_err(err)
	log.Printf("[%s] returning %T of len %d",r.URL.Path,data,len(data))
	sendAsJson(w, data)
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

// apiSensorEdit is the handler for `/api/v0/sensor/edit`.
// It edits a sensor in the DB.
func apiSensorEdit(w http.ResponseWriter, r *http.Request, id int) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	raw_body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("error in body",err.Error())
		return
	}
	var body map[string]string
	err = json.Unmarshal(raw_body, &body)
	if err != nil {
		log.Println("error decoding JSON", err.Error())
		return
	}
	log.Printf("[%s] received %s",r.URL.Path,body)
	sensorID, _ := strconv.Atoi(body["id"])
	err = a.UpdateSensor(sensorID, body["data"])
	if err != nil {
		log.Println("error updating sensor",err.Error())
	}
}

// apiUserEdit is the handler for `/api/v0/user/edit`.
// It edits a user in the DB.
func apiUserEdit(w http.ResponseWriter, r *http.Request, id int) {
	log.Println(r.Header,r.PostForm,r.Form,r.Body)
}

// sendAsJson takes a val of any type, converts it to JSON and writes it to
// the http.ResponseWriter with the correct headers.
func sendAsJson(w http.ResponseWriter, val interface{}) {
	// Marshall data to JSON
	ret, _ := json.Marshal(val)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Write(ret)
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
