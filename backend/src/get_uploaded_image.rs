use actix_multipart::Multipart;
use actix_web::{error, Error};
use futures_util::{StreamExt, TryStreamExt};

// wrapper for multipart so controllers do not depend on actix

// TODO: impl from futures_util::stream::Stream instead of reading to a buffer

pub async fn get_uploaded_image(mut payload: Multipart) -> Result<Vec<u8>, Error> {
    let mut image_data = Vec::new();

    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        let name = content_disposition.get_name().unwrap();

        match name {
            "image" => {
                while let Some(chunk) = field.next().await {
                    let data = chunk?;
                    image_data.extend_from_slice(&data);
                }
            }
            _ => println!("Field {} not processed", name),
        }
    }

    if image_data.is_empty() {
        return Err(error::ErrorBadRequest("No image field found"));
    }

    Ok(image_data)
}
