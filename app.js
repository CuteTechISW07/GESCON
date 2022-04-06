const express = require("express");

const session = require("express-session");
const cors = require("cors");
const router = require('./router');
/*
*
*   Configuración del servidor
*
*/



const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3500;

const app = express();
/**
 *  Establece el uso de sesiones
 */
app.use(session({
    secret: "cutech2022-MSJ",
    resave: true,
    saveUninitialized: true,
}))
app.use(bodyParser.json());
app.use(cors());



/**
 * 
 * Abre el servidor
 * 
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use('/', router); //Router para las diferentes rutas del proyecto
