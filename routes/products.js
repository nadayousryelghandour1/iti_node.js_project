const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../models/auth');
let ProductModel = require("../models/product");
const product = require('../models/product');

router.get('/', async (req, res) => {
    try {
        let products = await ProductModel.find();
        if (products.length == 0) {
            return res.send("No Product Yet.");
        } else {
            res.json(products)
        }
    } catch (e) {
        res.status(501).send(`message : ${e.message}`);
    }
});


router.get('/:id', async (req, res) => {
    try {
        let id = +req.params.id;
        let product = await ProductModel.findOne({id});
        if (!product) return res.status(404).send("Message No Product Found");
        res.status(200).json(product);
    } catch (e) {
        res.status(501).send(`message : ${e.message}`);
    }
});

router.post('/addProduct', [
    body('name')
        .exists().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage('Product Name Should be more than 3 character')
        .isString().withMessage('Product Name Should String'),
    body('price')
        .exists().withMessage("Price is required")
        .isNumeric().withMessage('Product Price Should Digits'),
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const count = await ProductModel.countDocuments();
        let product = ProductModel({
            id :count+1,
            name: req.body.name,
            price: req.body.price
        });

        const createdProduct = await product.save();
        res.status(200).json(`product : ${createdProduct}`);
    } catch (e) {
        res.status(501).send(`message : ${e.message}`);
    }

});

router.put('/updateProduct/:id', [
    body('name')
        .exists().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage('Product Name Should be more than 3 character')
        .isString().withMessage('Product Name Should String'),
    body('price')
        .exists().withMessage("Price is required")
        .isNumeric().withMessage('Product Price Should be Digits'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = +req.params.id;
        let { name, price } = req.body;
        let product = await ProductModel.findOne({ id });
        if (!product) return res.status(404).send(`message : Product Not Found`);

        product.name = name;
        product.price = price;

        const updatedProduct = await product.save();
        res.status(200).json(`product : ${updatedProduct}`);
    } catch (e) {
        res.status(501).send(`message : ${e.message}`);
    }

});

router.patch('/editProduct/:id', [
    body('name')
        .optional()
        .isLength({ min: 3 }).withMessage('Product Name Should be more than 3 character')
        .isString().withMessage('Product Name Should String'),
    body('price')
        .optional()
        .isNumeric().withMessage('Product Price Should be Digits'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = +req.params.id;
        let { name, price } = req.body;
        let product = await ProductModel.findOne({ id });
        if (!product) return res.status(404).send(`message : Product Not Found`);

        product.name = name || product.name;
        product.price = price || product.price;

        const editedProduct = await product.save();
        res.status(200).json(`product : ${editedProduct}`);
    } catch (e) {
        res.status(501).send(`message : ${e.message}`);
    }

});

router.delete("/deleteProduct/:id", auth, async (req, res) => {
    try {
        const id = +req.params.id
        let product = await ProductModel.findOne({ id });
        if (!product) return res.status(404).send("Product Not Found");
        let deletedProduct = await product.deleteOne({ id });
        res.status(200).json(deletedProduct);
    } catch (e) {
        res.status(501).send(`Message : ${e.message}`);
    }
})

module.exports = router;