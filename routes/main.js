const express = require('express');
const router = express.Router();
const Product = require('../models/products');

router.get('/', (req, res) => {
    res.render('index');
})
router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/products/:id', (req, res, next) => {
    
        Product.find({ category: req.params.id }, (err, products) => {
            if (err) return next(err);
            res.render('category', {
                products: products
            })
        }).populate('category')
})

router.get('/product/:id', (req, res, next) => {
    Product.findById({ _id: req.params.id }, (err, product) => {
        if (err) return next(err);
        res.render('product', {
            product: product
        })
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;