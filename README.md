# shanegriffin.net

Experiments with Rust for the web using Sqlx/Actix/Vue/Tailwind.

Nginx is used as a proxy for ssl. 

## Requirements

cargo, sqlx-cli, npm

## Development

```cp .env.example .env```

Update DATA_PATH & API_KEYm, set ENVIRONMENT to dev.

Run backend:

```make run-dev-backend```

In new terminal, run compile watch for frontend:

```make run-dev-frontend```

## Deployment 

```cp .env.example .env```

Update DATA_PATH & API_KEYm, set ENVIRONMENT to prod.

```make build```

Run the containers:

```make up```

Or run in background:

```make up ARGS="-d"```

