package main

import (
	"log"
)

// Fatal error
func F_err(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

// Warning
func Warn(w string) {
	log.Println("WARNING:", w)
}

func main() {
	err := Init_user_db()
	F_err(err)

	err = Init_sensor_db()
	F_err(err)

	/*
		sensors, _ := ListSensors()
		for _, v := range sensors {
			log.Println(v)
		}
	*/
}
