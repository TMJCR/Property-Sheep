const jwt = require('jsonwebtoken');
const Landlord = require('../models/landlord');

const auth = async (req, res, next) => {
  console.log(req.cookies);
  try {
    const token = req.cookies['auth_token'];
    const decoded = jwt.verify(token, 'thisisit');
    const landlord = await Landlord.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!landlord) {
      throw new Error();
    }
    req.token = token;
    req.landlord = landlord;

    next();
  } catch (e) {
    res.status(401).send({ error: 'Please Authenticate' });
  }
};

module.exports = auth;
