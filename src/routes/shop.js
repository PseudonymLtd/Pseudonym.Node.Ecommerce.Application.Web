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
router.post('/checkout', shopController.postCheckoutPage);
router.post('/pay', shopController.postPay);

module.exports = router;