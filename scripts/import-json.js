#!/usr/bin/env node
// scripts/import-json.js - Import JSON files back to MongoDB
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const User = require('../server/models/User');
const Reservation = require('../server/models/Reservation');
const MenuItem = require('../server/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petit_bristo';
const EXPORTS_DIR = path.join(__dirname, 'exports');

const modelMap = {
  users: User,
  reservations: Reservation,
  menuitems: MenuItem
};

async function importJson() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✓ Connecté à MongoDB\n');

    // Find the most recent export files
    const files = fs.readdirSync(EXPORTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('manifest'));

    if (jsonFiles.length === 0) {
      console.log('❌ Aucun fichier JSON trouvé dans scripts/exports/');
      console.log('💡 Exécutez d\'abord: npm run export-json\n');
      process.exit(1);
    }

    console.log(`📥 Import des fichiers JSON...\n`);

    let totalImported = 0;

    for (const file of jsonFiles) {
      const filepath = path.join(EXPORTS_DIR, file);
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

      // Determine collection name from filename
      const collectionName = file.split('_')[0]; // 'users', 'reservations', 'menuitems'
      const model = modelMap[collectionName];

      if (!model) {
        console.log(`⚠️  Collection inconnue: ${file} (ignorée)`);
        continue;
      }

      // Option: clear collection before importing (uncomment to enable)
      // await model.deleteMany({});

      const result = await model.insertMany(data, { ordered: false }).catch(err => {
        // Ignore duplicate key errors if documents already exist
        if (err.code === 11000) {
          console.log(`  ⚠️  ${file}: Certains documents existent déjà (skipped duplicates)`);
          return { insertedCount: data.length - err.writeErrors.length };
        }
        throw err;
      });

      const count = result.insertedCount || result.length;
      console.log(`📄 ${file}`);
      console.log(`  ✓ ${count} documents importés\n`);
      totalImported += count;
    }

    console.log(`✅ Import terminé! (${totalImported} documents au total)`);
    console.log('💡 Vérifier avec: npm run view-data\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

importJson();
