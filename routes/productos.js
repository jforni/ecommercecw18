const { Router } = require('express');
const { productoPost, productosGet, productoGetID, productoPut, productoInhabilitado, productoDelete, habilitarProducto } = require('../controllers/productos');


const router = Router();

router.get('/', productosGet);

router.get('/:id', productoGetID);

router.post('/', productoPost);

router.put('/:id', productoPut);

router.patch('/:id', productoInhabilitado);

router.delete('/:id', productoDelete);

module.exports = router;