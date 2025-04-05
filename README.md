# MDV-sergen-yuksel-AUTHJS CiveLampus

Ce projet est un POC (Proof of Concept) démontrant une implémentation sécurisée de gestion des droits d'accès pour une plateforme de formation à distance.

## Fonctionnalités

- Authentification complète (JWT)
- Système de rôles (étudiant, intervenant, admin)
- Authentification à deux facteurs (OTP/TOTP) pour les zones sensibles
- Contrôle d'accès basé sur les rôles
- Interface utilisateur responsive et moderne

## Structure du projet

- `/backend` - API Node.js/Express avec Javascript
- `/frontend` - Application React/Vite avec TypeScript et Tailwind CSS

## Technologies utilisées

### Backend
- Node.js + Express.js
- Javascript
- MongoDB (via Mongoose)
- JWT pour l'authentification
- OTP (TOTP) pour l'authentification à deux facteurs
- bcrypt pour le hachage des mots de passe
- Zod pour la validation des entrées

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- ShadCN
- React Router pour la navigation
- Zustand pour la gestion d'état
- Axios pour les appels API

## Comptes de démonstration

Pour tester l'application, vous pouvez utiliser les comptes suivants :

Vous devez lancer le script pour créer l'admin :
```
cd backend
npm run create-admin
```
Cela va créer le compte administrateur.
Vous devrez activer la double Authentification avant de pouvoir consulter la liste des intervenants.

## Installation et démarrage


### Installation

1. Cloner le dépôt
```
git clone https://github.com/votre-utilisateur/CiveLampus.git
cd CiveLampus
```

2. Installer les dépendances du backend
```
cd backend
npm install
```

3. Installer les dépendances du frontend
```
cd ../frontend
npm install
```

### Configuration

1. Créer un fichier `.env` soit depuis le .env.example, ou alors prenez les informations de mon .env sur le site de l'école.

### Lancement

1. Démarrer le backend
```
cd backend
npm run dev
```

2. Démarrer le frontend dans un autre terminal
```
cd frontend
npm run dev
```

3. Accéder à l'application dans votre navigateur : http://localhost:5173

## Sécurité et contrôle d'accès

Le POC implémente différents niveaux de contrôle d'accès :

| Route           | Accessible par        | Sécurité                     |
|-----------------|----------------------|------------------------------|
| /details/:id    | Étudiant concerné    | Auth JWT + vérification userID |
| /etudiants      | Intervenant, Admin   | Auth JWT + vérification rôle   |
| /intervenants   | Admin uniquement     | Auth JWT + rôle + OTP (TOTP)   |


### Problèmes

Lors de la mise en place du projet j'ai eu quelques problèmes.

C'est la première fois que j'utilisais Vite avec React, car avant j'utilisais CRA (Create React App), et ensuite Next.js, mais avec Vite j'ai eu du mal, certains fonctionnalités qui marchait avec Next.js, ne fonctionnait pas avec Vite.

A la base je voulais faire aussi le typescript pour le backend, mais j'avais tellement d'erreurs que je n'arrivais à résoudre j'ai préféré passer sur du javascript.

J'ai pas mal bloqué sur les erreurs 401 not authorized, c'est encore une fois que je me suis habitué avec Next js a la simplicité.

Avec VITE j'ai du paramétré tailwind css et shadcn autrement car il ne repérait pas mes fichiers config directement.