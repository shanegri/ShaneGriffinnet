use actix_files as fs;
use actix_multipart::Multipart;
use actix_web::http::{header, StatusCode};
// Add this
use actix_web::{delete, get, patch, post, web, HttpResponse};
use actix_web::{Error, HttpRequest}; // Add Error here
use futures_lite::stream::StreamExt;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Row, Sqlite};
use std::env;
use std::fs::remove_file;
use std::io::Write;
use std::path::Path;

use crate::database::Image;

#[derive(Serialize, Deserialize)]
pub struct Auth {
    pub key: String,
}

// Return a response if invalid
fn check_api_key(req: &HttpRequest) -> Option<HttpResponse> {
    let auth_header = req.headers().get(header::AUTHORIZATION);

    if let Some(auth) = auth_header {
        if let Ok(auth_str) = auth.to_str() {
            let trimmed_auth_str = auth_str.trim();

            if trimmed_auth_str.is_empty() {
                return Some(HttpResponse::build(StatusCode::UNAUTHORIZED).finish());
            }

            let api_key = env::var("API_KEY").expect("API_KEY must be set");

            if trimmed_auth_str != api_key {
                return Some(HttpResponse::build(StatusCode::UNAUTHORIZED).finish());
            }

            return None;
        }
    }

    Some(HttpResponse::build(StatusCode::UNAUTHORIZED).finish())
}

#[post("/image")]
async fn add_image(
    pool: web::Data<Pool<Sqlite>>,
    mut payload: Multipart,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    if let Some(res) = check_api_key(&req) {
        return Ok(res);
    }

    let mut filepath = String::new();

    let images_path: String = env::var("IMAGES_PATH").expect("IMAGES_PATH must be set");

    // iterate over multipart stream
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        let name = content_disposition.get_name().unwrap();

        match name {
            "image" => {
                let filename = field.content_disposition().get_filename().unwrap();
                let path = format!(
                    "{}/{}",
                    &images_path,
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
    req: HttpRequest,
) -> HttpResponse {
    if let Some(res) = check_api_key(&req) {
        return res;
    }

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
async fn delete_image(
    pool: web::Data<Pool<Sqlite>>,
    path_id: web::Path<i64>,
    req: HttpRequest,
) -> HttpResponse {
    if let Some(res) = check_api_key(&req) {
        return res;
    }

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
