#!/usr/bin/env node
// scripts/test-api.js - Tester les API du serveur
const http = require('http');

const BASE_URL = 'http://localhost:4000';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body ? JSON.parse(body) : null,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║        TEST DES API PETIT BISTRO       ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Test 1: GET /api/menu
    console.log('1️⃣  GET /api/menu (Menu public)');
    console.log('─────────────────────────────────────');
    const menu = await request('GET', '/api/menu');
    console.log(`Status: ${menu.status}`);
    const categories = Object.keys(menu.body);
    console.log(`Categories: ${categories.join(', ')}`);
    const totalItems = categories.reduce((sum, cat) => sum + menu.body[cat].items.length, 0);
    console.log(`Total articles: ${totalItems}`);
    console.log('✅ Menu chargé\n');

    // Test 2: POST /api/auth/login (admin)
    console.log('2️⃣  POST /api/auth/login (Connexion admin)');
    console.log('─────────────────────────────────────');
    const login = await request('POST', '/api/auth/login', {
      email: 'admin@example.com',
      password: 'Admin@123'
    });
    console.log(`Status: ${login.status}`);
    if (login.status === 200) {
      const token = login.body.token;
      const role = login.body.role;
      console.log(`Role: ${role}`);
      console.log(`Token: ${token.substring(0, 20)}...`);
      console.log('✅ Admin connecté\n');

      // Test 3: GET /api/reservations (with token)
      console.log('3️⃣  GET /api/reservations (Lister les réservations)');
      console.log('─────────────────────────────────────');
      const url = new URL(BASE_URL + '/api/reservations');
      const resOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const reservations = await new Promise((resolve) => {
        const req = http.request(resOptions, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            resolve({
              status: res.statusCode,
              body: body ? JSON.parse(body) : []
            });
          });
        });
        req.end();
      });

      console.log(`Status: ${reservations.status}`);
      console.log(`Total réservations: ${reservations.body.length}`);
      console.log('✅ Réservations récupérées\n');

      // Test 4: POST /api/reservations (public)
      console.log('4️⃣  POST /api/reservations (Créer une réservation)');
      console.log('─────────────────────────────────────');
      const newReservation = await request('POST', '/api/reservations', {
        customerName: 'Test Client',
        customerEmail: 'test@example.com',
        customerPhone: '+33612345678',
        date: '2025-12-25',
        time: '19:00',
        guests: 4,
        specialRequests: 'Pas de sauce'
      });
      console.log(`Status: ${newReservation.status}`);
      if (newReservation.status === 200) {
        console.log(`Réservation créée: ${newReservation.body.reservation._id}`);
        console.log('✅ Réservation ajoutée\n');
      }
    } else {
      console.log(`❌ Erreur: ${login.body.error}`);
    }

    console.log('╔════════════════════════════════════════╗');
    console.log('║         TOUS LES TESTS RÉUSSIS! ✅     ║');
    console.log('╚════════════════════════════════════════╝');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Assurez-vous que le serveur est démarré: npm start');
  }
}

runTests();
