#!/usr/bin/env node

/**
 * Script de test pour le service d'import de films et séries
 * Usage: node test-movie-import.js
 */

// Simulation de l'environnement React Native
global.fetch = require('node-fetch');

// Import du service (version CommonJS)
const MovieService = require('./services/MovieService.js');

// URLs de test
const testUrls = [
  // TMDB - Films
  'https://www.themoviedb.org/movie/550-fight-club',
  'https://www.themoviedb.org/movie/13-forrest-gump',
  'https://www.themoviedb.org/movie/238-the-godfather',
  
  // TMDB - Séries
  'https://www.themoviedb.org/tv/1399-game-of-thrones',
  'https://www.themoviedb.org/tv/1396-breaking-bad',
  'https://www.themoviedb.org/tv/1398-sons-of-anarchy',
  
  // Netflix (simulation)
  'https://www.netflix.com/watch/80192098',
  'https://www.netflix.com/watch/80057281',
  
  // Prime Video (simulation)
  'https://www.primevideo.com/detail/tt1234567',
  'https://www.primevideo.com/detail/tt9876543',
  
  // Disney+ (simulation)
  'https://www.disneyplus.com/content/123456',
  'https://www.disneyplus.com/content/789012',
  
  // AlloCiné
  'https://www.allocine.fr/film/fichefilm_gen_cfilm=123456.html',
  'https://www.allocine.fr/film/fichefilm_gen_cfilm=789012.html',
  
  // IMDb
  'https://www.imdb.com/title/tt0111161/',
  'https://www.imdb.com/title/tt0068646/',
  
  // URLs invalides
  'https://exemple.com/invalid',
  'https://youtube.com/watch?v=123',
  'not-a-url'
];

async function testMovieService() {
  console.log('🎬 Test du Service d\'Import de Films et Séries\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const url of testUrls) {
    console.log(`\n🔗 Test de l'URL: ${url}`);
    
    try {
      // Test d'identification de plateforme
      const platform = MovieService.identifyPlatform(url);
      console.log(`   📋 Plateforme détectée: ${platform || 'Aucune'}`);
      
      // Test de validation d'URL
      const isValid = MovieService.isValidMovieUrl(url);
      console.log(`   ✅ URL valide: ${isValid}`);
      
      // Test d'extraction d'ID
      const contentId = MovieService.extractContentId(url, platform);
      console.log(`   🆔 ID extrait: ${contentId || 'Aucun'}`);
      
      // Test d'import complet (si URL valide)
      if (isValid) {
        console.log(`   🔄 Test d'import...`);
        const movieData = await MovieService.getMovieInfoFromUrl(url);
        
        if (movieData) {
          console.log(`   ✅ Import réussi:`);
          console.log(`      - Titre: ${movieData.title}`);
          console.log(`      - Type: ${movieData.type}`);
          console.log(`      - Plateforme: ${movieData.platform}`);
          if (movieData.director) console.log(`      - Réalisateur: ${movieData.director}`);
          if (movieData.year) console.log(`      - Année: ${movieData.year}`);
          if (movieData.rating) console.log(`      - Note: ${movieData.rating}/10`);
          successCount++;
        } else {
          console.log(`   ❌ Import échoué`);
          errorCount++;
        }
      } else {
        console.log(`   ⏭️  Import ignoré (URL invalide)`);
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      errorCount++;
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé des Tests');
  console.log('==================');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📋 Total: ${testUrls.length}`);
  console.log(`📈 Taux de succès: ${((successCount / testUrls.length) * 100).toFixed(1)}%`);
  
  // Test de la configuration API
  console.log('\n🔧 Configuration API');
  console.log('==================');
  const isConfigured = MovieService.isApiKeyConfigured();
  console.log(`TMDB API configurée: ${isConfigured ? '✅ Oui' : '❌ Non'}`);
  
  if (!isConfigured) {
    console.log('\n💡 Pour activer l\'import complet:');
    console.log('1. Créez un compte sur https://www.themoviedb.org/settings/api');
    console.log('2. Demandez une clé API');
    console.log('3. Ajoutez la clé dans config/api.js');
  }
}

// Test des patterns d'URL
function testUrlPatterns() {
  console.log('\n🔍 Test des Patterns d\'URL');
  console.log('==========================');
  
  const patterns = {
    netflix: [
      'https://www.netflix.com/watch/80192098',
      'https://netflix.com/watch/80057281',
      'https://www.netflix.fr/watch/123456'
    ],
    prime: [
      'https://www.primevideo.com/detail/tt1234567',
      'https://amazon.com/video/detail/tt9876543'
    ],
    disney: [
      'https://www.disneyplus.com/content/123456',
      'https://disney.com/plus/content/789012'
    ],
    tmdb: [
      'https://www.themoviedb.org/movie/550-fight-club',
      'https://themoviedb.org/tv/1399-game-of-thrones'
    ]
  };
  
  for (const [platform, urls] of Object.entries(patterns)) {
    console.log(`\n📺 ${platform.toUpperCase()}:`);
    for (const url of urls) {
      const detected = MovieService.identifyPlatform(url);
      const isValid = MovieService.isValidMovieUrl(url);
      console.log(`   ${url}`);
      console.log(`   → Détecté: ${detected}`);
      console.log(`   → Valide: ${isValid}`);
    }
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  try {
    await testMovieService();
    testUrlPatterns();
    
    console.log('\n✅ Tests terminés avec succès !');
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécution si le script est appelé directement
if (require.main === module) {
  runTests();
}

module.exports = { testMovieService, testUrlPatterns }; 