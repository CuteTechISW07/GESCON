const router = require("express").Router()
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const util = require("../util")


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})
const mailOption = {
    from: "cutetech07@gmail.com",
    to: "",
    subject: "Hola, esto es tu codigo de verificacion",
    html: "Por favor ingresa el siguiente codigo en Gescon %codigo%"
}
router.post("/createUser", util.agregaTokenPeticion, async (req, res) => {
    if (req.decoded.tipo != 6)
        return res.json({
            message: "Permisos denegados",
            error: false
        });
    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let clave = req.body.clave;
    let tipoUsuario = req.body.tipoUsuario;

    const codigo = ((min, max) => Math.floor(Math.random() * (max - min)) + min)(100000, 1000000)

    /**
     * POR FAVOR BORRA LO SIGUIENTE:
     */

    mailOption.to = correo;
    mailOption.html = mailOption.html.replace("%codigo%", codigo)
    await transporter.sendMail(mailOption)

    /**
     * 
     * GRACIAS
     */

    util.createConnection((errorCon, con) => {
        if (errorCon)
            res.json({
                message: err.message,
                error: true
            });
        const query = "INSERT INTO Usuario(nombre,correo,clave,TipoUsuario_idTipoUsuario,codigo) VALUES(?,?,?,?,?)"
        con.query(query, [nombre, correo, clave, tipoUsuario, codigo], async (err, results) => {
            con.release();
            if (err)
                res.json({
                    message: err.message,
                    error: true
                });
            if (results.length > 0) {
                mailOption.to = correo;
                mailOption.html.replace("%codigo%", codigo)
                await transporter.sendMail(mailOption)
                res.json({
                    message: "ok",
                    error: false,
                });
            }
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
            console.error(errorCon)
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
                    informacion: {
                        id_usuario: results[0].idUsuario,
                        nombre: results[0].nombre,
                        correo: results[0].correo,
                        tipo: results[0].TipoUsuario_idTipoUsuario,
                    }
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

router.post("/decodeJWT", util.revisaSinToken, (req, res) => {
    res.send(req.decoded)
})

module.exports = router;