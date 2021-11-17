"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var user = require("../models/User");

var bcrypt = require("bcryptjs");

var nodemailer = require('nodemailer');

var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ceideveloperoc@gmail.com',
    pass: 'bwc@2020'
  }
}); // ALL USERS ON USER MANAGEMENT PAGE

var users = function users(req, res) {
  var perPage, page, allusers;
  return regeneratorRuntime.async(function users$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          perPage = 8;
          page = req.params.page || 1;
          console.log(req.query);
          _context.next = 5;
          return regeneratorRuntime.awrap(user.findAll({
            where: {
              role: 'user'
            }
          }));

        case 5:
          allusers = _context.sent;

          // SORTING BY NAME
          if (req.query.sortby) {
            console.log("query is", req.query);
            user.findAll({
              limit: perPage * 1,
              offset: (page - 1) * perPage,
              where: {
                role: "user"
              },
              order: [['firstName', 'ASC']]
            }).then(function (response) {
              var users = [];
              var totalPage = Math.ceil(allusers.length / perPage);
              console.log(totalPage);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = response[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  i = _step.value;
                  users.push(i.dataValues);
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              res.json({
                data: users,
                totalPage: totalPage
              });
            });
          } // SEARCH BY NAME
          else if (req.query.search) {
              user.findAll({
                limit: perPage * 1,
                offset: (page - 1) * perPage,
                where: {
                  role: "user",
                  firstName: req.query.search
                }
              }).then(function (response) {
                console.log(response);
                var users = [];
                var totalPage = Math.ceil(response.length / perPage);
                console.log(totalPage);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = response[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    i = _step2.value;
                    users.push(i.dataValues);
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                      _iterator2["return"]();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }

                res.json({
                  data: users,
                  totalPage: totalPage
                });
              });
            } // else if(req.query.search && req.query.sortby){
            //     console.log("this one")
            //     user.findAll({
            //         limit: perPage * 1,
            //         offset: (page - 1) * perPage,
            //         where: { role: "user",firstName:req.query.search },
            //         order: [
            //             ['firstName', 'ASC'],
            //         ],
            //     }).then(response => {
            //         console.log(response)
            //         var users = []
            //         var totalPage = Math.ceil(response.length / perPage)
            //         console.log(totalPage)
            //         for (i of response) {
            //             users.push(i.dataValues)
            //         }
            //         res.json({
            //             data: users,
            //             totaPage: totalPage
            //         })
            //     })
            // }
            else {
                user.findAll({
                  limit: perPage * 1,
                  offset: (page - 1) * perPage,
                  where: {
                    role: "user"
                  }
                }).then(function (response) {
                  var users = [];
                  var totalPage = Math.ceil(allusers.length / perPage);
                  console.log(totalPage);
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = response[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      i = _step3.value;
                      users.push(i.dataValues);
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                        _iterator3["return"]();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }

                  res.json({
                    data: users,
                    totalPage: totalPage
                  });
                });
              }

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}; // DELETE USERS VIA USER MANAGEMENT PAGE


var deleteUser = function deleteUser(req, res) {
  var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4;

  return regeneratorRuntime.async(function deleteUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(typeof req.query.id == 'string')) {
            _context2.next = 4;
            break;
          }

          user.destroy({
            where: {
              id: req.query.id
            }
          }).then(function (response) {
            console.log(response);
            res.json({
              success: 'deleted'
            });
          });
          _context2.next = 32;
          break;

        case 4:
          if (!(_typeof(req.query.id) == 'object')) {
            _context2.next = 32;
            break;
          }

          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context2.prev = 8;
          _iterator4 = req.query.id[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context2.next = 17;
            break;
          }

          i = _step4.value;
          _context2.next = 14;
          return regeneratorRuntime.awrap(user.destroy({
            where: {
              id: i
            }
          }));

        case 14:
          _iteratorNormalCompletion4 = true;
          _context2.next = 10;
          break;

        case 17:
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](8);
          _didIteratorError4 = true;
          _iteratorError4 = _context2.t0;

        case 23:
          _context2.prev = 23;
          _context2.prev = 24;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 26:
          _context2.prev = 26;

          if (!_didIteratorError4) {
            _context2.next = 29;
            break;
          }

          throw _iteratorError4;

        case 29:
          return _context2.finish(26);

        case 30:
          return _context2.finish(23);

        case 31:
          res.json({
            success: "deleted"
          });

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 19, 23, 31], [24,, 26, 30]]);
}; // GENERATE RANDOM PASSWORD


function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
} // CREATE NEW USER VIA USER MANAGEMENT PAGE


var newUser = function newUser(req, res) {
  var password, hashedPassword;
  return regeneratorRuntime.async(function newUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(req.body);
          password = generatePassword();
          _context3.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 4:
          hashedPassword = _context3.sent;
          user.create({
            firstName: req.body.firstname.toLowerCase(),
            lastName: req.body.lastname.toLowerCase(),
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role
          }).then(function (result) {
            console.log(result);
            var mailoptions = {
              from: 'ceideveloperoc@gmail.com',
              to: req.body.email,
              subject: "OTP for Application",
              text: "Your user credentials for CEI Application are:\n             email:".concat(req.body.email, "  \n             passwors: ").concat(password)
            };
            mail.sendMail(mailoptions, function (err, result) {
              if (result) {
                res.json({
                  success: "User Created"
                });
              }
            });
          })["catch"](function (err) {
            console.log(err);
            res.json({
              error: "Something went wrong"
            });
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // GET USER DETAILS 


var userDetails = function userDetails(req, res) {
  var details;
  return regeneratorRuntime.async(function userDetails$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(req.query);
          _context4.next = 3;
          return regeneratorRuntime.awrap(user.findOne({
            where: {
              id: req.query.id
            }
          }));

        case 3:
          details = _context4.sent;
          //  console.log(details)
          res.json({
            data: details
          });

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // EDIT USER DETAILS


var editUser = function editUser(req, res) {
  return regeneratorRuntime.async(function editUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(req.body); // console.log(req.query)

          if (!(Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
            user.update(req.body, {
              where: {
                id: req.query.id
              }
            }).then(function (response) {
              res.json({
                success: "Successfully updated"
              });
            });
          }

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  users: users,
  deleteUser: deleteUser,
  newUser: newUser,
  userDetails: userDetails,
  editUser: editUser
};