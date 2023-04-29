const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { UserModel } = require('../models/user.model');

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userAlready = await UserModel.findOne({ email });
        if (userAlready) {
            res.status(200).send({ "msg": "user already exists", "user": userAlready })
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(400).send({ "msg": "Something went wrong" })
                } else {
                    const newUser = new UserModel({
                        name,
                        email,
                        password: hash
                    });
                    await newUser.save();
                    res.status(201).send({ "msg": "User registered successfully", "user": newUser })
                }
            });
        }
    } catch (error) {
        res.status(400).send({ "msg": error.message })
        console.log(error.message)
    }
});

userRouter.get('/users', async (req, res) => {
    try {
      const users = await UserModel.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

module.exports={
    userRouter
}