# Pokédex - semestre 6

Projet réalisé en groupe pour le semestre 6 du BUT MMI.

## Liens

- GitHub : https://github.com/aeadn/pokedex_s6
- Site en ligne : https://pokedexmmi.alwaysdata.net

## Installation

Il faut avoir Git, Node.js 22 et npm sur son ordinateur.

```bash
git clone https://github.com/aeadn/pokedex_s6.git
cd pokedex_s6/github-actions/partie-3
npm install
```

Il n'y a pas de base de données pour ce projet. Les jaquettes sont enregistrées dans un dossier sur le serveur.

## Fichier d'environnement

Il faut copier le fichier d'exemple :

```bash
cp .env.example .env.local
```

Puis remplir les deux variables :

```env
GITHUB_TOKEN=votre_token_github
GITHUB_REPO=aeadn/pokedex_s6
```

Le token est utilisé uniquement par le serveur pour appeler l'API GitHub. Il ne faut pas l'ajouter dans Git. Le fichier `.env.local` est déjà ignoré par le `.gitignore`.

Sur Alwaysdata, `GITHUB_TOKEN` doit être ajouté dans les variables d'environnement du site.

## Lancer le projet

```bash
npm run dev
```

- Pokédex : http://localhost:5173
- Administration : http://localhost:5173/administration.html
- Backend : http://localhost:3000

## Tests et build

```bash
npm run lint
npm test -- --run
npm run build
```

Le workflow GitHub Actions teste le projet et le déploie sur Alwaysdata après un push sur `main`.

## Ressources utilisées

- TyraDex
- PokéAPI
- TCGdex
- API GitHub
- Pokemon Type Icons
- WaveSurfer.js

## Groupe

- aeadn
- JoumanaL
- estban000
