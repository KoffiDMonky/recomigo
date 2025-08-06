#!/usr/bin/env node

/**
 * Test de la sélection par ID TMDB
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

async function testSelectionById() {
  console.log('🔍 Test de la sélection par ID TMDB...\n');

  try {
    // Test avec "Jeux d'enfants" - récupérer les suggestions
    console.log('🎬 Recherche des suggestions pour "Jeux d\'enfants"...');
    const suggestions = await MovieService.searchMovieSuggestions('Jeux d\'enfants');
    
    if (suggestions && suggestions.length > 0) {
      console.log(`✅ ${suggestions.length} suggestions trouvées\n`);
      
      // Test avec les 3 premiers résultats
      for (let i = 0; i < Math.min(3, suggestions.length); i++) {
        const suggestion = suggestions[i];
        console.log(`🔍 Test ${i + 1}: "${suggestion.title}" (ID: ${suggestion.id}, Type: ${suggestion.mediaType})`);
        console.log(`   Réalisateur dans suggestion: ${suggestion.director || 'N/A'}`);
        
        // Récupérer les détails par ID
        const movieData = await MovieService.getMovieById(suggestion.id, suggestion.mediaType);
        
        if (movieData) {
          console.log(`✅ Détails récupérés:`);
          console.log(`   - Titre: ${movieData.title}`);
          console.log(`   - Année: ${movieData.year}`);
          console.log(`   - Type: ${movieData.type}`);
          console.log(`   - Réalisateur: ${movieData.director || 'N/A'}`);
          console.log(`   - Genre: ${movieData.genre || 'N/A'}`);
          console.log(`   - Note: ${movieData.rating || 'N/A'}`);
          
          // Vérifier la cohérence
          if (movieData.director === suggestion.director) {
            console.log(`✅ Cohérence OK: Réalisateur identique`);
          } else {
            console.log(`⚠️ Différence de réalisateur:`);
            console.log(`   Suggestion: ${suggestion.director || 'N/A'}`);
            console.log(`   Détails: ${movieData.director || 'N/A'}`);
          }
        } else {
          console.log(`❌ Impossible de récupérer les détails`);
        }
        
        console.log(''); // Ligne vide
      }
    } else {
      console.log('❌ Aucune suggestion trouvée');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Test spécifique pour "Jeux d'enfants" de Yann Samuell
async function testJeuxDenfantsYannSamuell() {
  console.log('🎯 Test spécifique pour "Jeux d\'enfants" de Yann Samuell...\n');
  
  try {
    const suggestions = await MovieService.searchMovieSuggestions('Jeux d\'enfants');
    
    // Chercher celui de Yann Samuell
    const yannSamuell = suggestions.find(s => s.director === 'Yann Samuell');
    
    if (yannSamuell) {
      console.log(`✅ Trouvé: "${yannSamuell.title}" (${yannSamuell.year})`);
      console.log(`   ID: ${yannSamuell.id}, Type: ${yannSamuell.mediaType}`);
      console.log(`   Réalisateur: ${yannSamuell.director}`);
      
      // Récupérer les détails par ID
      const movieData = await MovieService.getMovieById(yannSamuell.id, yannSamuell.mediaType);
      
      if (movieData) {
        console.log(`\n✅ Détails récupérés par ID:`);
        console.log(`   - Titre: ${movieData.title}`);
        console.log(`   - Année: ${movieData.year}`);
        console.log(`   - Réalisateur: ${movieData.director}`);
        console.log(`   - Genre: ${movieData.genre}`);
        console.log(`   - Description: ${movieData.description ? movieData.description.substring(0, 100) + '...' : 'N/A'}`);
        
        if (movieData.director === 'Yann Samuell') {
          console.log(`\n🎉 SUCCÈS: Les bonnes informations sont récupérées !`);
        } else {
          console.log(`\n❌ ERREUR: Mauvais réalisateur récupéré`);
        }
      } else {
        console.log(`❌ Impossible de récupérer les détails`);
      }
    } else {
      console.log('❌ Film de Yann Samuell non trouvé dans les suggestions');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test de la sélection par ID TMDB\n');
  
  await testSelectionById();
  await testJeuxDenfantsYannSamuell();
  
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 