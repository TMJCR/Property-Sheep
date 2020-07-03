const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const landlordSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    multipleProperties: {
      type: Boolean,
      default: false,
    },
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
  },
  { timestamps: true }
);

const Landlord = mongoose.model('Landlord', landlordSchema);

module.exports = Landlord;
