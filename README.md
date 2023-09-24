# shanegriffin.net

Experiments & learning with Rust as a web service with Vue.

Backend: Sqlite3, Sqlx, Actix

Frontend: Vue, Tailwind

Nginx used to serve static (images, frontend) and ssl.

## System Requirements

docker, make, cargo, sqlx-cli, npm w/ latest node, sqlite3, openssl (for dev)

## Development

```cp .env.example .env```

Update DATA_PATH, API_KEY, CERT_DIR, set ENVIRONMENT to dev.

Run backend:

```make run-dev-backend```

In new terminal, run compile watch for frontend:

```make run-dev-frontend```

In new terminal, start reverse proxy:

```make run-dev-proxy```

## Deployment

```cp .env.example .env```

Update DATA_PATH, API_KEY, CERT_DIR, set ENVIRONMENT to prod.

If running locally, run ```make dev-ssl``` to self sign, creates certs in DATA_PATH/certs. Otherwise, CERT_DIR must contain fullchain.pem and privkey.pem.

```make build```

Run the containers:

```make up```

Or run in background, then manual shutdown:

```make up ARGS="-d"```

```make down```

## Future

* tests
* dockerize system requirements
* try db other then postgres
* build & deploy w/ gh actions
* proper error propagation
* rewrite frontend to ssr w/ [htmx](https://htmx.org/)?
* interesting.. [poem_openapi](https://docs.rs/poem-openapi/latest/poem_openapi/)
