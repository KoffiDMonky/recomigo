#!/usr/bin/env node

/**
 * Test de débogage pour l'erreur 404
 */

const axios = require('axios');

// Votre clé API TMDB
const TMDB_API_KEY = '3948ca8b5668ba0cb68f7825161fd087';

async function debugSearch(title) {
  console.log(`🔍 Débogage de la recherche: "${title}"`);
  
  try {
    // Test 1: Recherche multi
    console.log('\n1️⃣ Test recherche multi:');
    const multiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
    console.log('URL:', multiUrl);
    
    const multiResponse = await axios.get(multiUrl);
    console.log('Status:', multiResponse.status);
    console.log('Résultats:', multiResponse.data.results?.length || 0);
    
    if (multiResponse.data.results && multiResponse.data.results.length > 0) {
      const firstResult = multiResponse.data.results[0];
      console.log('Premier résultat:', firstResult.title || firstResult.name);
      console.log('Type:', firstResult.media_type);
      console.log('ID:', firstResult.id);
      
      // Test 2: Détails
      console.log('\n2️⃣ Test détails:');
      const detailsUrl = `https://api.themoviedb.org/3/${firstResult.media_type}/${firstResult.id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
      console.log('URL détails:', detailsUrl);
      
      const detailsResponse = await axios.get(detailsUrl);
      console.log('Status détails:', detailsResponse.status);
      console.log('Titre détails:', detailsResponse.data.title || detailsResponse.data.name);
      
    } else {
      console.log('❌ Aucun résultat trouvé');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('URL qui a échoué:', error.config?.url);
    }
  }
}

async function testMovieService() {
  console.log('🔍 Test du MovieService avec débogage...\n');
  
  // Simulation de l'environnement React Native avec axios
  const axios = require('axios');
  global.axios = axios;
  
  // Import du service
  const MovieService = require('./services/MovieService.js');
  
  const testTitles = ['The Matrix', 'Inception'];
  
  for (const title of testTitles) {
    console.log(`\n🎬 Test: "${title}"`);
    
    try {
      const result = await MovieService.searchMovieByTitle(title);
      
      if (result) {
        console.log(`✅ Trouvé: ${result.title} (${result.year})`);
        console.log(`   - Type: ${result.type}`);
        console.log(`   - Note: ${result.rating}`);
        console.log(`   - Image: ${result.image ? '✅' : '❌'}`);
      } else {
        console.log(`❌ Non trouvé: ${title}`);
      }
    } catch (error) {
      console.log(`❌ Erreur MovieService: ${error.message}`);
    }
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test de débogage 404\n');
  
  await debugSearch('The Matrix');
  await testMovieService();
}

if (require.main === module) {
  runTests();
} 