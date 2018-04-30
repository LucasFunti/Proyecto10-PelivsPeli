var connection = require('../conexion_bd')

function buscarCompetencias(req,res){
  var sql = 'SELECT * FROM competencias WHERE baja = 0';
  console.log(sql);
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      console.log(resultado);
      res.send(JSON.stringify(resultado));
    }
  });

};
function buscarGeneroCompetencia(idCompetencia){
  var sql = 'SELECT v.genero_id FROM votos v JOIN genero g ON (g.id = v.genero_id) WHERE competencia_id = ' + idCompetencia + ' AND baja = 0';
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      return resultado;
    }
  });

};
function buscarActorCompetencia(idCompetencia){
  var sql = 'SELECT v.actor_id FROM votos v JOIN actor a ON (a.id = v.actor_id) WHERE competencia_id = ' + idCompetencia + ' AND baja = 0';
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      return resultado;
    }
  });

};
function buscarDirectorCompetencia(idCompetencia){
  var sql = 'SELECT v.director_id FROM votos v JOIN director d ON (d.id = v.director_id) WHERE competencia_id = ' + idCompetencia + ' AND baja = 0';
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      return resultado;
    }
  });

};

function armarSQL(idCompetencia){
  var genero_id = buscarGeneroCompetencia(idCompetencia)
  var actor_id = buscarActorCompetencia(idCompetencia)
  var director_id = buscarDirectorCompetencia(idCompetencia)
  var sql_random
  if(genero_id != undefined && actor_id != undefined && director_id != undefined){
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN genero g ON(g.id = v.genero_id) JOIN actor a ON(a.id = v.actor_id) JOIN director d ON(d.id=v.director_id) WHERE g.id = '+ genero_id +' AND a.id = ' + actor_id +' AND d.id = ' + director_id + ' ORDER BY RAND() LIMIT 2'

  }else if (genero_id == undefined && actor_id != undefined && director_id != undefined) {
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN actor a ON(a.id = v.actor_id) JOIN director d ON(d.id=v.director_id) WHERE a.id = ' + actor_id +' AND d.id = ' + director_id + ' ORDER BY RAND() LIMIT 2'

  }else if (genero_id == undefined && actor_id == undefined && director_id != undefined){
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN director d ON(d.id=v.director_id) WHERE d.id = ' + director_id + ' ORDER BY RAND() LIMIT 2'

  }else if (genero_id == undefined && actor_id == undefined && director_id == undefined) {
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) ORDER BY RAND() LIMIT 2'
  }else if (genero_id != undefined && actor_id == undefined && director_id != undefined) {
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN genero g ON(g.id = v.genero_id) JOIN director d ON(d.id=v.director_id) WHERE g.id = '+ genero_id +' AND d.id = ' + director_id + ' ORDER BY RAND() LIMIT 2'
  }else if (genero_id != undefined && actor_id != undefined && director_id == undefined) {
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN genero g ON(g.id = v.genero_id) JOIN actor a ON(a.id = v.actor_id) WHERE g.id = '+ genero_id +' AND a.id = ' + actor_id +' ORDER BY RAND() LIMIT 2'
  }else if (genero_id != undefined && actor_id == undefined && director_id == undefined) {
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN genero g ON(g.id = v.genero_id) WHERE g.id = '+ genero_id +' ORDER BY RAND() LIMIT 2'
  }else if (genero_id == undefined && actor_id != undefined && director_id == undefined) {
    sql_random = 'SELECT p.* FROM votos v JOIN pelicula p ON (v.pelicula_id = p.id) JOIN actor a ON(a.id = v.actor_id) WHERE a.id = ' + actor_id + ' ORDER BY RAND() LIMIT 2'
  }

  return sql_random
};

function buscarPeliculas(idCompetencia){
  var sql_random = armarSQL(idCompetencia);
  connection.query(sql_random, function(error,reesultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      if(resultado.length < 2){
        console.log("No hay peliculas suficientes para su eleccion");
        return res.status(404).send("No hay peliculas suficientes para su eleccion");
      }else{
        return resultado;
      }
    }
  });
};

function buscarCompetencia(req,res){
  //  data = {competencia;peliculas;}
  var id = req.params.id
  var sql = 'SELECT * FROM competencias WHERE id = ' + id + ' AND baja = 0' ;
  var peliculas = buscarPeliculas(id);
  connection.query(sql,function(error,resutlado,fields){
      if(error){
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }else{
        var response = {
          competencia: resultado,
          peliculas: peliculas
        }
        res.send(JSON.stringify(response));
      }
  });

};

