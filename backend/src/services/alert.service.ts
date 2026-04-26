import { eq, ne } from 'drizzle-orm';
import { db } from '../config/db';
import { help } from '../db/schema';

export class AlertService {
    static async getActiveAlerts() {
        return await db.select().from(help).where(ne(help.status, 'resolved'));
    }

    static async resolveAlert(id: number) {
        await db.update(help).set({ status: 'resolved' }).where(eq(help.id, id));
        return true;
    }
}
