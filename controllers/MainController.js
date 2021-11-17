const db = require("../config/database");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const cloudinary = require("cloudinary");
const { OAuth2Client } = require("google-auth-library");
const { uploadImage } = require("./AWS/aws.helper");
const client = new OAuth2Client(
  "501516992284-icth2bhte5iu6fpskcd97hcia62f9qdd.apps.googleusercontent.com"
);

// EMAIL CONFIGURATIONS
var mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ceideveloperoc@gmail.com",
    pass: "bwc@2020",
  },
});
// SIGN UP API
const signup = async (req, res) => {
  console.log(req.body);
  const isEmail = await User.findOne({ where: { email: req.body.email } });
  console.log(isEmail);
  // IF EMAIL EXISTS
  if (isEmail) {
    res.json({
      error: "User with this email exist",
    });
  } else {
    // HASHING THE PASSWORD
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    // DATA SAVED TO DB
    User.create({
      firstName: req.body.firstName.toLowerCase(),
      lastName: req.body.lastName.toLowerCase(),
      email: req.body.email,
      password: hashedPassword,
    })
      .then((result) => {
        // var user = {id:result.dataValues.id}
        // console.log(user);
        // const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({
          success: "Successfully registered! you can login now",
          data: result.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// LOGIN API
const login = async (req, res) => {
  console.log(req.body);
  User.findOne({ where: { email: req.body.email } }).then(async (data) => {
    if (data) {
      if (data.dataValues.status) {
        const user = { id: data.dataValues.id, role: data.dataValues.role };
        bcrypt.compare(
          req.body.password,
          data.dataValues.password,
          (err, result) => {
            if (result) {
              console.log(user);
              const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
              console.log(data);
              res.status(200).json({
                user: data.dataValues,
                token: token,
                success: "successful Login",
              });
            } else {
              res.json({
                error: "Incorrect email or password",
              });
            }
          }
        );
      } else {
        res.json({
          error: "You account is Deactivated, please contact admin",
        });
      }
    } else {
      res.json({
        error: "Incorrect email or password",
      });
    }
  });
};
// FUNCTION TO CREATE RANDOM OTP
var generateOTP = () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
// TO GET THE EXPIRY TIME
var d1 = new Date(),
  d2 = new Date(d1);
d2.setMinutes(d1.getMinutes() + 2);
console.log(d1.getTime());
console.log(d2.getTime());
// SEND OTP
const sendOTP = async (req, res) => {
  console.log(req.body);
  const email = await User.findOne({ where: { email: req.body.email } });
  // IF EMAIL EXISTS, OTP SENT THROUGH EMAIL
  if (email) {
    console.log("email", email);
    const OTP = generateOTP();
    console.log(OTP);
    var mailoptions = {
      from: "ceideveloperoc@gmail.com",
      to: req.body.email,
      subject: `OTP for Application`,
      text: `Your OTP for Application is ${OTP}`,
    };
    mail.sendMail(mailoptions, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.status(200).json({
          email: req.body.email,
          otp: OTP,
          success: "OTP is sent successfully, OTP will expire in 10 minutes",
          expiration: d2.getTime(),
        });
      }
    });
  }
  // EMAIL DOESN'T EXISTS
  else {
    res.json({
      error: "No user found",
    });
  }
};
// CHANGE PASSWORD
const changePassword = async (req, res) => {
  console.log(req.body);
  const userData = await User.findOne({ where: { email: req.body.email } });
  const password = await bcrypt.compare(
    req.body.password,
    userData.dataValues.password
  );
  // IF PASSWORD MATCHES OLD PASSWORD, ERROR
  if (password) {
    res.json({
      error: "Password same as old password",
    });
  }
  // NEW PASSWORD, UPDATE
  else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.update(
      { password: hashedPassword },
      { where: { email: req.body.email } }
    )
      .then((result) => {
        console.log("Updated");
        console.log(result);
        res.status(200).json({
          success: "Password successfully updated!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          error: "Error updating password!",
        });
      });
  }
};

const authentication = (token) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.json({ error: "Did not match" });
    }
    res.json({
      success: "verified",
      data: req.user,
    });
  });
};
// CHECKING THE AUTHENTICATION AT THE DASHBOARD FOR AUTHENTICATED USER
const dashboard = (req, res) => {
  console.log(req.headers.token);
  jwt.verify(
    req.headers.token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        res.json({ error: "Did not match" });
      } else {
        console.log("success");
        res.json({
          success: "verified",
          data: req.user,
        });
      }
    }
  );
};
// LOGIN VIA GOOGLE
const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log(tokenId);
  // VERIFYING THE TOKEN RECEIVED BY GOOGLE
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "501516992284-p5ndrh0l2dfr2umcs904uk92vg488vb3.apps.googleusercontent.com",
    })
    .then(async (response) => {
      const { email_verified, name, email } = response.payload;
      console.log(email);
      // console.log(response.payload);
      // IF VERIFIED
      if (email_verified) {
        // CHECK IF ALREADY EXISTS
        const userData = await User.findOne({ where: { email: email } });
        console.log(userData);
        // IF EXISTS, TOKEN IS ALOTTED
        if (userData) {
          const token = jwt.sign(
            { id: userData.dataValues.id },
            process.env.ACCESS_TOKEN_SECRET
          );
          res.status(200).json({
            user: userData.dataValues,
            token: token,
            success: "successful Login",
          });
        }
        // IF NOT IN DB, USER IS CREATED WITH DUMMY PASSWORD AND TOKEN IS ALLOTED
        // OTHER DETAILS CAN BE EDITED AND ADDED IN PROFILE MANAGEMENT
        else {
          User.create({
            firstName: name.split(" ")[0].toLowerCase(),
            lastName: name.split(" ")[1].toLowerCase(),
            email: email,
            password: email + process.env.PASSWORD,
          }).then((err, data) => {
            if (err) {
              res.status(400).json({
                error: "Something went wrong",
              });
            } else {
              const token = jwt.sign(
                { id: data.dataValues.id },
                process.env.ACCESS_TOKEN_SECRET
              );
              res.status(200).json({
                user: data.dataValues,
                token: token,
                success: "successful Login",
              });
            }
          });
        }
      }
    });
};

