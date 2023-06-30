use std::env;
use std::path::Path;

use actix_files as fs;

use actix_web::web::Data;
use actix_web::{get, post, web, App, HttpResponse, HttpServer};
use sqlx::Row;
use sqlx::Sqlite;

use actix_multipart::Multipart; // Add this
use actix_web::Error; // Add Error here
use actix_web::{delete, patch};
use futures_lite::stream::StreamExt;
use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePoolOptions, Pool};
use std::fs::remove_file;
use std::io::Write;

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct Image {
    id: i64,
    path: String,
    subject: Option<String>,
    location: Option<String>,
    time_frame: Option<String>,
    display_order: Option<i64>,
}

#[post("/image")]
async fn add_image(
    pool: web::Data<Pool<Sqlite>>,
    mut payload: Multipart,
    // req_image: web::Json<Image>,
) -> Result<HttpResponse, Error> {
    let mut filepath = String::new();

    // iterate over multipart stream
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        let name = content_disposition.get_name().unwrap();

        match name {
            "image" => {
                let filename = field.content_disposition().get_filename().unwrap();
                let path = format!(
                    "/home/shane/projects/shanegriffinnet/backend/{}",
                    sanitize_filename::sanitize(&filename)
                );
                filepath = path.clone();
                let mut f = web::block(|| std::fs::File::create(path))
                    .await
                    .unwrap()
                    .unwrap();

                // Field in turn is stream of *Bytes* object
                while let Some(chunk) = field.next().await {
                    let data = chunk.unwrap();
                    // filesystem operations are blocking, we have to use threadpool
                    f = web::block(move || f.write_all(&data).map(|_| f))
                        .await
                        .unwrap()
                        .unwrap();
                }
            }
            _ => println!("Field {} not processed", name),
        }

        // let content_type = field
        //     .content_disposition()
        //     .ok_or_else(|| actix_web::error::ParseError::Incomplete)?;
    }
    sqlx::query!(
        r#"
        INSERT INTO images (path, display_order)
        VALUES (?, (SELECT IFNULL(MAX(display_order), 0) + 1 FROM images))
        "#,
        filepath,
    )
    .execute(pool.as_ref())
    .await
    .unwrap();
    Ok(HttpResponse::Ok().finish())
}

// Edit an existing image
#[patch("/image/{id}")]
async fn edit_image(
    pool: web::Data<Pool<Sqlite>>,
    id: web::Path<i64>,
    req_image: web::Json<Image>,
) -> HttpResponse {
    let id = id.into_inner(); // extend the lifetime by binding it to a variable
    sqlx::query!(
        r#"UPDATE images SET path = ?, subject = ?, location = ?, time_frame = ?, display_order = ? WHERE id = ?"#,
        req_image.path,
        req_image.subject,
        req_image.location,
        req_image.time_frame,
        req_image.display_order,
        id)
        .execute(pool.as_ref())
        .await
        .unwrap();
    HttpResponse::Ok().finish()
}

#[delete("/image/{id}")]
async fn delete_image(pool: web::Data<Pool<Sqlite>>, path_id: web::Path<i64>) -> HttpResponse {
    let id = path_id.into_inner();
    // Fetch the path from the database
    let row = sqlx::query("SELECT path FROM images WHERE id = ?")
        .bind(id)
        .fetch_one(pool.as_ref())
        .await;

    let file_path: String = match row {
        Ok(row) => match row.try_get("path") {
            Ok(path) => path,
            Err(err) => {
                eprintln!("Failed to get path from row: {:?}", err);
                return HttpResponse::InternalServerError().finish();
            }
        },
        Err(err) => {
            eprintln!("Failed to fetch image path from database: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    // Remove file here (add result handling for production code)
    if let Err(e) = remove_file(&file_path) {
        eprintln!("Failed to remove file: {}", e);
        // Respond with error message or status code
        return HttpResponse::InternalServerError().finish();
    }

    sqlx::query!(r#"DELETE FROM images WHERE id = ?"#, id)
        .execute(pool.as_ref())
        .await
        .unwrap();

    HttpResponse::Ok().finish()
}

#[get("/image/{id}")]
async fn get_image(
    pool: web::Data<Pool<Sqlite>>,
    id: web::Path<i64>,
) -> actix_web::Result<fs::NamedFile> {
    let id = id.into_inner();

    let row: Image = sqlx::query_as(r#"SELECT * FROM images WHERE id = ?"#)
        .bind(id)
        .fetch_one(pool.as_ref())
        .await
        .unwrap();

    let img_path = Path::new(&row.path);

    // Ensure that the file exists
    if !img_path.exists() {
        return Err(actix_web::error::ErrorNotFound("File not found"));
    }

    Ok(fs::NamedFile::open(img_path)?)
}

// Fetch all images
#[get("/images")]
async fn get_images(pool: web::Data<Pool<Sqlite>>) -> HttpResponse {
    println!("get_images");
    let rows = sqlx::query_as::<_, Image>(r#"SELECT * FROM images"#)
        .fetch_all(pool.as_ref())
        .await
        .unwrap();
    HttpResponse::Ok().json(rows)
}
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool: Pool<Sqlite> = SqlitePoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Error creating pool");

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .service(add_image)
            .service(edit_image)
            .service(delete_image)
            .service(get_image)
            .service(get_images)
            .service(fs::Files::new("/", "./../frontend/dist").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
