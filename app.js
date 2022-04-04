const express = require("express");
const mysql = require("mysql");
const session = require("express-session");

/*
*
*   Configuración del servidor
*
*/
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "gescon",
    
});
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const app = express();
/**
 *  Establece el uso de sesiones
 */
app.use(session({
    secret : "cutech2022-MSJ",
    resave : true,
    saveUninitialized: true,
}))
app.use(bodyParser.json());

/**
 * Establece la conexión a la base de datos
 */
connection.connect(error => {
    if(error) throw error;
    console.log("Database server Running");
})

/**
 * 
 * Abre el servidor
 * 
 */
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

/**
 * 
 *  Estructura del objeto sesión:
 *  req.session.<objeto>
 *  tipos de objeto:
 *      id_usuario: id del usuario en la base de datos
 *      nombre: nombre del usuario ._.
 *      correo: correo del usuario ._:
 *      tipo: Tipo de usuario (sirve para dar permisos)
 * 
 *  Ejemplo: Para verificar que exista la sesión
 *  if(!req.session.id){
 *      TO DO
 *  }
 * 
 */


/*
* RUTAS DEL SERVIDOR
*/
app.post("/articles", (req,res)=>{
    // Verifica la sesión para no dar acceso a usuarios no loggeados
    if(!req.session.id_usuario){
        return res.json({
            message : "Debe tener una sesión activa",
            error : false
        });
    }
    
    // Verifica que el tipo de usuario sea el correcto, en este caso el líder de comite
    if(req.session.tipo != 3)
        return res.json({
            message : "Permisos denegados",
            error : false
        });

    
    // Consulta a la base de datos
    const query = "SELECT * FROM vw_articulo_version_autor";

    connection.query(query, (err,results) => {
        if(err)
            return res.json({
                message : err.message,
                error : true
            });
        
        if(results.length > 0)
            res.json({
                message : "Artículos encontrados",
                error : false,
                data : results
            });
        else
            res.json({
                message : "No hay resultados que mostrar",
                error : false
            })
    });
    
});