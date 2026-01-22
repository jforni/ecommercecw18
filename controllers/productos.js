const { response, request} = require('express');
const Producto = require('../models/producto');
const cloudinary = require ('cloudinary').v2;

const productosGet = async (req=request, res=response) => {
    //Obtener todos los productos paginados
    const {desde = 0, limite = 5} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'correo')
            .populate('categoria', 'nombre'),
    ])

    res.json({
        mensaje: 'Productos obtenidos',
        total,
        productos,
    })
}

const productoGetID = async (req=request, res=response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'correo')
        .populate('categoria', 'nombre');

    res.json({
        mensaje: "Producto obtenido según lo solicitado!",
        producto
    });
}

const productoPost = async (req=request, res=response) =>{
    const {precio, categoria, descripcion, img, stock } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({nombre});

    //Subir imagen a Cloudinary
    const imagen = async (img) => {
        try {
            //Upload 
            const result = await cloudinary.uploader.upload(img)
            return result.secure_url;
        } catch (error) {
            console.error(error);            
        }
    }

    const imgId = await imagen(img);

    //Validar si el producto existe
    if(productoDB){
        return res.status(400).json({
            mensaje: `El producto ${productoDB.nombre} ya existe.`
        })
    }

    //Generar la data que vamos a guardar en la BD
    const data = {nombre, categoria, precio, descripcion, img: imgId, stock, usuario: req.usuario._id }

    const producto = new Producto(data);

    //Grabar en la BD
    await producto.save();

    res.status(201).json({
        msg: 'Producto creado con éxito!',
        producto,
    })
};

const productoPut = async (req=request, res=response) => {
    const {id} = req.params;
    const { precio, categoria, descripcion, destacado, img, stock} = req.body;

    const usuario = req.usuario_id;

    //Borrar la imagen anterior
    if(img){
        const productoActual = await Producto.findById(id);
        const imagenBorrar = productoActual.img;
        const nombreArr = imagenBorrar.split('/');
        const nombreImg = nombreArr[nombreArr.length - 1];
        const [public_id] = nombreImg.split('.');
        await cloudinary.uploader.destroy(public_id);
    };

    //Cargar la imagen nueva
    const imagenNueva = async (img) => {
        try {
            //Actualizar la imagen
            const result = await cloudinary.uploader.upload(img);
            return result.secure_url;
        } catch (error) {
            console.log(error)
        }
    };

    const imgId = await imagenNueva(img);

    let data = {
        precio, descripcion, categoria, destacado, stock, img:imgId, usuario
    };

    //Si viene el nombre del producto
    if(req.body.nombre){
        data.nombre = req.body.nombre.toUpperCase();
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.status(201).json({
        mensaje: 'El producto se actualizó correctamente!',
        producto
    });
};

const habilitarProducto = async (req=request, res=response) => {
    const {id} = req.params;

    try {
        const productoHabilitado = await Producto.findByIdAndUpdate(id, {estado: true}, {new:true});

        res.status(200).json({
            mensaje: 'El producto ha sido habilitado correctamente',
            productoHabilitado
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al procesar la solicitud'
        })
    }
}

const productoInhabilitado = async (req=request, res=response) => {
    const {id} = req.params;

    try {
        const producto = await Producto.findById(id);

        if(!producto){
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            })
        }

        producto.estado = !producto.estado;
        await producto.save();

        res.status(200).json({
            mensaje: 'El producto ha sido deshabilitado correctamente',
            producto
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al procesar la solicitud'
        })
    }
}

const productoDelete = async (req=request, res=response) => {
    const {id} = req.params;

    //Eliminación del documento físicamente
    const productoBorrado = await Producto.findByIdAndDelete(id);

    res.json({
        mensaje: 'Producto eliminado exitosamente!',
        productoBorrado
    })
}

module.exports = {
    productosGet,
    productoGetID,
    productoPost,
    productoPut,
    habilitarProducto,
    productoInhabilitado,
    productoDelete
}