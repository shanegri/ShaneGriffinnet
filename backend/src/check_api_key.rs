use std::sync::Arc;

use actix_web::dev::ServiceRequest;
use actix_web::http::header;

use crate::config::Config;

pub fn check_api_key(config: Arc<Config>, req: &ServiceRequest) -> bool {
    let auth_header = req.headers().get(header::AUTHORIZATION);

    if let Some(auth) = auth_header {
        if let Ok(auth_str) = auth.to_str() {
            let trimmed_auth_str = auth_str.trim();

            if trimmed_auth_str.is_empty() {
                return false;
            }

            if trimmed_auth_str == config.api_key {
                return true;
            }
        }
    }

    return false;
}
