insert into `user` (name, email, password) 
values
	('Cavit Keskin', 'cavitkeskin@gmail.com', md5('ck123')),
	('Scott Lee', 'scott.lee@gooroo.com', md5('sl123'));
	
insert into `category` (name)
values 
	('Romance'),
	('Horror'),
	('Travel'),
	('Science'),
	('Dictionaries'),
	('Comics'),
	('Journals'),
	('Biographies');
	
insert into book (owner, title, author, publisher, category)
values
	(null, 'Right Behind You', 'Lisa Gardner', 'Penguin Publishing Group', 2),
	(1, 'After She\'s Gone', 'Lisa Jackson', 'Kensington', 1),
	(1, 'Everything, Everything', 'Victoria Aveyard', 'Random House', 3),
	(2, 'Lincoln in the Bardo', 'George Saunders', 'Random House', 3),
	(1, 'Norse Mythology', 'Neil Gaiman', 'Norton', 4),
	(2, 'Never Die Alone', 'Lisa Jackson', 'Center Point', 3);