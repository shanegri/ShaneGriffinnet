use std::env;
use std::sync::Arc;

use actix_web::web::Data;
use actix_web::{dev::Service as _, web};
use actix_web::{App, HttpResponse, HttpServer};

mod config;
mod controllers;
mod database;

mod check_api_key;
mod get_uploaded_image;
mod routes;

use check_api_key::check_api_key;
use config::Config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db = Arc::new(database::Db::new(&db_url).await);

    let bind_address = env::var("BIND_ADDRESS").expect("BIND_ADDRESS must be set");

    let config = Arc::new(Config {
        api_key: env::var("API_KEY").expect("API_KEY must be set"),
        images_path: env::var("IMAGES_PATH").expect("IMAGES_PATH must be set"),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(db.clone()))
            .app_data(Data::new(config.clone()))
            // public images route
            .service(routes::get_images)
            // api key protected routes
            .service(
                web::scope("")
                    .wrap_fn(|req, srv| {
                        let config = req
                            .app_data::<web::Data<Arc<Config>>>()
                            .expect("Config not found in app data")
                            .get_ref()
                            .clone();

                        if check_api_key(config, &req) {
                            return srv.call(req);
                        }

                        return Box::pin(async move {
                            Ok(req.into_response(HttpResponse::Unauthorized()))
                        });
                    })
                    .service(routes::upload_image)
                    .service(routes::edit_image)
                    .service(routes::delete_image),
            )
    })
    .workers(2)
    .bind((bind_address, 8080))?
    .run()
    .await
}
