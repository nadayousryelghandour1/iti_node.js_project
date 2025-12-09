const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");


router.get('/login', [
    body('email')
        .exists().withMessage("Please Enter Your Email")
        .isEmail().withMessage("Please Enter Your Email Correctly as String"),
    body('password')
        .exists().withMessage("Please Enter Your Password")
        .isString().withMessage("Please Enter Your Password Correctly as String")
        .isLength({ min: 8 }).withMessage("Please Password must be more than 8 character")],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let { email, password } = req.body;
            let user = await UserModel.findOne({ email });
            if (!user) return res.status(404).send("Message : User Not Found");
            let match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).send("Message : Wrong Password");
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email
                },
                "SECRET_KEY_123",
                { expiresIn: "1h" }
            );

            res.status(200).json({ message: "Login success", token });
        } catch (e) {
            res.status(501).send(`message : ${e.message}`);
        }
    })

router.post('/signUp', [
    body('name')
        .exists().withMessage("Please Enter Your Name")
        .isString().withMessage("Please Enter Your Name Correctly as String")
        .isLength({ min: 3 }).withMessage("Please Name must be more than 3 character"),
    body('email')
        .exists().withMessage("Please Enter Your Email")
        .isEmail().withMessage("Please Enter Your Email Correctly"),
    body('password')
        .exists().withMessage("Please Enter Your Password")
        .isString().withMessage("Please Enter Your Password Correctly as String")
        .isLength({ min: 8 }).withMessage("Please Password must be more than 8 character")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let { name, email, password } = req.body;
        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already Exists!" });
        let hashedPass = await bcrypt.hash(password, 10);
        let user = UserModel({
            name: name,
            email: email,
            password: hashedPass
        });

        const createdUser = user.save();
        res.status(200).send(`message : User is created successfuly`);
    } catch (e) {
        res.status(501).send(`message : ${e.message}`);
    }

})

module.exports = router;