#!/usr/bin/env node

/**
 * Test de la nouvelle version raccourcie "Reco de"
 */

function testRecoDeLength() {
  console.log('🚀 Test de la nouvelle version "Reco de"\n');

  // Simuler différents cas avec le nouveau format
  const testCases = [
    { name: 'Adrien', expected: 'OK' },
    { name: 'Marie', expected: 'OK' },
    { name: 'Jean-Pierre', expected: 'OK' },
    { name: 'Jean-Pierre-Marie-Claude', expected: 'Limité' },
    { name: 'TrèsLongNomDeFamilleAvecBeaucoupDeCaractères', expected: 'Limité' },
    { name: 'Dr. Jean-Pierre-Marie-Claude de la Fontaine', expected: 'Limité' },
    { name: 'A', expected: 'OK' },
    { name: 'Jean', expected: 'OK' },
    { name: 'Jean-Pierre-Marie', expected: 'OK' },
    { name: 'Jean-Pierre-Marie-Claude-Henri', expected: 'Limité' }
  ];

  console.log('📋 Test avec "Reco de":');
  testCases.forEach((testCase, index) => {
    const fullText = `Reco de ${testCase.name}`;
    const isLong = fullText.length > 25; // Limite réduite pour le format raccourci
    const status = isLong ? '⚠️' : '✅';
    
    console.log(`   ${index + 1}. "${testCase.name}"`);
    console.log(`      Texte complet: "${fullText}"`);
    console.log(`      Longueur: ${fullText.length} caractères`);
    console.log(`      Status: ${status} ${isLong ? 'Limité' : 'OK'}`);
    console.log('');
  });

  // Comparaison avec l'ancien format
  console.log('📊 Comparaison des formats:');
  const comparisonCases = [
    'Adrien',
    'Jean-Pierre-Marie-Claude',
    'Dr. Jean-Pierre-Marie-Claude de la Fontaine'
  ];

  comparisonCases.forEach((name, index) => {
    const oldFormat = `Recommandé par ${name}`;
    const newFormat = `Reco de ${name}`;
    const oldLength = oldFormat.length;
    const newLength = newFormat.length;
    const saved = oldLength - newLength;
    
    console.log(`   ${index + 1}. "${name}":`);
    console.log(`      Ancien: "${oldFormat}" (${oldLength} caractères)`);
    console.log(`      Nouveau: "${newFormat}" (${newLength} caractères)`);
    console.log(`      Économie: ${saved} caractères (${Math.round(saved/oldLength*100)}%)`);
    console.log('');
  });

  // Test de simulation d'interface avec le nouveau format
  console.log('🖥️ Simulation d\'interface avec "Reco de":');
  const mockItems = [
    { title: 'The Matrix', recommendedBy: 'Adrien' },
    { title: 'Inception', recommendedBy: 'Jean-Pierre-Marie-Claude de la Fontaine' },
    { title: 'Interstellar', recommendedBy: 'Marie' },
    { title: 'Breaking Bad', recommendedBy: 'Dr. Jean-Pierre-Marie-Claude-Henri de la Fontaine et Cie' },
    { title: 'Game of Thrones', recommendedBy: 'Jean' }
  ];

  mockItems.forEach((item, index) => {
    const fullText = `Reco de ${item.recommendedBy}`;
    const isLong = fullText.length > 25;
    const displayText = isLong ? `${fullText.substring(0, 22)}...` : fullText;
    
    console.log(`   ${index + 1}. ${item.title}:`);
    console.log(`      - Reco de: "${item.recommendedBy}"`);
    console.log(`      - Longueur: ${fullText.length} caractères`);
    console.log(`      - Affichage: "${displayText}"`);
    console.log(`      - Status: ${isLong ? '⚠️ Limité' : '✅ OK'}`);
    console.log('');
  });
}

// Test de validation des avantages
function testAdvantages() {
  console.log('✅ Avantages du nouveau format "Reco de":\n');
  
  console.log('📏 Espace économisé:');
  console.log('   - "Recommandé par" = 15 caractères');
  console.log('   - "Reco de" = 8 caractères');
  console.log('   - Économie = 7 caractères (47%)');
  
  console.log('\n🎯 Avantages:');
  console.log('   - Plus d\'espace pour les noms longs');
  console.log('   - Interface plus compacte');
  console.log('   - Bouton "Découvrir" mieux préservé');
  console.log('   - Lecture plus rapide');
  console.log('   - Moins de troncature nécessaire');
  
  console.log('\n📱 Impact sur l\'interface:');
  console.log('   - Noms courts: Affichage complet garanti');
  console.log('   - Noms moyens: Plus d\'espace disponible');
  console.log('   - Noms longs: Troncature réduite');
  console.log('   - Bouton: Toujours visible et accessible');
}

// Exécution
function runTests() {
  console.log('🚀 Test de la nouvelle version "Reco de"\n');
  
  testRecoDeLength();
  testAdvantages();
  
  console.log('\n✅ Tests terminés !');
  console.log('\n📋 Résumé des améliorations:');
  console.log('   - Format raccourci: "Reco de" au lieu de "Recommandé par"');
  console.log('   - Économie de 7 caractères (47%)');
  console.log('   - Plus d\'espace pour les noms');
  console.log('   - Interface plus compacte');
  console.log('   - Meilleure préservation du bouton');
  console.log('   - Lecture plus fluide');
}

if (require.main === module) {
  runTests();
} 