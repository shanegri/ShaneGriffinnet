use serde::{Deserialize, Serialize};
use sqlx::Sqlite;
use sqlx::{sqlite::SqlitePoolOptions, Pool};
use std::env;

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct Image {
    pub id: i64,
    pub path: String,
    pub subject: Option<String>,
    pub location: Option<String>,
    pub time_frame: Option<String>,
    pub display_order: Option<i64>,
}

pub async fn setup_db() -> Pool<Sqlite> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqlitePoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Error creating pool")
}
