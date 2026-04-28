import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readUsers } from '../utils/userDb';

const JWT_SECRET = process.env.JWT_SECRET || 'gayuh_secret_key_123!';

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
        const isMatch = await bcrypt.compare(password, foundUser.password);
        
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
