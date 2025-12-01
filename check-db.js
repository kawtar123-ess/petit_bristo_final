#!/usr/bin/env node
// Check MongoDB collections status
require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./server/models/MenuItem');
const Reservation = require('./server/models/Reservation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petit_bristo';

async function checkDB() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✓ Connecté\n');

    const menuCount = await MenuItem.countDocuments();
    const reservationCount = await Reservation.countDocuments();

    console.log('📊 Statistiques de la base:');
    console.log(`   🍽️  Menu: ${menuCount} articles`);
    console.log(`   📅 Réservations: ${reservationCount}\n`);

    if (menuCount > 0) {
      const sample = await MenuItem.findOne().lean();
      console.log('✅ Menu chargé depuis MongoDB');
      console.log(`   Exemple: ${sample.name} (${sample.category})\n`);
    } else {
      console.log('⚠️  Le menu est vide. Exécutez: npm run seed-menu\n');
    }

    console.log('✅ Système prêt!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

checkDB();
