
create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(250),
    password varchar(250),
    email varchar(250),
    status varchar(250),
    role varchar(250),
    UNIQUE(email),
    created_at timestamp default current_timestamp
);

insert into user(name, contactNumber, password, email, status, role) values('admin', '1234567890', 'admin', 'admin@gmail.com' , 'active', 'admin');

-- create table product(
--     id int primary key AUTO_INCREMENT,
--     name varchar(250),
--     description text,
--     price decimal(10, 2),
--     stock int,
--     created_at timestamp default current_timestamp
-- );

-- create table orders(
--     id int primary key AUTO_INCREMENT,
--     user_id int,
--     total decimal(10, 2),
--     status varchar(250),
--     created_at timestamp default current_timestamp,
--     foreign key (user_id) references user(id)
-- );

-- create table order_items(
--     id int primary key AUTO_INCREMENT,
--     order_id int,
--     product_id int,
--     quantity int,
--     price decimal(10, 2),
--     created_at timestamp default current_timestamp,
--     foreign key (order_id) references orders(id),
--     foreign key (product_id) references product(id)
-- );


create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    created_at timestamp default current_timestamp,
    primary key(id)
);