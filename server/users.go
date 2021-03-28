package main

import (
	"errors"
	"fmt"
	"log"

	"./errs"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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
	UserID uint
	Tok    string
	Valid  bool
}

// String represents a User as string.
func (u *User) String() string {
	return fmt.Sprintf("%s: %s, Token: %s", u.Email, u.Name, u.Tok)
}

// String represents a Session as a string.
func (s *Session) String() string {
	isValid := ""
	if s.Valid {
		isValid = "valid"
	}
	return fmt.Sprintf("%s user %d, tok %s, created %v", isValid, s.UserID, s.Tok, s.CreatedAt)
}

// Login takes a users email and password, returning (sessionToken,error)
func (a *App) Login(email string, hash []byte) (string, error) {
	// Validate user
	users, err := a.ListUsersEmail(email)
	invalid := errors.New("invalid credentials")
	if err != nil {
		return "", err
	}
	if len(users) == 0 {
		// User with the provided email doesn't exist.
		// Spend time anyway, so a potential attacker doesn't know if it's
		// wrong user, wrong password, or both.
		bcrypt.GenerateFromPassword([]byte("nop"), a.hashCost)
		return "", invalid
	}
	user := users[0]
	err = bcrypt.CompareHashAndPassword(user.Password, hash)
	if err != nil {
		return "", invalid
	}
	// Check if user already has an active session
	var s *Session
	uid := int(user.ID)
	s, err = a.getSessionFromUser(uid)
	if s != nil {
		return "", errors.New("user already logged in")
	}
	var tok string
	tok, err = a.CreateSession(uid)
	return tok, err
}

// Logout takes a token and invalidates it, effectively logging a user out
func (a *App) Logout(tok string) error {
	// Check if user is logged in
	_, err := a.getSessionFromTok(tok)
	if err != nil {
		return err
	}
	err = a.InvalidateSession(tok)
	return err
}

/////////////////////////////////////////////////
//////////////////// DB /////////////////////////
/////////////////////////////////////////////////

// InitUserDB performs the required initializations of the user's DB.
// MUST be called before using the DB.
func (a *App) InitUserDB() error {
	var err error
	a.DB_u, err = gorm.Open(sqlite.Open("db/users.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	errs.F_err(err)

	return a.DB_u.AutoMigrate(&User{}, &Session{})
}

// CreateUser creates in the DB a new user/account with `email`, `name` and
// hashed password `firstHash`.
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
	return err
}

// ListUsers returns a list with existing users in the DB.
func (a *App) ListUsers() ([]User, error) {
	var users []User
	err := a.DB_u.Find(&users).Error
	return users, err
}

// ListUsersClean returns a list with existing users in the DB,
// but with the Password and Tok fields stripped out.
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

// ListUsersEmail returns a list with existing users in the DB that have
// the email `email`.
func (a *App) ListUsersEmail(email string) ([]User, error) {
	var users []User
	err := a.DB_u.Where("Email = ?", email).Find(&users).Error
	return users, err
}

// ListUsersEmailClean returns a list with existing users in the DB that have
// the email `email`, but with the Password and Tok fields stripped out.
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

// ExistsUser checks if a user with ID `id` exists, returning (true,*User) if so.
func (a *App) ExistsUser(id int) (bool, *User) {
	user := &User{}
	err := a.DB_u.First(user, id).Error
	if err != nil {
		return false, nil
	}
	return true, user
}

// DeleteUser deletes from the DB a user with ID `id`
func (a *App) DeleteUser(id int) error {
	err := a.DB_u.Delete(&User{}, id).Error
	if err != nil {
		log.Println("[DeleteUser] error deleting user")
		return err
	}
	return nil
}

// UpdateUser updates the email of a user with id `id`.
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

// getSessionFromTok takes session token, returns (Session,error)
func (a *App) getSessionFromTok(tok string) (*Session, error) {
	var s *Session
	err := a.DB_u.Where("Tok = ?", tok).First(&s).Error
	return s, err
}

// getSessionFromUser takes user's ID, returns (Session,error)
func (a *App) getSessionFromUser(userID int) (*Session, error) {
	// First, get User
	ok, u := a.ExistsUser(userID)
	if !ok {
		return nil, errors.New("invalid userID " + fmt.Sprint(userID))
	}
	s, err := a.getSessionFromTok(u.Tok)
	if err != nil {
		return nil, err
	}
	return s, nil
}

// getUserFromSession takes a session token, returns the User (if any)
// with that token.
func (a *App) getUserFromSession(tok string) (*User, error) {
	s, err := a.getSessionFromTok(tok)
	if err != nil {
		return nil, err
	}
	var user *User
	err = a.DB_u.Where("ID = ?", s.UserID).First(&user).Error
	if err != nil {
		return nil, err
	}
	return user, err
}

// InvalidateSession invalidates the session with token `tok`, updating both the
// corresponding Session and User in the DB.
func (a *App) InvalidateSession(tok string) error {
	s, err := a.getSessionFromTok(tok)
	if err != nil {
		return err
	}
	var user *User
	user, err = a.getUserFromSession(tok)
	if err != nil {
		return err
	}
	s.Valid = false
	err = a.DB_u.Save(s).Error
	if err != nil {
		// I assume we don't have to set s.Valid back to true, as the DB save failed
		return err
	}
	user.Tok = ""
	err = a.DB_u.Save(user).Error
	// Same comment as above
	return err
}

// ExistsSession returns true if the session represented by `tok` is valid/exists
func (a *App) ExistsSession(tok string) bool {
	_, err := a.getSessionFromTok(tok)
	return err == nil
}

// CreateSession creates a new session in the DB for user with id `userID`.
func (a *App) CreateSession(userID int) (string, error) {
	ok, u := a.ExistsUser(userID)
	if !ok {
		return "", errors.New("invalid userID " + fmt.Sprint(userID))
	}
	// Generate a new token
	tok := uuid.UUID.String(uuid.New())
	session := &Session{UserID: u.ID, Tok: tok, Valid: true}
	err := a.DB_u.Create(session).Error
	if err != nil {
		return "", err
	}
	// Save the token in the affected user
	u.Tok = tok
	err = a.DB_u.Save(u).Error
	return tok, err
}

// ListOpenSessions returns an array of valid Sessions.
func (a *App) ListOpenSessions() ([]Session, error) {
	var sessions []Session
	err := a.DB_u.Find(&sessions).Error
	// Array is traversed like this because the array is resized inside the loop
	for i := 0; ; i++ {
		if i >= len(sessions) {
			// Reached end of list
			break
		}
		if !sessions[i].Valid {
			// Remove it from the returning array
			sessions = removeSession(sessions, i)
		}
	}
	return sessions, err
}

func (a *App) RefreshSession(tok string) error {
	session, err := a.getSessionFromTok(tok)
	if err != nil {
		return err
	}
	err = a.DB_u.Save(&session).Error
	return err
}

// removeSession removes the Session at pos `i` from the array.
func removeSession(s []Session, i int) []Session {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}
