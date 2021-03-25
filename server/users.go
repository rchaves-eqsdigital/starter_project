package main

import (
	"./errs"
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
)

type User struct {
	gorm.Model
	Email    string
	Name     string
	Password []byte
	Tok      string
}

type Session struct {
	gorm.Model
	ID    uint
	Tok   string
	Valid bool
}

func (u *User) String() string {
	return u.Email + ":" + string(u.Password)
}

// LOGIN / LOGOUT? token, cookies, etc etc
// - Sessão c/ UUID (guardar em BE dados como data de acesso, IP, etc.)
func (a *App) Login(email string, hash []byte) error {
	// Validate user
	users, err := a.ListUsersEmail(email)
	invalid := errors.New("invalid credentials")
	if err != nil {
		return err
	}
	if len(users) == 0 {
		// User with the provided email doesn't exist.
		// Spend time anyway, so a potential attacker doesn't know if it's
		// wrong user, wrong password, or both.
		bcrypt.GenerateFromPassword([]byte("nop"), a.hashCost)
		return invalid
	}
	user := users[0]
	err = bcrypt.CompareHashAndPassword(user.Password, hash)
	if err != nil {
		return invalid
	}
	// Check if user already has an active session
	_, err = a.sessionGetEmail(email)
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
	session, err := a.sessionGetEmail(email)
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

	return a.DB_u.AutoMigrate(&User{}, &Session{})
}

// Creates a new user/account
func (a *App) CreateUser(email string, name string, firstHash []byte) error {
	// Generating a random salt isn't required, already handled by bcrypt
	// Appending it to the base hash
	var err error
	var hash []byte
	hash, err = bcrypt.GenerateFromPassword(firstHash, a.hashCost)
	if err != nil {
		return err
	}
	// Creating user in the DB
	err = a.DB_u.Create(&User{Email: email, Password: hash, Name: name}).Error
	if err != nil {
		return err
	}
	return nil
}

func (a *App) ListUsers() ([]User, error) {
	var users []User
	err := a.DB_u.Find(&users).Error
	return users, err
}

func (a *App) ListUsersClean() ([]User, error) {
	users, err := a.ListUsers()
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(users); i++ {
		users[i].Password = nil
		users[i].Tok = ""
	}
	return users, err
}

func (a *App) ListUsersEmail(email string) ([]User, error) {
	var users []User
	err := a.DB_u.Where("Email = ?", email).Find(&users).Error
	return users, err
}

func (a *App) ListUsersEmailClean(email string) ([]User, error) {
	users, err := a.ListUsersEmail(email)
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(users); i++ {
		users[i].Password = nil
		users[i].Tok = ""
	}
	return users, err
}

func (a *App) ExistsUser(id int) (bool, *User) {
	user := &User{}
	err := a.DB_u.First(user, id).Error
	if err != nil {
		return false, nil
	}
	return true, user
}

func (a *App) DeleteUser(email string) error {
	var user User
	err := a.DB_u.First(&user, 1).Error
	errs.F_err(err)

	err = a.DB_u.Delete(&user, 1).Error
	errs.F_err(err)
	return nil
}

func (a *App) UpdateUser(id int, email string) error {
	user := &User{}
	err := a.DB_u.First(user, id).Error
	if err != nil {
		log.Println("couldn't find user with ID", id)
		return err
	}
	user.Email = email
	a.DB_u.Save(user)
	return nil
}

// Takes session token, returns (Session,error)
func (a *App) sessionGetTok(tok string) (*Session, error) {
	var s *Session
	err := a.DB_u.Where("Tok LIKE ?", fmt.Sprintf("%%%s%%", tok)).Find(s).Error
	return s, err
}

// Takes user's email, returns (Session,error)
func (a *App) sessionGetEmail(email string) (*Session, error) {
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
