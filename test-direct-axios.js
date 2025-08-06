#!/usr/bin/env node

/**
 * Test direct avec axios pour simuler le MovieService
 */

const axios = require('axios');

// Votre clé API TMDB
const TMDB_API_KEY = '3948ca8b5668ba0cb68f7825161fd087';

async function searchMovieByTitle(title, type = null) {
  if (!title || !TMDB_API_KEY) {
    console.log('⚠️ Titre manquant ou clé API TMDB non configurée');
    return null;
  }

  try {
    // Construire l'URL de recherche
    let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
    
    if (type) {
      searchUrl = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
    }

    const response = await axios.get(searchUrl);
    
    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      
      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        
        // Récupérer les détails complets
        const detailsUrl = `https://api.themoviedb.org/3/${firstResult.media_type}/${firstResult.id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
        const detailsResponse = await axios.get(detailsUrl);
        
        if (detailsResponse.status >= 200 && detailsResponse.status < 300) {
          const details = detailsResponse.data;
          
          return {
            title: details.title || details.name,
            type: details.media_type === 'tv' ? 'Série' : 'Film',
            description: details.overview,
            year: details.release_date ? new Date(details.release_date).getFullYear() : 
                   (details.first_air_date ? new Date(details.first_air_date).getFullYear() : null),
            rating: details.vote_average ? `${Math.round(details.vote_average)}/10` : null,
            image: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
            director: extractDirector(details.credits?.crew),
            cast: details.credits?.cast ? details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : null,
            genre: details.genres ? details.genres.map(g => g.name).join(', ') : null,
            tmdbId: details.id,
            mediaType: details.media_type
          };
        }
      }
    }
    
    console.log(`❌ Aucun résultat trouvé pour: ${title}`);
    return null;
    
  } catch (error) {
    console.error('❌ Erreur lors de la recherche TMDB:', error.message);
    return null;
  }
}

function extractDirector(crew) {
  if (!crew) return null;
  const director = crew.find(p => p.job === 'Director');
  return director ? director.name : null;
}

// Test simple de recherche
async function testSearch() {
  console.log('🔍 Test de recherche TMDB avec axios...\n');

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
      const result = await searchMovieByTitle(title);

      if (result) {
        console.log(`✅ Trouvé: ${result.title} (${result.year})`);
        console.log(`   - Type: ${result.type}`);
        console.log(`   - Note: ${result.rating}`);
        console.log(`   - Image: ${result.image ? '✅' : '❌'}`);
        console.log(`   - Réalisateur: ${result.director || 'N/A'}`);
        console.log(`   - Genre: ${result.genre || 'N/A'}`);
        console.log(`   - Description: ${result.description ? result.description.substring(0, 100) + '...' : 'N/A'}`);
      } else {
        console.log(`❌ Non trouvé: ${title}`);
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }

    console.log(''); // Ligne vide
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test direct avec axios\n');
  
  await testSearch();
  
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 