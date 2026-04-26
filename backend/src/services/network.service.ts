import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { mOdp, mOdc } from '../db/schema';

export class NetworkService {
    static async getAllOdps() {
        return await db.select().from(mOdp);
    }

    static async getOdpById(id: number) {
        const result = await db.select().from(mOdp).where(eq(mOdp.idOdp, id));
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
