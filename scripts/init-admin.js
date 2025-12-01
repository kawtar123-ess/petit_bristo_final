// scripts/init-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../server/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petit_bristo';

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  let user = await User.findOne({ email: adminEmail });
  if (user) {
    console.log('Admin already exists:', adminEmail);
    process.exit(0);
  }

  const hash = await bcrypt.hash(adminPassword, 10);
  user = new User({ email: adminEmail, passwordHash: hash, role: 'admin' });
  await user.save();
  console.log('Created admin:', adminEmail, 'with password:', adminPassword);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
