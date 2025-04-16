# Knowledge Learning

## Description

Knowledge Learning est une application full-stack conçue pour l'entreprise fictive Knowledge Learning qui est une plateforme e-learning.  
Le backend est développé avec **Express.js** et le frontend avec **Vue.js 3**.

---

## Structure du Projet

Le projet est divisé en deux parties principales :

1. **Backend** (`knowledge-learning`) : Serveur Node.js avec Express.
2. **Frontend** (`kl-frontend`) : Application Vue.js.

---

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- MongoDB (local ou cloud)
- MailDev (pour tester les emails en dev)

---

## Installation

### Backend

#### 1. Cloner le dépôt

```bash
git clone <URL_DU_DEPOT>
cd knowledge-learning
```

#### 2. Installer les dépendances

```bash
npm install
```

#### 3. Configuration de l'environnement

Créer un fichier `.env` à partir du modèle :

##### Exemple de configuration `.env`

```env
# Serveur
PORT=3000
HOST=localhost

# Base de données
MONGODB_URI=mongodb://localhost:27017/knowledge_learning

# Authentification
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Mailer
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=Knowledge Learning <no-reply@example.com>

# Sécurité
CSRF_SECRET=your_csrf_secret_key
```

#### 4. Démarrer le serveur

- En développement :

```bash
npm start
```

- En production :

```bash
npm run prod
```

---

### Frontend

#### 1. Aller dans le dossier frontend

```bash
cd kl-frontend
```

#### 2. Installer les dépendances

```bash
npm install
```

#### 3. Démarrer l'application

```bash
npm run serve
```

Accès : [http://localhost:8080](http://localhost:8080)

---

## Tests (Backend)

Le projet utilise **Mocha**, **Chai**, **Sinon** et **Supertest** pour les tests :

```bash
npm run test
```

---

## Technologies principales

### Backend

- Express.js
- MongoDB + Mongoose
- JWT
- Stripe
- Swagger
- Nodemailer
- MailDev

### Frontend

- Vue 3
- Vuex
- Vue Router
- Axios
- Vue3 Toastify

---

## Tester les emails en local (MailDev)

MailDev permet d'intercepter et de visualiser les emails envoyés en local.

#### Installation (globale ou locale)

```bash
npm install -g maildev
```

####  Lancer MailDev

```bash
maildev
```

Par défaut :
- Interface : [http://localhost:1080](http://localhost:1080)
- SMTP : `localhost:1025`

#### Exemple de configuration `.env` pour MailDev

```env
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=unused
EMAIL_PASS=unused
```

---

## 📚 Documentation API

L’API est documentée avec **Swagger** :  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---