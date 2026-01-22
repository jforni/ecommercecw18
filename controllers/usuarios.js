const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const { desde = 0, limite = 10 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(desde).limit(limite)
    ]);

    res.json({
        mensaje: "Usuarios obtenidos",
        total,
        usuarios
    });
}

const usuarioGetID = async (req = request, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    res.json({
        mensaje: "Usuario obtenido",
        usuario
    })
}

const usuarioPost = async (req = request, res = response) => {
    //Recibir el cuerpo de la petición
    const datos = req.body;

    const { nombre, apellido, correo, password, rol } = datos;
    const usuario = new Usuario({ nombre, apellido, correo, password, rol });

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    usuario.password = hash;

    //Guardar los datos en la BD
    await usuario.save();

    res.json({
        mensaje: 'Usuario cargado correctamente en la BD',
        usuario
    })
}

const usuarioPut = async (req = request, res = response) => {
    const { id } = req.params;

    //Obtener datos del usuario a actualizar
    const { password, correo, ...resto } = req.body;

    //Si atualiza el password, debo encriptarlo
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    //Modificación de datos
    resto.correo = correo;

    //Buscar el usuario y actualizarlo
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        mensaje: "Usuario actualizado correctamente!",
        usuario
    })
}

const usuarioInhabilitado = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        usuario.estado = !usuario.estado;
        await usuario.save();

        res.status(200).json({
            mensaje: `El usuario fue ${usuario.estado ? "habilitado" : "deshabilitado"} correctamente`,
            usuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al procesar la solicitud'
        })
    }
}

const usuarioDelete = async (req = request, res = response) => {
    const { id } = req.params;

    //Eliminación del documento físicamente
    const usuarioBorrado = await Usuario.findByIdAndDelete(id);

    res.json({
        mensaje: 'Usuario eliminado exitosamente!',
        usuarioBorrado
    })
}

module.exports = {
    usuariosGet,
    usuarioGetID,
    usuarioPost,
    usuarioPut,
    usuarioInhabilitado,
    usuarioDelete
}