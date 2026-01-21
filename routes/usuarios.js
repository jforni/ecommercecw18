const { Router } = require('express');
const { check } = require('express-validator');
const { usuarioPost, usuariosGet, usuarioGetID, usuarioPut, usuarioDelete, usuarioInhabilitado, /* habilitarUsuario  */ } = require('../controllers/usuarios');
const { usuarioExiste, emailExiste, esRolValido } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/',[
    validarJWT,
    esAdminRole,
], usuariosGet);

router.get('/:id', [
    check('id', "El id no es válido").isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioGetID);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('correo').custom(emailExiste),
    check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({ min: 6 }),
    check('rol').custom(esRolValido),
    validarCampos
], usuarioPost);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioPut);

router.patch('/:id', [
    validarJWT,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioInhabilitado);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioDelete);

module.exports = router;