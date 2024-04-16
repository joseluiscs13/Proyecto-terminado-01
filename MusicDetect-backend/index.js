const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mediaserver = require('mediaserver');

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// TODO: CRUD: Eventos
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/public/index.html');
})

app.get('/events', (req, res) => {
    fs.readFile(path.join(__dirname, '/data/tracks.json'), (err, tracks) => {
        if(err) throw err;
        res.json(JSON.parse(tracks));
        console.log(tracks);
    });
})

app.get('/events/:name', (req, res) => {
    const track = __dirname + '/data/music/' + req.params.name;
    // console.log(req.params.name);
    mediaserver.pipe(req, res, track);
})

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
});