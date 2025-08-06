#!/usr/bin/env node

/**
 * Script de test pour plusieurs films Netflix
 * Usage: node test-multiple-netflix.js
 */

// Simulation de l'environnement React Native
global.fetch = require('node-fetch');

// Import du service
const MovieService = require('./services/MovieService.js');

// Films de test avec leurs IDs Netflix
const testMovies = [
  {
    name: 'Interstellar',
    url: 'https://www.netflix.com/fr/title/70305903?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'Interstellar'
  },
  {
    name: 'Ready Player One',
    url: 'https://www.netflix.com/fr/title/80211726?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'Ready Player One'
  },
  {
    name: 'The Truman Show',
    url: 'https://www.netflix.com/fr/title/11819086?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'The Truman Show'
  },
  {
    name: 'Suits',
    url: 'https://www.netflix.com/fr/title/70195800?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'Suits : avocats sur mesure'
  },
  {
    name: 'Film Inconnu 1',
    url: 'https://www.netflix.com/fr/title/12345678?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'Fallback'
  },
  {
    name: 'Film Inconnu 2',
    url: 'https://www.netflix.com/fr/title/87654321?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'Fallback'
  },
  {
    name: 'Film Inconnu 3',
    url: 'https://www.netflix.com/fr/title/99999999?s=i&trkid=279243217&vlang=fr&trg=cp',
    expectedTitle: 'Fallback'
  }
];

async function testMultipleNetflixMovies() {
  console.log('🎬 Test Multiple Films Netflix\n');
  
  let successCount = 0;
  let errorCount = 0;
  let correctTitleCount = 0;
  
  for (const movie of testMovies) {
    console.log(`\n🔗 Test: ${movie.name}`);
    console.log(`URL: ${movie.url}`);
    
    try {
      const platform = MovieService.identifyPlatform(movie.url);
      console.log(`📋 Plateforme détectée: ${platform}`);
      
      const contentId = MovieService.extractContentId(movie.url, platform);
      console.log(`🆔 ID extrait: ${contentId}`);
      
      const movieData = await MovieService.getNetflixInfo(contentId, movie.url);
      
      if (movieData) {
        console.log(`✅ Import réussi:`);
        console.log(`   - Titre: ${movieData.title}`);
        console.log(`   - Type: ${movieData.type}`);
        console.log(`   - Année: ${movieData.year || 'N/A'}`);
        console.log(`   - Image: ${movieData.image ? '✅ Oui' : '❌ Non'}`);
        
        // Vérifier si le titre est correct
        const isCorrectTitle = movieData.title === movie.expectedTitle || 
                              (movie.expectedTitle === 'Fallback' && movieData.title !== movie.expectedTitle);
        
        if (isCorrectTitle) {
          console.log(`   - Titre correct: ✅ Oui`);
          correctTitleCount++;
        } else {
          console.log(`   - Titre correct: ❌ Non (attendu: ${movie.expectedTitle})`);
        }
        
        successCount++;
      } else {
        console.log(`❌ Import échoué`);
        errorCount++;
      }
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
      errorCount++;
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé des Tests');
  console.log('==================');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`🎯 Titres corrects: ${correctTitleCount}/${testMovies.length}`);
  console.log(`📋 Total: ${testMovies.length}`);
  console.log(`📈 Taux de succès: ${((successCount / testMovies.length) * 100).toFixed(1)}%`);
  console.log(`🎯 Précision des titres: ${((correctTitleCount / testMovies.length) * 100).toFixed(1)}%`);
}

// Test spécifique pour vérifier la base de données
function testNetflixDatabase() {
  console.log('\n🔍 Test de la Base de Données Netflix');
  console.log('=====================================');
  
  try {
    const netflixTitles = require('./data/netflixTitles.js');
    const allTitles = netflixTitles.getAllNetflixTitles();
    
    console.log(`📊 Nombre de titres dans la base: ${Object.keys(allTitles).length}`);
    
    for (const [netflixId, titleInfo] of Object.entries(allTitles)) {
      console.log(`   - ID ${netflixId}: ${titleInfo.title} (${titleInfo.type})`);
    }
    
  } catch (error) {
    console.log('❌ Impossible de charger la base de données:', error.message);
  }
}

// Test de performance
async function testPerformance() {
  console.log('\n⚡ Test de Performance');
  console.log('=====================');
  
  const startTime = Date.now();
  
  for (let i = 0; i < 3; i++) {
    const url = 'https://www.netflix.com/fr/title/70305903?s=i&trkid=279243217&vlang=fr&trg=cp';
    const contentId = MovieService.extractContentId(url, 'netflix');
    await MovieService.getNetflixInfo(contentId, url);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log(`⏱️  Temps moyen par requête: ${(duration / 3).toFixed(0)}ms`);
  console.log(`🚀 Performance: ${duration < 5000 ? '✅ Rapide' : '⚠️ Lent'}`);
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests multiples...\n');
  
  try {
    await testMultipleNetflixMovies();
    testNetflixDatabase();
    await testPerformance();
    
    console.log('\n✅ Tous les tests terminés avec succès !');
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécution si le script est appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = { testMultipleNetflixMovies, testNetflixDatabase, testPerformance }; 