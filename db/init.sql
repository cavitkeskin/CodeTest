create table if not exists `user` (
	id integer not null auto_increment,
	name varchar(48),
	email varchar(48) not null,
	password varchar(32),
	primary key(id),
	unique key (email)
);

create table if not exists `category` (
	id integer not null auto_increment,
	name varchar(32) not null,
	primary key(id)
);

create table if not exists `book` (
	id integer not null auto_increment,
	owner integer,
	title varchar(64) not null,
	author varchar(48) not null,
	publisher varchar(48) not null,
	category integer not null,
	primary key(id),
	foreign key(owner) references `user`(id),
	foreign key(category) references category(id)
);

create view book_view as
select 
	b.*,
	u.name as owner_name,
	c.name as category_name
from book b
left join `user` u on u.id = b.owner
inner join category c on c.id = b.category;



