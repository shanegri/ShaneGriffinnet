
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

ifndef CERT_DIR
$(error CERT_DIR is not set)
endif

fmt:
	cd backend && cargo fmt
	cd frontend && npm run format

clean:
	cd backend && cargo clean
	rm ${DATA_PATH}/public/ -rf
	rm ${DATA_PATH}/certs/ -rf

setup: 
	mkdir -p ${DATA_PATH}/images
	mkdir -p ${DATA_PATH}/public

	sqlite3 ${DATA_PATH}/database.db < backend/migrations/0_create_images.sql

	cd backend && \
	cargo sqlx migrate run --database-url sqlite:${DATA_PATH}/database.db

dev-ssl:
	if [ ! -d "${DATA_PATH}/certs" ]; then \
		mkdir -p ${DATA_PATH}/certs; \
		openssl genrsa -out ${DATA_PATH}/certs/privkey.pem 4096; \
		openssl req -new -x509 -key ${DATA_PATH}/certs/privkey.pem -out ${DATA_PATH}/certs/fullchain.pem -days 365 -subj '/CN=localhost/O=SGN/C=US';  \
		chmod -R a+r ${DATA_PATH}/certs; \
	fi

run-dev-proxy: setup dev-ssl
	export PROXY_PASS=host.docker.internal && \
	envsubst '$$PROXY_PASS' < nginx/nginx.conf.template > nginx/nginx.conf
	docker compose up nginx-proxy

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
	export PROXY_PASS=sgn && \
	envsubst '$$PROXY_PASS' < nginx/nginx.conf.template > nginx/nginx.conf
	docker compose up $(ARGS)

down:
	docker compose down $(ARGS)
