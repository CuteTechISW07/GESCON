const mysql = require("mysql");
const jwt = require("jsonwebtoken")

const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports.createConnection = (callback) => {

    /**
     * Establece la conexión a la base de datos
     */

    pool.getConnection((error, con) => {
        if (error) {
            console.error(error)
        } else {
            callback(error, con)
        }
    })
}
module.exports.agregaTokenPeticion = (req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, "EjuLNG9pt8m5cFZn", (err, decoded) => {
            if (err) {
                console.error(err)
                return res.send({
                    Estado: "Error",
                    Descripcion: "Sesión invalida"
                })

            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            Estado: "Error",
            Descripcion: "No tiene permisos"
        })
    }
}

module.exports.revisaSinToken = (req, res, next) => {
    const token = req.headers['access-token'];
    if (token) {
        res.send({
            Estado: "Error",
            Descripcion: "Ya hay una sesion activa"
        })
    } else {
        next();
    }
}