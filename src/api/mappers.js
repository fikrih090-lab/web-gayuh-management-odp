export const mapClient = (customer) => {
    // odpCode adalah field tunggal yang sudah dinormalisasi di backend (UPPERCASE)
    const odpCode = customer.odpCode
        || (customer.codeOdp ? String(customer.codeOdp).toUpperCase().trim() : null)
        || String(customer.idOdp || '');

    return {
        id: `CL-${customer.customerId || Math.floor(Math.random() * 1000)}`,
        name: customer.name || 'Unknown',
        phone: customer.noWa || '-',
        address: customer.address || '-',
        package: customer.typeId || 'Standard',
        monthlyFee: Number(customer.custAmount || 0),
        // odpId harus UPPERCASE dan sama persis dengan ODP id di mapOdp
        odpId: odpCode,
        portNumber: Number(customer.noPortOdp) || 1,
        lat: Number(customer.latitude) || -6.9175,
        lng: Number(customer.longitude) || 107.6191,
        status: (['aktif', 'active'].includes(String(customer.cStatus || '').toLowerCase())) ? 'online' : 'offline',
        paymentStatus: 'paid',
        ontSerial: customer.serialNumber || '-',
        lastOnline: new Date().toISOString(),
        joinDate: customer.registerDate || ''
    };
};

export const mapOdp = (odp) => {
    // ID ODP harus UPPERCASE dan konsisten dengan odpId di mapClient
    const odpCode = (odp.codeOdp || odp.idOdp || '').toString().toUpperCase().trim();

    return {
        id: odpCode,
        name: odp.codeOdp || odp.idOdp || 'ODP Unknown',
        type: odp.remark || 'Unknown',
        // totalPorts pakai totalPort (dari snake_case total_port via toCamelCase)
        totalPorts: Number(odp.totalPort) || 8,
        // usedPorts dari COUNT query di backend (sudah dijumlah lintas semua mitra)
        usedPorts: Number(odp.usedPorts) || 0,
        lat: Number(odp.latitude) || -6.9175,
        lng: Number(odp.longitude) || 107.6191,
        address: odp.document || '',
        status: 'active',
        pathId: `PATH-${odp.codeOdc || 1}`,
        note: odp.remark || '',
        sourceDb: odp.sourceDb || 'gayuh',
        hostId: odp.hostId || 'default',
        createdAt: odp.created ? new Date(odp.created * 1000).toISOString() : new Date().toISOString(),
        ports: Array.from({ length: Number(odp.totalPort) || 8 }).map((_, i) => ({
            number: i + 1,
            status: 'available',
            clientId: null
        }))
    };
};

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
