#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '..', 'config');
const envExamplePath = path.join(configDir, 'env.example.js');
const envPath = path.join(configDir, 'env.js');

// Check if env.js already exists
if (fs.existsSync(envPath)) {
    console.log('✅ Environment configuration already exists at config/env.js');
    console.log('   If you need to reset it, delete the file and run this script again.');
    process.exit(0);
}

// Check if env.example.js exists
if (!fs.existsSync(envExamplePath)) {
    console.error('❌ env.example.js not found at config/env.example.js');
    process.exit(1);
}

try {
    // Copy env.example.js to env.js
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Environment configuration created at config/env.js');
    console.log('📝 Please update the values in config/env.js according to your environment');
    console.log('🔧 You can find documentation in config/README.md');
} catch (error) {
    console.error('❌ Error creating environment configuration:', error.message);
    process.exit(1);
}
