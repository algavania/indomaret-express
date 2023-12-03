const express = require('express');
const router = express.Router();

const userRouter = require('./user');
router.use('/user', userRouter);

const categoryRouter = require('./category');
router.use('/category', categoryRouter);

module.exports = router;