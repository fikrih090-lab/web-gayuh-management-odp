import { eq } from 'drizzle-orm';
import { db, connectionPools } from '../config/db';
import { customer } from '../db/schema';
import { getAllowedDatabases, toCamelCase, toSnakeCase } from '../utils/db.utils';

// Result cache: 2 minutes TTL
let clientCache: any[] | null = null;
let clientCacheExpiry = 0;
export function invalidateClientCache() { clientCache = null; clientCacheExpiry = 0; }

export class ClientService {
    static async getAllClients() {
        const now = Date.now();
        if (clientCache && now < clientCacheExpiry) {
            return clientCache;
        }

        const targetDbs = await getAllowedDatabases();

        // Query all databases in PARALLEL
        const results = await Promise.all(
            targetDbs.map(async ({ hostId, pool, dbName }) => {
                try {
                    // JOIN dengan m_odp untuk mendapatkan code_odp agar bisa dimatch di frontend
                    const [rows] = await pool.query(`
                        SELECT c.*, o.code_odp 
                        FROM \`${dbName}\`.customer c
                        LEFT JOIN \`${dbName}\`.m_odp o ON c.id_odp = o.id_odp
                    `);
                    return { hostId, dbName, rows: rows as any[] };
                } catch (e) {
                    return { hostId, dbName, rows: [] };
                }
            })
        );
        
        const allCustomers: any[] = [];
        for (const { hostId, dbName, rows } of results) {
            for (const row of rows) {
                const camelRow = toCamelCase(row);
                const normalizedCode = camelRow.codeOdp
                    ? String(camelRow.codeOdp).toUpperCase().trim()
                    : null;
                
                allCustomers.push({
                    ...camelRow,
                    originalId: camelRow.customerId,
                    customerId: `${hostId}_${dbName}_${camelRow.customerId}`,
                    // odpCode: kode ODP yang sudah dinormalisasi (UPPERCASE), field tunggal untuk matching
                    odpCode: normalizedCode || String(camelRow.idOdp || ''),
                    sourceDb: dbName,
                    hostId: hostId
                });
            }
        }
        
        clientCache = allCustomers
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'id', { sensitivity: 'base' }));
        clientCacheExpiry = Date.now() + 2 * 60 * 1000;
        console.log(`[Client Cache] Cached ${clientCache.length} clients dari ${new Set(allCustomers.map(c => c.hostId)).size} host (sorted)`);
        return clientCache;
    }


    static async getClientById(idStr: string | number) {
        if (typeof idStr === 'string' && idStr.includes('_')) {
            const parts = idStr.split('_');
            const id = parts.pop();
            const hostId = parts.shift();
            const dbName = parts.join('_');
            
            const pool = connectionPools.get(hostId);
            if (!pool) return null;

            try {
                const [rows] = await pool.query(`SELECT * FROM \`${dbName}\`.customer WHERE customer_id = ?`, [id]);
                if ((rows as any[]).length > 0) {
                    const camelRow = toCamelCase((rows as any[])[0]);
                    return {
                        ...camelRow,
                        customerId: idStr,
                        sourceDb: dbName,
                        hostId: hostId
                    };
                }
            } catch (e) {}
            return null;
        }

        const result = await db.select().from(customer).where(eq(customer.customerId, Number(idStr)));
        return result[0];
    }

    static async createClient(data: any) {
        // Map form fields ke nama kolom database yang tepat
        const mapped: any = {
            name:            data.name            || '-',
            no_services:     data.noServices      || data.typeId        || '-',
            email:           data.email           || '-',
            register_date:   new Date().toISOString().split('T')[0],
            due_date:        data.dueDate         || 1,
            address:         data.address         || '-',
            no_wa:           data.noWa            || data.no_wa         || '-',
            c_status:        data.cStatus         || 'Aktif',
            ppn:             data.ppn             || 0,
            no_ktp:          data.noKtp           || '-',
            ktp:             data.ktp             || '-',
            created:         Math.floor(Date.now() / 1000),
            mode_user:       data.modeUser        || 'pppoe',
            user_mikrotik:   data.userMikrotik    || '-',
            mitra:           data.mitra           || 1,
            coverage:        data.coverage        || 1,
            auto_isolir:     data.autoIsolir      || 1,
            type_id:         data.typeId          || '-',
            router:          data.router          || 1,
            codeunique:      data.codeunique      || 0,
            phonecode:       data.phonecode       || 62,
            latitude:        data.latitude        || '0',
            longitude:       data.longitude       || '0',
            user_profile:    data.userProfile     || 'default',
            action:          data.action          || 1,
            type_payment:    data.typePayment     || 1,
            max_due_isolir:  data.maxDueIsolir    || 0,
            olt:             data.olt             || 1,
            connection:      data.connection      || 1,
            cust_amount:     data.custAmount      || data.cust_amount   || 0,
            mac_address:     data.macAddress      || '-',
            level:           data.level           || 1,
            cust_description: data.custDescription || '-',
            type_ip:         data.typeIp          || 1,
            id_odc:          data.idOdc           || 1,
            id_odp:          data.idOdp           || 0,
            no_port_odp:     data.noPortOdp       || data.no_port_odp   || 1,
            month_due_date:  data.monthDueDate    || 0,
            send_bill:       data.sendBill        || 1,
            serial_number:   data.serialNumber    || '-',
            pass_mikrotik:   data.passMikrotik    || '-',
            slot:            data.slot            || 1,
            port:            data.port            || 1,
            onu_index:       data.onuIndex        || 1,
            onu_type:        data.onuType         || '-',
            vlan:            data.vlan            || 0,
            no_va:           data.noVa            || '-',
            up_onu:          data.upOnu           || '-',
            down_onu:        data.downOnu         || '-',
            customer_mitra:  data.customerMitra   || 1,
            createby:        data.createby        || 1,
        };

        const targetHost = data.targetHost || 'default';
        const targetDb   = data.targetDb   || 'gayuh';
        const pool = connectionPools.get(targetHost);
        
        if (pool) {
            // Resolve id_odp dari code_odp jika masih string
            if (typeof mapped.id_odp === 'string' && isNaN(Number(mapped.id_odp))) {
                try {
                    const [odpRows] = await pool.query(
                        `SELECT id_odp FROM \`${targetDb}\`.m_odp WHERE code_odp = ?`,
                        [mapped.id_odp]
                    );
                    mapped.id_odp = (odpRows as any[]).length > 0 ? (odpRows as any[])[0].id_odp : 0;
                } catch(e) { mapped.id_odp = 0; }
            }

            const keys         = Object.keys(mapped);
            const values       = Object.values(mapped);
            const placeholders = values.map(() => '?').join(', ');
            
            try {
                const [result] = await pool.query(
                    `INSERT INTO \`${targetDb}\`.customer (${keys.join(', ')}) VALUES (${placeholders})`,
                    values
                );
                invalidateClientCache();
                return { customerId: `${targetHost}_${targetDb}_${(result as any).insertId}`, ...mapped };
            } catch (e) {
                console.error('Insert error:', e);
                throw e;
            }
        }

        // Fallback ke default DB
        const result = await db.insert(customer).values(mapped as any);
        return { customerId: result[0].insertId, ...mapped };
    }

    static async updateClient(id: number, data: Partial<typeof customer.$inferInsert>) {
        await db.update(customer).set(data).where(eq(customer.customerId, id));
        return { customerId: id, ...data };
    }

    static async deleteClient(id: number) {
        await db.delete(customer).where(eq(customer.customerId, id));
        return true;
    }
}
