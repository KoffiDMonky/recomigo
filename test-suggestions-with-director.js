#!/usr/bin/env node

/**
 * Test des suggestions avec réalisateur
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

async function testSuggestionsWithDirector() {
  console.log('🔍 Test des suggestions avec réalisateur...\n');

  const testQueries = [
    'Jeux d\'enfants',
    'The Matrix',
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
          if (suggestion.director) {
            console.log(`     Réalisateur: ${suggestion.director}`);
          } else {
            console.log(`     Réalisateur: N/A`);
          }
          console.log('');
        });
        
      } else {
        console.log('❌ Aucune suggestion trouvée');
      }
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
    
    console.log(''); // Ligne vide
  }
}

// Test spécifique pour "Jeux d'enfants" avec réalisateurs
async function testJeuxDenfantsWithDirector() {
  console.log('🎯 Test spécifique pour "Jeux d\'enfants" avec réalisateurs...\n');
  
  try {
    const suggestions = await MovieService.searchMovieSuggestions('Jeux d\'enfants');
    
    console.log(`📋 ${suggestions.length} versions trouvées:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion.title} (${suggestion.year}) - ${suggestion.type}`);
      console.log(`     Note: ${suggestion.rating}`);
      if (suggestion.director) {
        console.log(`     Réalisé par: ${suggestion.director}`);
      } else {
        console.log(`     Réalisateur: N/A`);
      }
      console.log('');
    });
    
    if (suggestions.length > 0) {
      console.log('💡 L\'utilisateur pourra choisir parmi ces options avec les réalisateurs !');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test des suggestions avec réalisateur\n');
  
  await testSuggestionsWithDirector();
  await testJeuxDenfantsWithDirector();
  
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 