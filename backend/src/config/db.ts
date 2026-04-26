import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

// Create the connection
const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/gayuh_db',
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
