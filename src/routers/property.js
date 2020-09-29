const express = require('express');
const Property = require('../models/properties');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = new express.Router();

router.post('/properties', auth, async (req, res) => {
  console.log(req.body);
  await req.body.forEach(async (prop) => {
    const property = new Property({
      ...prop,
      landlord: req.landlord._id,
    });
    try {
      await property.save();
    } catch (e) {
      res.status(400).send(e);
    }
  });
  res.status(201).send({ Success: 'Property Added' });
});

router.get('/properties', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.landlord
      .populate({
        path: 'properties',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.landlord.properties);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/properties/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const property = await Property.findOne({ _id, landlord: req.landlord._id });
    if (!property) {
      return res.status(404).send();
    }
    res.send(property);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/properties/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['completed', 'description'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Request' });
  }
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.landlord._id,
    });

    if (!property) {
      return res.status(404).send();
    }
    updates.forEach((update) => (property[update] = req.body[update]));
    await property.save();

    res.send(property);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/properties/:id', auth, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      owner: req.landlord._id,
    });
    if (!property) {
      res.status(404).send({ error: 'Not here!' });
    }
    res.send(property);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
