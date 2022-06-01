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

router.post("/newArticle", (req, res) => {
    if (req.files.file === null) {
        return res.status(400).json({
            "message": "No se subió un archivo"
        });
    }

    const file = req.files.file;
    const filename = file.name;
    const tema = req.body.tema;
    const id_user = req.body.id_user

    var id_articulo = 0;

    util.createConnection((errorCon, con) => {
        if (errorCon) {
            res.status(500).json({
                message: "Error en la conexión",
                error: true,
            });
        }

        var query = `INSERT INTO Articulo VALUES (null, '${tema}', '${filename}', ${id_user})`;
        con.query(query, (err, results) => {
            if (err)
                res.status(500).json({
                    message: "Ha ocurrido un error al insertar",
                    error: true
                })

            if (results.length == 0)
                res.status(500).json({
                    message: "Ha ocurrido un error",
                    error: true
                })

            id_articulo = results.insertId;

            query = `INSERT INTO Version VALUES (null, 1, '/static/articles/${filename}', 'SIN COMENTAR', ${id_articulo}, 1, 1)`
            con.query(query, (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({
                        message: "Ha ocurrido un error al insertar",
                        error: true
                    });
                }
                if (results.length == 0)
                    res.status(500).json({
                        message: "Ha ocurrido un error",
                        error: true
                    })
            });
        });
    })

    file.mv(`${process.cwd()}/static/articles/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    });

    res.status(200).json({
        message: "Archivo subido de forma correcta",
        error: false,
    })
})

router.get("/:status",util.agregaTokenPeticion ,(req, res) => {
    const { status } = req.params;

    if (!(req.decoded.tipo == 6 || req.decoded.tipo == 3))
        return res.json({
            message: "Permisos denegados",
            error: false
        });

    util.createConnection((errorCon, con) => {
        if (errorCon) {
            res.status(500).json({
                message: "Error en la conexión",
                error: true,
            });
        }

        //var query = `SELECT * FROM Estado`;
        /* 
                        <th scope='col'>#</th>
                        <th scope='col'>Articulo</th>
                        <th scope='col'>Versión</th>
                        <th scope='col'>Autor</th>
        
        */
        //INSERT INTO Articulo VALUES (null, '${tema}', '${filename}', ${id_user})
        var query = `SELECT A.idArticulo,A.Tema,V.archivo,V.numeroversion,U.nombre,V.idVersion FROM Articulo A JOIN Usuario U ON A.Usuario_idUsuario=U.idUsuario JOIN Version V ON A.idArticulo=V.Articulo_idArticulo AND V.Estado_idEstado=${status}`;
        con.query(query, (err, results) => {
            if (err)
                res.status(500).json({
                    message: "Ha ocurrido un error consultando la BD",
                    error: true
                })
            res.status(200).json(results);
        });
    })
})

router.post("/setState",util.agregaTokenPeticion ,(req, res) => {
    console.log(req.decoded.tipo)
    
    if (!(req.decoded.tipo == 6 || req.decoded.tipo == 3))
        return res.json({
            message: "Permisos denegados",
            error: false
        });

    const { idVersion, newState } = req.body;
    util.createConnection((errorCon, con) => {
        if (errorCon) {
            res.status(500).json({
                message: "Error en la conexión",
                error: true,
            });
        }

        var query = `UPDATE Version SET Estado_idEstado=${newState} WHERE idVersion=${idVersion}`;
        con.query(query, (err, results) => {
            if (err)
                res.status(500).json({
                    message: "Ha ocurrido un error consultando la BD",
                    error: true
                })
            res.status(200).json({
                message : "Estatus actualizado con exito",
                error : false
            });
        });
    })
})

router.post("/consrev",util.agregaTokenPeticion ,(req,res)=>{
    // Verifica la sesión para no dar acceso a usuarios no loggeados
    if (!(req.decoded.tipo == 6 || req.decoded.tipo == 1))
        return res.json({
            message: "Permisos denegados",
            error: false
        });


    // Consulta a la base de datos
    const query = `SELECT * FROM vw_articulo_version_autor WHERE id_usuario = ${req.decoded.id_usuario}`;
    
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

module.exports = router;