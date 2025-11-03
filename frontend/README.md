# EcoRide – Frontend (React + Vite)

## Versioning

- v1.0.0: Prototype initial (statique) et livré sur GitHub.
- v1.0.1: Chargement dynamique des données d'exemple depuis `public/` avec `fetch` + docs mises à jour.

## Démarrage

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

Le build produit le dossier `dist/`. Le contenu de `public/` est copié tel quel à la racine de `dist/` (ex: `public/sample_data.json` devient `dist/sample_data.json`).

## Données et chargement dynamique (v1.0.1)

- L'échantillon de données a été déplacé de `src/data/sample_data.json` vers `public/sample_data.json`.
- La page principale (`src/App.jsx`) ne fait plus d'import statique JSON. Elle charge désormais les données avec `fetch("/sample_data.json")` et les gère via `useState`/`useEffect`.

### Pourquoi `useState` et pas une variable classique ?

- `useState` déclenche un rendu quand la valeur change, ce qui met l'UI à jour automatiquement après la réponse réseau. Une variable classique ne déclenche pas de re-rendu React.

### `useEffect`

- `useEffect(() => { ... }, [])` lance le `fetch` au montage du composant, une seule fois. Le tableau de dépendances vide évite des rechargements inattendus.

### `Promise.then()` et `fetch()`

- `fetch()` retourne une promesse résolue avec la réponse HTTP. On chaîne `then()` pour `.json()` puis pour mettre à jour l'état. En cas d'erreur, on capture et on affiche un message.

## Impact sur l'éco-conception / évaluations d'impact

- Changement principal: ajout d'UNE requête HTTP pour récupérer `sample_data.json` au lieu d'un import statique bundlé.
- Effets attendus:
  - Réseau: +1 requête GET cachable (fichier statique). Poids du JS potentiellement réduit car les données ne sont plus incluses dans le bundle.
  - Perf perçue: légère latence initiale pour la section "Données chargées" pendant le chargement (un indicateur "Chargement…" est affiché). LCP global ne devrait pas être significativement impacté si le JSON reste léger et servi en HTTP/2+ avec cache.
  - Cache: `sample_data.json` est un asset statique, donc fortement cacheable côté navigateur/CDN. Pensez à l'invalidation si le contenu change.

### Mise à jour des mesures (à faire/complété selon vos résultats)

- Reprenez les mesures du scénario prioritaire. Notez la requête additionnelle et le poids transféré.
- Comparez v1.0.0 (données dans le bundle) vs v1.0.1 (données statiques séparées) sur:
  - Nombre de requêtes
  - Poids total transféré
  - LCP/TTFB/INP (si disponibles)
  - EcoIndex, carbone et énergie estimés

Ajoutez ici vos chiffres et conclusions.

## Outil EcoIndex App et scénarios

- Attention: la version 6.0.0 d'`EcoIndex App` ne gère pas les scénarios. Utilisez une autre version compatible pour réaliser et documenter vos évaluations.
- Documentez dans cette section:
  - Version exacte de l'outil utilisée
  - Scénario prioritaire (étapes d'usage)
  - Paramètres de test (réseau, device, cache)
  - Résultats v1.0.0 vs v1.0.1 et interprétation

## Où se trouvent les fichiers au build ?

- `dist/index.html`: point d'entrée.
- `dist/assets/*.js` et `*.css`: bundles minifiés.
- `dist/sample_data.json`: échantillon de données accessible dynamiquement par l'application.

## Notes techniques

- Le déplacement vers `public/` permet l'accès par URL au runtime (sans rebundler), utile pour des données prototypes et pour rapprocher le comportement d'un backend réel.
