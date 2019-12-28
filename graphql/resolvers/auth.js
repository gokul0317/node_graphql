const bcrypt = require("bcryptjs");

const User = require("../../model/user");

module.exports = {

  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User Exist Already");
      }

      const hashedPass = await bcrypt.hash(args.userInput.password, 12);
      const userSave = new User({
        email: args.userInput.email,
        password: hashedPass
      });
      const result = await userSave.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};
