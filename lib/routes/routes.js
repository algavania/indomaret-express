const express = require('express');
const router = express.Router();

const userRouter = require('./user');
router.use('/user', userRouter);

const categoryRouter = require('./category');
router.use('/category', categoryRouter);

const productRouter = require('./product');
router.use('/product', productRouter);

module.exports = router;