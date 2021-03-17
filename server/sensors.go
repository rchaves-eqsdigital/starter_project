package main

import (
	"bufio"
	"errors"
	"fmt"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"./errs"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Sensor struct {
	gorm.Model
	RoomID string
	data []DataEntry
}

type DataEntry struct {
	gorm.Model
	SensorID uint
	Date   time.Time
	Temp   int
	InOut     string // "In", "Out"
}

func (s Sensor) String() string {
	return fmt.Sprintf("%s, %d entries",s.RoomID,len(s.data))
}

func (d DataEntry) String() string {
	return d.Date.String() + ": " + fmt.Sprint(d.Temp) + "ºC " + d.InOut
}

/////////////////////////////////////////////////
//////////////////// DB /////////////////////////
/////////////////////////////////////////////////

// Required before using the DB
func (a *App) Init_sensor_db() error {
	var err error
	a.DB_s, err = gorm.Open(sqlite.Open("db/sensors.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})
	errs.F_err(err)

	// Enabling Write Ahead Logging, instead of Journaling
	// which uses database-level locking
	err = a.DB_s.Exec("PRAGMA journal_mode=WAL;").Error
	errs.F_err(err)

	err = a.DB_s.AutoMigrate(&DataEntry{},&Sensor{})
	errs.F_err(err)

	// Checking if DB is empty
	var count int64
	a.DB_s.Model(&Sensor{}).Count(&count)
	if count == 0 {
		a.loadDataset()
	}

	return nil
}

// Reads dataset from file and loads it into the DB
// CSV format: id,room_id/id,noted_date,temp,out/in
// Date format:08-12-2018 09:29
func (a *App) loadDataset() {
	start_t := time.Now()
	fname := "db/IOT-temp.csv"
	file, err := os.Open(fname)
	errs.F_err(err)
	defer file.Close()

	const buffer_max_size = 1024
	const workers = 4
	lines := make([]DataEntry, buffer_max_size)
	log.Printf("Loading dataset using %d bytes buffers and %d workers.",buffer_max_size,workers)
	jobs := make(chan []DataEntry)
	done := make(chan int)
	for w := 1; w <= workers; w++{
		go workerThread(a,w,jobs,done)
	}

	scanner := bufio.NewScanner(file)
	scanner.Scan() // Skip first CSV line
	s := Sensor{}
	d := DataEntry{}
	for scanner.Scan() {
		values := strings.Split(scanner.Text(), ",")
		for i, v := range values {
			switch i {
			case 0:
			case 1:
				// New Sensor
				// Assumes that data entries of different sensors aren't mixed.
				if v != s.RoomID {
					s = Sensor{RoomID: v}
					a.CreateSensor(&s)
				} else {
					// Keep adding data to current Sensor
				}
			case 2:
				date_layout := "02-01-2006 15:04"
				d.Date, err = time.Parse(date_layout, v)
				if err != nil {
					errs.Warn("Bad date. Expected " + date_layout + ", got " + v)
				}
			case 3:
				d.Temp, err = strconv.Atoi(v)
				if err != nil {
					errs.Warn("temperature value not int")
				}
			case 4:
				d.InOut = v
				d.SensorID = s.ID;
				// Last field, DataEntry ready.
				lines = append(lines,d)
				if len(lines) == cap(lines) {
					// Flush data entries to workers
					jobs <- lines
					lines = make([]DataEntry, 0, buffer_max_size) // clear list
				}
				d = DataEntry{}
			default:
				errs.F_err(errors.New("shouldn't be here!"))
			}
		}
	}
	// Signal workers to end
	close(jobs)
	// Last batch if there is leftover data
	if len(lines) > 0 {
		a.CreateDataEntryBatch(&lines)
	}
	// Wait for workers to end (join)
	for workers_done := 0; workers_done < workers; {
		<-done // Blocking
		workers_done += 1
	}
	close(done)

	elapsed_t := time.Since(start_t)
	log.Printf("Finished loading dataset: %s", elapsed_t)
}

func workerThread(a *App, w int, jobs <-chan []DataEntry, done chan<- int) {
	for v := range jobs {
		tmp := make([]DataEntry, len(v))
		copy(tmp, v)
		a.CreateDataEntryBatch(&tmp)
	}
	done <- w
}

// Creates a sensor in the DB from existing struct
func (a *App) CreateSensor(s *Sensor) error {
	return a.DB_s.Create(s).Error
}

func (a *App) CreateSensorBatch(s *[]Sensor) error {
	return a.DB_s.Create(s).Error
}

func (a *App) CreateDataEntry(d *DataEntry) error {
	return a.DB_s.Create(d).Error
}

func (a *App) CreateDataEntryBatch(d *[]DataEntry) error {
	return a.DB_s.Create(d).Error
}

func (a *App) ListSensors() ([]Sensor, error) {
	var sensors []Sensor
	err := a.DB_s.Find(&sensors).Error
	return sensors, err
}

func (a *App) ListDataEntries(s *Sensor) ([]DataEntry, error) {

	s.data = make([]DataEntry,0)
	/* // Showing tables
	rows, _ := a.DB_s.Table("sqlite_master").
		Where("type = ?","table").
		Select("name").Rows()
	for rows.Next() {
		var name string
		err := rows.Scan(&name)
		errs.F_err(err)
		log.Println("Table",name)
	}
	 */
	/*
	rows, _ := a.DB_s.Table("data_entries").
		Select("id,sensor_id,date,temp,in_out").Rows()
	for rows.Next() {
		var id int
		var sensorID uint
		var date time.Time
		var temp int
		var in string
		err := rows.Scan(&id,&sensorID,&date,&temp,&in)
		errs.F_err(err)
		log.Println(id,sensorID,date,temp,in)
	}
	rows, _ = a.DB_s.Table("sensors").
		Select("id,room_id").Rows()
	for rows.Next() {
		var id int
		var roomid string
		err := rows.Scan(&id,&roomid)
		errs.F_err(err)
		log.Println(id,roomid)
	}
	 */
	rows, err := a.DB_s.Table("sensors").Where("sensors.id = ?", s.ID).
		Joins("Join data_entries on data_entries.sensor_id = sensors.id").
		Select("data_entries.sensor_id, data_entries.date, data_entries.temp, data_entries.in_out").
		Rows()
	errs.F_err(err)
	for rows.Next() {
		var dataEntry DataEntry
		err = rows.Scan(&dataEntry.SensorID,&dataEntry.Date,&dataEntry.Temp,&dataEntry.InOut)
		errs.F_err(err)
		s.data = append(s.data,dataEntry)
	}
	return s.data, nil
}

func (a *App) DeleteSensor(id string) error {
	var sensor Sensor
	err := a.DB_s.First(&sensor, 1).Error
	if err != nil {
		log.Fatalln("couldn't find sensor with ID", id)
	}

	err = a.DB_s.Delete(&sensor, 1).Error
	if err != nil {
		log.Fatalln("couldn't delete sensor", sensor)
	}
	return nil
}

func (a *App) UpdateSensor() error {
	return nil
}

func GetData() {

}
