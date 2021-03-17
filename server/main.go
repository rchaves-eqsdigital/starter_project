package main

import (
	"./errs"
	"gorm.io/gorm"
	"log"
)

type App struct {
	DB_u *gorm.DB // users db
	DB_s *gorm.DB // sensors db
}

func (a *App) Init() error {
	err := a.Init_user_db()
	if err != nil {
		return err
	}

	err = a.Init_sensor_db()
	return err
}

func main() {
	a := App{}
	err := a.Init()
	errs.F_err(err)

	sensors, _ := a.ListSensors()
	log.Println("Number of sensors:", len(sensors))
	for i, _ := range sensors {
		a.ListDataEntries(&sensors[i])
		log.Println(sensors[i])
	}

	a.Run()
}
