const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.get('/protected', requireLogin, (req, res) => {
    res.send('Hello user');
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(422).json({ "error": "Please add all the fields" });
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ "error": "User already exists with that email" });
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword
                    })

                    user.save().then(user => {
                        res.json({ "message": "Saved Successfully" });
                    }).catch(error => {
                        console.log(error);
                    })
                })

        }).catch(error => console.log(error));
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ "error": "Please add email or password" });
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ "error": "Invalid email or password" });
            }

            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ "message": "Successfully signed in" });
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        res.json({ token: token });
                    } else {
                        return res.status(422).json({ "error": "Invalid password" });
                    }
                })
        })
        .catch(error => {
            console.log(error);
        })
});

module.exports = router;