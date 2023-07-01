FROM rust:1.70.0
WORKDIR /usr/src/sgn-backend

COPY ./backend/src ./src
COPY ./backend/Cargo.lock .
COPY ./backend/Cargo.toml .
COPY ./backend/sqlx-data.json .

RUN mkdir /usr/src/data/

RUN export SQLX_OFFLINE=true && cargo install --path .
CMD ["sgn-backend"]

EXPOSE 8080
