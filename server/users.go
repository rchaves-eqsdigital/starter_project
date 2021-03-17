package main

import (
	"fmt"

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
func (a *App) Login(email string, hash []byte) error {
	// Check if user already has an active session
	_, err := a.sessionGet_email(email)
	if err != nil {
		return err // user already logged in
	}

	err = a.newSession(email, hash)
	if err != nil {
		return err // invalid email/password
	}
	return nil
}

// Logs out and invalidates session
func (a *App) Logout(email string) error {
	// Check if user is logged in
	session, err := a.sessionGet_email(email)
	if err != nil {
		return err
	}
	err = a.sessionInvalidate(session.Tok)
	if err != nil {
		return err // user not logged in
	}
	return nil
}

/////////////////////////////////////////////////
//////////////////// DB /////////////////////////
/////////////////////////////////////////////////

func (a *App) InitUserDB() error {
	var err error
	a.DB_u, err = gorm.Open(sqlite.Open("db/users.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	errs.F_err(err)

	return a.DB_u.AutoMigrate(&User{}, &Sensor{})
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

func (a *App) ListUsers_email(email string) ([]User, error) {
	var users []User
	err := a.DB_u.Where("Email LIKE ?", fmt.Sprintf("%%%s%%", email)).Find(&users).Error
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
func (a *App) sessionGet_tok(tok string) (*Session, error) {
	var s *Session
	err := a.DB_u.Where("Tok LIKE ?", fmt.Sprintf("%%%s%%",tok)).Find(s).Error
	return s, err
}

// Takes user's email, returns (Session,error)
func (a *App) sessionGet_email(email string) (*Session, error) {
	// First, get User
	/*
	var u *User

	var s *Session
	err := a.DB_u.Where("")
	 */
	return nil, nil
}

func (a *App) sessionInvalidate(tok string) error {
	return nil
}

func (a *App) sessionIsValid(tok string) error {
	return nil
}

func (a *App) newSession(email string, hash []byte) error {
	/*
	var users []User
	var err error
	users, err = a.ListUsers_email(email)
	if err != nil {
		return err
	}
	if len(users) == 0 {
		return errors.New("couldn't find user")
	}
	if len(users) > 1 {
		return errors.New("multiple results")
	}

	if bytes.Compare(users[0].Password, hash) == 0 {
		a.DB_u.Create(&Session{U: user, Tok: uuid.UUID.String(uuid.New()), Valid: true})
	} else {
		return errors.New("invalid credentials")
	}

	 */
	return nil
}
