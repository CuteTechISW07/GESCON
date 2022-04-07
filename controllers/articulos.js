const util = require("../util");

exports.getArticulos = (req,res)=>{
    /*
    // Verifica la sesión para no dar acceso a usuarios no loggeados
    if (!req.session.id_usuario) {
        return res.json({
            message: "Debe tener una sesión activa",
            error: false
        });
    }

    // Verifica que el tipo de usuario sea el correcto, en este caso el líder de comite
    if (req.session.tipo != 3)
        return res.json({
            message: "Permisos denegados",
            error: false
        });


    // Consulta a la base de datos
    const query = "SELECT * FROM vw_articulo_version_autor";

    connection.query(query, (err, results) => {
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
    });*/
    const respuesta = {
        error: false,
        message: "To cool",
        data : [
            {
                id_usuario : 1,
                autor : "Jesús García",
                id_articulo : 1,
                titulo_articulo : "Articulo guay",
                id_version : 1,
                archivo : "/",
                num_version : 1,
                estatus : "En revisión"
            },
            {
                id_usuario : 2,
                autor : "Alberto Valencia",
                id_articulo : 2,
                titulo_articulo : "Articulo guay 2",
                id_version : 2,
                archivo : "/",
                num_version : 1,
                estatus : "Aceptado"
            }
        ]
    }

    res.json(respuesta);

}