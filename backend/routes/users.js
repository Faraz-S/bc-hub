import express from "express";
const router = express.Router();
import mongoose from 'mongoose';

import {User, userSchema} from "../models/user.js"
import isLoggedIn from '../utils/isLoggedIn.js' 

router.get("/username/:username", async (req, res) => {
    try {
        let profile = await User.findOne({username: req.params.username}).exec();
        if (!profile){
            res.status(404).json({Error: 'user does not exist'}).send();
            return;
        }
        var data = profile.toObject()
        delete data.password
        console.log(data)
        res.json(data)
      } catch(err) {
        console.log(err);
        res.status(404).json({Error: err})
    }
});

router.get("/:id", async (req, res) => {
    try {
        // Query community posts (not just from people you follow) and sort in reverse chronological order
        let profile = await User.findById(req.params.id).exec();
        if (!profile){
            res.status(404).json({Error: 'user does not exist'}).send();
            return;
        }
        var data = profile.toObject()
        delete data.password
        console.log(data)
        res.json(data)
        // res.json(getUser('id', req.params.id))
      } catch(err) {
        console.log(err);
        res.status(404).json({Error: err})
    }
});

// Get all of the users that this user is following/followed by
router.get('/followers/:type/:id', async(req, res) => {
    // Get the user with the given ID
    let profile;
    try{
        profile = await User.findById(req.params.id).exec();
        if (!profile){
            res.status(404).json({Error: 'user does not exist'}).send();
        }
    } catch (e) {
        res.status(404).json({Error: e}).send()
    }

    if (!req.params.type || (req.params.type !== 'following' && req.params.type !== 'followers')){
        res.status(400).json({Error: "type must be either 'following' or 'followers'"}).send();
    }
    try{
        let users;
        if (req.params.type === 'following'){
            users = await User.find({ _id: { "$in" : profile.followingUsers}})
        } else {
            users = await User.find({ _id: { "$in" : profile.followers}})
        }
        var data = []
        for (let i = 0; i < users.length; i++){
            data.push(users[i].toObject())
            delete (data[i]).password
        }
        console.log(data)
        res.json(data)
    } catch(err){
        console.log(err);
        res.status(404).json({Error: err})
    }
})

const getUser = async (fieldName, fieldValue) => {
    let profile;
    if (fieldName === 'username'){
        profile = await User.findOne({username: fieldValue}).exec();
    } else if (fieldName === 'id'){
        profile = await User.findById(fieldValue).exec();
    }
    var data = profile.toObject()
    delete data.password
    console.log(data)
    return data
}

router.post("/:id/follow-unfollow", async (req, res) => {
    // See if the user is logged in
    const authenticated = await isLoggedIn(req)
    if (authenticated.status !== 200) {
      res.status(401).json({Error: 'Client unauthenticated'}).send();
    }

    // See if the person they are trying to follow exists
    let user = null;
    try {
      user = await User.findById(req.params.id).exec();
    } catch(err) {
      console.log(err);
      res.status(404).json({Error: err}).send();
      return;
    }
    if (!user){
      res.status(404).json({Error: 'The user you are trying to follow does not exist'}).send();
      return;
    }

    // See if the user is trying to follow themselves
    if (authenticated.user.id === req.params.id){
        res.status(400).json({Error: 'You cannot follow yourself'}).send();
    }

    // Determine if you are already following this user
    const myUser = await User.findById(authenticated.user.id).exec();
    let checkFollowing = myUser.followingUsers.indexOf(user.id);
    if (checkFollowing === -1){ // Not following already, so follow the user
        myUser.followingUsers.push(user.id)
        user.followers.push(myUser.id)
        myUser.save()
        user.save()
        res.status(200).json({Outcome: 'You have successfully followed the user', code: 1}).send();
    } else { // Already following, so unfollow the user
        myUser.followingUsers.splice(checkFollowing, 1);
        user.followers.splice(user.followers.indexOf(myUser.id), 1)
        myUser.save()
        user.save()
        res.status(200).json({Outcome: 'You have successfully unfollowed the user', code: -1}).send();
    }

})

export default router;