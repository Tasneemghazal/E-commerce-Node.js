import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        min:4,
        max:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
    gender:{
        type:String,
        enum:['male','female']
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    status:{
        type:String,
        default:'active',
        enum:['active','inactive']
    },
    role:{
        type:String,
        default:'user',
        enum:['admin','user'],
    }
},{
    timestamps:true,
});

const userModel = model('User',userSchema);
export default userModel;