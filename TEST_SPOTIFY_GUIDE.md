# 🎵 Guide de Test - Import Spotify

## ✅ Configuration Vérifiée

Votre configuration Spotify fonctionne parfaitement ! Voici comment tester l'import automatique dans l'application.

## 🧪 URLs de Test Spotify

### Chansons Populaires
```
https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl
https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu
```

### Albums
```
https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3
https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy
```

### Formats d'URL Supportés
- ✅ `https://open.spotify.com/track/...`
- ✅ `https://spotify.com/track/...`
- ✅ `https://open.spotify.com/album/...`
- ✅ `https://spotify.com/album/...`

## 🚀 Comment Tester dans l'App

### Étape 1 : Lancer l'Application
```bash
npm start
# ou
expo start
```

### Étape 2 : Créer une Recommandation Musique
1. Ouvrez l'application Recomigo
2. Cliquez sur "Ajouter une recommandation"
3. Sélectionnez "Musique" comme catégorie
4. Cliquez sur "Suivant"

### Étape 3 : Tester l'Import Automatique
1. **Collez une URL Spotify** dans le champ "Lien"
2. **Attendez** que l'indicateur de chargement apparaisse
3. **Vérifiez** que les champs se remplissent automatiquement :
   - ✅ Titre de la musique
   - ✅ Artiste
   - ✅ Album
   - ✅ Image (si disponible)

### Étape 4 : Vérifier les Messages
Vous devriez voir :
- ✅ "URL Spotify valide - Les métadonnées seront récupérées automatiquement"
- 🔄 Indicateur de chargement
- ✅ Métadonnées remplies automatiquement

## 🎯 Exemples de Test

### Test 1 : Chanson Populaire
```
URL: https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl
Résultat attendu:
- Titre: Cut To The Feeling
- Artiste: Carly Rae Jepsen
- Album: Cut To The Feeling
- Image: ✅ Disponible
```

### Test 2 : Album Complet
```
URL: https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3
Résultat attendu:
- Titre: [Nom de l'album]
- Artiste: [Nom de l'artiste]
- Album: [Nom de l'album]
- Image: ✅ Disponible
```

## 🔧 Dépannage

### Problème : "Clé API Spotify non configurée"
**Solution :** Vérifiez que les clés sont bien configurées dans `config/api.js`

### Problème : "URL non reconnue"
**Solution :** Vérifiez que l'URL est au bon format Spotify

### Problème : Pas de métadonnées récupérées
**Solution :** 
1. Vérifiez votre connexion internet
2. Vérifiez que la chanson existe sur Spotify
3. Essayez une autre URL

## 📱 Test sur Mobile

### iOS Simulator
1. Appuyez sur `i` dans le terminal Expo
2. Testez avec les URLs ci-dessus

### Android Emulator
1. Appuyez sur `a` dans le terminal Expo
2. Testez avec les URLs ci-dessus

### Appareil Physique
1. Scannez le QR code avec l'app Expo Go
2. Testez avec les URLs ci-dessus

## 🎵 URLs de Test Supplémentaires

### Musique Électro
```
https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu
```

### Musique Classique
```
https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
```

### Pop/Rock
```
https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl
```

## ✅ Checklist de Test

- [ ] L'application se lance sans erreur
- [ ] Le formulaire musique s'ouvre
- [ ] L'URL Spotify est reconnue
- [ ] Les métadonnées se remplissent automatiquement
- [ ] L'image se charge (si disponible)
- [ ] Les messages d'information s'affichent correctement
- [ ] L'import fonctionne avec différents formats d'URL

## 🎉 Résultat Attendu

Après avoir collé une URL Spotify valide, vous devriez voir :
1. **Message de validation** : "✅ URL Spotify valide"
2. **Indicateur de chargement** : Spinner bleu
3. **Champs remplis** : Titre, Artiste, Album automatiquement
4. **Image chargée** : Miniature de l'album (si disponible)

Votre import Spotify est maintenant opérationnel ! 🎵 