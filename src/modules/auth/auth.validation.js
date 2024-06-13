import Joi from 'joi'

 export const registerSchema =Joi.object({
    userName: Joi.string().min(4).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/),
    
});
export const loginSchema =Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/),
    
});

export const sendCodeSchema =Joi.object({
    email:Joi.string().email().required(),
});

export const forgetSchema =Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/),
    code:Joi.string().length(4)
});