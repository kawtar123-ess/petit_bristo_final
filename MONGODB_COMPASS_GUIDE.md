# 🗄️ MongoDB Compass — Guide Complet pour Petit Bistro

## 📥 Étape 1 : Télécharger et Installer MongoDB Compass

### Windows
1. Allez sur : **https://www.mongodb.com/try/download/compass**
2. Sélectionnez **Windows** et téléchargez le fichier `.msi`
3. Double-cliquez et suivez l'installation

### macOS
```bash
brew install mongodb-compass
```

### Linux
Visitez https://www.mongodb.com/try/download/compass pour votre distribution

---

## 🔌 Étape 2 : Se Connecter à MongoDB Compass

### Configuration de base
1. **Ouvrez MongoDB Compass**
2. Dans le champ **"Connection String"**, entrez :
   ```
   mongodb://127.0.0.1:27017
   ```
3. Cliquez sur le bouton **"Connect"** (ou appuyez sur **Ctrl+Enter**)

### Configuration pour une base distante (MongoDB Atlas)
Si vous avez un compte MongoDB Atlas :
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

---

## 👀 Étape 3 : Visualiser les Données

### Accéder à la base de données
1. Dans le volet gauche, cherchez **"petit_bristo"**
2. Cliquez dessus pour l'ouvrir
3. Vous verrez 3 collections : **users**, **reservations**, **menuitems**

### Explorer une collection
1. Cliquez sur **"menuitems"** (par exemple)
2. Vous verrez tous les plats en format JSON
3. Cliquez sur un document pour le voir en détail

---

## ✏️ Étape 4 : Modifier les Données

### Ajouter un nouveau plat au menu

1. Allez dans la collection **"menuitems"**
2. Cliquez sur le bouton vert **"+ INSERT DOCUMENT"**
3. Remplissez le JSON (exemple) :
   ```json
   {
     "category": "plats",
     "name": "Coq au Vin",
     "description": "Coq fermier braisé au vin de Bourgogne",
     "price": "38€"
   }
   ```
4. Cliquez sur **"Insert"**

### Modifier un document existant
1. Cliquez sur le document dans la liste
2. Modifiez les champs directement
3. Les changements sont sauvegardés automatiquement

### Supprimer un document
1. Survolez le document
2. Cliquez sur l'icône **🗑️ Trash**
3. Confirmez la suppression

---

## 📊 Étape 5 : Gérer les Utilisateurs (Users)

### Voir tous les admins
1. Cliquez sur la collection **"users"**
2. Vous verrez `admin@example.com` avec le rôle `admin`

### Ajouter un nouvel utilisateur
⚠️ **Important** : N'ajoutez jamais directement via Compass car le mot de passe doit être **hashé**

À la place, utilisez :
```bash
npm run init-admin
```

Ou modifiez le script pour ajouter d'autres utilisateurs.

---

## 🔄 Étape 6 : Visualiser les Réservations

### Voir toutes les réservations
1. Cliquez sur **"reservations"**
2. Vous verrez une liste de tous les clients qui ont réservé

### Filtrer par statut
1. Dans le panneau de recherche, cliquez sur **"Filter"**
2. Entrez :
   ```json
   { "status": "pending" }
   ```
3. Appuyez sur **Enter**

### Filtrer par date
```json
{ "date": "2025-12-15" }
```

---

## 🎨 Étape 7 : Utiliser les Commandes Avancées

### Agrégation (Pipeline)
Pour voir le nombre total de réservations par statut :

1. Cliquez sur **"Aggregation"**
2. Ajoutez une étape :
   ```json
   {
     "$group": {
       "_id": "$status",
       "count": { "$sum": 1 }
     }
   }
   ```

### Exporter les données
1. Cliquez sur **"..."** en haut à droite
2. Sélectionnez **"Export Collection"**
3. Choisissez le format (JSON, CSV)

### Importer des données
1. Cliquez sur **"..."**
2. Sélectionnez **"Import Collection"**
3. Sélectionnez un fichier JSON

---

## 🛠️ Commandes Utiles depuis le Terminal

### Afficher les données (sans interface)
```bash
npm run view-data
```
Affiche une vue complète de la base dans le terminal.

### Ajouter le menu de base
```bash
npm run seed-menu
```

### Créer un admin
```bash
npm run init-admin
```

---

## 🧹 Nettoyer la Base de Données

### Via Compass
1. Cliquez sur la collection
2. Cliquez sur **"..."** en haut
3. Sélectionnez **"Drop Collection"**

### Via Terminal
```bash
mongosh
use petit_bristo
db.reservations.deleteMany({})  // Vide les réservations
db.menuitems.deleteMany({})     // Vide le menu
```

---

## 🔍 Dépannage

### Compass ne se connecte pas
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez la chaîne de connexion : `mongodb://127.0.0.1:27017`
- Assurez-vous que le port 27017 est accessible

### Je ne vois pas la base "petit_bristo"
- Assurez-vous d'avoir exécuté `npm run init-admin` une fois
- Redémarrez Compass
- Cliquez sur **"Refresh"** dans le volet de gauche

### Les modifications ne s'affichent pas
- Actualisez la page : **F5** ou **Cmd+R**
- Fermez et rouvrez la collection

---

## 📱 Informations de Connexion Rapide

| Configuration | Valeur |
|---------------|--------|
| **Host** | 127.0.0.1 |
| **Port** | 27017 |
| **Database** | petit_bristo |
| **Connection String** | mongodb://127.0.0.1:27017 |
| **Admin Email** | admin@example.com |
| **Admin Password** | Admin@123 |

---

## 🎓 Ressources Supplémentaires

- **MongoDB Compass Docs** : https://docs.mongodb.com/compass/
- **MongoDB Query Language** : https://docs.mongodb.com/manual/reference/operator/query/
- **Mongoose Docs** : https://mongoosejs.com/

---

**✅ Vous êtes maintenant prêt à gérer votre base de données MongoDB !** 🚀
