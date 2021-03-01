package errs

import "log"

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
