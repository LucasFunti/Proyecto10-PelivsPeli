SOURCE C:/Windows/System32/proyecto_acamica/dump_base_de_datos.sql;

CREATE TABLE competencias(
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(200),
  baja BOOLEAN,
  PRIMARY KEY(id)
);

INSERT INTO competencias(nombre) VALUES ('¿Cual es la peli mas bizarra?');
INSERT INTO competencias(nombre) VALUES ('¿Que drama te hizo llorar mas?');
INSERT INTO competencias(nombre) VALUES ('¿Harry o el señor de los anillos?');

CREATE TABLE votos(
  id INT NOT NULL AUTO_INCREMENT,
  pelicula_id INT NOT NULL,
  competencia_id INT NOT NULL,
  genero_id INT,
  actor_id INT,
  director_id INT,
  votos INT DEFAULT 0 ,
  PRIMARY KEY(id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula,
  FOREIGN KEY (competencia_id) REFERENCES competencias,
  FOREIGN KEY (genero_id) REFERENCES genero,
  FOREIGN KEY (actor_id) REFERENCES actor,
  FOREIGN KEY (director_id) REFERENCES director
);
