
const mongoose  =  require('mongoose')
const bcrypt = require('bcrypt')
const jwb = require('jsonwebtoken')
const Useschema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    age:{
        type:Number,
        required: true,
        validate(value){
            if(value < 0 ){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email:{
        required:true,
        type:String,
        unique:true,
        validate(value){
            if(validator.isEmail(value)){

            }
            else {
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        required:true,
        type:String,
        trim:true,
        minLength: 6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot be password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
        
    }],
    avatar:{
        type:Buffer
    }
    
},{
    timestamps:true
})

Useschema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})

Useschema.statics.FindbyCreds = async (email,pass)=>{
    
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Invalid creds')
    }
    const isvalid = await bcrypt.compare(pass,user.password)
    if(isvalid === false){
        throw new Error('Invalid creds')
    }
    return user
}

Useschema.methods.GenAuthtoken = async function(){
    const user = this
    const token = jwb.sign({id:user.id},'houtk')
    user.tokens = user.tokens.concat({token})
    
    await user.save()
    return token
}

Useschema.methods.toJSON =function(){
    const userobject = this 
    const user = userobject.toObject()
    delete user.password
    delete user.tokens
    delete user.avatar
    

    return user
}

//hash pass before saving 
Useschema.pre('save',async function(next){
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,8)
    }
    
})
var validator = require('validator')

const Task = require('./task')
const User = mongoose.model('User',Useschema)

module.exports = User