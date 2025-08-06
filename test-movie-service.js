#!/usr/bin/env node

/**
 * Test du MovieService avec la nouvelle clé API TMDB
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

// Test simple de recherche
async function testMovieService() {
  console.log('🔍 Test du MovieService avec la nouvelle clé API...\n');

  const testTitles = [
    'The Matrix',
    'Inception',
    'Interstellar',
    'Breaking Bad',
    'Game of Thrones'
  ];

  for (const title of testTitles) {
    console.log(`🔍 Recherche: "${title}"`);

    try {
      const result = await MovieService.searchMovieByTitle(title);

      if (result) {
        console.log(`✅ Trouvé: ${result.title} (${result.year})`);
        console.log(`   - Type: ${result.type}`);
        console.log(`   - Note: ${result.rating}`);
        console.log(`   - Image: ${result.image ? '✅' : '❌'}`);
        console.log(`   - Réalisateur: ${result.director || 'N/A'}`);
        console.log(`   - Genre: ${result.genre || 'N/A'}`);
      } else {
        console.log(`❌ Non trouvé: ${title}`);
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }

    console.log(''); // Ligne vide
  }
}

// Test avec une clé API spécifique
async function testWithSpecificKey() {
  console.log('🔑 Test avec clé API spécifique...\n');

  // Votre vraie clé API TMDB
  const API_KEY = '3948ca8b5668ba0cb68f7825161fd087';

  try {
    const axios = require('axios');
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=The Matrix&language=fr-FR`;
    const response = await axios.get(searchUrl);

    if (response.status === 200) {
      const data = response.data;
      console.log('✅ API fonctionne !');
      console.log(`Résultats trouvés: ${data.results.length}`);

      data.results.slice(0, 3).forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})`);
      });
    } else {
      console.log('❌ Erreur API:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test du MovieService\n');

  await testWithSpecificKey();
  await testMovieService();
}

if (require.main === module) {
  runTests();
} 