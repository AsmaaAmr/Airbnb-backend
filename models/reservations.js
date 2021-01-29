const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  hostID: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  hostedHomeID: {
    type: Schema.Types.ObjectId,
    ref:"hostedHome",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  no_Of_Guests: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  }
});
const Reservation = mongoose.model("reservation", ReservationSchema);

module.exports = Reservation;
