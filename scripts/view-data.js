// scripts/view-data.js - Visualise les données MongoDB dans le terminal
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const User = require(path.join(__dirname, '../server/models/User'));
const Reservation = require(path.join(__dirname, '../server/models/Reservation'));
const MenuItem = require(path.join(__dirname, '../server/models/MenuItem'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petit_bristo';

function maskedUri(uri) {
  try {
    // mask password if present: mongodb[srv]://user:pass@host/...
    return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$2:****@');
  } catch (e) {
    return uri;
  }
}

function extractHost(uri) {
  // try to extract host portion after @ or after //
  const atMatch = uri.match(/@([^\/\?]+)/);
  if (atMatch) return atMatch[1];
  const protoMatch = uri.match(/mongodb(?:\+srv)?:\/\/([^\/\?]+)/);
  return protoMatch ? protoMatch[1] : uri;
}

async function viewData() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✓ Connecté à MongoDB\n');

    console.log('╔════════════════════════════════════════╗');
    console.log('║          PETIT BISTRO DATABASE         ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Users
    console.log('👤 UTILISATEURS');
    console.log('─────────────────────────────────────────');
    const users = await User.find();
    console.log(`Total: ${users.length}\n`);
    if (users.length === 0) {
      console.log('  (Aucun utilisateur trouvé)');
    } else {
      users.forEach((u) => {
        const role = u.role === 'admin' ? '👑' : '👥';
        console.log(`  ${role} ${u.email} (${u.role})`);
        console.log(`     ID: ${u._id}`);
      });
    }

    // Reservations
    console.log('\n📅 RÉSERVATIONS');
    console.log('─────────────────────────────────────────');
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    console.log(`Total: ${reservations.length}\n`);
    if (reservations.length === 0) {
      console.log('  (Aucune réservation trouvée)');
    } else {
      reservations.forEach((r, i) => {
        const statusIcon = r.status === 'confirmed' ? '✓' : r.status === 'pending' ? '⏳' : '✗';
        console.log(`  ${i + 1}. ${statusIcon} ${r.customerName}`);
        console.log(`     📅 ${r.date} à ${r.time} | 👥 ${r.guests} personne(s)`);
        console.log(`     📧 ${r.customerEmail} | 📞 ${r.customerPhone}`);
        console.log(`     Status: ${r.status}`);
        if (r.specialRequests) console.log(`     💬 Demandes: ${r.specialRequests}`);
        console.log('');
      });
    }

    // Menu
    console.log('\n🍽️  MENU');
    console.log('─────────────────────────────────────────');
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    console.log(`Total d'articles: ${items.length}\n`);
    
    if (items.length === 0) {
      console.log('  (Aucun article du menu trouvé)');
      console.log('\n  💡 Exécutez: npm run seed-menu');
    } else {
      const grouped = {};
      items.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      Object.entries(grouped).forEach(([cat, items]) => {
        console.log(`  📌 ${cat.toUpperCase()}`);
        items.forEach((item) => {
          console.log(`     • ${item.name} ... ${item.price}`);
          console.log(`       ${item.description}`);
        });
        console.log('');
      });
    }

    console.log('╔════════════════════════════════════════╗');
    console.log('║      Gérer via MongoDB Compass         ║');
    const display = maskedUri(MONGODB_URI);
    const host = extractHost(MONGODB_URI);
    const srv = MONGODB_URI.startsWith('mongodb+srv://') ? ' (SRV / Atlas)' : '';
    console.log(`║    ${display}`);
    console.log(`║    hôte: ${host}${srv}`);
    console.log('╚════════════════════════════════════════╝\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

viewData();
