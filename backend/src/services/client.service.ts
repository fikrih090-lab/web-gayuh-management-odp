import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { customer } from '../db/schema';

export class ClientService {
    static async getAllClients() {
        return await db.select().from(customer);
    }

    static async getClientById(id: number) {
        const result = await db.select().from(customer).where(eq(customer.customerId, id));
        return result[0];
    }

    static async createClient(data: Partial<typeof customer.$inferInsert>) {
        const fullData = {
            email: '-',
            registerDate: new Date().toISOString().split('T')[0],
            dueDate: 1,
            cStatus: 'Aktif',
            ppn: 0,
            noKtp: '-',
            ktp: '-',
            created: Math.floor(Date.now() / 1000),
            modeUser: 'pppoe',
            userMikrotik: '-',
            mitra: 1,
            coverage: 1,
            autoIsolir: 1,
            router: 1,
            codeunique: 0,
            phonecode: 62,
            userProfile: 'default',
            action: 1,
            typePayment: 1,
            maxDueIsolir: 0,
            olt: 1,
            connection: 1,
            macAddress: '-',
            level: 1,
            custDescription: '-',
            typeIp: 1,
            idOdc: 1,
            monthDueDate: 0,
            sendBill: 1,
            serialNumber: '-',
            passMikrotik: '-',
            slot: 1,
            port: 1,
            onuIndex: 1,
            onuType: '-',
            vlan: 0,
            noVa: '-',
            upOnu: '-',
            downOnu: '-',
            customerMitra: 1,
            createby: 1,
            ...data
        } as typeof customer.$inferInsert;
        const result = await db.insert(customer).values(fullData);
        return { customerId: result[0].insertId, ...fullData };
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
