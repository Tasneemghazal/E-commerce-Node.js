import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "email alreday exists" });
  }
  const hashedPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALTROUND)
  );
  const createUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });
  return res.status(201).json({ message: "success", user: createUser });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user doesn't exist" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (user.status === "inactive") {
    return res.status(400).json({ message: "user is blocked" });
  }
  if (!match) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const token = jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSIG)

  return res.status(200).json({ message: "success" ,token});
};
