export const mapClient = (customer) => ({
    id: `CL-${customer.customerId || Math.floor(Math.random() * 1000)}`,
    name: customer.name || 'Unknown',
    phone: customer.noWa || '-',
    address: customer.address || '-',
    package: customer.typeId || 'Standard',
    monthlyFee: Number(customer.custAmount || 0),
    odpId: `ODP-${customer.idOdp || 0}`,
    portNumber: customer.noPortOdp || 1,
    lat: Number(customer.latitude) || -6.9175,
    lng: Number(customer.longitude) || 107.6191,
    status: (String(customer.cStatus).toLowerCase() === 'aktif' || customer.cStatus === 'active') ? 'online' : 'offline',
    paymentStatus: 'paid', // Simplified for UI
    ontSerial: customer.serialNumber || '-',
    lastOnline: new Date().toISOString(),
    joinDate: customer.registerDate || ''
});

export const mapOdp = (odp) => ({
    id: `ODP-${odp.idOdp}`,
    name: odp.codeOdp || 'ODP Unknown',
    type: odp.remark || 'Unknown',
    totalPorts: odp.totalPort || 8,
    usedPorts: Math.floor((odp.totalPort || 8) / 2), // Mock partial usage for UI
    lat: Number(odp.latitude) || -6.9175,
    lng: Number(odp.longitude) || 107.6191,
    address: odp.document || '',
    status: 'active',
    pathId: `PATH-${odp.codeOdc || 1}`,
    note: odp.remark || '',
    createdAt: odp.created ? new Date(odp.created * 1000).toISOString() : new Date().toISOString(),
    ports: Array.from({ length: odp.totalPort || 8 }).map((_, i) => ({
        number: i + 1,
        status: i % 2 === 0 ? 'used' : 'available',
        clientId: i % 2 === 0 ? `CL-${i}` : null
    }))
});

export const mapAlert = (help) => ({
    id: `ALR-${help.id}`,
    type: help.helpType === 1 ? 'fiber_cut' : 'info',
    severity: help.status === 'open' ? 'critical' : 'warning',
    title: help.noTicket || 'System Alert',
    description: help.description || 'No description provided.',
    affectedClients: 0,
    resolved: help.status !== 'open',
    createdAt: help.dateCreated ? new Date(help.dateCreated * 1000).toISOString() : new Date().toISOString()
});
