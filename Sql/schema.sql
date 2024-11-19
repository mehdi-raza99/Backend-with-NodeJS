Create Table user(
    id varchar(50) PRIMARY KEY,
    username varchar(50) Unique,
    email varchar(50) Unique not null,
    password varchar(50) not null
);