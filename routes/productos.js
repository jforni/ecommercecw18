const { Router } = require('express');
const { productoPost, productosGet, productoGetID, productoPut, productoInhabilitado, productoDelete, habilitarProducto } = require('../controllers/productos');
const { check } = require('express-validator');
const { productoExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/', productosGet);

router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(productoExiste),
    validarCampos
],productoGetID);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
], productoPost);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(productoExiste),
    validarCampos,
],productoPut);

router.patch('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(productoExiste),
    validarCampos,
], productoInhabilitado);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(productoExiste),
    validarCampos,
], productoDelete);

module.exports = router;