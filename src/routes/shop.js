const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getShop);
router.get('/product/:id', shopController.getProductPage);

module.exports = router;