const Booking = require("../../model/booking");
const { transformEvent, transformBooking } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (e) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated");
    }
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      if (fetchedEvent) {
        const booking = new Booking({
          user: req.userId,
          event: args.eventId
        });
        const result = await booking.save();
        return transformBooking(result);
      }
    } catch (e) {
      throw e;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (e) {
      throw e;
    }
  }
};
