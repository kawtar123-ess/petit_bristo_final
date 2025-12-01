# Gestion et Visualisation de MongoDB pour Petit Bistro

## 1. Installation de MongoDB Compass (GUI)

**MongoDB Compass** est l'outil graphique officiel pour gérer MongoDB.

### Téléchargement
- Allez sur : https://www.mongodb.com/try/download/compass
- Téléchargez la version Windows
- Installez-la

### Connexion dans Compass
1. Ouvrez **MongoDB Compass**
2. Dans le champ "Connection String", entrez :
   ```
   mongodb://127.0.0.1:27017
   ```
3. Cliquez sur **Connect**

## 2. Visualiser les Collections

Une fois connecté à Compass :

1. **Accédez la base de données** : `petit_bristo` (elle s'affichera si vous avez exécuté `npm run init-admin`)
2. **Cliquez sur une collection** (Users, Reservations, MenuItems)
3. Vous verrez tous les documents en format JSON

### Collections dans Petit Bistro

- **users** — Les utilisateurs (admin@example.com, etc.)
- **reservations** — Les réservations de clients
- **menuitems** — Les plats du menu

## 3. Commandes MongoDB Shell (mongosh)

Si vous avez MongoDB installé localement, vous pouvez aussi utiliser le terminal :

### Connexion
```bash
mongosh
```

### Commandes de base

```javascript
// Afficher toutes les bases de données
show databases

// Sélectionner une base
use petit_bristo

// Afficher les collections
show collections

// Lister les utilisateurs
db.users.find().pretty()

// Lister les réservations
db.reservations.find().pretty()

// Lister le menu
db.menuitems.find().pretty()

// Compter les réservations
db.reservations.countDocuments()

// Trouver une réservation par email
db.reservations.findOne({ customerEmail: "client@example.com" })

// Supprimer toutes les réservations
db.reservations.deleteMany({})

// Supprimer la base de données entière
db.dropDatabase()
```

## 4. Visualiser les Données via l'API REST

Vous pouvez aussi interroger votre serveur Express directement :

### Récupérer le menu
```bash
curl http://localhost:4000/api/menu
```

Réponse :
```json
{
  "entrees": {
    "title": "Entrées Raffinées",
    "items": [...]
  }
}
```

### Se connecter (récupérer un token)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

Réponse :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "email": "admin@example.com"
}
```

### Récupérer les réservations (avec token)
```bash
curl http://localhost:4000/api/reservations \
  -H "Authorization: Bearer <VOTRE_TOKEN_ICI>"
```

## 5. Ajouter des Données Manuellement via Compass

1. Dans Compass, ouvrez la collection **menuitems**
2. Cliquez sur **+ INSERT DOCUMENT**
3. Remplissez le JSON :
   ```json
   {
     "category": "entrees",
     "name": "Salade Niçoise",
     "description": "Salade fraîche avec tomates, œufs et anchois",
     "price": "12€"
   }
   ```
4. Cliquez sur **Insert**

## 6. Supprimer les Données de Test

### Via Compass
1. Sélectionnez une collection
2. Cochez les documents que vous voulez supprimer
3. Cliquez sur **Delete**

### Via Shell
```javascript
use petit_bristo
db.reservations.deleteMany({})  // Vide toutes les réservations
db.menuitems.deleteMany({})     // Vide tous les plats
```

## 7. Exporter/Importer les Données

### Exporter (shell)
```bash
mongoexport --db petit_bristo --collection reservations --out reservations.json
```

### Importer (shell)
```bash
mongoimport --db petit_bristo --collection reservations --file reservations.json
```

## 8. Vérifier la Connexion dans votre Code

Votre serveur Express se connecte automatiquement à MongoDB au démarrage.
Regardez le terminal lors du `npm start` :

```
Server listening on http://localhost:4000
MongoDB connected
```

Si vous voyez **"MongoDB connected"**, tout fonctionne !

## 9. Changer la Connexion MongoDB

Si vous avez une instance MongoDB distante (Atlas, etc.), modifiez le fichier `.env` :

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/petit_bristo
JWT_SECRET=votre-secret
PORT=4000
```

## Résumé rapide

| Action | Méthode |
|--------|---------|
| Voir toutes les données | MongoDB Compass (GUI) |
| Interroger en terminal | `mongosh` puis `db.collection.find()` |
| Ajouter des documents | Compass ou API POST |
| Supprimer des données | Compass ou `db.collection.deleteMany({})` |
| Exporter/Importer | `mongoexport` / `mongoimport` |
| Tester les API | `curl` ou Postman |

Vous êtes prêt à gérer vos données ! 🚀
