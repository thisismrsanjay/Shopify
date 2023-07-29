const router = require('express').Router();
const faker = require('faker');
const Category = require('../models/category');
const Product = require('../models/products');

router.get('/:name', async (req, res, next) => {
    try {
        const category = await Category.findOne({ name: req.params.name });

        for(let i = 0 ; i < 30 ; i++) {
            let product = new Product();
            product.category = category._id;
            product.name = faker.commerce.productName();
            product.price = faker.commerce.price();
            product.image = faker.image.image();

            await product.save();
        }
        res.redirect('/add-category');
    } catch(err) {
        next(err);
    }
});

module.exports = router;
