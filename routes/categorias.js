const {Router} = require('express');
const { categoriasGet, categoriaGet, categoriaPost, categoriaPut, categoriaInhabilitada, categoriaDelete, habilitarCategoria } = require('../controllers/categorias');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { categoriaExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validarCampos');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/', [
    validarJWT,
],categoriasGet);

router.get('/:id',[
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
], categoriaGet);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre de la categoría es obligatorio').notEmpty(),
    validarCampos
],categoriaPost);

router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
], categoriaPut);

router.patch('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
], categoriaInhabilitada);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
], categoriaDelete);

module.exports = router;