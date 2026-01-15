const { Router } = require('express');
const { usuarioPost, usuariosGet, usuarioGetID, usuarioPut, usuarioDelete, usuarioInhabilitado, /* habilitarUsuario  */} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.get('/:id', usuarioGetID);

router.post('/', usuarioPost);

router.put('/:id', usuarioPut);

/* router.patch('/:id', habilitarUsuario); */

router.patch('/:id', usuarioInhabilitado);

router.delete('/:id', usuarioDelete);

module.exports = router;