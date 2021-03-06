import {CommunityPost} from "../models/community_post.js"
import {User} from "../models/user.js";
import {deadToken} from '../models/deadToken.js'
import jwt from 'jsonwebtoken'

  //Assumes user is already logged in, must check first separately
  const isPostOwner = async (req) => {
    const token = req.headers['x-access-token']
    if (deadToken.findOne({token: token}).limit(1).size() == 0){
      return ({status: 400, error: 'invalid token'})
    }
    else {
      try {
        const decoded = jwt.verify(token, 'secret123')
        const username = decoded.username
        const password = decoded.password
        try {
          const user = await User.findOne({ username: username, password: password}) //get user making request
          try {
            const post = await CommunityPost.findById(req.params.id).exec(); //get post from request
            const owner = await User.findById(post.owner).exec();
            if(owner.id === user.id) { //if user is the owner
                return ({status: 200})
            }
            else {
                return ({status: 401, error: 'not owner'})
            }
          } 
          catch (err) {
            return ({status: 400, error: 'post does not exist'})
          }
        } 
        catch (err) { //user doesnt exist
          return ({status: 400, error: 'user does not exist'})
        }
      }
      catch (err) { //jwt error
        return ({status: 400, error: 'error validating token'})
      }
  }
}

export default isPostOwner;