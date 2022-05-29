const util = require("../util");
const router = require("express").Router();

router.post("/gestion",util.agregaTokenPeticion ,(req,res)=>{
    // Verifica la sesión para no dar acceso a usuarios no loggeados
    if (!(req.decoded.tipo == 6 || req.decoded.tipo == 3))
        return res.json({
            message: "Permisos denegados",
            error: false
        });


    // Consulta a la base de datos
    const query = "SELECT * FROM vw_articulo_version_autor";
    
    util.createConnection((errorCon, con)=>{
        if(errorCon){
            res.json({
                status: 500,
                error : true,
                message : "Ha ocurrido un error"
            })
        }
        
        con.query(query, (err, results) => {
            if (err)
                return res.json({
                    message: err.message,
                    error: true
                });
    
            if (results.length > 0)
                res.json({
                    message: "Artículos encontrados",
                    error: false,
                    data: results
                });
            else
                res.json({
                    message: "No hay resultados que mostrar",
                    error: false
                })
        });
    })
    
    

});

router.post("/newArticle",(req,res)=>{
    if(req.files.file===null){
        return res.status(400).json({
            "message" : "No se subió un archivo"
        });
    }

    const file = req.files.file;
    const filename = file.name;
    const tema = req.body.tema;
    const id_user = req.body.id_user

    var id_articulo = 0;

    util.createConnection((errorCon, con)=>{
        if(errorCon){
            res.status(500).json({
                message : "Error en la conexión",
                error : true,
            });
        }

        var query = `INSERT INTO Articulo VALUES (null, '${tema}', '${filename}', ${id_user})`;
        con.query(query, (err,results)=>{
            if(err)
                res.status(500).json({
                    message: "Ha ocurrido un error al insertar",
                    error : true
                })
            
            if(results.length == 0)
                res.status(500).json({
                    message : "Ha ocurrido un error",
                    error : true
                })
            
            id_articulo = results.insertId;

            query = `INSERT INTO Version VALUES (null, 1, '/static/articles/${filename}', 'SIN COMENTAR', ${id_articulo}, 1, 1)`
            con.query(query,(err,results)=>{
                if(err){
                    console.log(err);
                    res.json({
                        message : "Ha ocurrido un error al insertar",
                        error : true
                    });
                }
                if(results.length == 0)
                    res.status(500).json({
                        message : "Ha ocurrido un error",
                        error : true
                    })
            });
        });
    })

    file.mv(`${process.cwd()}/static/articles/${file.name}`,err=>{
        if(err){
            console.error(err);
            return res.status(500).send(err);
        }
    });

    res.status(200).json({
        message : "Archivo subido de forma correcta",
        error : false,
    })
})

module.exports = router;