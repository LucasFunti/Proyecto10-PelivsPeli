var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciasControlador = require('./controladores/competenciasControlador');
require('dotenv').config();

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//actores - directores - generos
app.get('/competencias', competenciasControlador.buscarCompetencias );
app.post('/competencias', competenciasControlador.crearCompetencia);
app.get('/actores', competenciasControlador.buscarActores );
app.get('/directores', competenciasControlador.buscarDirectores );
app.get('/generos', competenciasControlador.buscarGeneros );
app.delete('/competencias/:idCompetencia', competenciasControlador.eliminarCompetencia);
app.put('/competencias/:idCompetencia', competenciasControlador.editarCompetencia);
app.get('/competencias/:id/peliculas', competenciasControlador.buscarCompetencia);
app.get('/competencias/:id/resultados', competenciasControlador.buscarResultados);
app.put('/competencias/:idCompetencia/voto', competenciasControlador.votar);
app.put('/competencias/:idCompetencia/votos', competenciasControlador.reiniciarCompetencia);


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8081';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});
