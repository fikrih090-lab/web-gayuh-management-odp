import { Request, Response } from 'express';
import { NetworkService, invalidateOdpCache } from '../services/network.service';
import { readOdpOverrides, writeOdpOverrides } from '../utils/odpDb';

export const getOdps = async (req: Request, res: Response) => {
    try {
        const page   = Math.max(1, parseInt(req.query.page as string)  || 1);
        const limit  = parseInt(req.query.limit as string) || 50;
        const search = ((req.query.search as string) || '').toLowerCase().trim();
        const letter = ((req.query.letter as string) || '').toLowerCase().trim();

        const all = await NetworkService.getAllOdps();

        let filtered = all;

        if (letter) {
            filtered = filtered.filter(o => 
                (o.codeOdp || '').toLowerCase().startsWith(letter)
            );
        }

        if (search) {
            filtered = filtered.filter(o =>
                (o.codeOdp  || '').toLowerCase().includes(search) ||
                (o.noPole   || '').toLowerCase().includes(search) ||
                (o.remark   || '').toLowerCase().includes(search)
            );
        }

        const total = filtered.length;
        const data  = filtered.slice((page - 1) * limit, page * limit);

        // Pastikan browser tidak cache response ODP agar perubahan langsung tampil
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODPs' });
    }
};

export const getOdpById = async (req: Request, res: Response) => {
    try {
        const odp = await NetworkService.getOdpById(req.params.id);
        if (!odp) return res.status(404).json({ error: 'ODP not found' });
        res.json(odp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODP' });
    }
};

export const createOdp = async (req: Request, res: Response) => {
    try {
        const odp = await NetworkService.createOdp(req.body);
        res.status(201).json(odp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ODP' });
    }
};

export const getOdcs = async (req: Request, res: Response) => {
    try {
        const result = await NetworkService.getAllOdcs();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODCs' });
    }
};

export const updateOdp = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { latitude, longitude, totalPort, coverageOdp, remark } = req.body;
        
        await NetworkService.updateOdp(id, {
            latitude,
            longitude,
            totalPort: Number(totalPort),
            coverageOdp: Number(coverageOdp),
            remark
        });
        
        // Return updated ODP so frontend can update state immediately (bypasses cache staleness)
        const updatedOdp = await NetworkService.getOdpById(id);
        res.json({ message: 'ODP updated successfully', odp: updatedOdp });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ODP' });
    }
};

export const deleteOdp = async (req: Request, res: Response) => {
    try {
        const success = await NetworkService.deleteOdp(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(400).json({ error: 'Failed to delete ODP' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ODP' });
    }
};

export const importOdps = async (req: Request, res: Response) => {
    try {
        const importedData = req.body;
        if (!importedData || typeof importedData !== 'object') {
            return res.status(400).json({ error: 'Invalid format' });
        }
        
        const overrides = readOdpOverrides();
        
        // Normalize input into an array of items
        let items: any[] = [];
        if (Array.isArray(importedData)) {
            items = importedData;
        } else if (Array.isArray(importedData.data)) {
            items = importedData.data;
        } else {
            // Convert object to array
            items = Object.entries(importedData).map(([k, v]: [string, any]) => {
                return typeof v === 'object' ? { codeOdp: k, ...v } : null;
            }).filter(Boolean);
        }
        
        let count = 0;
        for (const item of items) {
            if (item && typeof item === 'object') {
                const key = item.codeOdp || item.idOdp || item.id || item.code_odp || item.name;
                if (key) {
                    const normalizedKey = String(key).toUpperCase().trim();
                    overrides[normalizedKey] = {
                        ...overrides[normalizedKey],
                        latitude: item.latitude || item.lat || overrides[normalizedKey]?.latitude || '',
                        longitude: item.longitude || item.lng || overrides[normalizedKey]?.longitude || '',
                        totalPort: item.totalPort || item.total_port || overrides[normalizedKey]?.totalPort || 8,
                        coverageOdp: item.coverageOdp || item.coverage_odp || overrides[normalizedKey]?.coverageOdp || 0,
                        remark: item.remark || overrides[normalizedKey]?.remark || ''
                    };
                    count++;
                }
            }
        }
        
        writeOdpOverrides(overrides);
        invalidateOdpCache();
        
        res.json({ message: 'ODP data imported successfully', count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to import ODPs' });
    }
};
