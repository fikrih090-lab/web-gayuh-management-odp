import { eq } from 'drizzle-orm';
import { db, connectionPools } from '../config/db';
import { mOdp, mOdc } from '../db/schema';
import { getAllowedDatabases, toCamelCase } from '../utils/db.utils';

// Result cache: 2 minutes TTL
let odpCache: any[] | null = null;
let odpCacheExpiry = 0;
export function invalidateOdpCache() { odpCache = null; odpCacheExpiry = 0; }

export class NetworkService {
    static async getAllOdps() {
        const now = Date.now();
        if (odpCache && now < odpCacheExpiry) {
            return odpCache;
        }

        const targetDbs = await getAllowedDatabases();
        const odpMap = new Map<string, any>();

        // Step 1: Fetch ODP dari SEMUA database secara parallel
        // Map otomatis deduplicate — code_odp yang sama hanya simpan satu
        const fetchResults = await Promise.all(
            targetDbs.map(async ({ hostId, pool, dbName }) => {
                try {
                    const [rows] = await pool.query(`SELECT * FROM \`${dbName}\`.m_odp`);
                    return { hostId, dbName, rows: rows as any[] };
                } catch {
                    return { hostId, dbName, rows: [] };
                }
            })
        );

        for (const { hostId, dbName, rows } of fetchResults) {
            for (const row of rows) {
                const camelRow = toCamelCase(row);
                // Normalisasi kode ke Uppercase
                const odpCode = camelRow.codeOdp ? String(camelRow.codeOdp).toUpperCase().trim() : null;
                if (!odpCode) continue;

                const existing = odpMap.get(odpCode);
                
                const isNewer = !existing || 
                                (hostId === '2' && existing.hostId !== '2') || 
                                (hostId === '3' && existing.hostId !== '2' && existing.hostId !== '3') ||
                                (existing.hostId === hostId && camelRow.created > existing.created);

                if (isNewer) {
                    odpMap.set(odpCode, {
                        ...camelRow,
                        originalId: camelRow.idOdp,
                        codeOdp:    odpCode, // Pastikan codeOdp juga UPPERCASE
                        idOdp:      odpCode, // key untuk matching
                        usedPorts:  0,
                        sourceDb:   dbName,
                        hostId:     hostId
                    });
                }
            }
        }

        // Step 2: Hitung total usedPorts dari SEMUA database (dijumlah lintas mitra)
        const countResults = await Promise.all(
            targetDbs.map(async ({ pool, dbName }) => {
                try {
                    const [rows] = await pool.query(`
                        SELECT o.code_odp, COUNT(c.customer_id) AS used_ports
                        FROM \`${dbName}\`.m_odp o
                        LEFT JOIN \`${dbName}\`.customer c ON c.id_odp = o.id_odp
                        GROUP BY o.code_odp
                    `);
                    return rows as any[];
                } catch { return []; }
            })
        );

        for (const rows of countResults) {
            for (const row of rows) {
                if (!row.code_odp) continue;
                const normalizedCode = String(row.code_odp).toUpperCase().trim();
                const entry = odpMap.get(normalizedCode);
                if (entry) entry.usedPorts += Number(row.used_ports || 0);
            }
        }

        odpCache = Array.from(odpMap.values())
            .filter(odp => {
                const hasCoordinates = odp.latitude && Number(odp.latitude) !== 0;
                const hasClients = (odp.usedPorts || 0) > 0;
                return hasCoordinates || hasClients;
            })
            .sort((a, b) => String(a.codeOdp || '').localeCompare(String(b.codeOdp || ''), 'id', { sensitivity: 'base' }));
        odpCacheExpiry = Date.now() + 2 * 60 * 1000;
        console.log(`[ODP Cache] Cached ${odpCache.length} ODP unik dari ${targetDbs.length} database (sorted A-Z)`);
        return odpCache;
    }

    static async getOdpById(idStr: string | number) {
        if (typeof idStr === 'string' && idStr.includes('_')) {
            const parts = idStr.split('_');
            const id = parts.pop();
            const hostId = parts.shift();
            const dbName = parts.join('_');
            
            const pool = connectionPools.get(hostId);
            if (!pool) return null;

            try {
                const [rows] = await pool.query(`SELECT * FROM \`${dbName}\`.m_odp WHERE id_odp = ?`, [id]);
                if ((rows as any[]).length > 0) {
                    const camelRow = toCamelCase((rows as any[])[0]);
                    return {
                        ...camelRow,
                        idOdp: idStr,
                        sourceDb: dbName,
                        hostId: hostId
                    };
                }
            } catch (e) {}
            return null;
        }

        const result = await db.select().from(mOdp).where(eq(mOdp.idOdp, Number(idStr)));
        return result[0];
    }

    static async createOdp(data: Partial<typeof mOdp.$inferInsert>) {
        const fullData = {
            codeOdc: 1,
            coverageOdp: 1,
            noPortOdc: 1,
            colorTubeFo: '-',
            noPole: '-',
            document: '',
            remark: '',
            created: Math.floor(Date.now() / 1000),
            createBy: 1,
            roleId: 1,
            ...data
        } as typeof mOdp.$inferInsert;
        
        const result = await db.insert(mOdp).values(fullData);
        return { idOdp: result[0].insertId, ...fullData };
    }

    static async getAllOdcs() {
        return await db.select().from(mOdc);
    }
}
