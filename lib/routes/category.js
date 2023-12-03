const express = require('express');
const router = express.Router();
const controller = require('../controllers/category_controller');
const { authentication, isAdmin } = require('../middlewares/authentication');

router.use(authentication);
router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategoryById);

router.use(isAdmin);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;