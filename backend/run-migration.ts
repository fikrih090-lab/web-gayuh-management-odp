import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function runMigration() {
  console.log('Connecting to database...');
  const poolConnection = mysql.createPool(process.env.DATABASE_URL);
  
  const db = drizzle(poolConnection);
  
  console.log('Running migrations...');
  try {
    await migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await poolConnection.end();
    process.exit(0);
  }
}

runMigration();
