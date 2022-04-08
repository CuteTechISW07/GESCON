const router = require('express').Router();
const user = require("./controllers/user")
const articulos = require("./controllers/articulos");
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
router.use("/User", user)

/**
 * Router Articulos
 */
router.post("/articulos", articulos.getArticulos);

module.exports = router;