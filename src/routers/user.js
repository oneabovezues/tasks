const express = require('express')
const router = new express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwb = require('jsonwebtoken')
const sharp = require('sharp')
const auth = require('../Middleware/Auth')
const { append } = require('express/lib/response')
const multer = require('multer')
const { sendwelcome, sendcancel } = require('../Emails/account')
const { object } = require('sharp/lib/is')
const validator = require('validator')



router.get('/users/me', auth, async(req, res) => {

    try {
        const user = req.user
        res.send(user)

    } catch (e) {

        res.send(e)
    }
})

router.post('/users', async(req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.GenAuthtoken()
        await sendwelcome(user)
        res.send({ user, token })

    } catch (e) {
        if(e.errors){
        const errobj = Object.keys(e.errors)
        const Errortypes = {}
        
        

        errobj.forEach((value)=>{
            
            Errortypes[value] =  e.errors[value].properties.type
        })
        res.status(400).send(Errortypes)
    }else{
        res.status(404).send({email:'Email already in use'})
    }
}
})

router.post('/users/log-in', async(req, res) => {
    
    
    try{
        const user = await User.FindbyCreds(req.body.Email, req.body.password)
        if(!user){
            return res.status(400).send('invalid creds ')
        }
        
        const token = await user.GenAuthtoken()

        res.send({ token, user })
    }catch(e){
        
        
        res.status(400).send(e.message)
    }


})

router.post('/users/log-out-all', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('logged out of all instances')
    } catch (e) {
        res.status(404).send(e)
    }
   
})

router.post('/users/log-out', auth, async(req, res) => {
    const user = req.user
    const authtoken = req.auth

    try {
        user.tokens = user.tokens.filter((token) => {

            const issame = token.token !== authtoken
            return issame

        })

        await user.save()

        res.send(['Succesfully logged out', { user }])
    } catch (e) {
        res.send(e)
    }

})


router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ["name", "age", "email"]
    const validop = updates.every((value) => {
        return allowed.includes(value)
    })
    if (validop === false) {
        return res.status(400).send('Invalid update provided')
    }
    try {

        const user = req.user
        updates.forEach((field) => {
            user[field] = req.body[field]
        })
        await user.save()
        res.send(user)
    } catch (e) {
        res.send(e)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        await sendcancel(req.user)
        res.send(req.user)
    } catch (e) {
        res.send(e)
    }
})

const avatar = new multer({
    limits: {
        fileSize: 50000000,

    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|png)$/)) {
            cb(new Error('Inavlid extension'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async(req, res) => {
    
    
    const buffer = await sharp(req.file.buffer).png().resize(100).toBuffer()
    req.user.avatar = buffer


    await req.user.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    
    req.user.avatar = undefined
    await req.user.save()
    res.send('deleted')
})

router.get('/users/:token/avatar', async(req, res) => {
    try {
        const jwb = require('jsonwebtoken')
        const json = jwb.verify(req.params.token,'houtk')
        console.log(json)


        const user = await User.findById(json.id)
        if (user) {
            if (user.avatar) {
                res.set('Content-Type', 'image/jpg')
                return res.send(user.avatar)
            }
            return res.status(404).send('a')
        }
        res.status(404).send('no user found')
    } catch {

    }
})





module.exports = router