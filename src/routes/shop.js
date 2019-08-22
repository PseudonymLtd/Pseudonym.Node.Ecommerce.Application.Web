const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProductsListPage);
router.get('/product/:id', shopController.getProductDetailsPage);
router.get('/cart', shopController.getCartPage);
router.post('/cart', shopController.postAddToCart);
router.get('/cart/product/:id', shopController.getRemoveCartItem);
router.post('/cart/product/:id', shopController.postEditCartItem);
router.get('/checkout/:postalServiceId', shopController.getCheckoutPage);

module.exports = router;