import mongoose, { Schema, model } from 'mongoose';

const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        min:4,
        max:20,
    },
    image:{
        type:Object,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:'active',
        enum:['active','inactive']
    },
    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},

},{
    timestamps:true,
});

const categoryModel = model('Category',categorySchema);
export default categoryModel;