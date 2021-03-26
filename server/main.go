package main

import (
	"./errs"
	"crypto/sha256"
	"gorm.io/gorm"
	"log"
)

type App struct {
	DB_u     *gorm.DB // users db
	DB_s     *gorm.DB // sensors db
	hashCost int      // cost for bcrypt
}

var a = App{} // TODO: Fix. Global atm, maybe singleton?

func (a *App) Init() error {
	err := a.InitUserDB()
	if err != nil {
		return err
	}
	// user@user.com, user
	if users, _ := a.ListUsers(); len(users) == 0 {
		log.Println("[init] Creating default user...")
		username := "user@user.com"
		name := "Default User"
		password := "user"
		hash := sha256.Sum256([]byte(password))
		a.hashCost = 15 // 2s on a 9700k
		err = a.CreateUser(username, name, hash[:])
		errs.F_err(err)
		log.Println("[init] User created.")
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
		log.Println("[main]", sensors[i])
	}

	a.Run()
}
