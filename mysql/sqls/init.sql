CREATE DATABASE tweet_db;
USE tweet_db;

CREATE TABLE tweets(
    id int(11) unsigned not null auto_increment,
    name varchar(255) not null,
    text varchar(255) not null,
    date varchar(255) not null,
    primary key (id)
);