create database bbdd_security_2026;
use bbdd_security_2026;
create table perfiles
( id_perfil int not null auto_increment primary key,
	nombre varchar(250) not null
);
insert into perfiles(nombre)
values ('ROLE_ADMON'),('ROLE_CLIENTE'),
('ROLE_TRABAJADOR'),
('ROLE_JEFE');


create table usuarios
(
	username varchar(45) not null primary key,
	password varchar(250) not null,
	nombre varchar(100),
	apellidos varchar(200),
	enabled int,
	FECHA_REGISTRO date,
    fecha_nacimiento date,
    direccion varchar(200),
	id_perfil int,
    foreign key (id_perfil) references perfiles(id_perfil)
);

insert into usuarios values
('tomas@ifp.es', '{noop}tomasin', 'Tomas', 'Escu',1,'2025-11-05','1960-11-02','madrid', 1);

insert into usuarios values
('sara@ifp.es', '{noop}sarita', 'Sara', 'Baras',2,'2024-02-05','1999-03-16','sevilla', 2),
('eva@ifp.es', '{noop}evita', 'Eva', 'Goma',1,'2000-01-02','1978-05-24','cordoba', 3),
('ramon@ifp.es', '{noop}ramoncin', 'Ramon', 'González',1,'2014-07-07','1996-06-04','madrid', 4);


