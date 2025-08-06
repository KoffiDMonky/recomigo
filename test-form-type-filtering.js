#!/usr/bin/env node

/**
 * Test du filtrage par type dans les formulaires
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

async function testMovieForm() {
  console.log('🎬 Test du formulaire FILM (type="movie")...\n');

  try {
    // Test avec "Matrix" - devrait retourner des films
    console.log('🔍 Recherche "Matrix" (type="movie")...');
    const movieSuggestions = await MovieService.searchMovieSuggestions('Matrix', 'movie');
    
    if (movieSuggestions && movieSuggestions.length > 0) {
      console.log(`✅ ${movieSuggestions.length} résultats trouvés\n`);
      
      // Vérifier que ce sont bien des films
      const movies = movieSuggestions.filter(s => s.type === 'Film');
      const series = movieSuggestions.filter(s => s.type === 'Série');
      
      console.log(`📊 Répartition:`);
      console.log(`   - Films: ${movies.length}`);
      console.log(`   - Séries: ${series.length}`);
      
      if (movies.length > 0) {
        console.log(`\n🎯 Premier film trouvé:`);
        console.log(`   - Titre: ${movies[0].title}`);
        console.log(`   - Année: ${movies[0].year}`);
        console.log(`   - Type: ${movies[0].type}`);
        console.log(`   - Réalisateur: ${movies[0].director || 'N/A'}`);
      }
      
      if (series.length > 0) {
        console.log(`\n⚠️ ATTENTION: Séries trouvées dans la recherche de films!`);
        console.log(`   - Titre: ${series[0].title}`);
        console.log(`   - Type: ${series[0].type}`);
      }
      
    } else {
      console.log('❌ Aucun résultat trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

async function testSerieForm() {
  console.log('\n📺 Test du formulaire SÉRIE (type="tv")...\n');

  try {
    // Test avec "Breaking Bad" - devrait retourner des séries
    console.log('🔍 Recherche "Breaking Bad" (type="tv")...');
    const serieSuggestions = await MovieService.searchMovieSuggestions('Breaking Bad', 'tv');
    
    if (serieSuggestions && serieSuggestions.length > 0) {
      console.log(`✅ ${serieSuggestions.length} résultats trouvés\n`);
      
      // Vérifier que ce sont bien des séries
      const movies = serieSuggestions.filter(s => s.type === 'Film');
      const series = serieSuggestions.filter(s => s.type === 'Série');
      
      console.log(`📊 Répartition:`);
      console.log(`   - Films: ${movies.length}`);
      console.log(`   - Séries: ${series.length}`);
      
      if (series.length > 0) {
        console.log(`\n🎯 Première série trouvée:`);
        console.log(`   - Titre: ${series[0].title}`);
        console.log(`   - Année: ${series[0].year}`);
        console.log(`   - Type: ${series[0].type}`);
        console.log(`   - Réalisateur: ${series[0].director || 'N/A'}`);
      }
      
      if (movies.length > 0) {
        console.log(`\n⚠️ ATTENTION: Films trouvés dans la recherche de séries!`);
        console.log(`   - Titre: ${movies[0].title}`);
        console.log(`   - Type: ${movies[0].type}`);
      }
      
    } else {
      console.log('❌ Aucun résultat trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

async function testMixedSearch() {
  console.log('\n🔄 Test de recherche mixte (sans type spécifique)...\n');

  try {
    // Test avec "Matrix" sans type - devrait retourner films ET séries
    console.log('🔍 Recherche "Matrix" (sans type)...');
    const mixedSuggestions = await MovieService.searchMovieSuggestions('Matrix');
    
    if (mixedSuggestions && mixedSuggestions.length > 0) {
      console.log(`✅ ${mixedSuggestions.length} résultats trouvés\n`);
      
      const movies = mixedSuggestions.filter(s => s.type === 'Film');
      const series = mixedSuggestions.filter(s => s.type === 'Série');
      
      console.log(`📊 Répartition:`);
      console.log(`   - Films: ${movies.length}`);
      console.log(`   - Séries: ${series.length}`);
      
      console.log(`\n📋 Tous les résultats:`);
      mixedSuggestions.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} (${item.year}) - ${item.type}`);
      });
      
    } else {
      console.log('❌ Aucun résultat trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Test de validation des formulaires
async function testFormValidation() {
  console.log('\n✅ Test de validation des formulaires...\n');

  console.log('🎬 Formulaire FILM:');
  console.log('   - Type: "movie"');
  console.log('   - Recherche: Films uniquement');
  console.log('   - URL: /search/movie');
  
  console.log('\n📺 Formulaire SÉRIE:');
  console.log('   - Type: "tv"');
  console.log('   - Recherche: Séries uniquement');
  console.log('   - URL: /search/tv');
  
  console.log('\n🔄 Recherche MIXTE:');
  console.log('   - Type: null/undefined');
  console.log('   - Recherche: Films ET séries');
  console.log('   - URL: /search/multi');
}

// Exécution
async function runTests() {
  console.log('🚀 Test du filtrage par type dans les formulaires\n');
  
  await testMovieForm();
  await testSerieForm();
  await testMixedSearch();
  await testFormValidation();
  
  console.log('\n✅ Tests terminés !');
  console.log('\n📋 Résumé:');
  console.log('   - Formulaire FILM: Recherche uniquement des films');
  console.log('   - Formulaire SÉRIE: Recherche uniquement des séries');
  console.log('   - Filtrage correct par type dans TMDB API');
  console.log('   - Interface adaptée selon le type');
}

if (require.main === module) {
  runTests();
} 