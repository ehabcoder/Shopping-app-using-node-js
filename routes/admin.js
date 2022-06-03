const path = require('path');
const { check, body } = require('express-validator');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

// // /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

// // /admin/add-product => POST
router.post('/add-product', [
    body('title', 'Please Enter a valid title.').isLength({ min: 3 }),
    body('price', 'Please Enter a valid Price.').isCurrency({ symbol: '$', require_symbol: false, allow_negative: false, thousand_separator: ',', decimal_separator: '.', allow_decimal: true, allow_space_after_digits: false }),
    body('description', 'Please Enter a valid Description.').isLength({ min: 10, max: undefined })
], isAuth, adminController.post_prodcut);

router.post('/edit-product', [
    body('title', 'Please Enter a valid title.').isLength({ min: 3 }),
    body('price', 'Please Enter a valid Price.').isCurrency({ symbol: '$', require_symbol: false, allow_negative: false, thousand_separator: ',', decimal_separator: '.', allow_decimal: true, allow_space_after_digits: false }),
    body('description', 'Please Enter a valid Description.').isLength({ min: 10, max: undefined })
], isAuth, adminController.postEditProduct)

router.delete('/product/:productId', isAuth, adminController.deleteProduct)



module.exports = router;