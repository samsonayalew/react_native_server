
const User = require("../models/user");
import jwt from "jsonwebtoken";
import {nanoid} from "nanoid";
import {expressjwt} from 'express-jwt';

const { hashPassword, comparePassword } = require("../helpers/auth");
const cloudinary = require('cloudinary').v2;

//configure cloudinary image service
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// sendgrid email service
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

export const signup = async (req, res) => {
  console.log("HIT SIGNUP");
  try {
    // validation
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, "some_secret_letters_numbers", {
        expiresIn: "7d",
      });

      //   console.log(user);
      const { password, ...rest } = user;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, "some_secret_letters_numbers", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({ email });
  console.log("USER ===> ", user);
  if (!user) {
    return res.json({ error: "User not found" });
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  user.save();
  // prepare email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password reset code",
    html: `
      <h4>
      Enter this pin in the app reset the pasword
      </h4>
      <h1>
        PIN: <span style="color:red">${resetCode}</span>
      </h1>
      `
  };
  // send email
  try {
    const data = await sgMail.send(emailData);
    console.log(data);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const requireSignin = expressjwt({
  secret: "some_secret_letters_numbers",
  algorithms: ['HS256']
});


export const uploadImage = async (req, res) => {
  try {
    // console.log('upload image > user id', JSON.stringify(req.user._id));
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: nanoid()
    });
    // console.log('cloudinary ->',result);
    const user = await User.findByIdAndUpdate(req.user._id, {
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      }
    }, { new: true });
    return res.json({
      name: user?.name,
      email: user?.email,
      role: user?.role,
      image: user?.image,
    });
  } catch (e) {
    console.warn('cloudinary ERROR->', e);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (password && password.length < 6) {
      return res.json({
        error: 'Password is required and should minimum 6 characters long',
      });
    } else {
      //update db
      const hashedPassword = await hashPassword(password);
      const user = await User.findByIdAndUpdate(req.user._id, { password: hashedPassword }, { new: true });
      // delete user?.password;
      return res.json(user);
    }
  } catch (e) {

  }
};