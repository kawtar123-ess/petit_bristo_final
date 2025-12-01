// scripts/seed-menu.js - Ajoute des plats au menu
require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../server/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petit_bristo';

const menuItems = [
  // Entrées
  { category: 'entrees', name: 'Foie gras mi-cuit aux figues', description: 'Foie gras de canard, compotée de figues, brioche dorée', price: '24€' },
  { category: 'entrees', name: 'Saint-Jacques snackées', description: "Noix de Saint-Jacques, purée de topinambour, caviar d'Aquitaine", price: '28€' },
  { category: 'entrees', name: 'Tartare de thon rouge', description: 'Thon rouge de ligne, avocat, wasabi, sésame noir', price: '22€' },
  
  // Plats
  { category: 'plats', name: 'Bœuf de Kobé grillé', description: 'Filet de bœuf de Kobé, jus au vin rouge, légumes de saison', price: '65€' },
  { category: 'plats', name: 'Homard bleu thermidor', description: 'Homard breton, sauce thermidor, riz pilaf aux herbes', price: '48€' },
  { category: 'plats', name: 'Pigeon en croûte de sel', description: 'Pigeon fermier, croûte aux herbes, jus corsé', price: '42€' },
  
  // Desserts
  { category: 'desserts', name: 'Soufflé au Grand Marnier', description: 'Soufflé chaud, glace vanille Bourbon, tuile aux amandes', price: '16€' },
  { category: 'desserts', name: 'Tarte au chocolat Valrhona', description: 'Chocolat noir 70%, ganache onctueuse, or comestible', price: '14€' },
  
  // Boissons
  { category: 'boissons', name: 'Champagne Dom Pérignon', description: 'Millésime 2012, bulles fines et persistantes', price: '280€' },
  { category: 'boissons', name: 'Bordeaux Pauillac', description: 'Château Lafite Rothschild 2015', price: '450€' }
];

async function seedMenu() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Accept --force or -f to clear collection before inserting
  const force = process.argv.includes('--force') || process.argv.includes('-f');
  if (force) {
    await MenuItem.deleteMany({});
    console.log('⚠️  Collection `menuitems` vidée (--force)');
  }

  const existing = await MenuItem.countDocuments();
  if (existing > 0 && !force) {
    console.log(`${existing} éléments de menu existent déjà. Ajout des nouveaux...`);
  }

  const inserted = await MenuItem.insertMany(menuItems);
  console.log(`✓ ${inserted.length} plats ajoutés au menu`);
  process.exit(0);
}

seedMenu().catch((err) => {
  console.error(err);
  process.exit(1);
});
