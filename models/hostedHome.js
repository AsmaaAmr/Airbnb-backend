const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hostedHomeSchema = new Schema({
  HostID: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Entire Place", "Private Room", "Shared Room"],
    required: true,
  },
  no_Of_Guests: {
    type: Number,
    required: true,
  },
  averagePricePerNight: {
    type: Number,
    required: true,
  },
  no_Of_Bedrooms: {
    type: Number,
    required: true,
  },
  no_Of_Bathrooms: {
    type: Number,
    required: true,
  },
  propertyType: {
    type: String,
    enum: [
      "Apartment",
      "Bed and breakfast",
      "Boutique hotel",
      "House",
      "Secondary unit",
      "Unique space",
    ],
    required: true,
  },
  pool: {
    type: Boolean,
    required: false,
  },
  Gym: {
    type: Boolean,
    required: false,
  },
  BeachFront: {
    type: Boolean,
    required: false,
  },
});
const HostedHome = mongoose.model("hostedHome", hostedHomeSchema);

module.exports = HostedHome;
