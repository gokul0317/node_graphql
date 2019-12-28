const Booking = require("../../model/booking");
const { transformEvent, transformBooking } = require("./merge");
 
module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (e) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      if (fetchedEvent) {
        const booking = new Booking({
          user: "5e05e65f7a9e4d41606d5208",
          event: args.eventId
        });
        const result = await booking.save();
        return transformBooking(result);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  cancelBooking: async args => {
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
