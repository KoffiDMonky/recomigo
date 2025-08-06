#!/usr/bin/env node

/**
 * Test TMDB dans l'environnement React Native
 * Usage: node test-react-native-tmdb.js
 */

// Simulation de l'environnement React Native
global.fetch = require('node-fetch');

// Import du service
const MovieService = require('./services/MovieService.js');

// Test simple de recherche
async function testSearch() {
  console.log('🔍 Test de recherche TMDB...\n');
  
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
  
  // Remplacez par votre vraie clé API TMDB
  const API_KEY = 'VOTRE_VRAIE_CLE_API_TMDB_ICI';
  
  if (API_KEY === 'VOTRE_VRAIE_CLE_API_TMDB_ICI') {
    console.log('⚠️ Veuillez configurer votre clé API TMDB :');
    console.log('1. Allez sur https://www.themoviedb.org/settings/api');
    console.log('2. Créez un compte gratuit');
    console.log('3. Demandez une clé API');
    console.log('4. Remplacez API_KEY dans ce fichier');
    return;
  }
  
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=The Matrix&language=fr-FR`;
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
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

// Instructions détaillées
function showDetailedInstructions() {
  console.log('\n📋 Instructions détaillées pour configurer TMDB :');
  console.log('================================================');
  console.log('1. Allez sur https://www.themoviedb.org/settings/api');
  console.log('2. Cliquez sur "Create" pour créer un compte');
  console.log('3. Remplissez le formulaire (gratuit)');
  console.log('4. Une fois connecté, allez dans "API"');
  console.log('5. Cliquez sur "Create" pour demander une clé API');
  console.log('6. Choisissez "Developer" (gratuit)');
  console.log('7. Remplissez le formulaire (nom, email, etc.)');
  console.log('8. Vous recevrez votre clé API par email');
  console.log('9. Remplacez VOTRE_CLE_API_TMDB par cette clé');
  console.log('10. Relancez les tests');
}

// Exécution
async function runTests() {
  console.log('🚀 Test TMDB dans React Native\n');
  
  await testSearch();
  await testWithSpecificKey();
  showDetailedInstructions();
}

if (require.main === module) {
  runTests();
} 