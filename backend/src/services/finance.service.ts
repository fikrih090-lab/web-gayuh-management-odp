import { eq, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { invoice, customer } from '../db/schema';

export class FinanceService {
    static async getAllInvoices() {
        return await db.select({
            id: invoice.invoiceId,
            amount: invoice.amount,
            month: invoice.month,
            year: invoice.year,
            status: invoice.status,
            datePayment: invoice.datePayment,
            clientName: customer.name
        }).from(invoice).leftJoin(customer, eq(invoice.noServices, customer.noServices));
    }

    static async generateMonthlyInvoices(month: string, year: number) {
        // Find active clients
        const activeClients = await db.select().from(customer).where(eq(customer.cStatus, 'active'));
        const newInvoices = activeClients.map(client => ({
            invoice: `INV-${client.noServices}-${year}${month}`,
            codeUnique: Math.floor(Math.random() * 1000),
            month: month,
            year: year,
            noServices: client.noServices,
            status: 'unpaid',
            iPpn: client.ppn,
            created: Math.floor(Date.now() / 1000),
            createBy: 1, // System
            metodePayment: '',
            adminFee: 0,
            amount: client.custAmount,
            orderId: '',
            token: '',
            paymentType: '',
            transactionTime: '',
            bank: '',
            vaNumber: '',
            pdfUrl: '',
            statusCode: '',
            expired: '',
            xId: '',
            xBankCode: '',
            xMethod: '',
            xAccountNumber: '',
            xExpired: '',
            xExternalId: '',
            xAmount: '',
            xQrcode: '',
            reference: '',
            paymentUrl: '',
            codeCoupon: '',
            discCoupon: 0,
            outlet: 0,
            statusIncome: '',
            invDueDate: '',
            dateIsolir: '',
            sendBeforeDue: '',
            sendDue: '',
            picture: '',
            invPpn: 0,
            picture1: '',
            sendBill: '',
            sendPaid: '',
            datePaid: '',
            sendBillEmail: '',
            sendBillSms: '',
            sendPaidEmail: '',
            sendPaidSms: '',
            subtotal: client.custAmount,
            amountuniq: 0,
            daterequniq: 0
        }));
        
        if (newInvoices.length > 0) {
            await db.insert(invoice).values(newInvoices);
        }
        return newInvoices.length;
    }

    static async payInvoice(invoiceId: number) {
        await db.update(invoice).set({ status: 'paid', datePayment: Math.floor(Date.now() / 1000) }).where(eq(invoice.invoiceId, invoiceId));
        return true;
    }

    static async getFinanceStats() {
        const result = await db.select({
            totalRevenue: sql<number>`sum(case when ${invoice.status} = 'paid' then ${invoice.amount} else 0 end)`,
            outstanding: sql<number>`sum(case when ${invoice.status} != 'paid' then ${invoice.amount} else 0 end)`,
            overdueCount: sql<number>`sum(case when ${invoice.status} = 'overdue' then 1 else 0 end)`,
        }).from(invoice);
        
        return result[0];
    }
}
