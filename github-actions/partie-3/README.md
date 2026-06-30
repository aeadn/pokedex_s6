# Liens

- Projet GitHub : https://github.com/aeadn/pokedex_s6
- Site déployé : https://pokedexmmi.alwaysdata.net

## Installation

Prérequis : Node.js 22, npm et Git. Il n'y a pas de base de données.

```bash
git clone https://github.com/aeadn/pokedex_s6.git
cd pokedex_s6/github-actions/partie-3
npm install
```

Créer un fichier `.env.local` à partir de `.env.example` :

```bash
cp .env.example .env.local
```

Puis renseigner :

```env
GITHUB_TOKEN=votre_token_github
GITHUB_REPO=aeadn/pokedex_s6
```

Le token sert au serveur pour récupérer les collaborateurs GitHub. Il ne faut pas le mettre sur le dépôt.
Sur Alwaysdata, `GITHUB_TOKEN` doit être ajouté dans les variables d'environnement du site.

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
