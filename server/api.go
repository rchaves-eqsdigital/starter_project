package main

import (
	"log"
	"net/http"
)

func (a App) Run() {
	http.HandleFunc("/api/v0/login/", apiLogin)
	http.HandleFunc("/api/v0/logout/", apiLogout)
	http.HandleFunc("/api/v0/sensor/", apiSensor)                // list all sensors
	http.HandleFunc("/api/v0/sensor/data", apiSensorData)        // get sensor data
	http.HandleFunc("/api/v0/sensor/data/add", apiSensorDataAdd) // add sensor data reading
	http.HandleFunc("/api/v0/sensor/add", apiSensorAdd)          // add sensor
	http.HandleFunc("/api/v0/user/", apiUser)                    // default show all
	http.HandleFunc("/api/v0/user/data/", apiUserData)           // get user data
	http.HandleFunc("/api/v0/user/add", apiUserAdd)              // add user

	http.HandleFunc("/login/", viewLogin)
	http.HandleFunc("/users/", viewUsers)
	http.HandleFunc("/sensors/", viewSensors)

	log.Println("Starting HTTP server...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func apiLogin(w http.ResponseWriter, r *http.Request) {

}

func apiLogout(w http.ResponseWriter, r *http.Request) {

}

func apiSensor(w http.ResponseWriter, r *http.Request) {

}
func apiSensorData(w http.ResponseWriter, r *http.Request) {

}
func apiSensorDataAdd(w http.ResponseWriter, r *http.Request) {

}
func apiSensorAdd(w http.ResponseWriter, r *http.Request) {

}
func apiUser(w http.ResponseWriter, r *http.Request) {

}
func apiUserData(w http.ResponseWriter, r *http.Request) {

}
func apiUserAdd(w http.ResponseWriter, r *http.Request) {

}
func viewLogin(w http.ResponseWriter, r *http.Request) {

}
func viewUsers(w http.ResponseWriter, r *http.Request) {

}
func viewSensors(w http.ResponseWriter, r *http.Request) {

}
