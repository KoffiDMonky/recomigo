#!/usr/bin/env node

/**
 * Test simple de l'API TMDB avec axios
 */

const axios = require('axios');

// Votre clé API TMDB
const TMDB_API_KEY = '3948ca8b5668ba0cb68f7825161fd087';

async function testTMDBAPI() {
  console.log('🔍 Test simple de l\'API TMDB...\n');
  
  try {
    // Test avec The Matrix
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=The Matrix&language=fr-FR`;
    
    console.log('URL de test:', searchUrl);
    
    const response = await axios.get(searchUrl);
    
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      const data = response.data;
      console.log('✅ API fonctionne !');
      console.log('Résultats trouvés:', data.results.length);
      
      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        console.log('Premier résultat:');
        console.log(`  - Titre: ${movie.title}`);
        console.log(`  - Année: ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}`);
        console.log(`  - Note: ${movie.vote_average}/10`);
        console.log(`  - Image: ${movie.poster_path ? '✅' : '❌'}`);
        
        // Test avec les détails complets
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
        const detailsResponse = await axios.get(detailsUrl);
        
        if (detailsResponse.status === 200) {
          const details = detailsResponse.data;
          console.log('\n📋 Détails complets:');
          console.log(`  - Description: ${details.overview ? details.overview.substring(0, 100) + '...' : 'N/A'}`);
          console.log(`  - Genre: ${details.genres ? details.genres.map(g => g.name).join(', ') : 'N/A'}`);
          
          if (details.credits && details.credits.crew) {
            const director = details.credits.crew.find(p => p.job === 'Director');
            console.log(`  - Réalisateur: ${director ? director.name : 'N/A'}`);
          }
          
          if (details.credits && details.credits.cast) {
            const cast = details.credits.cast.slice(0, 3).map(a => a.name).join(', ');
            console.log(`  - Acteurs: ${cast}`);
          }
        }
      }
    } else {
      console.log('❌ Erreur API:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

// Test avec plusieurs films
async function testMultipleMovies() {
  console.log('\n🎬 Test avec plusieurs films...\n');
  
  const movies = ['Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction'];
  
  for (const movie of movies) {
    console.log(`🔍 Recherche: "${movie}"`);
    
    try {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie)}&language=fr-FR`;
      const response = await axios.get(searchUrl);
      
      if (response.status === 200) {
        const data = response.data;
        
        if (data.results && data.results.length > 0) {
          const firstResult = data.results[0];
          console.log(`✅ Trouvé: ${firstResult.title} (${firstResult.release_date ? new Date(firstResult.release_date).getFullYear() : 'N/A'})`);
        } else {
          console.log(`❌ Non trouvé: ${movie}`);
        }
      } else {
        console.log(`❌ Erreur pour ${movie}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Erreur pour ${movie}: ${error.message}`);
    }
    
    console.log(''); // Ligne vide
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test simple de l\'API TMDB\n');
  
  await testTMDBAPI();
  await testMultipleMovies();
  
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 