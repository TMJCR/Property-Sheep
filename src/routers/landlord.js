const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Landlord = require('../models/landlord');
const auth = require('../middleware/auth');
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Wrong file type uploaded'));
    }
    cb(undefined, true);
  },
});

router.post('/landlords/create', async (req, res) => {
  // split both requests into a landlord, properties and contractors
  const landlord = new Landlord(req.body);

  try {
    await landlord.save();
    const token = await landlord.generateAuthToken();
    res.cookie('auth_token', token);
    res.status(201).redirect('http://localhost:5001/');
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/landlords/me', auth, async (req, res) => {
  // destructure off the properties and contractors
  const { properties, contractors, ...landlords } = req.body;
  const updates = Object.keys(landlords);

  const allowedUpdates = [
    'firstName',
    'lastName',
    'title',
    'mobile',
    'email',
    'houseNumber',
    'address',
    'marketingPreference',
    'additionalServices',
    'ownershipStructures',
    'tenantType',
    'useEmergencyContact',
    'emergencyContact',
    'addContractors',
    'bankName',
    'bankAccountName',
    'bankAccountNumber',
    'bankSortCode',
    'multipleProperties',
    'paymentProcessed',
    'paymentDate',
    'ukResident',
    'nationalInsurance',
    'taxReference',
    'taxOffice',
    'taxOfficePostcode',
    'onboarded',
  ];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.landlord[update] = req.body[update]));
    await req.landlord.save();
    res.send(req.landlord);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/landlords/login', async (req, res) => {
  try {
    const landlord = await Landlord.findByCredentials(req.body.email, req.body.password);
    const token = await landlord.generateAuthToken();
    res.cookie('auth_token', token);
    if (landlord.onboarded) {
      res.redirect('http://localhost:3000/landlords/me');
    } else {
      res.redirect('http://localhost:5001');
    }

    // res.send({ landlord, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/landlords/logout', auth, async (req, res) => {
  try {
    req.landlord.tokens = req.landlord.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.landlord.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/landlords/logoutAll', auth, async (req, res) => {
  try {
    req.landlord.tokens = [];
    await req.landlord.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  '/landlords/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.landlord.avatar = buffer;

    await req.landlord.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete('/landlords/me/avatar', auth, async (req, res) => {
  req.landlord.avatar = undefined;
  await req.landlord.save();
  res.send();
});

router.get('/landlords/me', auth, async (req, res) => {
  res.send(req.landlord);
});

router.delete('/landlords/me', auth, async (req, res) => {
  try {
    await req.landlord.remove();
    res.send(req.landlord);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/landlords/:id/avatar', async (req, res) => {
  try {
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord || !landlord.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(landlord.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
