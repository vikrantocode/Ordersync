const User = require("../../models/User");

const getUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await User.findOne({ where: { id } });
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something Went Wrong!");
  }
};

module.exports = {
  getUser: getUser,
};
