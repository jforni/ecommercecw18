const {Router} = require('express');
const { categoriasGet, categoriaGet, categoriaPost, categoriaPut, categoriaInhabilitada, categoriaDelete } = require('../controllers/categorias');


const router = Router();

router.get('/', categoriasGet);

router.get('/:id', categoriaGet);

router.post('/', categoriaPost);

router.put('/:id', categoriaPut);

router.patch('/:id', categoriaInhabilitada);

router.delete('/:id', categoriaDelete);

module.exports = router;