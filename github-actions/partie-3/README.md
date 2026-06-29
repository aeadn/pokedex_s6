# Liens

- Projet GitHub : https://github.com/aeadn/pokedex_s6
- Site déployé : https://pokedexmmi.alwaysdata.net

## Installation

Prérequis : Node.js 18 ou une version plus récente, npm et Git.

```bash
git clone https://github.com/aeadn/pokedex_s6.git
cd pokedex_s6/github-actions/partie-3
npm install
```

Créer un fichier `.env.local` à partir de `.env.example` :

```env
GITHUB_TOKEN=votre_token_github
GITHUB_REPO=aeadn/pokedex_s6
```

Le token GitHub est confidentiel et ne doit jamais être envoyé sur le dépôt.

## Lancement

```bash
npm run dev
```

- Site : http://localhost:5173
- Administration des jaquettes : http://localhost:5173/administration.html
- Serveur backend : http://localhost:3000

## Tests et production

```bash
npm run lint
npm test -- --run
npm run build
```


