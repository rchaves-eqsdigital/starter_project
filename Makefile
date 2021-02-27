all: server

server: bin/server

bin/server:
	mkdir ./bin/
	go build -o ./bin/server server/*.go

clean:
	rm -f db/*db*
	rm -rf ./bin/