const User = require('../models/User');

exports.ifUser = async (req, res, next) => {
    const { email, phoneNumber, bvn } = req.body;
    const user = await User.findOne({ $or : [{ email }, { phoneNumber}, { bvn } ] });
    try {
      if(!user) {
        return res.status(400).json({ success: false, error: 'User not found' });
      } else {
        req.user = user;
        next();
      }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Something strange happened' });
    }
};

exports.notUser = async (req, res, next) => {
    const { email, phoneNumber, bvn } = req.body;
    const user = await User.findOne({ $or : [{ email }, { phoneNumber}, { bvn } ] });
    try {
      if(user) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      } else {
        next();
      }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something strange happened' });
    }
};

exports.isUserVerified = async (req, res, next) => {
    const { email, phoneNumber, bvn } = req.body;
    const user = await User.findOne({ $or : [{ email }, { phoneNumber}, { bvn } ] });
    try {
      if(user) {
        if(user.isVerified) {
            next();
        } else {
            return res.status(403).json({ success: false, error: 'User is not verified' });
        }
      } else {
        return res.status(400).json({ success: false, error: 'User not found' });
      }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something strange happened' });
    }
};
 
// module.exports = userMiddleware;
