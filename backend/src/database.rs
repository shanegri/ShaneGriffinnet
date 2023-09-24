use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePoolOptions, Pool};
use sqlx::{Row, Sqlite};

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct Image {
    pub id: i64,
    pub filename: String,
    pub subject: Option<String>,
    pub location: Option<String>,
    pub time_frame: Option<String>,
    pub display_order: Option<i64>,
}
pub struct Db {
    pool: Pool<Sqlite>,
}

impl Db {
    pub async fn new(db_url: &str) -> Db {
        let pool = SqlitePoolOptions::new()
            .connect(&db_url)
            .await
            .expect("Error creating sqlx pool");

        return Db { pool };
    }

    pub async fn get_images(&self) -> Result<Vec<Image>, String> {
        let rows_result = sqlx::query_as::<_, Image>(r#"SELECT * FROM images"#)
            .fetch_all(&self.pool)
            .await;

        match rows_result {
            Ok(rows) => Ok(rows),
            Err(err) => Err(err.to_string()),
        }
    }

    pub async fn insert_image(&self, filename: &str) -> Result<(), String> {
        let insert_result = sqlx::query!(
            r#"
                INSERT INTO images (filename, display_order)
                VALUES (?, (SELECT IFNULL(MAX(display_order), 0) + 1 FROM images))
                "#,
            filename,
        )
        .execute(&self.pool)
        .await;

        match insert_result {
            Ok(_) => Ok(()),
            Err(err) => Err(err.to_string()),
        }
    }

    pub async fn get_filename(&self, id: i64) -> Result<String, String> {
        let row_result = sqlx::query("SELECT filename FROM images WHERE id = ?")
            .bind(id)
            .fetch_one(&self.pool)
            .await;

        match row_result {
            Ok(row) => match row.try_get("filename") {
                Ok(filename) => Ok(filename),
                Err(err) => Err(err.to_string()),
            },
            Err(err) => Err(err.to_string()),
        }
    }

    pub async fn update_image(&self, image: Image) -> Result<(), String> {
        let update_result = sqlx::query!(
            r#"UPDATE images SET filename = ?, subject = ?, location = ?, time_frame = ?, display_order = ? WHERE id = ?"#,
            image.filename,
            image.subject,
            image.location,
            image.time_frame,
            image.display_order,
            image.id)
            .execute(&self.pool)
            .await;

        match update_result {
            Ok(_) => Ok(()),
            Err(err) => Err(err.to_string()),
        }
    }

    pub async fn delete_image(&self, id: i64) -> Result<(), String> {
        sqlx::query!(r#"DELETE FROM images WHERE id = ?"#, id)
            .execute(&self.pool)
            .await
            .unwrap();

        Ok(())
    }
}
