#!/usr/bin/env node
// scripts/export-json.js - Export all collections to JSON files
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const User = require('../server/models/User');
const Reservation = require('../server/models/Reservation');
const MenuItem = require('../server/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petit_bristo';
const EXPORTS_DIR = path.join(__dirname, 'exports');

// Ensure exports directory exists
if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

async function exportCollections() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✓ Connecté à MongoDB\n');

    const collections = [
      { model: User, name: 'users', label: '👤 Utilisateurs' },
      { model: Reservation, name: 'reservations', label: '📅 Réservations' },
      { model: MenuItem, name: 'menuitems', label: '🍽️  Menu' }
    ];

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const exportedFiles = [];

    console.log('📤 Export des collections en JSON...\n');

    for (const { model, name, label } of collections) {
      const documents = await model.find({}).lean();
      const filename = `${name}_${timestamp}.json`;
      const filepath = path.join(EXPORTS_DIR, filename);

      fs.writeFileSync(filepath, JSON.stringify(documents, null, 2), 'utf8');
      console.log(`${label}`);
      console.log(`  📄 ${filename} (${documents.length} documents)`);
      exportedFiles.push(filename);
    }

    // Create a manifest file
    const manifest = {
      exportedAt: new Date().toISOString(),
      mongodbUri: MONGODB_URI.replace(/:\w+@/, ':****@'), // mask password
      collections: collections.map(c => ({
        name: c.name,
        file: `${c.name}_${timestamp}.json`
      })),
      note: 'These JSON files are snapshots of MongoDB collections. Use import-json.js to reimport or process them.',
      usage: {
        import: 'npm run import-json',
        view: 'cat scripts/exports/<filename>',
        mongoimport: `mongoimport --uri="${MONGODB_URI}" --collection=<name> --file=scripts/exports/<filename> --jsonArray`
      }
    };

    const manifestPath = path.join(EXPORTS_DIR, `manifest_${timestamp}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`\n📋 Manifest créé: manifest_${timestamp}.json`);

    console.log('\n✅ Export terminé!');
    console.log(`📁 Tous les fichiers sont dans: ${EXPORTS_DIR}\n`);
    console.log('💡 Prochaines étapes:');
    console.log('  • Visualiser: cat scripts/exports/<filename>');
    console.log('  • Réimporter: npm run import-json');
    console.log('  • MongoDB Compass: New Connection → paste URI → Connect → View Collections\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

exportCollections();
