## Questionnaire

### 1. Comment définiriez-vous l'authentification ? (Quels sont ses mécanismes, à quoi sert-elle ?)
L'authentification est un mécanisme permettant à un utilisateur de prouver son identité auprès d'un système informatique. Généralement, ce processus implique la vérification d'un identifiant (email, username) associé à une preuve de son identité (mot de passe, empreinte digitale, token), permettant de sécuriser l'accès aux ressources d'un système.

---

### 2. Quelles sont les différences avec l'autorisation ?
L'authentification vérifie qui est l'utilisateur.  
L'autorisation détermine les droits d'accès de l'utilisateur authentifié.

---

### 3. Qu'est-ce qu'un facteur d'authentification ?
Un facteur d'authentification est une catégorie d'informations utilisée pour vérifier l'identité d'un utilisateur.

On distingue généralement 3 types principaux :
- Ce que l'on sait (mot de passe, code PIN)
- Ce que l'on possède (téléphone, clé USB, carte bancaire)
- Ce que l'on est (biométrie : empreinte digitale, reconnaissance faciale)

---

### 4. Citez 3 méthodes d'authentification :
- Authentification par mot de passe
- Authentification par biométrie
- Authentification par clé physique ou token matériel

---

### 5. Qu'est-ce que le hashage ?
Le hashage est un procédé cryptographique permettant de transformer une donnée (comme un mot de passe) en une chaîne de caractères fixe, non réversible, appelée « hash ». Ce processus garantit l'intégrité et la sécurité du mot de passe en le rendant illisible même en cas de compromission.

Exemples d’algorithmes de hashage courants : bcrypt, SHA-256.

---

### 6. À quoi sert le sel dans le hashage ?
Le salt est une chaîne aléatoire unique ajoutée à la donnée initiale avant le hashage. Il permet de renforcer la sécurité en :

- empêchant deux mots de passe identiques d’avoir le même hash.
- rendant les attaques par rainbow tables inefficaces.

---

### 7. Qu'est-ce que le chiffrement ?
Le chiffrement est un processus cryptographique consistant à transformer des données lisibles en données illisibles  grâce à une clé secrète. Seul le détenteur de la clé de déchiffrement pourra retrouver les données originales.

Exemples : chiffrement symétrique, chiffrement asymétrique.

---

### 8. Qu'est-ce que l'attaque par force brute ? Et comment s'en prémunir ?
Une attaque par force brute consiste à tester systématiquement toutes les combinaisons possibles jusqu'à trouver la bonne 

Moyens de s'en prémunir :
- Limiter le nombre d'essais
- Mettre en place un mécanisme de blocage temporaire
- Imposer des mots de passe complexes
- Authentification multifactorielle

---

### 9. Quels sont les points d'attention lors du développement d'un système d'authentification ? (architecture, code, dépendances...)
- Sécuriser le stockage des mots de passe
- Gestion stricte des sessions et tokens 
- Vérification des inputs utilisateur 
- Limitation du nombre de requêtes 
- Audit des dépendances
- Protection contre injections
- Sécurité des headers HTTP 

---

### 10. Expliquer le principe d'authentification multifacteur :
L'authentification multifacteur (MFA) implique d'utiliser au moins deux facteurs distincts pour valider une identité, réduisant drastiquement les risques en cas de compromission d'un seul facteur.


---

### 11. Qu'est-ce qu'une attaque CSRF ? Comment peut-on s'en protéger ?
La CSRF (Cross-Site Request Forgery) est une attaque consistant à faire exécuter une requête non désirée par un utilisateur authentifié sur un site auquel il a accès.

Protections :
- Jetons CSRF 
- Vérification de l’origine des requêtes via le header Referer ou Origin
- Utilisation de cookies sécurisés

---

### 12. Expliquez ce que représentent le principe de session, cookies et headers :
- Session : stockage temporaire d'informations sur un utilisateur authentifié côté serveur.
- Cookies : petits fichiers texte stockés côté client pour conserver des informations de session ou préférences utilisateurs.
- Headers : en-têtes HTTP, transmettent des métadonnées entre client et serveur.

---

### 13. Par quel protocole est sécurisé l'échange d'informations entre un client web et un serveur web ? Expliquez les grands principes :
Le protocole HTTPS sécurise les échanges grâce au protocole TLS :

- Chiffrement des échanges pour éviter leur interception
- Authentification du serveur via certificat SSL/TLS
- Intégrité des données pour éviter leur modification en transit

---

### 14. Qu'est-ce qu'un token JWT ? De quoi est-il composé ?
Un JWT est un standard ouvert permettant de transmettre des informations sécurisées sous forme d'objet JSON entre deux parties.

Composition :
- Header : algorithme utilisé 
- Payload : données utilisateur
- Signature : permet de vérifier l'intégrité du token

---

### 15. Qu'est-ce que OAuth 2 ? Qu'est-ce qu'il résout ?
OAuth 2 est un protocole d'autorisation permettant à des applications tierces d’accéder aux ressources d’un utilisateur sur un autre service sans lui demander directement ses identifiants.

Il résout :
- La gestion sécurisée de l'accès limité à des ressources protégées sans partage des identifiants utilisateurs.
- La délégation des autorisations à des applications tierces.

Exemple  : connecter une appli tierce via Google, Facebook ou GitHub sans partager ses identifiants personnels.

