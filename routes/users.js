const { User, validate } = require('../models/users');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
 
router.post('/users', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      return res.status(400).send('That user already exists!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User(_.pick(req.body, ['email', 'password']));
        console.log(user);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send(_.pick(user, ['_id', 'email']));
    }
});

module.exports = router;