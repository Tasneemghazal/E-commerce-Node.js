import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/email.js";
import { customAlphabet, nanoid } from "nanoid";
import { emailTemplate } from "../../utils/emailTemplate.js";
import xlsx from 'xlsx';
export const register = async (req, res, next) => {
  const { userName, email, password ,phone,address} = req.body;
  const hashedPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALTROUND)
  );
  const createUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    phone,
    address
  });
  const token = jwt.sign({email},process.env.CONFIRM_EMAILTOKEN)
  await sendEmail(email, "welcome",userName,token);
  return res.status(201).json({ message: "success", user: createUser });
};

export const addUserExcel = async(req, res)=> {
  const workbook = xlsx.readFile(req.file.path);
  const worksheet = workbook.Sheets [workbook.SheetNames[0]];
  const users = xlsx.utils.sheet_to_json(worksheet);
  await userModel.insertMany(users);
  return res.json({message:"success"});
}
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

  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGINSIG
  );

  return res.status(200).json({ message: "success", token });
};

export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  const code = customAlphabet("1234567890abcdef", 4)();
  const user = await userModel.findOneAndUpdate(
    { email },
    { sendCode: code },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await sendEmail(email, "resetpassword", `<h2>code is ${code}</h2>`);
  return res.status(200).json({ message: "success" });
};

export const forgetPassword = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "email not found" });
  }
  if (user.sendCode != code) {
    return res.status(400).json({ message: "invalid code" });
  }
  user.password = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
  user.sendCode=null;
  await user.save();
  return res.status(200).json({ message: "success" });
};

export const confirmEmail = async(req, res)=>{
  const token = req.params.token;
  const decoded = jwt.verify (token, process.env.CONFIRM_EMAILTOKEN);
  await userModel.findOneAndUpdate({email:decoded.email}, {confirmEmail:true});
  return res.status(200).json({message:"success"});
  }
