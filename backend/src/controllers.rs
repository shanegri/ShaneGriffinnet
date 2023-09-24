use std::{fs::remove_file, io::Write, path::Path, sync::Arc};

use rand::{thread_rng, Rng};

use crate::database::{Db, Image};

pub async fn get_images(db: Arc<Db>) -> Vec<Image> {
    return db.get_images().await.unwrap();
}

pub async fn upload_image(images_path: &str, image: &Vec<u8>, db: Arc<Db>) {
    #![allow(unused_assignments)]
    let mut filename = String::new();
    let mut path = String::new();

    // len 10 random unique filename
    loop {
        let chars: Vec<char> = (0..10)
            .map(|_| thread_rng().gen_range(97..123)) // lowercase letters only
            .map(|c| char::from_u32(c).unwrap()) // unwrap should never fail here
            .collect();
        let token: String = chars.into_iter().collect();

        filename = format!("{}.jpg", token,);
        path = format!("{}/{}", images_path, filename);

        if !Path::new(&path).exists() {
            break;
        }
    }

    let mut f = std::fs::File::create(&path).unwrap();

    f.write_all(image).unwrap();

    db.insert_image(&filename).await.unwrap();
}

pub async fn delete_image(images_path: &str, id: i64, db: Arc<Db>) {
    let filename = db.get_filename(id).await.unwrap();

    let file_path = format!("{}/{}", &images_path, filename);

    remove_file(&file_path).unwrap();

    db.delete_image(id).await.unwrap();
}

pub async fn edit_image(image: Image, db: Arc<Db>) {
    db.update_image(image).await.unwrap();
}
