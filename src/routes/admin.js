const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);
router.post('/add-product', productsController.postAddProduct);
router.get('/remove-product/:id', productsController.getRemoveProduct);

module.exports = router;