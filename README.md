# 🍷 Petit Bistro - MongoDB Atlas Edition

Application web gastronomique avec backend Node.js + Express + MongoDB Atlas.

## 🚀 Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer MongoDB Atlas
Créez un fichier `.env` à la racine (ou utilisez le `.env` existant) :
```
MONGODB_URI=mongodb+srv://student:mongo123@cluster0.linattv.mongodb.net/petit_bristo?retryWrites=true&w=majority
JWT_SECRET=change-this-secret
PORT=4000
```

### 3. Démarrer le serveur
```bash
npm start
```
Visitez `http://localhost:4000`

## 📱 Fonctionnalités

✅ **Menu** - Chargé dynamiquement depuis MongoDB  
✅ **Réservations** - Sauvegardées en base de données  
✅ **Admin Dashboard** - Gérer les réservations en temps réel  
✅ **Authentication** - JWT-based user login  

## 📦 Architecture

```
petit_bristo/
├── server.js              # Serveur Express
├── check-db.js            # Vérifier l'état de MongoDB
├── .env                   # Variables d'environnement
├── server/
│   ├── models/            # Mongoose schemas (MenuItem, Reservation, User)
│   └── routes/            # API endpoints (auth, menu, reservations)
├── pages/                 # HTML pages
├── pages_js/              # Frontend JS (modular)
└── scripts/
    ├── export-json.js     # Exporter collections en JSON
    └── import-json.js     # Importer JSON en MongoDB
```

## 🛠️ Commandes disponibles

```bash
npm start              # Démarrer le serveur
npm run dev           # Démarrer avec nodemon (auto-reload)
npm run check-db      # Vérifier l'état de MongoDB
npm run export-json   # Exporter les données en JSON
npm run import-json   # Importer JSON en MongoDB
```

## 🔑 Credentials par défaut

- **Admin Login**: `admin@example.com` / `Admin@123`
- **Database**: `petit_bristo`
- **Collections**: `users`, `reservations`, `menuitems`

## 📊 API Endpoints

### Public
- `GET /api/menu` - Récupérer le menu (groupé par catégorie)
- `POST /api/reservations` - Créer une réservation

### Admin (authentification JWT requise)
- `POST /api/auth/login` - Connexion admin
- `GET /api/auth/me` - Vérifier la session
- `GET /api/reservations` - Lister toutes les réservations
- `PATCH /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Supprimer une réservation
- `POST /api/menu` - Ajouter un article au menu

## 🗄️ MongoDB Compass (optionnel)

Pour gérer visuellement :
1. Téléchargez [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Collez l'URI depuis `.env`
3. Naviguez vers base `petit_bristo` → collections

## 📝 Notes

- Tous les menus et réservations sont stockés **en base de données**
- Les données sont **persistantes** et sauvegardées sur Atlas
- JWT tokens expirent après 8 heures
- Passwords sont **hashés** avec bcryptjs

## 🔒 Production

Avant de déployer :
1. Changez `JWT_SECRET` par une clé forte
2. Utilisez des identifiants MongoDB sécurisés
3. Restreignez l'accès à votre cluster Atlas (IP whitelist)
4. Déployez sur un service comme Heroku, Railway, ou Render

``` 
