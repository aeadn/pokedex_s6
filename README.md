## Installation et mise en place
npm install dans partie-3

### Prérequis
- Node.js (version 18+)
- npm
- Git

- Frontend (Vite) : http://localhost:5173/
- Page d'administration (gestion des jaquettes) : http://localhost:5173/administration.html
- Backend d'uploads : http://localhost:3000 (API utilisée par la page d'administration)
- Lien du site https://aeadn.github.io/pokedex_s6/
La configuration Vite proxie les routes `/upload`, `/games`, `/uploads` et `/github` vers le serveur d'uploads `http://localhost:3000`.


### Crédits et ressources externes

#### APIs utilisées
- **Tyradex** (https://tyradex.app/) - Données principales des Pokémon
- **PokeAPI** (https://pokeapi.co/) - Données supplémentaires et sprites
- **TCGdex** (https://tcgdex.dev/) - Cartes Pokémon françaises

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

Abby Joumana Marcell
