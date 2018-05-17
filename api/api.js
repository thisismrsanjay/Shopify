const router = require('express').Router();
const faker = require('faker');
const Category = require('../models/category');
const Product = require('../models/products');

router.get('/:name',(req,res,next)=>{

    Category.findOne({name:req.params.name},(err,category)=>{
        if (err) return next(err);
        for(let i =0 ;i<30;i++){
            let product = new Product();
            product.category = category._id;
            product.name= faker.commerce.productName();
            product.price = faker.commerce.price();
            product.image= faker.image.image();

            product.save((err)=>{
                if(err)return next(err);
            })
        }res.redirect('/add-category');
    })


});
module.exports= router;