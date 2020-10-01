const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./properties');
const landlordSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: 'User',
      trim: true,
    },
    lastName: {
      type: String,
      default: 'User',
      trim: true,
    },
    title: {
      type: String,
    },
    mobile: {
      type: Number,
      trim: true,
    },
    houseNumber: {},
    address: {},
    password: {
      type: String,
      trim: true,
      minlength: [7, 'Please add at least 7 characters'],
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password must not contain the word password');
        }
        //   if (!validator.isLength(value, { min: 7 })) {
        //     throw new Error('Password must be longer than 6 characters');
        //   }
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    marketingPreference: {
      type: String,
    },
    additionalServices: {},
    ownershipStructures: {},
    tenantType: {},
    useEmergencyContact: {},
    emergencyContact: {},
    addContractors: {},
    bankName: { type: String },
    bankAccountName: { type: String },
    bankAccountNumber: { type: Number },
    bankSortCode: {},
    multipleProperties: {},
    paymentProcessed: { type: String },
    paymentDate: {},
    ukResident: {},
    nationalInsurance: {},
    taxReference: {},
    taxOffice: {},
    taxOfficePostcode: {},
    onboarded: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

landlordSchema.virtual('properties', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'landlord',
});

landlordSchema.virtual('contractors', {
  ref: 'Contractor',
  localField: '_id',
  foreignField: 'landlord',
});

landlordSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

landlordSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisisit', { expiresIn: '30 minutes' });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

landlordSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hash the plain text password before saving
landlordSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

landlordSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});
const User = mongoose.model('User', landlordSchema);

module.exports = User;
