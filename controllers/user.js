const router = require("express").Router()


const util = require("../util")
router.post("/createUser", (req, res) => {
    if (req.session.user)
        return res.json({
            message: "Debe tener una sesión activa",
            error: false
        });
    if (req.session.user.tipo != 6)
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
router.post("/authUser", (req, res) => {
    console.log(req.session);
    if (req.session.user)
        return res.json({
            message: "Ya existe una sesion activa",
            error: false
        });
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

                req.session.user = {
                    id_usuario: results[0].idUsuario,
                    nombre: results[0].nombre,
                    correo: results[0].correo,
                    tipo: results[0].TipoUsuario_idTipoUsuario,
                }
                req.session.save(errSes => {
                    if (errSes)
                        console.error(errSes)
                    console.log(req.session)
                    res.json({
                        message: "ok",
                        error: false,
                    });
                })
            }
            else
                res.json({
                    message: "Usario o contraseñas invalidos",
                    error: false
                })
        })
    })
})
router.all("/logoutUser", (req, res) => {
    if (req.session.user)
        return res.json({
            message: "Debe tener una sesión activa",
            error: false
        });
    req.session.regenerate(
        res.json({
            message: "ok",
            error: false
        })
    )
})
module.exports = router;