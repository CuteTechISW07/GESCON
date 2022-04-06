const router = require('express').Router();
const user = require("./controllers/user")

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

/**
 * Router User
 */
router.post("/User/createUser", user.createUser)
router.post("/User/authUser", user.authUser)
router.post("/User/logout", user.logoutUser)





/**
 * Otro
 */
router.post("/articulos", cors(), (req, res) => {
    // Verifica la sesión para no dar acceso a usuarios no loggeados
    if (!req.session.id_usuario) {
        return res.json({
            message: "Debe tener una sesión activa",
            error: false
        });
    }

    // Verifica que el tipo de usuario sea el correcto, en este caso el líder de comite
    if (req.session.tipo != 3)
        return res.json({
            message: "Permisos denegados",
            error: false
        });


    // Consulta a la base de datos
    const query = "SELECT * FROM vw_articulo_version_autor";

    connection.query(query, (err, results) => {
        if (err)
            return res.json({
                message: err.message,
                error: true
            });

        if (results.length > 0)
            res.json({
                message: "Artículos encontrados",
                error: false,
                data: results
            });
        else
            res.json({
                message: "No hay resultados que mostrar",
                error: false
            })
    });

});