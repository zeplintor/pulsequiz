# 🎵 PulseQuiz - Mise à Jour Majeure v2.0

## 🚀 Nouvelles Fonctionnalités

### 1. Recherche YouTube Dynamique (Sans API Key)

**Fini les API keys !** On utilise maintenant `yt-search` pour scraper YouTube directement.

#### API Routes Créées

**`/api/search`** - Recherche personnalisée
```bash
GET /api/search?query=despacito
```
Retourne les 20 meilleures vidéos correspondantes avec :
- ID YouTube
- Titre
- Artiste
- Thumbnail
- Durée
- Nombre de vues

**`/api/trending`** - Vidéos tendances
```bash
GET /api/trending
```
Récupère automatiquement 30 vidéos musicales populaires de 2025/2026.

### 2. Player YouTube Visible avec Effet Flou

Le player n'est plus caché ! Voici comment ça fonctionne :

#### Phase Devinette 🎭
```tsx
<YouTubePlayer
  isRevealed={false}
  showOverlay={true}
/>
```
- Vidéo floutée à **40px**
- Overlay avec animation d'ondes sonores pulsantes
- Message "Devinez la chanson..." animé
- Impossible de voir le titre ou la vidéo clairement

#### Phase Révélation ✨
```tsx
<YouTubePlayer
  isRevealed={true}
  showOverlay={false}
/>
```
- Transition fluide de blur 40px → 0px (0.8s)
- Révélation du titre et artiste en **typographie néon**
- Glow effect autour du player
- Contrôles YouTube visibles

### 3. Interface Host Redesignée

#### Layout Moderne
```
┌────────────────────────────────────────────┐
│ PULSEGUIZ    [Players] [PIN] [Rechercher] │
├──────────────────────────┬─────────────────┤
│                          │                 │
│   📺 Player YouTube      │  🏆 Scoreboard  │
│   (2/3 de l'écran)       │  (1/3)          │
│                          │                 │
│   [Titre/Artiste révélé] │  [Buzzer Info]  │
│   [Play/Pause] [Suivant] │                 │
└──────────────────────────┴─────────────────┘
```

#### Fonctionnalités
- **Bouton "Rechercher"** : Ouvre un modal de recherche immersive
- **Bouton "Utiliser les Tendances"** : Sélectionne une vidéo aléatoire parmi les hits
- **Player Central** : Format 16:9, contrôles visibles
- **Auto-sync Firestore** : Tous les joueurs voient la même chose

### 4. Modal de Recherche Immersif

