import { registerSchema } from "../modules/auth/auth.validation.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const errorsMsg = [];
    let filterData = {};
    if (req.file) {
      filterData = {
        image: req.file,
        ...req.body,
        ...req.params,
        ...req.query,
      };
    } else if (req.files) {
      filterData = { ...req.files, ...req.body, ...req.params, ...req.query };
    } else {
      filterData = { ...req.body, ...req.params, ...req.query };
    }
    const { error } = schema.validate(filterData, { abortEarly: false });
    if (error) {
      error.details.forEach((err) => {
        const key = err.context.key;
        errorsMsg.push({ [key]: err.message });
      });
      return res
        .status(400)
        .json({ message: "validation error", errors: errorsMsg });
    }
    next();
  };
};
