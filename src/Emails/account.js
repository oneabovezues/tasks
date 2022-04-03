const sengridapi = "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"
const sengrid = require('@sendgrid/mail')
const { text } = require('express')
sengrid.setApiKey(sengridapi)


const msg = {
    to:'atharavagarwal11@gmail.com',
    from:'pandoodly@gmail.com',
    subject:'First',
    text:'test'

}

const sendwelcome = async(user)=>{
    console.log('ahhh')
    await sengrid.send({
        to:user.email,
        from:'pandoodly@gmail.com',
        subject:'Welcome to task managar '+ user.name,
        text:'Welcome to sengrid we hope you enjoy your time with us'
    }).then(()=>console.log('test2'))
    console.log('test')
}
const sendcancel = async(user)=>{
    await sengrid.send({
        to:user.email,
        from:'pandoodly@gmail.com',
        subject:'Task manager cancellation confirmation',
        text:"We hope you had a good time"
    })
}


module.exports = {sendwelcome,sendcancel}
