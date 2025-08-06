#!/usr/bin/env node

/**
 * Test pour déboguer les URLs appelées
 */

const axios = require('axios');

// Votre clé API TMDB
const TMDB_API_KEY = '3948ca8b5668ba0cb68f7825161fd087';

async function testURLs() {
  console.log('🔍 Test des URLs TMDB...\n');
  
  const testCases = [
    {
      title: 'The Matrix',
      type: null,
      expectedUrl: `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=The%20Matrix`
    },
    {
      title: 'Inception',
      type: 'movie',
      expectedUrl: `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=Inception`
    },
    {
      title: 'Breaking Bad',
      type: 'tv',
      expectedUrl: `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=fr-FR&query=Breaking%20Bad`
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`🎬 Test: "${testCase.title}" (type: ${testCase.type || 'multi'})`);
    
    // Construire l'URL comme dans le service
    let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(testCase.title)}`;
    
    if (testCase.type) {
      searchUrl = `https://api.themoviedb.org/3/search/${testCase.type}?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(testCase.title)}`;
    }
    
    console.log('URL construite:', searchUrl);
    console.log('URL attendue:', testCase.expectedUrl);
    console.log('URLs identiques:', searchUrl === testCase.expectedUrl);
    
    try {
      const response = await axios.get(searchUrl);
      console.log('Status:', response.status);
      console.log('Résultats:', response.data.results?.length || 0);
      
      if (response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        console.log('Premier résultat:', firstResult.title || firstResult.name);
        console.log('Type:', firstResult.media_type);
        console.log('ID:', firstResult.id);
        
        // Test de l'URL de détails
        const detailsUrl = `https://api.themoviedb.org/3/${firstResult.media_type}/${firstResult.id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
        console.log('URL détails:', detailsUrl);
        
        const detailsResponse = await axios.get(detailsUrl);
        console.log('Status détails:', detailsResponse.status);
        
      } else {
        console.log('❌ Aucun résultat trouvé');
      }
      
    } catch (error) {
      console.log('❌ Erreur:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
    
    console.log(''); // Ligne vide
  }
}

if (require.main === module) {
  testURLs();
} 