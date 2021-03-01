all: server

server: bin/server

test: server
	go test ./server/ -v

bin/server:
	mkdir ./bin/
	go build -o ./bin/server server/*.go

clean:
	rm -f db/*db*
	rm -rf ./bin/