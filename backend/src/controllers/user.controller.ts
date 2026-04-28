import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { readUsers, writeUsers } from '../utils/userDb';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = readUsers();
        // Hilangkan password saat dikirim ke frontend
        const safeUsers = users.map((u: any) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            phone: u.phone,
            roleId: u.roleId
        }));
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data user' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, roleId } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const users = readUsers();
        
        const newUser = {
            id: Date.now(), // simple id generation
            email,
            password: hashedPassword,
            name,
            phone: phone || '-',
            roleId: roleId || '2'
        };

        users.push(newUser);
        writeUsers(users);
        
        res.status(201).json({ id: newUser.id, ...newUser, password: '' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Gagal membuat user baru' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, roleId } = req.body;
        const id = Number(req.params.id);
        
        const users = readUsers();
        const userIndex = users.findIndex((u: any) => u.id === id);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        
        const updateData: any = {
            email,
            name,
            phone,
            roleId
        };
        
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        } else {
            updateData.password = users[userIndex].password;
        }

        users[userIndex] = { ...users[userIndex], ...updateData };
        writeUsers(users);
        
        res.json({ id, ...updateData, password: '' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengupdate user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const users = readUsers();
        const filteredUsers = users.filter((u: any) => u.id !== id);
        writeUsers(filteredUsers);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus user' });
    }
};
