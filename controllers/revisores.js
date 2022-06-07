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

        var query = `SELECT max(idVersion) as id_version FROM Version WHERE Articulo_idArticulo = ${id_articulo}`;
        var id_version = 0;

        con.query(query,(err,results)=>{
            if(err){
                res.json({
                    message : "Ocurrió un error realizando la consulta",
                    error : true
                });
            }
            
            if (results.length == 0)
                res.json({
                    message: "Ha ocurrido un error",
                    error: true
                });

            id_version = results[0]['id_version'];

            query = `UPDATE Version SET id_revisor = ${id_revisor}, Estado_idEstado = 2 WHERE idVersion = ${id_version}`;

            con.query(query, (err,results)=>{
                if(err){
                    console.log(err);
                    res.json({
                        message : "Ocurrió un error al asignar al revisor",
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

router.get("/myArticles",util.agregaTokenPeticion,(req,res)=>{
    if(!(req.decoded.tipo==2 || req.decoded.tipo==6)){
        res.json({
            message : "Permisos denegados",
            error : false
        });
    }

    const id_user = req.decoded.id_usuario;
    
    const query = `SELECT * FROM vw_articulo_version_autor WHERE id_revisor = ${id_user} AND estatus = 'En revisión'`
    util.createConnection((errorCon,con)=>{
        if(errorCon){
            res.json({
                message : "Ha ocurrido un error conectando con la base de datos",
                error : true
            });
        }

        con.query(query,(err,results)=>{
            if(err){
                res.json({
                    message : "Ha ocurrido un error durante la consulta",
                    error : true
                })
            }

            res.json({
                message : "Consulta realizada con éxito",
                error : false,
                data : results
            })
        })
    })
});

module.exports = router;