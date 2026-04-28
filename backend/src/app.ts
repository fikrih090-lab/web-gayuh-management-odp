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
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

// Use routes
app.use('/api/clients', clientRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // === CACHE WARMING ===
    // Pre-load data saat server pertama nyala, agar request pertama dari browser langsung cepat
    console.log('[Cache Warm] Starting background cache warm-up...');
    
    try {
        const { NetworkService } = await import('./services/network.service');
        const { ClientService } = await import('./services/client.service');
        
        // Jalankan keduanya bersamaan
        await Promise.all([
            NetworkService.getAllOdps().then(r  => console.log(`[Cache Warm] ✅ ODPs: ${r.length} data`)),
            ClientService.getAllClients().then(r => console.log(`[Cache Warm] ✅ Clients: ${r.length} data`)),
        ]);
        
        console.log('[Cache Warm] ✅ Cache ready! Aplikasi siap digunakan.');
    } catch (e) {
        console.warn('[Cache Warm] ⚠️ Warm-up failed (will load on first request):', (e as any).message);
    }
});
