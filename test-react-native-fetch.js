#!/usr/bin/env node

/**
 * Test pour simuler l'environnement React Native
 */

// Simulation de React Native
global.fetch = async (url, options = {}) => {
  console.log('🌐 Fetch appelé avec URL:', url);
  
  // Simuler une réponse fetch
  return {
    ok: true,
    status: 200,
    json: async () => {
      // Simuler une réponse TMDB
      return {
        results: [
          {
            id: 603,
            title: 'Matrix',
            media_type: 'movie',
            release_date: '1999-03-31'
          }
        ]
      };
    }
  };
};

// Import du service
const MovieService = require('./services/MovieService.js');

async function testReactNative() {
  console.log('🚀 Test en environnement React Native simulé\n');
  
  try {
    const result = await MovieService.searchMovieByTitle('The Matrix');
    
    if (result) {
      console.log('✅ Résultat trouvé:', result.title);
    } else {
      console.log('❌ Aucun résultat');
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

if (require.main === module) {
  testReactNative();
} 