const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { uploadImage, deleteImages } = require("./AWS/aws.helper");

// ALL USERS ON USER MANAGEMENT PAGE
const users = async (req, res) => {
  var perPage = 8;
  var page = req.params.page || 1;
  console.log(req.query);
  const allusers = await User.findAll({ where: { role: "user" } });
  // SORTING BY NAME
  if (req.query.sortby) {
    console.log("query is", req.query);
    User.findAll({
      limit: perPage * 1,
      offset: (page - 1) * perPage,
      where: { role: "user" },
      order: [["firstName", "ASC"]],
    }).then((response) => {
      var users = [];
      var totalPage = Math.ceil(allusers.length / perPage);
      console.log(totalPage);
      for (i of response) {
        users.push(i.dataValues);
      }
      res.json({
        data: users,
        totalPage: totalPage,
      });
    });
  }
  // SEARCH BY NAME
  else if (req.query.search) {
    User.findAll({
      limit: perPage * 1,
      offset: (page - 1) * perPage,
      where: { role: "user", firstName: req.query.search },
    }).then((response) => {
      console.log(response);
      var users = [];
      var totalPage = Math.ceil(response.length / perPage);
      console.log(totalPage);
      for (i of response) {
        users.push(i.dataValues);
      }
      res.json({
        data: users,
        totalPage: totalPage,
      });
    });
  }
  else {
    User.findAll({
      limit: perPage * 1,
      offset: (page - 1) * perPage,
      where: { role: "user" },
    }).then((response) => {
      var users = [];
      var totalPage = Math.ceil(allusers.length / perPage);
      console.log(totalPage);
      for (i of response) {
        users.push(i.dataValues);
      }
      res.json({
        data: users,
        totalPage: totalPage,
      });
    });
  }
};

// DELETE USERS VIA USER MANAGEMENT PAGE

const deleteUser = async (req, res) => {
  // console.log(req.query)
  if (typeof req.query.id == "string") {
    const user = await User.findOne({ where: { id: req.query.id } });
    const image = user.profileImage;
    await user.destroy();
    if (image) deleteImages(image, null, (obj) => {});
    res.json({
      success: "deleted",
    });
  } else if (typeof req.query.id == "object") {
    for (i of req.query.id) {
      await User.destroy({ where: { id: i } });
    }
    res.json({
      success: "deleted",
    });
  }
};
// GENERATE RANDOM PASSWORD
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

// CREATE NEW USER VIA USER MANAGEMENT PAGE
const newUser = async (req, res) => {
  console.log(req.body);
  var password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  User.create({
    firstName: req.body.firstname.toLowerCase(),
    lastName: req.body.lastname.toLowerCase(),
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    role: req.body.role,
  })
    .then((result) => {
      res.json({
        success: "User Created",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: "Something went wrong",
      });
    });
};

// GET USER DETAILS
const userDetails = async (req, res) => {
  console.log(req.query);
  const details = await User.findOne({ where: { id: req.query.id } });
  //  console.log(details)
  res.json({
    data: details,
  });
};

// EDIT USER DETAILS
const editUser = async (req, res) => {
  if (req.file)
    uploadImage(req.file, "userImages", async (obj) => {
      console.log(obj);
      req.body.profileImage = obj.Data.Key;
      try {
        const user = await User.findOne({ where: { id: req.query.id } });
        const deleteImage = user.profileImage;
        await user.update(req.body);
        if (deleteImage) deleteImages(deleteImage, null, (obj) => {});
        return res.status(200).send("User Updated.");
      } catch (err) {
        console.log(err);
        return res.status(500).send("Something Went Wrong!!!");
      }
    });
  else {
    await User.update(req.body, { where: { id: req.query.id } });
    return res.status(200).send("User Updated.");
  }
};
// const editUser = async (req, res) => {
//     console.log(req.body)
//     var data = req.body
//     if(req.file){
//         const file = req.file.path;
//         const result = await cloudinary.uploader.upload(file)
//         // console.log(result)
//         data["profileImage"] = result.url
//     }
//     console.log(data)
//     if (!(Object.keys(data).length === 0 && data.constructor === Object)) {
//         user.update(req.body, { where: { id: req.query.id } }).then(response => {
//             res.json({
//                 success: "Successfully updated"
//             })
//         })
//     }
// }

const activate = async (req, res) => {
  console.log(req.query);
  for (i of req.query.id) {
    await User.update({ status: true }, { where: { id: i } });
  }
  res.json({
    success: "Status Changed",
  });
};
const deactivate = async (req, res) => {
  console.log(req.query);
  for (i of req.query.id) {
    await User.update({ status: false }, { where: { id: i } });
  }
  res.json({
    success: "Status Changed",
  });
};
module.exports = {
  users: users,
  deleteUser: deleteUser,
  newUser: newUser,
  userDetails: userDetails,
  editUser: editUser,
  deactivate: deactivate,
  activate: activate,
};
