const util = require("../util");
const router = require("express").Router();

router.get("/list",util.agregaTokenPeticion, (req,res)=>{
    if(!(req.decoded.tipo==3 || req.decoded.tipo==6)){
        res.json({
            message : "Permisos denegados",
            error : false
        });
    }

    util.createConnection((errorCon,con)=>{
        if(errorCon){
            res.json({
                message : "Ha ocurrido un error con la conexión a la base de datos",
                error : true
            });
        }

        const query = `SELECT idUsuario, nombre FROM Usuario WHERE TipoUsuario_idTipoUsuario = 2`;
        con.query(query,(err,results)=>{
            if(err){
                res.json({
                    message : "Ocurrió un error realizando la consulta",
                    error : true
                });
            }

            res.json({
                message : "Consulta realizada con éxito",
                error : false,
                data : results
            })
        });
    });
})

module.exports = router;