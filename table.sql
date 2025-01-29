
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