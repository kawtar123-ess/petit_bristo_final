# petit_bristo_nosql

This project now includes a simple Node/Express backend with MongoDB (Mongoose) to provide APIs for authentication, reservations and menu management.

Quick start (local):

1. Install dependencies:

```powershell
npm install
```

2. Start MongoDB locally (or set `MONGODB_URI` env var). Example with a local MongoDB server.

3. Create the initial admin user (one-time):

```powershell
npm run init-admin
```

Default admin credentials (can be changed via env vars):
- Email: `admin@example.com`
- Password: `Admin@123`

You can override them with environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD` before running the `init-admin` script.

4. Start the app (serves frontend + API):

```powershell
npm run dev   # requires nodemon
# or
npm start
```

5. Open the app in the browser (http://localhost:4000 by default).

Notes:
- Backend server is `server.js` and provides the API under `/api/*`.
- For production, set `MONGODB_URI` and `JWT_SECRET` environment variables and use a process manager.

API overview:
- POST /api/auth/login { email, password } -> { token, role, email }
- POST /api/reservations (public) -> create reservation
- GET /api/reservations (admin only, requires Bearer token) -> list
- PATCH /api/reservations/:id (admin only)
- DELETE /api/reservations/:id (admin only)
- GET /api/menu -> public menu grouped by category

Front-end changes:
- `pages/login.html` and `pages_js/login.js` now call the backend login API and store a token in `localStorage`.
- Navbar reacts to login state and shows logout button.
- Admin users are redirected to the admin dashboard after login.

## Connexion à MongoDB Atlas (cloud)

Si vous préférez utiliser MongoDB Atlas (hébergé) au lieu d'une instance locale, suivez ces étapes :

1. Créez un compte sur https://www.mongodb.com/atlas et créez un nouveau cluster gratuit (ou payant).
2. Dans le panneau Atlas, créez un **Database User** (username/password) avec les droits nécessaires.
3. Autorisez votre adresse IP (ou 0.0.0.0/0 pour tester depuis n'importe où) dans **Network Access → IP Whitelist**.
4. Dans **Connect → Connect Your Application**, copiez la chaîne de connexion **URI** (format `mongodb+srv://...`). Exemple :

	 ```text
	 mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/petit_bristo?retryWrites=true&w=majority
	 ```

	 - Remplacez `<username>` et `<password>` par les identifiants du Database User créé.
	 - `petit_bristo` est le nom de la base de données utilisée par l'application (vous pouvez le changer).

5. Définissez la variable d'environnement `MONGODB_URI` avant de démarrer le serveur.

	 - Exemple (PowerShell, session courante) :

		 ```powershell
		 $env:MONGODB_URI = "mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/petit_bristo?retryWrites=true&w=majority"
		 $env:JWT_SECRET = "change-this-secret"
		 npm start
		 ```

	 - Exemple (PowerShell, persistant via `setx`) :

		 ```powershell
		 setx MONGODB_URI "mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/petit_bristo?retryWrites=true&w=majority"
		 setx JWT_SECRET "change-this-secret"
		 # Ouvrez un nouveau terminal Powershell pour que les variables prennent effet
		 npm start
		 ```

6. Redémarrez l'application (ou ouvrez un nouveau terminal si vous avez utilisé `setx`). Le serveur lit `MONGODB_URI` depuis l'environnement et se connectera à Atlas.

Remarques de sécurité :
- Ne stockez pas de mots de passe en clair dans le code ni dans les dépôts. Utilisez des variables d'environnement ou un service secret manager.
- Pour la production, définissez `JWT_SECRET` sur une valeur longue et aléatoire.


``` 
