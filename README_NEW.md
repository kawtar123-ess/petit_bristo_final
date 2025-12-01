# petit_bristo_nosql — Gestion avec MongoDB Compass

Application restaurant avec backend Node/Express + MongoDB (Mongoose).

## 🚀 Démarrage Rapide

### 1️⃣ Installation
```bash
npm install
```

### 2️⃣ Créer l'utilisateur administrateur
```bash
npm run init-admin
```
Cela crée un admin avec :
- **Email** : `admin@example.com`
- **Password** : `Admin@123`

### 3️⃣ Ajouter les plats du menu
```bash
npm run seed-menu
```

### 4️⃣ Démarrer le serveur
```bash
npm start
```
L'app sera disponible sur : **http://localhost:4000**

---

## 📊 Gérer les Données avec MongoDB Compass

### Étapes simples :

1. **Téléchargez MongoDB Compass** : https://www.mongodb.com/try/download/compass

2. **Ouvrez Compass** et connectez-vous :
   ```
   mongodb://127.0.0.1:27017
   ```

3. **Accédez à la base "petit_bristo"** et vous verrez 3 collections :
   - **users** — Les administrateurs
   - **reservations** — Les réservations des clients
   - **menuitems** — Les plats du menu

4. **Cliquez sur une collection** pour voir, modifier ou supprimer les données

📖 **Guide détaillé** : Lire `MONGODB_COMPASS_GUIDE.md`

---

## 🔧 Commandes Utiles

```bash
# Afficher les données dans le terminal
npm run view-data

# Ajouter les plats du menu
npm run seed-menu

# Créer un administrateur
npm run init-admin

# Démarrer en mode développement (auto-reload)
npm run dev
```

---

## 📝 Variables d'Environnement

Créez un fichier `.env` :
```env
MONGODB_URI=mongodb://127.0.0.1:27017/petit_bristo
JWT_SECRET=votre-clé-secrète
PORT=4000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

---

## 🔐 Fonctionnalités

✅ **Authentification** — Login avec JWT
✅ **Admin Dashboard** — Gestion des réservations
✅ **Réservations** — Créer, modifier, confirmer, annuler
✅ **Menu** — Affichage dynamique depuis MongoDB
✅ **Navbar Responsive** — Affiche l'utilisateur connecté

---

## 📱 API Endpoints

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/login` | Se connecter |
| GET | `/api/auth/me` | Info utilisateur |
| POST | `/api/reservations` | Créer une réservation |
| GET | `/api/reservations` | Lister (admin only) |
| PATCH | `/api/reservations/:id` | Modifier (admin only) |
| DELETE | `/api/reservations/:id` | Supprimer (admin only) |
| GET | `/api/menu` | Récupérer le menu |

---

**Besoin d'aide ?** Consultez `MONGODB_COMPASS_GUIDE.md`
