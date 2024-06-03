import userModel from "../../../DB/models/user.model.js"

export const getUsers = async(req, res,next) => {
    const users = await userModel.find();
    if(!users){
        return res.status(404).json({message: "No users found"});
    }
    return res.status(200).json({message:"success", users})
}

export const getUserData = async(req, res,next) => {
    const user = await userModel.findById(req.user._id);
    if(!user){
        return res.status(404).json({message: "No user found"});
    }
    return res.status(200).json({message:"success", user})
}