const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');
const { authentication } = require('../middlewares/authentication');

router.post('/register', controller.register);
router.post('/login', controller.login);


router.get('/:id', authentication, controller.getUserById);

module.exports = router;