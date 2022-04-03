const express = require('express')
const jwb = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async(req,res,next)=>{
    try{ 
        const auth = req.header('Authorization').replace('Bearer ','')
        const decoded = jwb.verify(auth,'houtk')
        const user = await User.findOne({_id:decoded.id,'tokens.token':auth})
        if(!user){
            throw new Error()
        }
        req.user = user
        req.auth = auth
        next()
    }catch(e){
        res.status(404).send('Inavlid/empty auth token pls log in')
    }
    
    
}

module.exports = auth