const util = require("../util")
exports.createUser = (req, res) => {
    if (req.session.id_usuario)
        return res.json({
            message: "Debe tener una sesión activa",
            error: false
        });
    if (req.session.tipo != 6)
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
}
exports.authUser = (req, res) => {
    if (!req.session.id_usuario)
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
                req.session = {
                    id_usuario: results.idUsuario,
                    nombre: results.nombre,
                    correo: results.correo,
                    tipo: results.TipoUsuario_idTipoUsuario,
                }
                res.json({
                    message: "ok",
                    error: false,
                });
            }
            else
                res.json({
                    message: "Usario o contraseñas invalidos",
                    error: false
                })
        })
    })
}
