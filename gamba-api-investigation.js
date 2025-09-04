#!/usr/bin/env node

/**
 * Gamba API Investigation Script
 * This script will test all known Gamba API endpoints to investigate creator fee discrepancies
 */

const CREATOR_ADDRESS = '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ';
const API_BASE = 'https://api.gamba.so';

// Known Gamba API endpoints based on common patterns and gamba-react-ui-v2 package
const endpoints = [
  // Stats endpoints
  `/stats`,
  `/stats?creator=${CREATOR_ADDRESS}`,
  `/stats/${CREATOR_ADDRESS}`,
  `/creator/${CREATOR_ADDRESS}/stats`,
  `/creator/${CREATOR_ADDRESS}/fees`,
  `/creator/${CREATOR_ADDRESS}/revenue`,
  `/platform/${CREATOR_ADDRESS}/stats`,
  
  // Events/Games endpoints
  `/events`,
  `/events?creator=${CREATOR_ADDRESS}`,
  `/events/settledGames?creator=${CREATOR_ADDRESS}`,
  `/games?creator=${CREATOR_ADDRESS}`,
  `/transactions?creator=${CREATOR_ADDRESS}`,
  
  // Creator-specific endpoints
  `/creator/${CREATOR_ADDRESS}`,
  `/creator/${CREATOR_ADDRESS}/players`,
  `/creator/${CREATOR_ADDRESS}/volume`,
  `/creator/${CREATOR_ADDRESS}/plays`,
  
  // Platform endpoints
  `/platform/${CREATOR_ADDRESS}`,
  `/platforms`,
  `/platforms/${CREATOR_ADDRESS}`,
  
  // Pool/liquidity endpoints
  `/pools`,
  `/pools?creator=${CREATOR_ADDRESS}`,
  `/liquidity?creator=${CREATOR_ADDRESS}`,
  
  // Fee-related endpoints
  `/fees`,
  `/fees?creator=${CREATOR_ADDRESS}`,
  `/revenue`,
  `/revenue?creator=${CREATOR_ADDRESS}`,
];

async function testEndpoint(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    console.log(`\n🔍 Testing: ${url}`);
    
    const response = await fetch(url);
    const status = response.status;
    
    if (status === 200) {
      const data = await response.json();
      console.log(`✅ ${status} - SUCCESS`);
      
      // Look for fee-related fields
      const feeFields = findFeeFields(data);
      if (feeFields.length > 0) {
        console.log(`💰 Fee-related fields found:`, feeFields);
      }
      
      // Show first few items if it's an array
      if (Array.isArray(data)) {
        console.log(`📊 Response: Array with ${data.length} items`);
        if (data.length > 0) {
          console.log(`First item:`, JSON.stringify(data[0], null, 2));
        }
      } else {
        console.log(`📊 Response:`, JSON.stringify(data, null, 2));
      }
      
    } else if (status === 404) {
      console.log(`❌ ${status} - Not Found`);
    } else if (status === 400) {
      console.log(`⚠️  ${status} - Bad Request`);
      const text = await response.text();
      console.log(`Error: ${text}`);
    } else {
      console.log(`⚠️  ${status} - ${response.statusText}`);
      const text = await response.text();
      console.log(`Response: ${text.substring(0, 200)}...`);
    }
    
  } catch (error) {
    console.log(`💥 ERROR: ${error.message}`);
  }
}

function findFeeFields(obj, path = '') {
  const feeFields = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return feeFields;
  }
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      feeFields.push(...findFeeFields(item, `${path}[${index}]`));
    });
  } else {
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      
      // Check if key contains fee/revenue related terms
      if (key.toLowerCase().includes('fee') || 
          key.toLowerCase().includes('revenue') || 
          key.toLowerCase().includes('earn') ||
          key.toLowerCase().includes('profit') ||
          key.toLowerCase().includes('creator') ||
          key.toLowerCase().includes('platform')) {
        feeFields.push({ path: currentPath, key, value });
      }
      
      // Recurse into nested objects
      if (typeof value === 'object' && value !== null) {
        feeFields.push(...findFeeFields(value, currentPath));
      }
    });
  }
  
  return feeFields;
}

async function main() {
  console.log('🚀 Starting Gamba API Investigation');
  console.log(`🎯 Target Creator: ${CREATOR_ADDRESS}`);
  console.log(`🌐 API Base: ${API_BASE}`);
  console.log(`📊 Testing ${endpoints.length} endpoints...\n`);
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🏁 Investigation complete!');
  console.log('\n💡 Look for:');
  console.log('   - Different fee amounts across endpoints');
  console.log('   - Creator-specific vs platform-wide fees');
  console.log('   - Historical vs current fee data');
  console.log('   - Any endpoints showing 6.65% fee rates');
  console.log('   - Fee accumulation vs distribution endpoints');
}

// Run the investigation
main().catch(console.error);
