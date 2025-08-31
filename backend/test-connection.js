const http = require('http');

// Test de connexion au backend
const testBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/test', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'Timeout après 5 secondes' });
    });
  });
};

// Exécute le test
const runTest = async () => {
  console.log('🧪 Test de connexion au backend...');
  const result = await testBackend();
  
  if (result.error) {
    console.log('❌ Le backend n\'est pas accessible:', result.error);
    console.log('\n🔧 Solutions possibles:');
    console.log('1. Vérifiez que le backend est démarré: node server.js');
    console.log('2. Vérifiez que le port 5000 n\'est pas occupé');
    console.log('3. Essayez un port différent (5001, 3001, etc.)');
  } else {
    console.log('✅ Backend accessible:', result.status, result.data);
  }
};

runTest();