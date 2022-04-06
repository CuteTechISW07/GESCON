const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 20,
    host: "216.238.68.27",
    user: "Ares",
    password: "ugJ9z79Tnv9XmzxZ",
    database: "Gescon",
});

module.exports.createConnection = (callback) => {

    /**
     * Establece la conexión a la base de datos
     */

    pool.getConnection((error, con) => {
        callback(error, con)
    })
}