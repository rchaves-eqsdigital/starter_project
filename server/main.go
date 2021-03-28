package main

import (
	"crypto/sha256"
	"log"
	"strings"

	"./errs"
	"gorm.io/gorm"
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
	a.hashCost = 14 // 1s on a 9700k
	if users, _ := a.ListUsers(); len(users) == 0 {
		emails := []string{"user@user.com", "user1@user.com", "alice@user.com",
			"bob@user.com", "user2@user.com", "user3@user.com", "user4@user.com"}
		passwords := []string{"user", "user", "user", "user", "user", "user", "user"}
		createDefaultUsers(emails, passwords)
	}

	err = a.InitSensorDB()
	return err
}

func createDefaultUsers(emails []string, passwords []string) {
	if len(emails) != len(passwords) {
		log.Println("[init] Error: Emails and Passwords don't have the same size.")
		return
	}
	done := make(chan int)
	numUsers := len(emails)
	for i := 0; i < numUsers; i++ {
		email := emails[i]
		pass := passwords[i]
		go createDefaultUser(email, pass, done)
	}
	// Waiting for threads
	for usersDone := 0; usersDone < numUsers; usersDone++ {
		<-done
	}
	close(done)
}

func createDefaultUser(email string, password string, done chan int) {
	log.Println("[init] Creating user", email)
	name := "default " + strings.Split(email, "@")[0]
	hash := sha256.Sum256([]byte(password))
	err := a.CreateUser(email, name, hash[:])
	errs.F_err(err)
	log.Println("[init] Created user", email)
	done <- 0
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
