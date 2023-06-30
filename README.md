# shanegriffin.net

Experiments with Rust for the web using Sqlx/Actix/Vue/Tailwind.

## Development

### In frontend/

```npm run build -- --watch```

### In backend/

Create database

```sqlite3 database.db < ../database/0_create_images.sql```

Run server

```cargo run```

Alternatively for watch mode:

TODO: This crashes WSL's fs unfortunately, only use cargo run on WSL.

```cargo watch -x run```

## Deployment 

TODO:

