package main

import (
	"log"

	"./errs"
)

func main() {
	err := Init_user_db()
	errs.F_err(err)

	err = Init_sensor_db()
	errs.F_err(err)

	sensors, _ := ListSensors()
	log.Println("Number of sensors:", len(sensors))

}
