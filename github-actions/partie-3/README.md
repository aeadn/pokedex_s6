
## Liens

- GitHub : https://github.com/aeadn/pokedex_s6
- Site : https://pokedexmmi.alwaysdata.net

## Installer le projet

Il faut avoir Node.js 22, npm et Git.

```bash
git clone https://github.com/aeadn/pokedex_s6.git
cd pokedex_s6/github-actions/partie-3
npm install
```

Le projet n'utiise pas de base de données.

## Fichier `.env.local`

Copier le fichier d'exemple :

```bash
cp .env.example .env.local
```

Puis ajouter son token GitHub :

```env
GITHUB_TOKEN=votre_token_github
GITHUB_REPO=aeadn/pokedex_s6
```
Le token GitHub est privé et ne doit pas être ajouté au dépôt.

## Lancer le projet

```bash
npm run dev
```

- Pokédex : http://localhost:5173
- Administration : http://localhost:5173/administration.html
- Backend : http://localhost:3000

## Commandes utiles

```bash
npm run lint
npm test -- --run
npm run build
```