function votar(req,res){
  var id_pelicula = req.body.idPelicula;
  var id_competencia = req.params.idCompetencia;
  var sql = 'UPDATE votos SET votos = votos + 1 WHERE competencia_id = ' + id_competencia + ' AND ' + ' pelicula_id = ' + id_pelicula;
  console.log(sql);
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      console.log(result.affectedRows + " record(s) updated");
    }
  });
};

function buscarActores(req,res){
  var sql = 'SELECT * FROM actor';
  console.log(sql);
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      console.log(resultado);
      res.send(JSON.stringify(resultado));
    }
  });

};

function buscarDirectores(req,res){
  var sql = 'SELECT * FROM director';
  console.log(sql);
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      console.log(resultado);
      res.send(JSON.stringify(resultado));
    }
  });

};

function buscarGeneros(req,res){
  var sql = 'SELECT * FROM genero';
  console.log(sql);
  connection.query(sql, function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      console.log(resultado);
      res.send(JSON.stringify(resultado));
    }
  });

};

function obtenerNombreCompetencia(id_competencia,req,res){
  var sql = 'SELECT nombre FROM competencias WHERE id = ' + id_competencia + ' AND baja = 0' ;
  connection.query(sql,function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      return resultado;
    }
  });

};

function buscarResultados(req,res){
  //var data = {competencia: nombreCompetencia, resultados:}
  var id_competencia = req.params.id;
  var nombreCompetencia = obtenerNombreCompetencia(id_competencia,req,res);
  var sql = 'SELECT p.*,votos FROM pelicula AS p JOIN votos AS v ON(v.pelicula_id=p.id) JOIN competencias c ON (c.id=v.competencia_id) WHERE c.baja = 0 ORDER BY voto DESC LIMIT 3';
  connection.query(sql,function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }else{
      var response = {
        competencia: nombreCompetencia,
        resultados: resultado
      }
      res.send(JSON.stringify(response));
    }
  });
};

function crearCompetencia(req,res){
  var nombreCompetencia = req.body.nombreCompetencia;
  var sql = 'INSERT INTO competencias (nombre) VALUES ('+ nombreCompetencia +')';
  connection.query(sql,function(error,resultado,fields){
    if(error){
      console.log("Hubo un error en la creacion de la competencia", error.message);
      return res.status(404).send("Hubo un error en la creacion de la competencia");
    }else{
      res.send(resultado);
    }
  });
};

function eliminarCompetencia(req,res){
  var idCompetencia = req.param.idCompetencia
  var sql = 'UPDATE competencias SET baja = 1 WHERE id = ' + idCompetencia;
  connection.query(sql,function(error,resultado,fields){
    if(error){
      console.log("Hubo un error al eliminar la competencia", error.message);
      return res.status(404).send("Hubo un error al eliminar la competencia");
    }else{
      res.send(resultado);
    }
  });

};
function editarCompetencia(req,res){
  var idCompetencia = req.param.idCompetencia
  var nombreActualizado = req.body.nombreActualizado
  var sql = 'UPDATE competencias SET nombre = '+ nombreActualizado +' WHERE id = ' + idCompetencia;
  connection.query(sql,function(error,resultado,fields){
    if(error){
      console.log("Hubo un error al eliminar la competencia", error.message);
      return res.status(404).send("Hubo un error al eliminar la competencia");
    }else{
      res.send(resultado);
    }
  });
};

function reiniciarCompetencia(req,res){
  var idCompetencia = req.params.idCompetencia
  var sql = 'UPDATE votos SET voto = 0 WHERE competencia_id = ' + idCompetencia;
  connection.query(sql,function(error,resultado,fields){
    if(error){
      console.log("Hubo un error al reiniciar la competencia", error.message);
      return res.status(404).send("Hubo un error al reiniciar la competencia");
    }else{
      res.send(resultado);
    }
  });
};

module.exports = {
  buscarCompetencias: buscarCompetencias,
  buscarCompetencia: buscarCompetencia,
  buscarActores: buscarActores,
  buscarDirectores: buscarDirectores,
  buscarGeneros: buscarGeneros,
  votar: votar,
  buscarResultados: buscarResultados,
  crearCompetencia: crearCompetencia,
  eliminarCompetencia: eliminarCompetencia,
  editarCompetencia: editarCompetencia,
  reiniciarCompetencia: reiniciarCompetencia
}
