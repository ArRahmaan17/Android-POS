#!/usr/bin/env node

const axios = require('axios');

const testNetworkConnection = async () => {
    console.log('🔍 Testing network connectivity...\n');

    const endpoints = [
        { name: 'Google DNS', url: 'https://8.8.8.8' },
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'Your API Server', url: 'http://10.0.2.2:8000/api' }
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.name} (${endpoint.url})...`);
            const startTime = Date.now();

            const response = await axios.get(endpoint.url, {
                timeout: 5000,
                validateStatus: () => true // Accept any status code
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            console.log(`✅ ${endpoint.name}: ${response.status} (${responseTime}ms)`);

            if (endpoint.name === 'Your API Server' && response.status === 200) {
                console.log('   📡 API server is responding correctly');
            }

        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);

            if (endpoint.name === 'Your API Server') {
                console.log('   🔧 Troubleshooting tips:');
                console.log('   - Make sure your API server is running on port 8000');
                console.log('   - Check if the server is accessible from your device/emulator');
                console.log('   - For Android emulator, use 10.0.2.2 instead of localhost');
                console.log('   - For iOS simulator, use localhost or your computer\'s IP');
            }
        }
        console.log('');
    }

    console.log('📋 Network test completed!');
};

testNetworkConnection().catch(console.error);
