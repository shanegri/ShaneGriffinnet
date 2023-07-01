use std::env;

use actix_files as fs;

use actix_web::web::Data;
use actix_web::{App, HttpServer};
use serde::{Deserialize, Serialize};

mod database;
mod routes;

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct Image {
    id: i64,
    path: String,
    subject: Option<String>,
    location: Option<String>,
    time_frame: Option<String>,
    display_order: Option<i64>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    // Preempt check this
    let _ = env::var("API_KEY").expect("API_KEY must be set");
    let _ = env::var("IMAGES_PATH").expect("IMAGES_PATH must be set");

    let public_path = env::var("PUBLIC_PATH").expect("PUBLIC_PATH must be set");

    let bind_address = env::var("BIND_ADDRESS").expect("BIND_ADDRESS must be set");

    let pool = database::setup_db().await;

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .service(routes::add_image)
            .service(routes::edit_image)
            .service(routes::delete_image)
            .service(routes::get_image)
            .service(routes::get_images)
            .service(fs::Files::new("/", &public_path).index_file("index.html"))
    })
    .workers(2)
    .bind((bind_address, 8080))?
    .run()
    .await
}
