const router = require("express").Router()
const jwt = require("jsonwebtoken")

const util = require("../util")
router.post("/createUser", util.agregaTokenPeticion, (req, res) => {
    if (req.decoded.tipo != 6)
        return res.json({
            message: "Permisos denegados",
            error: false
        });
    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let clave = req.body.clave;
    let tipoUsuario = req.body.tipoUsuario;
    util.createConnection((errorCon, con) => {
        if (errorCon)
            res.json({
                message: err.message,
                error: true
            });
        const query = "INSERT INTO Usuario(nombre,correo,clave,TipoUsuario_idTipoUsuario) VALUES(?,?,?,?)"
        con.query(query, [nombre, correo, clave, tipoUsuario], (err, results) => {
            con.release();
            if (err)
                res.json({
                    message: err.message,
                    error: true
                });
            if (results.length > 0)
                res.json({
                    message: "ok",
                    error: false,
                });
            else
                res.json({
                    message: "Hubo un error al registrar el usuario ",
                    error: true
                })
        })
    })
});
router.post("/authUser", util.revisaSinToken, (req, res) => {
    let correo = req.body.correo;
    let clave = req.body.clave;
    util.createConnection((errorCon, con) => {
        if (errorCon) {
            console.error(errCon)
            res.json({
                message: errorCon.message,
                error: true
            });
        }
        const query = "SELECT idUsuario, nombre, correo,TipoUsuario_idTipoUsuario FROM Usuario WHERE correo=? AND clave=? LIMIT 1"
        con.query(query, [correo, clave], (err, results) => {
            con.release();
            if (err) {
                console.error(err)
                res.json({
                    message: err.message,
                    error: true
                });
            }
            if (results.length == 1) {
                let token = jwt.sign({
                    id_usuario: results[0].idUsuario,
                    nombre: results[0].nombre,
                    correo: results[0].correo,
                    tipo: results[0].TipoUsuario_idTipoUsuario,
                }, "EjuLNG9pt8m5cFZn", {
                    expiresIn: "30d"
                });
                res.send({
                    message: "ok",
                    token: token,
                });
            }
            else
                res.json({
                    message: "Usario o contraseñas invalidos",
                    error: false
                })
        })
    })
})
module.exports = router;