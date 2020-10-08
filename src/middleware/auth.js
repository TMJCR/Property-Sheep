const jwt = require('jsonwebtoken');
const Landlord = require('../models/landlord');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies['auth_token'];
    const decoded = jwt.verify(token, 'THIS_IS_NOT_FOR_PRODUCTION');
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
