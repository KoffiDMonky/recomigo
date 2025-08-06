#!/usr/bin/env node

/**
 * Test rapide pour vérifier une clé API TMDB
 */

const axios = require('axios');

// Remplacez par votre vraie clé API TMDB
const TMDB_API_KEY = '3948ca8b5668ba0cb68f7825161fd087';

async function testAPIKey() {
  console.log('🔑 Test de la clé API TMDB...\n');
  
  if (TMDB_API_KEY === 'VOTRE_VRAIE_CLE_API_ICI') {
    console.log('⚠️ Veuillez configurer votre vraie clé API TMDB :');
    console.log('1. Allez sur https://www.themoviedb.org/settings/api');
    console.log('2. Créez un compte et demandez une clé API');
    console.log('3. Remplacez TMDB_API_KEY dans ce fichier');
    return;
  }
  
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=The Matrix&language=fr-FR`;
    
    console.log('URL de test:', searchUrl);
    
    const response = await axios.get(searchUrl);
    
    if (response.status === 200) {
      const data = response.data;
      console.log('✅ Clé API valide !');
      console.log(`Résultats trouvés: ${data.results.length}`);
      
      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        console.log(`✅ Trouvé: ${movie.title} (${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})`);
        console.log(`   - Note: ${movie.vote_average}/10`);
        console.log(`   - Image: ${movie.poster_path ? '✅' : '❌'}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.status_message);
    }
  }
}

if (require.main === module) {
  testAPIKey();
} 