const bcrypt = require("bcryptjs");

const User = require("../../model/user");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User Exist Already");
      }
      const salt = await bcrypt.genSalt(10);  
      const hashedPass = await bcrypt.hash(args.userInput.password, salt);
      const userSave = new User({
        email: args.userInput.email,
        password: hashedPass
      });
      const result = await userSave.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User Does Not Exist");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password Is Not Correct");
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      "someSuperSecretKey",
      { expiresIn: "1h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
