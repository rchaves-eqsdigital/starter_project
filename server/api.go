package main

import (
	"./errs"
	"encoding/hex"
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

	if origin := r.Header.Get("Origin"); origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	} else {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}
	body, err := getPostBody(r)
	if err != nil {
		sendError(w, err)
		return
	}
	log.Printf("[%s] received %s",r.URL.Path,body["email"])
	var hash []byte
	hash, err = hex.DecodeString(body["password"])
	err = a.Login(body["email"], hash)
	if err != nil {
		sendError(w, err)
		return
	}

	log.Printf("[%s] %s logged in",r.URL.Path,body["email"])
	// TODO
	// Test if is already logged in
	// Token, session, etc.
	token := "abc"
	ret := make(map[string]string)
	ret["token"] = token
	sendAsJson(w, ret)
}

// apiLogout is the handler for `/api/v0/logout/`.
func apiLogout(w http.ResponseWriter, r *http.Request, id int) {

}

// apiSensor is the handler for `/api/v0/sensor/`.
// Returns a list with the existing sensors.
// If the `id=number` parameter is present, it instead returns the
// sensor with that ID.
func apiSensor(w http.ResponseWriter, r *http.Request, id int) {
	data, err := a.ListSensors()
	errs.F_err(err)
	keys, ok := r.URL.Query()["id"]
	if ok {
		// Asking for a single sensor with id in GET parameters
		id, err = strconv.Atoi(keys[0])
		if err != nil {
			log.Println("error parsing GET[id]",err.Error()) //TODO: return error
			return
		}
		// Search ID in data
		for _, d := range data {
			if int(d.ID) == id {
				log.Printf("[%s] returning sensor with ID %d",r.URL.Path,id)
				sendAsJson(w,d)
				return
			}
		}
		// Didn't find ID
		w.Header().Set("Access-Control-Allow-Origin", "*")
		http.NotFound(w,r)
	} else {
		log.Printf("[%s] returning %T of len %d",r.URL.Path,data,len(data))
		sendAsJson(w,data)
	}
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
	errs.F_err(err) //TODO: return error
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
// TODO: Users are being returned with the full struct. Take password out.
func apiUser(w http.ResponseWriter, r *http.Request, id int) {
	data, err := a.ListUsersClean()
	errs.F_err(err)
	keys, ok := r.URL.Query()["id"]
	if ok {
		// Asking for a single user with id in GET parameters
		id, err = strconv.Atoi(keys[0])
		if err != nil {
			log.Println("error parsing GET[id]",err.Error()) //TODO: return error
			return
		}
		// Search ID in data
		for _, d := range data {
			if int(d.ID) == id {
				log.Printf("[%s] returning user with ID %d",r.URL.Path,id)
				sendAsJson(w,d)
				return
			}
		}
		// Didn't find ID
		w.Header().Set("Access-Control-Allow-Origin", "*")
		http.NotFound(w,r)
	} else {
		log.Printf("[%s] returning %T of len %d",r.URL.Path,data,len(data))
		sendAsJson(w,data)
	}
}

// apiUserData is the handler for `/api/v0/user/([0-9]+)/data/`.
// Get user data.
func apiUserData(w http.ResponseWriter, r *http.Request, id int) {
	data, err := a.ListUsersClean()
	errs.F_err(err)
	// Search ID in data
	for _, d := range data {
		if int(d.ID) == id {
			log.Printf("[%s] returning user with ID %d", r.URL.Path, id)
			sendAsJson(w, d)
			return
		}
	}
	log.Printf("[%s] returning %T of len %d",r.URL.Path,data,len(data))
	sendAsJson(w,data)
}

// apiUserAdd is the handler for `/api/v0/user/add`.
// Add user.
func apiUserAdd(w http.ResponseWriter, r *http.Request, id int) {

}

// apiSensorEdit is the handler for `/api/v0/sensor/edit`.
// It edits a sensor in the DB.
func apiSensorEdit(w http.ResponseWriter, r *http.Request, id int) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	body, err := getPostBody(r)
	if err != nil {
		sendError(w, err)
		return
	}
	log.Printf("[%s] received %s",r.URL.Path,body)
	sensorID, _ := strconv.Atoi(body["id"])
	err = a.UpdateSensor(sensorID, body["data"])
	if err != nil {
		sendError(w, err)
		return
	}
}

// apiUserEdit is the handler for `/api/v0/user/edit`.
// It edits a user in the DB.
func apiUserEdit(w http.ResponseWriter, r *http.Request, id int) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	body, err := getPostBody(r)
	if err != nil {
		sendError(w, err)
		return
	}
	log.Printf("[%s] received %s",r.URL.Path,body)
	userID, _ := strconv.Atoi(body["id"])
	err = a.UpdateUser(userID, body["data"])
	if err != nil {
		sendError(w, err)
		return
	}
}

// sendAsJson takes a val of any type, converts it to JSON and writes it to
// the http.ResponseWriter with the correct headers.
func sendAsJson(w http.ResponseWriter, val interface{}) {
	// Marshall data to JSON
	ret, _ := json.Marshal(val)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(ret)
}

// sendError responds to a request with error `err`.
func sendError(w http.ResponseWriter, err error) {
	ret := make(map[string]string)
	ret["error"] = err.Error()
	sendAsJson(w,ret)
}

// getPostBody takes a request, and if it is POST, returns a `map[string]string
// of its body
func getPostBody(r *http.Request) (map[string]string, error){
	raw_body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}
	var body map[string]string
	err = json.Unmarshal(raw_body, &body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

/***************** REGEX *********************/

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
