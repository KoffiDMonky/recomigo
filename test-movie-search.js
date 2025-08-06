#!/usr/bin/env node

/**
 * Test de la recherche de films par titre
 * Usage: node test-movie-search.js
 */

// Simulation de l'environnement React Native
const fetch = require('node-fetch');
global.fetch = fetch;

// Import du service
const MovieService = require('./services/MovieService.js');

// Films de test
const testMovies = [
  'The Matrix',
  'Inception',
  'The Dark Knight',
  'Pulp Fiction',
  'Fight Club',
  'Interstellar',
  'The Shawshank Redemption',
  'Forrest Gump'
];

// Séries de test
const testSeries = [
  'Breaking Bad',
  'The Wire',
  'Game of Thrones',
  'The Office',
  'Friends',
  'Stranger Things',
  'The Crown',
  'Money Heist'
];

async function testMovieSearch() {
  console.log('🎬 Test de recherche de films par titre\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const movie of testMovies) {
    console.log(`🔍 Recherche: ${movie}`);
    
    try {
      const result = await MovieService.searchMovieByTitle(movie, 'movie');
      
      if (result) {
        console.log(`✅ Trouvé: ${result.title} (${result.year})`);
        console.log(`   - Type: ${result.type}`);
        console.log(`   - Note: ${result.rating}`);
        console.log(`   - Image: ${result.image ? '✅' : '❌'}`);
        successCount++;
      } else {
        console.log(`❌ Non trouvé: ${movie}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
      errorCount++;
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  console.log(`📊 Films: ${successCount}/${testMovies.length} trouvés`);
  return { successCount, errorCount };
}

async function testSeriesSearch() {
  console.log('📺 Test de recherche de séries par titre\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const series of testSeries) {
    console.log(`🔍 Recherche: ${series}`);
    
    try {
      const result = await MovieService.searchMovieByTitle(series, 'tv');
      
      if (result) {
        console.log(`✅ Trouvé: ${result.title} (${result.year})`);
        console.log(`   - Type: ${result.type}`);
        console.log(`   - Note: ${result.rating}`);
        console.log(`   - Image: ${result.image ? '✅' : '❌'}`);
        successCount++;
      } else {
        console.log(`❌ Non trouvé: ${series}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
      errorCount++;
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  console.log(`📊 Séries: ${successCount}/${testSeries.length} trouvées`);
  return { successCount, errorCount };
}

async function testSearchAccuracy() {
  console.log('🎯 Test de précision de recherche\n');
  
  const testCases = [
    { title: 'The Matrix', expected: 'The Matrix' },
    { title: 'Matrix', expected: 'The Matrix' },
    { title: 'Inception', expected: 'Inception' },
    { title: 'Batman', expected: 'The Dark Knight' },
    { title: 'Breaking Bad', expected: 'Breaking Bad' },
  ];
  
  let accurateCount = 0;
  
  for (const testCase of testCases) {
    console.log(`🔍 "${testCase.title}" → Attendu: "${testCase.expected}"`);
    
    try {
      const result = await MovieService.searchMovieByTitle(testCase.title);
      
      if (result && result.title.includes(testCase.expected)) {
        console.log(`✅ Précision: ${result.title}`);
        accurateCount++;
      } else {
        console.log(`❌ Précision: ${result ? result.title : 'Non trouvé'}`);
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log(`🎯 Précision: ${accurateCount}/${testCases.length} corrects`);
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Tests de recherche par titre TMDB\n');
  
  try {
    const movieResults = await testMovieSearch();
    const seriesResults = await testSeriesSearch();
    await testSearchAccuracy();
    
    console.log('\n📊 Résumé Final');
    console.log('===============');
    console.log(`🎬 Films: ${movieResults.successCount}/${testMovies.length} (${((movieResults.successCount / testMovies.length) * 100).toFixed(1)}%)`);
    console.log(`📺 Séries: ${seriesResults.successCount}/${testSeries.length} (${((seriesResults.successCount / testSeries.length) * 100).toFixed(1)}%)`);
    console.log(`✅ Total succès: ${movieResults.successCount + seriesResults.successCount}`);
    console.log(`❌ Total erreurs: ${movieResults.errorCount + seriesResults.errorCount}`);
    
    console.log('\n✅ Tous les tests terminés !');
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error);
  }
}

// Exécution si le script est appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = { testMovieSearch, testSeriesSearch, testSearchAccuracy }; 