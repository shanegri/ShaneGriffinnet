# shanegriffin.net

Experiments & learning with Rust as a web sevice with Vue.

Backend: Sqlite3, Sqlx, Actix

Frontend: Vue, Tailwind

## System Requirements

cargo, sqlx-cli, npm w/ latest node, sqlite3.

## Development

```cp .env.example .env```

Update DATA_PATH & API_KEY, set ENVIRONMENT to dev.

Run backend:

```make run-dev-backend```

In new terminal, run compile watch for frontend:

```make run-dev-frontend```

## Deployment 

```cp .env.example .env```

Update DATA_PATH & API_KEY, set ENVIRONMENT to prod.

```make build```

Run the containers:

```make up```

Or run in background:

```make up ARGS="-d"```

## Future

* backend ssl
* use actix http auth
* nginx serves static files
* dockerize system requirements
* tests
* try db other then postgres
* general cleanup, error handling, etc.
