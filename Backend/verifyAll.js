const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const result = await User.updateMany({ isVerified: false }, { isVerified: true });
    console.log(`Updated ${result.modifiedCount} users to verified status.`);
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
