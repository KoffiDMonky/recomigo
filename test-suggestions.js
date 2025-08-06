#!/usr/bin/env node

/**
 * Test de la fonctionnalité de suggestions
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

async function testSuggestions() {
  console.log('🔍 Test des suggestions TMDB...\n');

  const testQueries = [
    'Jeux d\'enfants',
    'The Matrix',
    'Breaking Bad',
    'Inception'
  ];

  for (const query of testQueries) {
    console.log(`🎬 Recherche: "${query}"`);
    
    try {
      const suggestions = await MovieService.searchMovieSuggestions(query);
      
      if (suggestions && suggestions.length > 0) {
        console.log(`✅ ${suggestions.length} suggestions trouvées:`);
        
        suggestions.forEach((suggestion, index) => {
          console.log(`  ${index + 1}. ${suggestion.title} (${suggestion.year}) - ${suggestion.type}`);
          console.log(`     Note: ${suggestion.rating} | Image: ${suggestion.image ? '✅' : '❌'}`);
        });
        
        // Test avec le premier résultat
        console.log(`\n🔍 Test avec le premier résultat: "${suggestions[0].title}"`);
        const fullResult = await MovieService.searchMovieByTitle(suggestions[0].title);
        
        if (fullResult) {
          console.log(`✅ Détails complets: ${fullResult.title} (${fullResult.year})`);
          console.log(`   - Type: ${fullResult.type}`);
          console.log(`   - Note: ${fullResult.rating}`);
          console.log(`   - Réalisateur: ${fullResult.director || 'N/A'}`);
          console.log(`   - Genre: ${fullResult.genre || 'N/A'}`);
        } else {
          console.log('❌ Impossible de récupérer les détails complets');
        }
        
      } else {
        console.log('❌ Aucune suggestion trouvée');
      }
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
    
    console.log(''); // Ligne vide
  }
}

// Test spécifique pour "Jeux d'enfants"
async function testJeuxDenfants() {
  console.log('🎯 Test spécifique pour "Jeux d\'enfants"...\n');
  
  try {
    const suggestions = await MovieService.searchMovieSuggestions('Jeux d\'enfants');
    
    console.log(`📋 ${suggestions.length} versions trouvées:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion.title} (${suggestion.year}) - ${suggestion.type}`);
      console.log(`     Note: ${suggestion.rating}`);
    });
    
    if (suggestions.length > 0) {
      console.log('\n💡 L\'utilisateur pourra choisir parmi ces options !');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test de la fonctionnalité de suggestions\n');
  
  await testSuggestions();
  await testJeuxDenfants();
  
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 