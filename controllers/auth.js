const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async ( req=request, res=response) => {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});

        //Verificar si el correo existe
        if(!usuario){
            return res.status(400).json({
                msg: 'Correo o password incorrectos | usuario inexistente'
            })
        }

        //Verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Correo o password incorrectos | usuario inactivo'
            })
        }

        //Verificar el password
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg: 'Correo o password incorrectos | password erróneo'
            })
        }

        //Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            msg: "Usuario logueado con éxito",
            usuario,
            token
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador del sistema'
        });
    }
}

module.exports = {
    login
}