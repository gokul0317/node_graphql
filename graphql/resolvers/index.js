const bcrypt = require("bcryptjs");

const Event = require("../../model/event");
const User = require("../../model/user");

const user = async id => {
  const user = await User.findById(id);
  try {
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (e) {
    throw new Error("No user found");
  }
};

const events = async eventIds => {
  const events = await Event.find({ _id: { $in: eventIds } });

  try {
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  } catch (e) {
    throw e;
  }
};

module.exports = {
  events: async () => {
    const events = await Event.find();
    try {
      return events.map(ev => {
        return {
          ...ev._doc,
          _id: ev._doc._id.toString(),
          date: new Date(ev._doc.date).toISOString(),
          creator: user.bind(this, ev._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    let event = new Event({
      title: args.eventInput.title,
      decription: args.eventInput.decription,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5e05e65f7a9e4d41606d5208"
    });
    let createdEvent;
    try {
      let data = await event.save();
      createdEvent = {
        ...data._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, data._doc.creator)
      };
      const userData = await User.findById("5e05e65f7a9e4d41606d5208");
      if (!userData) {
        throw new Error("User Does not exist");
      }
      userData.createdEvents.push(event);
      await userData.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
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
      const  result = await userSave.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};
