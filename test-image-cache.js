#!/usr/bin/env node

/**
 * Test du cache d'images
 */

// Simulation de l'environnement React Native avec axios
const axios = require('axios');
global.axios = axios;

// Import du service
const MovieService = require('./services/MovieService.js');

async function testImageCache() {
  console.log('🖼️ Test du cache d\'images...\n');

  try {
    // Test avec "Jeux d'enfants"
    console.log('🎬 Recherche des suggestions pour "Jeux d\'enfants"...');
    const suggestions = await MovieService.searchMovieSuggestions('Jeux d\'enfants');
    
    if (suggestions && suggestions.length > 0) {
      console.log(`✅ ${suggestions.length} suggestions trouvées\n`);
      
      // Test avec le premier résultat
      const firstSuggestion = suggestions[0];
      console.log(`🔍 Test avec: "${firstSuggestion.title}" (${firstSuggestion.year})`);
      console.log(`   Image: ${firstSuggestion.image ? '✅' : '❌'}`);
      console.log(`   Réalisateur: ${firstSuggestion.director || 'N/A'}`);
      
      // Récupérer les détails complets
      const movieData = await MovieService.getMovieById(firstSuggestion.id, firstSuggestion.mediaType);
      
      if (movieData) {
        console.log(`\n✅ Détails récupérés:`);
        console.log(`   - Titre: ${movieData.title}`);
        console.log(`   - Année: ${movieData.year}`);
        console.log(`   - Image: ${movieData.image ? '✅' : '❌'}`);
        console.log(`   - Réalisateur: ${movieData.director || 'N/A'}`);
        console.log(`   - Genre: ${movieData.genre || 'N/A'}`);
        
        if (movieData.image) {
          console.log(`   - URL image: ${movieData.image.substring(0, 50)}...`);
        }
      } else {
        console.log('❌ Impossible de récupérer les détails');
      }
      
    } else {
      console.log('❌ Aucune suggestion trouvée');
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Test avec plusieurs films pour vérifier le cache
async function testMultipleImages() {
  console.log('\n🔄 Test avec plusieurs films...\n');

  const testTitles = ['The Matrix', 'Inception', 'Interstellar'];
  
  for (const title of testTitles) {
    console.log(`🎬 Test: "${title}"`);
    
    try {
      const suggestions = await MovieService.searchMovieSuggestions(title);
      
      if (suggestions && suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        console.log(`   - Image disponible: ${firstSuggestion.image ? '✅' : '❌'}`);
        
        // Récupérer les détails
        const movieData = await MovieService.getMovieById(firstSuggestion.id, firstSuggestion.mediaType);
        
        if (movieData) {
          console.log(`   - Image dans détails: ${movieData.image ? '✅' : '❌'}`);
        }
      }
    } catch (error) {
      console.log(`   - Erreur: ${error.message}`);
    }
    
    console.log(''); // Ligne vide
  }
}

// Test de performance du cache
async function testCachePerformance() {
  console.log('\n⚡ Test de performance du cache...\n');

  try {
    const startTime = Date.now();
    
    // Première recherche (devrait télécharger)
    console.log('📥 Première recherche (téléchargement)...');
    const suggestions1 = await MovieService.searchMovieSuggestions('The Matrix');
    
    const firstTime = Date.now() - startTime;
    console.log(`   Temps: ${firstTime}ms`);
    
    // Deuxième recherche (devrait utiliser le cache)
    console.log('📦 Deuxième recherche (cache)...');
    const startTime2 = Date.now();
    const suggestions2 = await MovieService.searchMovieSuggestions('The Matrix');
    
    const secondTime = Date.now() - startTime2;
    console.log(`   Temps: ${secondTime}ms`);
    
    if (secondTime < firstTime) {
      console.log(`✅ Cache fonctionne: ${secondTime}ms < ${firstTime}ms`);
    } else {
      console.log(`⚠️ Cache peut-être lent: ${secondTime}ms >= ${firstTime}ms`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur performance: ${error.message}`);
  }
}

// Exécution
async function runTests() {
  console.log('🚀 Test du cache d\'images\n');
  
  await testImageCache();
  await testMultipleImages();
  await testCachePerformance();
  
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 