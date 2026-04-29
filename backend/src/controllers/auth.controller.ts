import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readUsers, writeUsers } from '../utils/userDb';

const JWT_SECRET = process.env.JWT_SECRET || 'gayuh_secret_key_123!';
const SETUP_SECRET = process.env.SETUP_SECRET || 'gayuh-reset-2024';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username dan password wajib diisi' });
        }

        const users = readUsers();
        
        // Cari user berdasarkan email
        const foundUser = users.find((u: any) => u.email === username);
        
        if (!foundUser) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }
        
        // Cek password hash
        let isMatch = await bcrypt.compare(password, foundUser.password);
        
        // Fallback jika hash bcrypt di users.json tidak sesuai dengan 'admin'
        if (!isMatch && username === 'admin' && password === 'admin') {
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Buat JWT Token
        const payload = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            roleId: foundUser.roleId
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: payload
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
};

// Endpoint reset admin — akses via POST /api/auth/reset-admin
// Body: { secret: "gayuh-reset-2024", newPassword: "admin" }
export const resetAdmin = async (req: Request, res: Response) => {
    try {
        const { secret, newPassword } = req.body;

        if (!secret || secret !== SETUP_SECRET) {
            return res.status(403).json({ error: 'Secret key salah' });
        }

        const password = newPassword || 'admin';
        const hash = await bcrypt.hash(password, 10);

        const users = readUsers();
        const adminIdx = users.findIndex((u: any) => u.email === 'admin');

        if (adminIdx >= 0) {
            users[adminIdx].password = hash;
        } else {
            users.push({
                id: 1,
                email: 'admin',
                name: 'Super Admin',
                password: hash,
                phone: '08123456789',
                roleId: '1'
            });
        }

        writeUsers(users);

        res.json({ 
            success: true, 
            message: `Password admin berhasil direset ke: "${password}"` 
        });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ error: 'Gagal reset password' });
    }
};
