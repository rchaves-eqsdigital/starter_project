package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string
	Password []byte
}

func (u *User) String() string {
	return u.Email + ":" + string(u.Password)
}

/////////////////////////////////////////////////
//////////////////// DB /////////////////////////
/////////////////////////////////////////////////

var u_db *gorm.DB

func Init_user_db() error {
	u_db, err := gorm.Open(sqlite.Open("db/users.db"), &gorm.Config{})
	F_err(err)

	return u_db.AutoMigrate(&User{})
}

// Creates a new user/account
func CreateUser(email string, hash []byte) error {
	u_db.Create(&User{Email: email, Password: hash})
	return nil
}

// LOGIN / LOGOUT? token, cookies, etc etc
// - Sessão c/ UUID (guardar em BE dados como data de acesso, IP, etc.)
// - JWT - https://jwt.io/ - ver isto
func Login() {

}

// Logs out and invalidates session/JWT
func Logout() {

}

func ListUsers() ([]User, error) {
	var users []User
	err := u_db.Find(&users).Error
	return users, err
}

func DeleteUser(email string) error {
	var user User
	err := u_db.First(&user, 1).Error
	F_err(err)

	err = u_db.Delete(&user, 1).Error
	F_err(err)
	return nil
}
