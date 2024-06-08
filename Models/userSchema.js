const mongoose =require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username required']
    },
    email:{
        type:String,
        required:[true,'Email required'],
        unique:true,
        validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email")
                }
            }
    },
    password:{
        type:String,
        required:[true,'Password required']
    },
    github:{
        type:String
    },
    linkedin:{
        type:String
    },
    profImg:{
        type:String
    }
})

const users  = mongoose.model('users',userSchema)

module.exports = users 
