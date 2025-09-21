import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"; //used to share information between client and server safely
import bcrypt from "bcrypt"; //It’s used to securely store passwords in databases
import validator from "validator"; //used for validating and sanitizing strings in Node.js.

//login user
const loginUser = async (req, res) => {
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});

        //if no user exists:
        if(!user){
            return res.json({success:false,message:"User doesnot exist"});
            
        }
        const isMatch=await bcrypt.compare(password, user.password); //comparing user entered pswrd, pswrd exists with username in db

        //if pswrd is not matching:
        if(!isMatch){
            return res.json({success:false, message: "Invalid credentials"});
        }
        const token=createToken(user._id); //token will be created, as token is created for every login of user
        res.json({success:true,token});

    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
};


//create token
//A token is just a string of characters that is given to a user after they log in.
//Instead of sending your username & password every time you make a request to the server
//(which is unsafe), you send this token.

//jwt.sign(payload, secret) from jwt
//Payload: some data you want to store in the token (here it’s { id }).
//Secret key: a private key (process.env.JWT_SECRET) used to sign the token.
// This ensures nobody else can create fake tokens without knowing the secret.

//use: Every time the user makes a request (say, accessing profile info), they send this token.
//On your server, you use jwt.verify(token, JWT_SECRET) to check:
//If the token is valid (not tampered with).
//If it was created with your secret key.
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //checks if email already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //validating email format and strong password
    if (!validator.isEmail(email)) {
      //if email is not valid(using validator)
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    //hashing user password

    //If two people use the same password "12345",
    // without salt → their hash will look exactly the same.
    //With salt → bcrypt adds a random string, so the hashes look different.
    const salt = await bcrypt.genSalt(10); //create random salt, means bcrypt will repeat the hashing process 2¹⁰ = 1024 times, makes it strong
    const hashedPassword = await bcrypt.hash(password, salt); //mixes "12345" + salt, then locks it.

    const newUser = new userModel({
      name: name, //from req body
      email: email, //from req body
      password: hashedPassword,
    });

    const user = await newUser.save(); //save user to db
    const token = createToken(user._id); //token will be created here for the user
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
