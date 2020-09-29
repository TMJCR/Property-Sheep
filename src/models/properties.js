const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {},
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Landlord',
    },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
