
-include .env
export

ifndef ENVIRONMENT
$(error ENVIRONMENT is not set)
endif

ifndef DATA_PATH
$(error DATA_PATH is not set)
endif

ifndef API_KEY
$(error API_KEY is not set)
endif

setup:
	mkdir -p ${DATA_PATH}/images
	mkdir -p ${DATA_PATH}/public

	cd backend && \
	cargo sqlx migrate run --database-url sqlite:${DATA_PATH}/database.db

run-dev-backend: setup
	# TODO: Would like to use cargo watch, but it crashes WSL's fs unfortunately
	export DATABASE_URL=sqlite:${DATA_PATH}/database.db && \
	export IMAGES_PATH=${DATA_PATH}/images && \
	export PUBLIC_PATH=${DATA_PATH}/public && \
	export BIND_ADDRESS=127.0.0.1 && \
	cd backend && cargo run 

run-dev-frontend:
	# TODO: change to serve dev files
	cd frontend && npm run build -- --watch

build: setup	
	cd frontend && npm run build

	cd backend && cargo sqlx prepare --database-url sqlite:${DATA_PATH}/database.db

	docker build -t sgn-backend .

ARGS ?=

up:
	docker-compose up $(ARGS)