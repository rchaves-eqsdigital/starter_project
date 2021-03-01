package main

import (
	"./errs"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type User struct {
	gorm.Model
	Email    string
	Password []byte
	Tok      string
}

type Session struct {
	gorm.Model
	U     User
	Tok   string
	Valid bool
}

func (u *User) String() string {
	return u.Email + ":" + string(u.Password)
}

// LOGIN / LOGOUT? token, cookies, etc etc
// - Sessão c/ UUID (guardar em BE dados como data de acesso, IP, etc.)
func Login(email string, hash []byte) error {
	// Check if user already has an active session
	_, err := sessionGet_email(email)
	if err != nil {
		return err // user already logged in
	}

	err = newSession(email, hash)
	if err != nil {
		return err // invalid email/password
	}
	return nil
}

// Logs out and invalidates session
func Logout(email string) error {
	// Check if user is logged in
	session, err := sessionGet_email(email)
	if err != nil {
		return err
	}
	err = sessionInvalidate(session.Tok)
	if err != nil {
		return err // user not logged in
	}
	return nil
}

/////////////////////////////////////////////////
//////////////////// DB /////////////////////////
/////////////////////////////////////////////////

// FIXME: removed u_db from here

func (a *App) Init_user_db() error {
	var err error
	a.DB_u, err = gorm.Open(sqlite.Open("db/users.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	errs.F_err(err)

	return a.DB_u.AutoMigrate(&User{})
}

// Creates a new user/account
func (a *App) CreateUser(email string, hash []byte) error {
	a.DB_u.Create(&User{Email: email, Password: hash})
	return nil
}

func (a *App) ListUsers() ([]User, error) {
	var users []User
	err := a.DB_u.Find(&users).Error
	return users, err
}

func (a *App) DeleteUser(email string) error {
	var user User
	err := a.DB_u.First(&user, 1).Error
	errs.F_err(err)

	err = a.DB_u.Delete(&user, 1).Error
	errs.F_err(err)
	return nil
}

// Takes session token, returns (Session,error)
func sessionGet_tok(tok string) (*Session, error) {
	return nil, nil
}

// Takes user's email, returns (Session,error)
func sessionGet_email(email string) (*Session, error) {
	return nil, nil
}

func sessionInvalidate(tok string) error {
	return nil
}

func sessionIsValid(tok string) error {
	return nil
}

func newSession(email string, hash []byte) error {
	/*
		if hash matches user{
			u_db.Create(&Session{})
		}else{
			return errors.New("invalid credentials")
		}
	*/
	return nil
}
