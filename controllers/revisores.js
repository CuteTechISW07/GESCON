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

        const query = `SELECT idUsuario, nombre FROM Usuario WHERE TipoUsuario_idTipoUsuario = 2 AND idUsuario != 7`;
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
});

router.post("/asignar",util.agregaTokenPeticion, (req,res)=>{
    if(!(req.decoded.tipo==3 || req.decoded.tipo==6)){
        res.json({
            message : "Permisos denegados",
            error : false
        });
    }

    const {id_revisor, id_articulo} = req.body;

    util.createConnection((errorCon, con)=>{
        if(errorCon){
            res.json({
                message : "Ha ocurrido un error con la conexión a la base de datos",
                error : true
            });
        }

        var query = `SELECT max(idVersion) as id_version FROM version WHERE Articulo_idArticulo = ${id_articulo}`;
        
        con.query(query,(err,results)=>{
            if(err){
                res.json({
                    message : "Ocurrió un error realizando la consulta",
                    error : true
                });
            }

            const id_version = results.id_version;

            query = `UPDATE Version SET id_revisor = ${id_revisor} AND Estado_idEstado = 2 WHERE idVersion = ${id_version}`;
            con.query(query, (err,results)=>{
                if(err){
                    res.json({
                        message : "Ocurrió un error realizando la consulta",
                        error : true
                    });
                }

                res.json({
                    message : "Revisor asignado exitosamente",
                    error : false
                })
            })

            
        });
    });
});

module.exports = router;