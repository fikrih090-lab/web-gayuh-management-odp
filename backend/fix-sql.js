const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, 'drizzle/0000_naive_menace.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');

// Replace AUTO_INCREMENT NOT NULL with AUTO_INCREMENT PRIMARY KEY NOT NULL
sql = sql.replace(/AUTO_INCREMENT NOT NULL/g, 'AUTO_INCREMENT PRIMARY KEY NOT NULL');

// Replace DEFAULT 'NULL' with DEFAULT NULL
sql = sql.replace(/DEFAULT 'NULL'/g, 'DEFAULT NULL');

// Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
sql = sql.replace(/CREATE TABLE `/g, 'CREATE TABLE IF NOT EXISTS `');

fs.writeFileSync(sqlPath, sql);
console.log('✅ Applied fixes to SQL file (PRIMARY KEY, NULL defaults, IF NOT EXISTS)');
