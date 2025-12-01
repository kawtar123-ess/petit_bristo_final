# 🍷 Petit Bistro - Architecture & Workflow

## 📋 Résumé des changements

Le projet a été **nettoyé et réorganisé** pour fonctionner entièrement avec **MongoDB Atlas**.

### ✅ Ce qui fonctionne maintenant

1. **Menu** : Chargé dynamiquement depuis MongoDB (API `/api/menu`)
   - Affiche **uniquement** les articles stockés en base
   - Aucune donnée locale en fallback
   - Groupés par catégorie (entrees, plats, desserts, boissons)

2. **Réservations** : Sauvegardées dans MongoDB (API `/api/reservations`)
   - Les visiteurs créent une réservation via le formulaire
   - Chaque réservation est enregistrée en base
   - Admin voit toutes les réservations (avec JWT authentication)

3. **Admin Dashboard** : Affiche les réservations de la BD
   - Modifier le statut (pending → confirmed → cancelled)
   - Supprimer une réservation
   - Filtrer par date/statut
   - Statistiques en temps réel

## 🗂️ Fichiers supprimés (nettoyage)

Les scripts de test/gestion inutiles ont été supprimés :
- `scripts/test-api.js` ❌
- `scripts/init-admin.js` ❌
- `scripts/view-data.js` ❌
- `scripts/seed-menu.js` ❌
- Ancien exports JSON (tous les fichiers d'export) ❌

## 📁 Structure du projet (après nettoyage)

```
petit_bristo/
├── .env                          # Variables d'environnement (MongoDB URI, JWT Secret)
├── server.js                     # Serveur Express + MongoDB connection
├── check-db.js                   # Vérifier l'état de la base
│
├── server/
│   ├── models/
│   │   ├── MenuItem.js          # Schéma menu (category, name, price, description)
│   │   ├── Reservation.js       # Schéma réservation (customer, date, time, status)
│   │   └── User.js              # Schéma utilisateur (admin/user)
│   └── routes/
│       ├── auth.js              # POST /api/auth/login, GET /api/auth/me
│       ├── menu.js              # GET /api/menu (public), POST /api/menu (admin)
│       └── reservations.js      # CRUD reservations (public POST, admin GET/PATCH/DELETE)
│
├── pages/                         # HTML (navbar, home, menu, reservation, admin, login)
├── pages_js/                      # JS (modular, calls APIs)
│   ├── menu.js                  # Fetch menu from /api/menu (NO local fallback)
│   ├── admin.js                 # Admin dashboard (DB-only)
│   ├── reservation.js           # Reservation form → POST /api/reservations
│   ├── login.js                 # Login → JWT token storage
│   └── navbar.js                # User state display
│
├── scripts/
│   ├── export-json.js           # Export collections to JSON files
│   ├── import-json.js           # Import JSON files to MongoDB
│   └── exports/
│       ├── menuitems_*.json     # Menu snapshots
│       ├── reservations_*.json  # Reservation snapshots
│       └── README.md             # Usage guide
│
├── package.json                  # npm scripts (start, dev, export-json, import-json, check-db)
└── README.md
```

## 🚀 Commandes utiles

### Démarrer le serveur
```bash
npm start                # Mode production
npm run dev             # Mode développement (nodemon)
```

### Vérifier la base
```bash
npm run check-db        # Affiche le nombre d'articles menu + réservations
```

### Exporter/Importer des données
```bash
npm run export-json     # Exporter users, reservations, menuitems → scripts/exports/
npm run import-json     # Réimporter depuis les fichiers JSON
```

## 🔧 Configuration

### .env (crée automatiquement, à mettre à jour)
```env
MONGODB_URI=mongodb+srv://student:mongo123@cluster0.linattv.mongodb.net/petit_bristo?retryWrites=true&w=majority
JWT_SECRET=petit-bristo-secret-key-change-in-production
PORT=4000
```

## 📊 Workflow complet

### 1. **Visiteur consulte le menu**
   - Visite http://localhost:4000
   - Frontend appelle `GET /api/menu`
   - Affiche les 10 articles depuis MongoDB
   - Peut voir les détails de chaque catégorie

### 2. **Visiteur crée une réservation**
   - Remplit le formulaire (nom, email, date, etc.)
   - Frontend appelle `POST /api/reservations`
   - Données sauvegardées dans MongoDB collection `reservations`

### 3. **Admin se connecte**
   - Email: `admin@example.com` (créé lors du premier setup)
   - Frontend appelle `POST /api/auth/login` avec JWT
   - Token stocké dans `localStorage`

### 4. **Admin voit les réservations**
   - Frontend appelle `GET /api/reservations` (avec Bearer token)
   - Récupère TOUTES les réservations de la BD
   - Peut les modifier/supprimer/confirmer

## 🔐 Sécurité

- ✅ Passwords hashés (bcryptjs)
- ✅ JWT authentication (8h expiry)
- ✅ Role-based access (user/admin)
- ✅ MongoDB URI masquée dans les logs
- ⚠️ Changez `JWT_SECRET` en production

## 🛠️ MongoDB Compass (optional)

Pour gérer les données visuellement :

1. Téléchargez: https://www.mongodb.com/try/download/compass
2. Connexion: copiez l'URI depuis `.env` ou collez manuellement
3. Naviguer: base `petit_bristo` → collections `menuitems`, `reservations`, `users`
4. Éditer: double-cliquez un document pour modifier/supprimer

## 📝 Notes finales

- **Pas de données locales hardcodées** : tout vient de MongoDB
- **Frontend allégé** : appels API simples, pas de SDK complexe
- **Scalable** : ajoutez des articles menu → automatiquement affichés partout
- **Sauvegardé** : toutes les réservations dans le cloud (Atlas)

Besoin d'aide ? Exécutez `npm run check-db` pour diagnostiquer.
