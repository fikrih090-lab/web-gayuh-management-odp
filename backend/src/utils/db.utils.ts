import { connectionPools } from '../config/db';

// Cache the database list for 5 minutes to avoid repeated SHOW DATABASES calls
let dbCache: { hostId: string; pool: any; dbName: string }[] | null = null;
let dbCacheExpiry = 0;

export async function getAllowedDatabases() {
    const now = Date.now();
    
    // Return cache if still valid (5 minutes TTL)
    if (dbCache && now < dbCacheExpiry) {
        return dbCache;
    }

    const excludedDbs = [
        'information_schema', 
        'mysql', 
        'performance_schema', 
        'phpmyadmin', 
        'sys'
    ];
    
    // Query all hosts in PARALLEL
    const hostEntries = Array.from(connectionPools.entries());
    const results = await Promise.all(
        hostEntries.map(async ([hostId, pool]) => {
            try {
                const [dbs] = await pool.query('SHOW DATABASES');
                return (dbs as any[])
                    .map(d => d.Database)
                    .filter((name: string) => !excludedDbs.includes(name))
                    .map((dbName: string) => ({ hostId, pool, dbName }));
            } catch (e) {
                console.error(`Failed to fetch databases for host ${hostId}`, (e as any).message);
                return [];
            }
        })
    );
    
    dbCache = results.flat();
    dbCacheExpiry = now + 5 * 60 * 1000; // 5 minutes
    
    console.log(`[DB Cache] Loaded ${dbCache.length} databases from ${hostEntries.length} hosts`);
    return dbCache;
}

export function invalidateDbCache() {
    dbCache = null;
    dbCacheExpiry = 0;
}

export function toCamelCase(obj: any) {
    if (!obj || typeof obj !== 'object') return obj;
    const newObj: any = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[camelKey] = obj[key];
    }
    return newObj;
}

export function toSnakeCase(str: string) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
