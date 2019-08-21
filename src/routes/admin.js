const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);
router.post('/add-product', productsController.postAddProduct);
router.get('/remove-product/:id', productsController.getRemoveProduct);
router.get('/update-product/:id', productsController.getUpdateProduct);
router.post('/update-product/:id', productsController.postUpdateProduct);
router.get('/manage-products', productsController.getManageProducts);

module.exports = router;