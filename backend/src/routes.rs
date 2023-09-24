use std::sync::Arc;

use actix_multipart::Multipart;
use actix_web::{delete, get, patch, post, web, HttpResponse};
use actix_web::HttpRequest;

use crate::config::Config;
use crate::controllers;
use crate::database::{Db, Image};
use crate::get_uploaded_image::get_uploaded_image;

#[post("/api/image")]
async fn upload_image(
    config: web::Data<Arc<Config>>,
    db: web::Data<Arc<Db>>,
    payload: Multipart,
    _req: HttpRequest,
) -> HttpResponse {
    let image: Vec<u8> = get_uploaded_image(payload).await.unwrap();

    controllers::upload_image(&config.images_path, &image, db.get_ref().clone()).await;

    HttpResponse::Ok().finish()
}

#[patch("/api/image/{id}")]
async fn edit_image(
    db: web::Data<Arc<Db>>,
    _id: web::Path<i64>,
    req_image: web::Json<Image>,
    _req: HttpRequest,
) -> HttpResponse {
    controllers::edit_image(req_image.into_inner(), db.get_ref().clone()).await;

    HttpResponse::Ok().finish()
}

#[delete("/api/image/{id}")]
async fn delete_image(
    config: web::Data<Arc<Config>>,
    db: web::Data<Arc<Db>>,
    path_id: web::Path<i64>,
    _req: HttpRequest,
) -> HttpResponse {
    let id = path_id.into_inner();

    controllers::delete_image(&config.images_path, id, db.get_ref().clone()).await;

    HttpResponse::Ok().finish()
}

#[get("/api/images")]
async fn get_images(db: web::Data<Arc<Db>>) -> HttpResponse {
    let rows = controllers::get_images(db.get_ref().clone()).await;
    
    HttpResponse::Ok().json(rows)
}
