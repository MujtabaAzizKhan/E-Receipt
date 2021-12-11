var config = require('config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require('./user_model')
const JWT_SECRET = 'key';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////        USERPROFILE           ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @route   POST routes/userprofile/user/loginuser
 * @desc    Login user
 * @access  Public
 */

exports.userLogin = (async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) throw Error('User Does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '8760d' });
    if (!token) throw Error('Couldnt sign the token');

    res.status(200).json({
        token,
        user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        cnic: user.cnic,
        phone_number: user.phone_number,
        email: user.email,
      }
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST routes/userprofile/user/registeruser
 * @desc    Register new user
 * @access  Public
 */

exports.userRegister = (async (req, res) => {
  const { first_name, last_name, cnic, phone_number, email, password } = req.body;

  // Simple validation
  if ( !first_name || !last_name || !cnic || !phone_number || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user= await User.findOne({ email });
    if (user) throw Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({
      first_name,
      last_name,
      cnic,
      phone_number,
      email,
      password: hash
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({
        first_name,
        last_name,
        cnic,
        phone_number,
        email,
        password
    },
    {
      expiresIn:'15m'
    }
    ); 
    
    res.status(200).json({
      token,
      user: {
      _id: savedUser.id,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      cnic: savedUser.cnic,
      phone_number: savedUser.phone_number,
      email: savedUser.email,
    }
  });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

