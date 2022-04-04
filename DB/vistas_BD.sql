use gescon;
/*
    Script para crear vistas en la base de datos
*/
create view vw_articulo_version_autor as (select 
	idUsuario as id_usuario, 
    nombre as autor, 
    idArticulo as id_articulo, 
    ArticuloCol as titulo_articulo, 
    idVersion as id_version, 
    archivo, 
    numeroversion as num_version, 
    estatus 
    from Usuario inner join Articulo on idUsuario = Usuario_idUsuario
    inner join Version on idArticulo = Articulo_idArticulo
    inner join Estado on idEstado = Estado_idEstado);
    
select * from vw_articulo_version_autor;