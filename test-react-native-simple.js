#!/usr/bin/env node

/**
 * Test simple pour React Native sans node-fetch
 */

// Test de la logique sans API
function testLogic() {
  console.log('🧠 Test de la logique de base...\n');
  
  const netflixTitles = require('./data/netflixTitles.js');
  
  // Test avec quelques IDs
  const testIds = ['80211727', '80211728', '80211729', '99999999'];
  
  testIds.forEach(id => {
    const title = netflixTitles.findNetflixTitle(id);
    if (title) {
      console.log(`✅ ID ${id}: ${title.title} (${title.type})`);
    } else {
      console.log(`❌ ID ${id}: Non trouvé dans la base`);
    }
  });
}

// Test de parsing d'URL
function testUrlParsing() {
  console.log('\n🔗 Test de parsing d\'URL...\n');
  
  const urls = [
    'https://www.netflix.com/fr/title/80211727',
    'https://www.netflix.com/fr/title/80211728',
    'https://disneyplus.com/fr-FR/browse/entity-ca1ac46e-9883-4125-a6e8-97efce9a2bf5'
  ];
  
  urls.forEach(url => {
    const isNetflix = url.includes('netflix');
    const isDisney = url.includes('disney');
    console.log(`URL: ${url}`);
    console.log(`  - Netflix: ${isNetflix ? '✅' : '❌'}`);
    console.log(`  - Disney: ${isDisney ? '✅' : '❌'}`);
  });
}

// Exécution
function runTests() {
  console.log('🚀 Tests simples pour React Native\n');
  testLogic();
  testUrlParsing();
  console.log('\n✅ Tests terminés !');
}

if (require.main === module) {
  runTests();
} 