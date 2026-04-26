import express from 'express';
import cors from 'cors';

import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());



import { db } from './config/db';
import { sql } from 'drizzle-orm';

app.get('/api/health', async (req, res) => {
    try {
        const result = await db.execute(sql`SELECT 1`);
        res.json({ status: 'ok', message: 'Gayuh ISP Backend is running', db: result });
    } catch(e) {
        res.status(500).json({ error: String(e) });
    }
});

import clientRoutes from './routes/client.routes';
import financeRoutes from './routes/finance.routes';
import networkRoutes from './routes/network.routes';
import alertRoutes from './routes/alert.routes';

// Use routes
app.use('/api/clients', clientRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/alerts', alertRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
