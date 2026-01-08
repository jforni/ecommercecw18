const { Router } = require('express');
const { productoPost, productosGet } = require('../controllers/productos');


const router = Router();

router.get('/', productosGet);

router.post('/', productoPost);

module.exports = router;