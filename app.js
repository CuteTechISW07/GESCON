const express = require("express");
const multer = require("multer");
const session = require("express-session");
const cors = require("cors");
const router = require('./router');
const bodyParser = require("body-parser");
/*
*
*   Configuración del servidor
*
*/
const PORT = process.env.PORT || 3500;

const app = express();
/**
 *  Establece el uso de sesiones
 */
app.use(session({
    secret: "cutech2022-MSJ",
    resave: false,
    saveUninitialized: true,
    unset: 'destroy'
}))

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse multipart/form-data
//app.use(multer());

app.use(cors());



/**
 * 
 * Abre el servidor
 * 
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(router); //Router para las diferentes rutas del proyecto
