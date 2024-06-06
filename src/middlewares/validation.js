import { registerSchema } from "../modules/auth/auth.validation.js"

export const validation = (schema)=>{

    return (req,res,next)=>{
        const errorsMsg=[];
    const {error}= schema.validate(req.body,{abortEarly:false})
    if(error){
        error.details.forEach(err => {
            const key =err.context.key;
            errorsMsg.push({[key]:err.message});
        });
        return res.status(400).json({message:"validation error",errors:errorsMsg})
    }
    next()
    }

}