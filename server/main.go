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

var a = App{} // TODO: Fix, maybe singleton?

func (a *App) Init() error {
	err := a.InitUserDB()
	if err != nil {
		return err
	}

	err = a.InitSensorDB()
	return err
}

func main() {
	err := a.Init()
	errs.F_err(err)

	sensors, _ := a.ListSensors()
	log.Println("[main] Number of sensors:", len(sensors))
	for i, _ := range sensors {
		a.ListDataEntries(&sensors[i])
		log.Println("[main]",sensors[i])
	}

	a.Run()
}
