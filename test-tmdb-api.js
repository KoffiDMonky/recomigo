#!/usr/bin/env node

/**
 * Test simple de l'API TMDB
 * Usage: node test-tmdb-api.js
 */

const fetch = require('node-fetch');

// Test avec une clé API de test (ne fonctionnera pas mais on verra l'erreur)
const TMDB_API_KEY = 'VOTRE_CLE_API_TMDB';

async function testTMDBAPI() {
  console.log('🔍 Test de l\'API TMDB...\n');
  
  try {
    // Test avec une recherche simple
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=The Matrix&language=fr-FR`;
    
    console.log('URL de test:', searchUrl);
    console.log('Clé API:', TMDB_API_KEY);
    
    const response = await fetch(searchUrl);
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API fonctionne !');
      console.log('Résultats:', data.results ? data.results.length : 0);
      
      if (data.results && data.results.length > 0) {
        console.log('Premier résultat:', data.results[0].title);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur API:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Test avec une clé API valide (si disponible)
async function testWithValidKey() {
  console.log('\n🔑 Test avec clé API valide...\n');
  
  // Remplacez par votre vraie clé API TMDB
  const VALID_API_KEY = 'VOTRE_VRAIE_CLE_API_TMDB_ICI';
  
  if (VALID_API_KEY === 'VOTRE_VRAIE_CLE_API_TMDB_ICI') {
    console.log('⚠️ Veuillez configurer votre clé API TMDB dans ce fichier');
    console.log('1. Allez sur https://www.themoviedb.org/settings/api');
    console.log('2. Créez un compte et demandez une clé API');
    console.log('3. Remplacez VALID_API_KEY par votre clé');
    return;
  }
  
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${VALID_API_KEY}&query=The Matrix&language=fr-FR`;
    
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API fonctionne avec la vraie clé !');
      console.log('Résultats trouvés:', data.results.length);
      
      data.results.slice(0, 3).forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})`);
      });
    } else {
      console.log('❌ Erreur avec la vraie clé:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Instructions pour configurer l'API
function showInstructions() {
  console.log('\n📋 Instructions pour configurer l\'API TMDB :');
  console.log('=============================================');
  console.log('1. Allez sur https://www.themoviedb.org/settings/api');
  console.log('2. Créez un compte gratuit');
  console.log('3. Demandez une clé API (gratuite)');
  console.log('4. Copiez config/api.template.js vers config/api.js');
  console.log('5. Remplacez VOTRE_CLE_API_TMDB par votre vraie clé');
  console.log('6. Relancez les tests');
}

// Exécution
async function runTests() {
  console.log('🚀 Test de l\'API TMDB\n');
  
  await testTMDBAPI();
  await testWithValidKey();
  showInstructions();
}

if (require.main === module) {
  runTests();
} 