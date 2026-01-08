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
            /* .populate('Usuario', 'correo') */
            .populate('categoria', 'nombre'),
    ])

    res.json({
        mensaje: 'Productos obtenidos',
        total,
        productos,
    })
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
    const data = {nombre, categoria, precio, descripcion, img: imgId, stock/* , usuario: req.usuario._id */ }

    const producto = new Producto(data);

    //Grabar en la BD
    await producto.save();

    res.status(201).json({
        msg: 'Producto creado con éxito!',
        producto,
    })
}

module.exports = {
    productosGet,
    productoPost,
}