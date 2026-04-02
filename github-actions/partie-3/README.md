# Pokédex v2025.0.0 - TP CI/CD

## Description
Application web Pokédex responsive développée avec Vite, Tailwind CSS et JavaScript moderne. Permet de consulter les informations détaillées des Pokémon avec une interface moderne et fluide.

## URLs
- **URL du projet sur GitHub** : [À définir après mise en ligne]
- **URL du site déployé** : [À définir après déploiement]

## Installation et mise en place

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Git

### Installation
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd pokedex-ci-cd

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

### Configuration
Créer un fichier `.env.local` à la racine du projet avec :
```env
VITE_GITHUB_TOKEN=votre_token_github
VITE_GITHUB_REPO=owner/repository
```

### Schéma de base de données
L'application utilise des APIs externes et ne nécessite pas de base de données locale.

### Template de fichier d'environnement
```env
# Copier ce contenu dans .env.local
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_REPO=votre-username/votre-repo
```

## Fonctionnalités implémentées

### Front-end
- ✅ Affichage des Pokémon par génération
- ✅ Mode grille/liste responsive
- ✅ Modal détaillée avec informations complètes
- ✅ Navigation entre Pokémon (précédent/suivant)
- ✅ Chargement des données du Pokédex lié au Pokémon affiché
- ✅ Noms étrangers des Pokémon (anglais et japonais)
- ✅ Lien vers la fiche poképedia.fr
- ✅ Changement dynamique du favicon
- ✅ Affichage des types en mode liste uniquement
- ✅ Numéros de Pokédex par région
- ✅ Changement de la couleur theme-color
- ✅ Cartes TCGdex françaises
- ✅ Spectre sonore du cri avec WaveSurfer.js
- ✅ Liste des contributeurs GitHub

### Crédits et ressources externes

#### APIs utilisées
- **Tyradex** (https://tyradex.vercel.app/) - Données principales des Pokémon
- **PokeAPI** (https://pokeapi.co/) - Données supplémentaires et sprites
- **TCGdex** (https://tcgdex.dev/) - Cartes Pokémon françaises

#### Icônes
- **Pokemon Type Icons** (https://github.com/partywhale/pokemon-type-icons) - Icônes des types

#### Librairies JavaScript
- **WaveSurfer.js** - Spectre audio des cris de Pokémon
- **Axios** - Requêtes HTTP
- **Core-js** - Polyfills JavaScript

#### Logos universitaires
- Université de [Nom] - Année universitaire 2025-2026

## Technologies utilisées
- **Vite** - Outil de build et serveur de développement
- **Tailwind CSS v4** - Framework CSS utilitaire
- **JavaScript ES6+** - Langage de programmation
- **HTML5** - Structure sémantique
- **CSS3** - Styles avancés avec propriétés personnalisées

## Structure du projet
```
src/
├── api/           # Modules API (PokeAPI, Tyradex)
├── styles/        # Styles CSS et propriétés
├── utils/         # Utilitaires et constantes
├── main.js        # Point d'entrée principal
├── pokemon-modal.js # Gestion de la modal
├── index.html     # Template HTML principal
└── ...
```

## Scripts disponibles
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification du code avec ESLint

## Déploiement
L'application est configurée pour le déploiement via GitHub Actions avec rsync vers un serveur distant.

## Contributeurs
Voir la section "Contributeurs GitHub" dans l'application pour la liste des membres de l'équipe.