#### Interface
```
┌─────────────────────────────────────────┐
│   Rechercher une Musique                │
├─────────────────────────────────────────┤
│ [Input: Titre, artiste...]              │
│ [Chercher] [Aléatoire]                  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [Thumbnail] Titre                   │ │
│ │             Artiste - Durée         │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [Thumbnail] Titre                   │ │
│ │             Artiste - Durée         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Actions
- **Recherche textuelle** : Tape n'importe quoi, obtiens des résultats instantanés
- **Bouton Aléatoire** : Tire une vidéo tendance au hasard
- **Click sur un résultat** : Lance immédiatement la vidéo en mode flou
- **Fermeture** : Click en dehors ou ESC

### 5. Animations & Effets Visuels

#### Onde Sonore Pulsante
3 cercles concentriques qui s'élargissent successivement :
```tsx
{[0, 1, 2].map((i) => (
  <motion.div
    animate={{
      scale: [0.5, 1.5],
      opacity: [0.8, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: i * 0.6,
    }}
  />
))}
```

#### Glow Dynamique
- **Mode Flou** : Glow cyan subtil (20px)
- **Mode Révélé** : Glow magenta/cyan intense (30-60px)

#### Transitions Fluides
- Flou → Net : 0.8s ease-in-out
- Titre/Artiste : Slide up 20px → 0px
- Modal : Scale 0.9 → 1.0

### 6. Workflow de Jeu Amélioré

#### Nouveau Flux
```
1. Host ouvre /host
   └→ Affiche PIN + Aucune musique

2. Host clique "Rechercher" OU "Utiliser les Tendances"
   └→ Modal de recherche s'ouvre

3. Host sélectionne une vidéo
   └→ Vidéo lance en mode FLOU
   └→ État Firestore sync → state: 'playing'

4. Joueurs voient l'overlay "Devinez..."
   └→ Premier à buzzer gagne le droit de répondre

5. Host valide "Correct" ou "Faux"
   └→ Si correct : Vidéo se révèle (déflou)
   └→ Titre/Artiste apparaissent en néon
   └→ +100 points au joueur
   └→ Après 5s : Modal de recherche se rouvre automatiquement

6. Host sélectionne la prochaine chanson
   └→ Le cycle continue
```

## 🔥 Changements Techniques

### Composant YouTubePlayer
**Avant** :
```tsx
<div className="hidden">
  <iframe width="1" height="1" />
</div>
```

**Après** :
```tsx
<div className="aspect-video relative">
  <iframe
    width="100%"
    height="100%"
    style={{ filter: isRevealed ? 'blur(0)' : 'blur(40px)' }}
  />
  {showOverlay && <SoundWaveOverlay />}
</div>
```

### Services Firestore
Aucune modification majeure, mais ajout de la possibilité de créer une session **sans playlist prédéfinie** :
```ts
const pin = await createSession([]); // Playlist vide
```

### Dépendances Ajoutées
```json
{
  "yt-search": "^2.x.x"
}
```

## 🎮 Comment Utiliser

### En Tant qu'Host

1. **Ouvre http://localhost:3000/host**
2. **Note le PIN** affiché en haut
3. **Attends que les joueurs rejoignent**
4. **Clique "Utiliser les Tendances"** pour un démarrage rapide
   - OU **Clique "Rechercher"** pour choisir manuellement
5. **Cherche "despacito"** par exemple
6. **Clique sur le résultat** → La vidéo commence en mode flou
7. **Les joueurs buzzent**
8. **Valide "Correct"** → La vidéo se révèle
9. **Après 5s** → Le modal se rouvre automatiquement
10. **Répète** pour la prochaine chanson

### En Tant que Joueur

1. **Ouvre http://localhost:3000/play** sur ton téléphone
2. **Entre le PIN** et ton nom
3. **Attends** que la musique commence
4. **BUZZ dès que tu reconnais** !
5. **Donne ta réponse** à l'host
6. **Gagne des points** ! 🏆

## 📊 Différences Visuelles

### Ancien Design
- Player caché (1x1px)
- Pas de recherche dynamique
- Playlist fixe de 5 chansons
- Pas d'effets visuels pendant le jeu

### Nouveau Design
- **Player visible** en 16:9 central
- **Recherche YouTube illimitée**
- **Playlist dynamique** infinie
- **Animations d'ondes sonores**
- **Effet de flou progressif**
- **Typographie néon** pour les métadonnées
- **Glow effects** réactifs

## 🚀 Prochaines Étapes Suggérées

1. **Ajouter un timer** ⏱️
   - Limite de temps pour deviner (30s ?)
   - Révélation automatique si timeout

2. **Système de difficulté** 🎯
   - Facile : Révélation progressive du flou
   - Difficile : Audio seulement (blur 100px)

3. **Playlists thématiques** 🎨
   - "Années 80"
   - "Hip-Hop"
   - "Rock Classique"

4. **Mode multijoueurs avancé** 🎮
   - Équipes
   - Battle royale (élimination)

5. **Analytics** 📈
   - Temps moyen de reconnaissance
   - Taux de réussite par chanson

## 🐛 Notes Importantes

### Limitations
- **yt-search** peut avoir des fluctuations de résultats
- **Pas de preview audio** dans la recherche (YouTube limite)
- **Certaines vidéos** peuvent être restreintes (âge, région)

### Recommandations
- Teste d'abord en local avec des chansons connues
- Évite les vidéos "Topic" ou "Auto-generated" (moins fiables)
- Privilégie les "Official Music Video"

---

**La transformation est complète !** 🎉

Ton blind test est maintenant **dynamique**, **immersif**, et **visuellement époustouflant**.

Bon jeu ! 🎵⚡🏆
