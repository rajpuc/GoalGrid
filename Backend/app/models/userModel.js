import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
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
    profileImageUrl:{
        type:String,
        default:null
    }
},{
    timestamps:true,
    versionKey:false
})

const userModel = mongoose.model('User',userSchema);
export default userModel;