const facebooklogin = (req, res) => {
  console.log(req.body);
  const { userID, accessToken } = req.body;
  let urlGraphfacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphfacebook, {
    method: "GET",
  })
    .then((res) => res.json())
    .then(async (response) => {
      const { email, name } = response;
      console.log(name, email);
      const userData = await User.findOne({ where: { email: email } });
      console.log(userData);
      // IF EXISTS, TOKEN IS ALOTTED
      if (userData) {
        const token = jwt.sign(
          { id: userData.dataValues.id },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
          user: userData.dataValues,
          token: token,
          success: "successful Login",
        });
      }
      // IF NOT IN DB, USER IS CREATED WITH DUMMY PASSWORD AND TOKEN IS ALLOTED
      // OTHER DETAILS CAN BE EDITED AND ADDED IN PROFILE MANAGEMENT
      else {
        User.create({
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1],
          email: email,
          password: email + process.env.ACCESS_TOKEN_SECRET,
        }).then((err, data) => {
          if (err) {
            res.status(400).json({
              error: "Something went wrong",
            });
          } else {
            const token = jwt.sign(
              { id: data.dataValues.id },
              process.env.ACCESS_TOKEN_SECRET
            );
            res.status(200).json({
              user: data.dataValues,
              token: token,
              success: "successful Login",
            });
          }
        });
      }
    });
};

// GET USERDATA

const userData = (req, res) => {
  console.log(req.query);
  User.findOne({ where: { id: req.query.id } }).then((response) => {
    res.json({
      data: response.dataValues,
    });
  });
};

// EDIT PROFILE

const editprofile = async (req, res) => {
  //console.log(req.file)
  var data = req.body;
  if (data["password"]) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data["password"] = hashedPassword;
  }
  if (req.file) {
    uploadImage(req.file, "userImages", async (obj) => {
      console.log(obj);
      data.profileImage = obj.Data.Key;
      try {
        const user = await User.findOne({ where: { id: req.query.id } });
        const deleteImage = user.profileImage;
        await user.update(req.body);
        if (deleteImage) deleteImages(deleteImage, null, (obj) => {});
        await User.update(data, { where: { id: req.query.id } });
        const userData = await User.findOne({ where: { id: req.query.id } });
        return res
          .status(200)
          .json({ success: "Profile Updated.", data: userData });
      } catch (err) {
        console.log(err);
        return res.status(500).send("Something Went Wrong!!!");
      }
    });
  } else {
    await User.update(data, { where: { id: req.query.id } });
    const userData = await User.findOne({ where: { id: req.query.id } });
    res.status(200).json({
      success: "Profile Updated.",
      data: userData,
    });
  }
};

module.exports = {
  signup: signup,
  login: login,
  sendOTP: sendOTP,
  changePassword: changePassword,
  dashboard: dashboard,
  googleLogin: googleLogin,
  facebooklogin: facebooklogin,
  editprofile: editprofile,
  userData: userData,
};
