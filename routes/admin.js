const router =require('express').Router();
const Category = require('../models/category');

router.get('/add-category', (req, res) => {
    res.render('admin/add-category', { message: req.flash('success') })
})

router.post('/add-category', async (req, res) => {
    const category = new Category();
    category.name = req.body.name;
    try {
        await category.save();
        req.flash('success', 'Successfully added a category');
        return res.redirect(`/api/${category.name}`);
    } catch (err) {
        // Handle error here - for example, log it and send a response to the user
        console.error(err);
        res.status(500).send("An error occurred");
    }
})

module.exports =router;
