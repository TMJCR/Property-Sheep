const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const contractorSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyTrade: {
      type: String,
      required: true,
    },
    contractorName: {
      type: String,
    },
    companyPostcode: {},
    companyPhone: {},
    associatedProperty: {},
    companyReference: {},
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Landlord',
    },
  },
  { timestamps: true }
);

const Contractor = mongoose.model('Contractor', contractorSchema);

module.exports = Contractor;
