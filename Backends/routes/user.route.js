const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { UserModel } = require('../models/user.model');

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, password, dob, bio } = req.body;

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
                        password: hash,
                        dob,
                        bio
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


  userRouter.get('/users/:id/friends', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await UserModel.findById(id).populate('friends');
      
      if (!user) {
        return res.status(400).send({ error: 'User not found' });
      }
  
      const friends = user.friends.map((friend) => {
        const { _id, name, email } = friend;
        return { _id, name, email };
      });
  
      res.status(200).send(friends);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  userRouter.post('/users/:id/friends', async (req, res) => {
    const { userId } = req.params;
    const { friendId } = req.body;
  
    try {
      const senderUser = await UserModel.findById(userId);
      const receiverUser = await UserModel.findById(friendId);
  
      if (!senderUser || !receiverUser) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      if (senderUser.friends.includes(friendId) || senderUser.friendRequests.includes(friendId)) {
        return res.status(201).send({ error:"You are already friends" });
      }
  
      senderUser.friendRequests.push(friendId);
      await sender.save();
  
      res.status(201).send({ message: "Friend request has been sent" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
module.exports={
    userRouter
}