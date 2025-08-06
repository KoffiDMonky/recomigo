#!/usr/bin/env node

/**
 * Test de l'affichage conditionnel du champ "Recommandé par"
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

async function testRecommendedByDisplay() {
  console.log('👤 Test de l\'affichage conditionnel "Recommandé par"...\n');

  try {
    // Test avec "The Matrix" pour récupérer des données
    console.log('🎬 Recherche "The Matrix"...');
    const suggestions = await MovieService.searchMovieSuggestions('The Matrix');
    
    if (suggestions && suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      console.log(`✅ Trouvé: "${firstSuggestion.title}" (${firstSuggestion.year})`);
      
      // Simuler différents cas de "Recommandé par"
      const testCases = [
        { recommendedBy: '', expected: 'Ne pas afficher' },
        { recommendedBy: '   ', expected: 'Ne pas afficher (espaces)' },
        { recommendedBy: 'Adrien', expected: 'Afficher' },
        { recommendedBy: 'Marie', expected: 'Afficher' },
        { recommendedBy: null, expected: 'Ne pas afficher' },
        { recommendedBy: undefined, expected: 'Ne pas afficher' }
      ];
      
      console.log('\n📋 Test des différents cas:');
      testCases.forEach((testCase, index) => {
        const shouldDisplay = testCase.recommendedBy && testCase.recommendedBy.trim();
        const status = shouldDisplay ? '✅' : '❌';
        console.log(`   ${index + 1}. "${testCase.recommendedBy}" → ${status} ${testCase.expected}`);
      });
      
      // Test avec des données réelles
      console.log('\n🎯 Test avec données réelles:');
      const movieData = await MovieService.getMovieById(firstSuggestion.id, firstSuggestion.mediaType);
      
      if (movieData) {
        console.log(`   - Titre: ${movieData.title}`);
        console.log(`   - Recommandé par: "${movieData.recommendedBy || 'Non défini'}"`);
        
        // Simuler l'affichage conditionnel
        const shouldDisplay = movieData.recommendedBy && movieData.recommendedBy.trim();
        console.log(`   - Affichage: ${shouldDisplay ? '✅ Afficher' : '❌ Ne pas afficher'}`);
      }
      
    } else {
      console.log('❌ Aucun résultat trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Test de validation de la logique
function testDisplayLogic() {
  console.log('\n🧠 Test de la logique d\'affichage...\n');

  const testCases = [
    { input: '', expected: false, description: 'Chaîne vide' },
    { input: '   ', expected: false, description: 'Espaces uniquement' },
    { input: 'Adrien', expected: true, description: 'Nom valide' },
    { input: 'Marie', expected: true, description: 'Autre nom valide' },
    { input: null, expected: false, description: 'Valeur null' },
    { input: undefined, expected: false, description: 'Valeur undefined' },
    { input: 'A', expected: true, description: 'Nom court' },
    { input: 'Jean-Pierre', expected: true, description: 'Nom avec tiret' }
  ];

  console.log('📊 Résultats des tests:');
  testCases.forEach((testCase, index) => {
    const result = testCase.input && testCase.input.trim();
    const status = (result === !!testCase.expected) ? '✅' : '❌';
    console.log(`   ${index + 1}. ${testCase.description}:`);
    console.log(`      Input: "${testCase.input}"`);
    console.log(`      Expected: ${testCase.expected}`);
    console.log(`      Result: ${result}`);
    console.log(`      Status: ${status}`);
    console.log('');
  });
}

// Test de simulation d'interface
function testInterfaceSimulation() {
  console.log('\n🖥️ Simulation d\'interface...\n');

  const mockItems = [
    { title: 'The Matrix', recommendedBy: 'Adrien' },
    { title: 'Inception', recommendedBy: '' },
    { title: 'Interstellar', recommendedBy: '   ' },
    { title: 'Breaking Bad', recommendedBy: 'Marie' },
    { title: 'Game of Thrones', recommendedBy: null },
    { title: 'Stranger Things', recommendedBy: undefined }
  ];

  console.log('📱 Affichage des cartes:');
  mockItems.forEach((item, index) => {
    const shouldDisplay = item.recommendedBy && item.recommendedBy.trim();
    const displayText = shouldDisplay ? `Recommandé par ${item.recommendedBy}` : 'Aucune recommandation';
    
    console.log(`   ${index + 1}. ${item.title}:`);
    console.log(`      - Recommandé par: "${item.recommendedBy || 'Non défini'}"`);
    console.log(`      - Affichage: ${shouldDisplay ? '✅' : '❌'} ${displayText}`);
    console.log('');
  });
}

// Exécution
async function runTests() {
  console.log('🚀 Test de l\'affichage conditionnel "Recommandé par"\n');
  
  await testRecommendedByDisplay();
  testDisplayLogic();
  testInterfaceSimulation();
  
  console.log('\n✅ Tests terminés !');
  console.log('\n📋 Résumé:');
  console.log('   - Champ vide → Ne pas afficher');
  console.log('   - Champ avec espaces → Ne pas afficher');
  console.log('   - Champ avec texte → Afficher');
  console.log('   - Valeur null/undefined → Ne pas afficher');
  console.log('   - Logique conditionnelle implémentée');
}

if (require.main === module) {
  runTests();
} 