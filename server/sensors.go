package main

import (
	"bufio"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"./errs"

	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Sensor struct {
	ID     string
	RoomID string
	Date   time.Time
	Temp   int
	In     string // "In", "Out"
}

func (s Sensor) String() string {
	return s.RoomID + "," + s.Date.String() + ": " + fmt.Sprint(s.Temp) + "ºC " + s.In
}

/////////////////////////////////////////////////
//////////////////// DB /////////////////////////
/////////////////////////////////////////////////
var s_db *gorm.DB

// Required before using the DB
func Init_sensor_db() error {
	var err error
	s_db, err = gorm.Open(sqlite.Open("db/sensors.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	errs.F_err(err)

	// Enabling Write Ahead Logging, instead of Journaling
	// which uses database-level lockinkg
	err = s_db.Exec("PRAGMA journal_mode=WAL;").Error // Enabling Write Ahead Logging,
	errs.F_err(err)

	err = s_db.AutoMigrate(&Sensor{})
	errs.F_err(err)

	var count int64
	s_db.Model(&Sensor{}).Count(&count)
	if count == 0 {
		loadDataset()
	}

	return nil
}

// Reads dataset from file and loads it into the DB
// CSV format: id,room_id/id,noted_date,temp,out/in
// Date format:08-12-2018 09:29
func loadDataset() {
	log.Println("Loading dataset.")
	start_t := time.Now()
	fname := "db/IOT-temp.csv"
	file, err := os.Open(fname)
	errs.F_err(err)
	defer file.Close()

	const buffer_max_size = 4096
	lines := make([]Sensor, 0, buffer_max_size) // Buffer for batch insert
	const workers = 4
	jobs := make(chan []Sensor)
	done := make(chan int)
	for w := 1; w <= workers; w++ {
		go workerThread(w, jobs, done)
	}

	scanner := bufio.NewScanner(file)
	scanner.Scan() // Skip first CSV line
	for scanner.Scan() {
		s := Sensor{}
		values := strings.Split(scanner.Text(), ",")
		for i, v := range values {
			switch i {
			case 0:
			case 1:
				s.RoomID = v
			case 2:
				date_layout := "02-01-2006 15:04"
				s.Date, err = time.Parse(date_layout, v)
				if err != nil {
					errs.Warn("Bad date. Expected " + date_layout + ", got " + v)
				}
			case 3:
				s.Temp, err = strconv.Atoi(v)
				if err != nil {
					errs.Warn("temperature value not int")
				}
			case 4:
				s.In = v
				s.ID = uuid.UUID.String(uuid.New())
				// Last field, Sensor struct ready.
				lines = append(lines, s)
				if len(lines) == cap(lines) {
					// Flush sensors to DB workers
					jobs <- lines
					lines = make([]Sensor, 0, buffer_max_size) // clear slice
				}
			default:
				errs.F_err(errors.New("shouldn't be here!"))
			}
		}
	}
	// Signal workers to end
	close(jobs)
	// Last batch if there is leftover data
	if len(lines) > 0 {
		CreateSensorBatch(&lines)
	}
	// Wait for workers to end (join)
	for workers_done := 0; workers_done < workers; {
		//log.Printf("worker-%d done\n", <-done)
		<-done
		workers_done += 1
	}
	close(done)

	elapsed_t := time.Since(start_t)
	log.Printf("Finished loading dataset: %s", elapsed_t)
}

func workerThread(w int, jobs <-chan []Sensor, done chan<- int) {
	for v := range jobs {
		tmp := make([]Sensor, len(v))
		copy(tmp, v)
		CreateSensorBatch(&tmp)
	}
	done <- w
}

// Creates a new sensor in the DB
func CreateSensorNew(id string, room string, date time.Time, temp int, in string) error {
	return s_db.Create(&Sensor{ID: id, RoomID: room, Date: date, Temp: temp, In: in}).Error
}

// Creates a sensor in the DB from existing struct
func CreateSensor(s *Sensor) error {
	return s_db.Create(s).Error
}

func CreateSensorBatch(s *[]Sensor) error {
	return s_db.Create(s).Error
}

func ListSensors() ([]Sensor, error) {
	var sensors []Sensor
	err := s_db.Find(&sensors).Error
	return sensors, err
}

func DeleteSensor(id string) error {
	var sensor Sensor
	err := s_db.First(&sensor, 1).Error
	if err != nil {
		log.Fatalln("couldn't find sensor with ID", id)
	}

	err = s_db.Delete(&sensor, 1).Error
	if err != nil {
		log.Fatalln("couldn't delete sensor", sensor)
	}
	return nil
}

func UpdateSensor() error {
	return nil
}

func GetData() {

}
