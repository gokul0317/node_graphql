const User = require("../../model/user");
const Event = require("../../model/event");
const { dateToString } = require("../helper/helper");
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

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (e) {
    throw e;
  }
};

const events = async eventIds => {
  const events = await Event.find({ _id: { $in: eventIds } });

  try {
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (e) {
    throw e;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

//   exports.user = user;
//   exports.events = events;
//   exports.singleEvent = singleEvent;
