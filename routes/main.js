const express = require('express');
const router = express.Router();
const Product = require('../models/products');

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/products/:id', async (req, res, next) => {
    try {
        const products = await Product.find({ category: req.params.id }).populate('category');
        res.render('category', {
            products: products
        })
    } catch(err) {
        next(err);
    }
})

router.get('/product/:id', async (req, res, next) => {
    try {
        const product = await Product.findById({ _id: req.params.id });
        res.render('product', {
            product: product
        })
    } catch(err) {
        next(err);
    }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
