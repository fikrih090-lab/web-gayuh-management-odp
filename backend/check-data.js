const fs = require('fs');
const path = require('path');

function readJsonSafe(filePath) {
  let raw16 = fs.readFileSync(filePath, 'utf16le');
  if (raw16.charCodeAt(0) === 0xFEFF) {
    raw16 = raw16.slice(1);
  }
  return JSON.parse(raw16);
}

try {
  const clientsPath = path.join(__dirname, '../temp_test.json');
  const clients = readJsonSafe(clientsPath);
  console.log('Keys in temp_test.json:', Object.keys(clients));
  if (clients.data && clients.data.length > 0) {
    console.log('First item keys:', Object.keys(clients.data[0]));
    console.log('First item name:', clients.data[0].name || clients.data[0].cName || 'No name field');
  }
} catch (e) {
  console.error('Error:', e);
}
