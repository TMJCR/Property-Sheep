const express = require('express');
const Contractor = require('../models/contractors');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = new express.Router();

router.post('/contractors', auth, async (req, res) => {
  await req.body.forEach(async (contract) => {
    const contractor = new Contractor({
      ...contract,
      landlord: req.landlord._id,
    });
    try {
      await contractor.save();
    } catch (e) {
      res.status(400).send(e);
    }
  });
  res.status(201).send({ Success: 'Contractor Added' });
});

router.get('/contractors', auth, async (req, res) => {
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
        path: 'contractors',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.landlord.contractors);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/contractors/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const contractor = await Contractor.findOne({ _id, landlord: req.landlord._id });
    if (!contractor) {
      return res.status(404).send();
    }
    res.send(contractor);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/contractors/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['completed', 'description'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Request' });
  }
  try {
    const contractor = await Contractor.findOne({
      _id: req.params.id,
      owner: req.landlord._id,
    });

    if (!contractor) {
      return res.status(404).send();
    }
    updates.forEach((update) => (contractor[update] = req.body[update]));
    await contractor.save();

    res.send(contractor);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/contractors/:id', auth, async (req, res) => {
  try {
    const contractor = await Contractor.findOneAndDelete({
      _id: req.params.id,
      owner: req.landlord._id,
    });
    if (!contractor) {
      res.status(404).send({ error: 'Not here!' });
    }
    res.send(contractor);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
