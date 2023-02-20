## PROJET pfc

### Etat du projet : terminé

### How to 

> Installer les dépendances

Pour installer les dépendances, il faut exécuter la commande : `npm install`.  

> Créer le bundle grâce à webpack

Pour créer le bundle, il faut lancer la commande : `npm run build`

> Lancer et accéder au serveur

Une fois les dépendances installés et le bundle généré, il faut exécuter la commande suivante pour lancer le serveur : ` npm run start `.  

> Accéder au serveur

Pour accéder au serveur, il faut se rendre sur l'adresse du localhost (127.0.0.1) et sur le port 8080.

### Rôle des principaux répertoires/fichiers

> Le répertoire client/

Liste tous les répertoires et fichiers qui seront utiles côté client (html, style, scripts javascript, images). Ce sont eux qui seront pris en charge par webpack

> Le répertoire dist/

Contient les fichiers de client compilés par webpack. Cela permet par exemple de compresser tous les scripts js en un seul : `bundle.js`. Les fichiers utilisés par le client seront donc ceux générés par webpack

> Le répertoire ResponseBuilders/

Se charge de charger les fichiers  correspondants aux requêtes reçues dans le répertoires `dist/`. Les chargements se font de manière asynchrone.

> Le répertoire controllers/

Contient les controllers nécessaires au bon fonctionnement du serveur : le `requestController` se charge de traiter les requêtes et d'appeler les `reponseBuilders`, et l' `IOController` se charge de la communication directe avec les clients grâce aux sockets. Il contient également une classe `Player` qui représente un joueur (attributs points et move).

### Zooms sur les communications entre sockets

Le fichier `SocketHandler` s'occupe de la communication côté client tandis que `IOController` s'en occupe côté serveur.

`SocketHandler` est le fichier principal côté client. La classe qui s'y trouve s'occupe :
- de l'envoi des messages : lorsqu'un coup a été joué, lorsque le joueur souhaite lancer une nouvelle partie, la connexion, déconnexion, etc.
- des messages à écouter : bienvenue, nombres de joueurs déjà connectés, résultats d'une manche, résultats de la partie, coup joué par l'adversaire, déconnexion de l'adversaire
- des fonctions à exécuter lors de la réception des messages : initialiser le jeu (mettre les scores à 0, clear les images, etc.), gérer le résultat d'une manche, la déconnexion de l'adversaire, les résultats de la partie entière, etc.

`IOController` s'en occupe donc côté serveur. Il communique avec les `SocketHandler` de chaque client et se charge du stockage des joueurs, de leur coups et points, du calcul des résultats et de leur envoi, etc. 


### Fonctionnalités supplémentaires ajoutées

- Le jeu  en 5 manches a été implémenté : le meilleur de ces 5 manches remporte la partie (départage si égalité)
- Un compteur permet de savoir à quel manche nous nous trouvons
- Le joueur est averti si son adversaire quitte la partie. Il est déclaré gagnant si son adversaire se déconnecte. Même s'il s'agit du même joueur, on ne peut pas reprendre la partie en cours car l'id d'un socket est différente à chaque connexion du client. On ne peut donc pas savoir s'il s'agit par exemple d'une simple acutalisation de la page ou d'un nouveau joueur qui s'est connecté. 
  
### Ajouts de fonctionnalités possibles

- Jouer des parties de 5 manches contre l'IA si un seul joueur est connecté
- Créer différents salons pour permettre à plus de deux joueurs de jouer en même temps
