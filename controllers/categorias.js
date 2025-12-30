const {request, response } = require('express');
const Categoria = require('../models/categoria');

const categoriasGet = async (req=request, res=response) => {
    //Obtener todas las categorías de productos paginadas
    const {desde = 0, limite = 5} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(desde)
            .limit(limite)
            /* .populate('Usuario', 'correo') */
    ])

    res.json({
        mensaje: 'Categorías obtenidas',
        total,
        categorias,
    })
}

const categoriaGet = async (req=request, res=response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id)/* .populate('Usuario', 'nombre apellido correo') */;

    res.json({
        mensaje: 'Categoría obtenida según pedido del usuario',
        categoria
    })
}

const categoriaPost = async (req=request, res=response) => {
    const nombre = req.body.nombre.toUpperCase();

    //Verificar si la categoría existe
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        res.status(400).json({
            mensaje: `La categoría ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data a guardar en la Base de Datos
    const data ={
        nombre, 
        /* usuario: req.usuario._id */
    }

    const categoria = new Categoria(data);

    //Guardar en la Base de Datos
    await categoria.save();

    res.status(201).json({
        mensaje: `Categoría ${categoria.nombre} creada con éxito.`,
        categoria
    })

}

const categoriaPut = async (req=request, res=response) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();
    /* const usuario = req.usuario._id */

    const data = {nombre /* , usuario */};

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.status(201).json({
        mensaje: 'Categoría actualizada correctamente.',
        categoria
    })
}

const categoriaInhabilitada = async (req=request, res=response) => {
    const {id} = req.params;

    try {
        const categoriaDeshabilitada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true});

        res.status(200).json({
            mensaje: 'La categoría ha sido deshabilitada correctamente',
            categoriaDeshabilitada
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al procesar la solicitud'
        })
    }
}

const categoriaDelete = async (req=request, res=response) => {
    const {id} = req.params;

    //Eliminación del documento físicamente
    const categoriaBorrada = await Categoria.findByIdAndDelete(id);

    res.json({
        mensaje: 'Categoría eliminada exitosamente!',
        categoriaBorrada
    })
}

module.exports = {
    categoriasGet,
    categoriaGet,
    categoriaPost,
    categoriaPut,
    categoriaInhabilitada,
    categoriaDelete
}