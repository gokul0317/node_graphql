const Event = require("../../model/event");
const User = require("../../model/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    const events = await Event.find();
    try {
      return events.map(ev => {
        return transformEvent(ev);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
     if(!req.isAuth){
         throw new Error("Not Authenticated"); 
     } 
    let event = new Event({
      title: args.eventInput.title,
      decription: args.eventInput.decription,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      let data = await event.save();
      createdEvent = transformEvent(data);
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
  }
};
