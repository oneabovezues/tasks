const mongoose  =  require('mongoose')

const validator = require('validator')


const Taskschema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},{
    timestamps:true
})
const Task = mongoose.model('task',Taskschema)

module.exports = Task