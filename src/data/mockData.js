// Mock data untuk development ISP Network Management

export const odpData = [
  {
    id: 'ODP-001',
    name: 'ODP Jl. Merdeka 01',
    type: '1:8',
    totalPorts: 8,
    usedPorts: 3,
    lat: -6.9175,
    lng: 107.6191,
    address: 'Jl. Merdeka No. 45, Bandung',
    status: 'active',
    pathId: 'PATH-001',
    note: 'Terpasang di tiang PLN #234',
    createdAt: '2025-03-15',
    ports: [
      { number: 1, status: 'used', clientId: 'CL-001' },
      { number: 2, status: 'available', clientId: null },
      { number: 3, status: 'used', clientId: 'CL-002' },
      { number: 4, status: 'available', clientId: null },
      { number: 5, status: 'used', clientId: 'CL-003' },
      { number: 6, status: 'available', clientId: null },
      { number: 7, status: 'available', clientId: null },
      { number: 8, status: 'available', clientId: null },
    ]
  },
  {
    id: 'ODP-002',
    name: 'ODP Jl. Asia Afrika 02',
    type: '1:16',
    totalPorts: 16,
    usedPorts: 12,
    lat: -6.9214,
    lng: 107.6072,
    address: 'Jl. Asia Afrika No. 112, Bandung',
    status: 'active',
    pathId: 'PATH-001',
    note: 'Terpasang di tiang Telkom',
    createdAt: '2025-02-10',
    ports: [
      { number: 1, status: 'used', clientId: 'CL-004' },
      { number: 2, status: 'used', clientId: 'CL-005' },
      { number: 3, status: 'used', clientId: 'CL-006' },
      { number: 4, status: 'used', clientId: 'CL-007' },
      { number: 5, status: 'used', clientId: 'CL-008' },
      { number: 6, status: 'available', clientId: null },
      { number: 7, status: 'used', clientId: 'CL-009' },
      { number: 8, status: 'used', clientId: 'CL-010' },
      { number: 9, status: 'used', clientId: 'CL-011' },
      { number: 10, status: 'available', clientId: null },
      { number: 11, status: 'used', clientId: 'CL-012' },
      { number: 12, status: 'used', clientId: 'CL-013' },
      { number: 13, status: 'available', clientId: null },
      { number: 14, status: 'used', clientId: 'CL-014' },
      { number: 15, status: 'used', clientId: 'CL-015' },
      { number: 16, status: 'available', clientId: null },
    ]
  },
  {
    id: 'ODP-003',
    name: 'ODP Jl. Braga 03',
    type: '1:8',
    totalPorts: 8,
    usedPorts: 8,
    lat: -6.9172,
    lng: 107.6098,
    address: 'Jl. Braga No. 67, Bandung',
    status: 'active',
    pathId: 'PATH-002',
    note: 'Full capacity - perlu ekspansi',
    createdAt: '2024-11-20',
    ports: [
      { number: 1, status: 'used', clientId: 'CL-016' },
      { number: 2, status: 'used', clientId: 'CL-017' },
      { number: 3, status: 'used', clientId: 'CL-018' },
      { number: 4, status: 'used', clientId: 'CL-019' },
      { number: 5, status: 'used', clientId: 'CL-020' },
      { number: 6, status: 'used', clientId: 'CL-021' },
      { number: 7, status: 'used', clientId: 'CL-022' },
      { number: 8, status: 'used', clientId: 'CL-023' },
    ]
  },
  {
    id: 'ODP-004',
    name: 'ODP Jl. Dago 04',
    type: '1:16',
    totalPorts: 16,
    usedPorts: 5,
    lat: -6.8848,
    lng: 107.6134,
    address: 'Jl. Ir. H. Juanda No. 200, Bandung',
    status: 'active',
    pathId: 'PATH-002',
    note: 'Area kampus ITB',
    createdAt: '2025-01-08',
    ports: [
      { number: 1, status: 'used', clientId: 'CL-024' },
      { number: 2, status: 'available', clientId: null },
      { number: 3, status: 'used', clientId: 'CL-025' },
      { number: 4, status: 'available', clientId: null },
      { number: 5, status: 'available', clientId: null },
      { number: 6, status: 'used', clientId: 'CL-026' },
      { number: 7, status: 'available', clientId: null },
      { number: 8, status: 'available', clientId: null },
      { number: 9, status: 'used', clientId: 'CL-027' },
      { number: 10, status: 'available', clientId: null },
      { number: 11, status: 'available', clientId: null },
      { number: 12, status: 'used', clientId: 'CL-028' },
      { number: 13, status: 'available', clientId: null },
      { number: 14, status: 'available', clientId: null },
      { number: 15, status: 'available', clientId: null },
      { number: 16, status: 'available', clientId: null },
    ]
  },
  {
    id: 'ODP-005',
    name: 'ODP Jl. Cihampelas 05',
    type: '1:8',
    totalPorts: 8,
    usedPorts: 6,
    lat: -6.8935,
    lng: 107.6037,
    address: 'Jl. Cihampelas No. 88, Bandung',
    status: 'active',
    pathId: 'PATH-003',
    note: 'Dekat pusat perbelanjaan',
    createdAt: '2025-04-01',
    ports: [
      { number: 1, status: 'used', clientId: 'CL-029' },
      { number: 2, status: 'used', clientId: 'CL-030' },
      { number: 3, status: 'available', clientId: null },
      { number: 4, status: 'used', clientId: 'CL-031' },
      { number: 5, status: 'used', clientId: 'CL-032' },
      { number: 6, status: 'used', clientId: 'CL-033' },
      { number: 7, status: 'available', clientId: null },
      { number: 8, status: 'used', clientId: 'CL-034' },
    ]
  },
]

export const clientData = [
  { id: 'CL-001', name: 'Ahmad Fauzi', phone: '081234567890', address: 'Jl. Merdeka No. 12', package: '20 Mbps', monthlyFee: 250000, odpId: 'ODP-001', portNumber: 1, lat: -6.9180, lng: 107.6185, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-A1B2C3D4', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-04-01' },
  { id: 'CL-002', name: 'Budi Santoso', phone: '081234567891', address: 'Jl. Merdeka No. 34', package: '50 Mbps', monthlyFee: 400000, odpId: 'ODP-001', portNumber: 3, lat: -6.9185, lng: 107.6195, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-E5F6G7H8', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-03-20' },
  { id: 'CL-003', name: 'Citra Dewi', phone: '081234567892', address: 'Jl. Merdeka No. 56', package: '30 Mbps', monthlyFee: 300000, odpId: 'ODP-001', portNumber: 5, lat: -6.9170, lng: 107.6200, status: 'offline', paymentStatus: 'overdue', ontSerial: 'HWTC-I9J0K1L2', lastOnline: '2026-04-24T14:30:00', joinDate: '2025-05-10' },
  { id: 'CL-004', name: 'Dedi Hermawan', phone: '081234567893', address: 'Jl. Asia Afrika No. 20', package: '100 Mbps', monthlyFee: 600000, odpId: 'ODP-002', portNumber: 1, lat: -6.9220, lng: 107.6065, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-M3N4O5P6', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-02-15' },
  { id: 'CL-005', name: 'Eka Putri', phone: '081234567894', address: 'Jl. Asia Afrika No. 32', package: '20 Mbps', monthlyFee: 250000, odpId: 'ODP-002', portNumber: 2, lat: -6.9210, lng: 107.6080, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-Q7R8S9T0', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-06-01' },
  { id: 'CL-006', name: 'Fajar Ramadhan', phone: '081234567895', address: 'Jl. Asia Afrika No. 55', package: '50 Mbps', monthlyFee: 400000, odpId: 'ODP-002', portNumber: 3, lat: -6.9225, lng: 107.6075, status: 'offline', paymentStatus: 'paid', ontSerial: 'HWTC-U1V2W3X4', lastOnline: '2026-04-25T08:15:00', joinDate: '2025-01-20' },
  { id: 'CL-007', name: 'Gita Sari', phone: '081234567896', address: 'Jl. Asia Afrika No. 78', package: '30 Mbps', monthlyFee: 300000, odpId: 'ODP-002', portNumber: 4, lat: -6.9218, lng: 107.6060, status: 'online', paymentStatus: 'overdue', ontSerial: 'HWTC-Y5Z6A7B8', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-07-15' },
  { id: 'CL-008', name: 'Hendra Wijaya', phone: '081234567897', address: 'Jl. Asia Afrika No. 91', package: '100 Mbps', monthlyFee: 600000, odpId: 'ODP-002', portNumber: 5, lat: -6.9230, lng: 107.6068, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-C9D0E1F2', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-04-10' },
  { id: 'CL-009', name: 'Indah Permata', phone: '081234567898', address: 'Jl. Braga No. 15', package: '50 Mbps', monthlyFee: 400000, odpId: 'ODP-002', portNumber: 7, lat: -6.9200, lng: 107.6090, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-G3H4I5J6', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-08-01' },
  { id: 'CL-010', name: 'Joko Priyanto', phone: '081234567899', address: 'Jl. Asia Afrika No. 105', package: '20 Mbps', monthlyFee: 250000, odpId: 'ODP-002', portNumber: 8, lat: -6.9208, lng: 107.6078, status: 'offline', paymentStatus: 'overdue', ontSerial: 'HWTC-K7L8M9N0', lastOnline: '2026-04-20T10:00:00', joinDate: '2025-03-05' },
  { id: 'CL-024', name: 'Xena Maharani', phone: '081234567913', address: 'Jl. Dago No. 150', package: '100 Mbps', monthlyFee: 600000, odpId: 'ODP-004', portNumber: 1, lat: -6.8855, lng: 107.6140, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-O1P2Q3R4', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-01-15' },
  { id: 'CL-025', name: 'Yoga Pratama', phone: '081234567914', address: 'Jl. Dago No. 178', package: '50 Mbps', monthlyFee: 400000, odpId: 'ODP-004', portNumber: 3, lat: -6.8840, lng: 107.6128, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-S5T6U7V8', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-02-20' },
  { id: 'CL-029', name: 'Cahya Nugraha', phone: '081234567918', address: 'Jl. Cihampelas No. 20', package: '30 Mbps', monthlyFee: 300000, odpId: 'ODP-005', portNumber: 1, lat: -6.8940, lng: 107.6030, status: 'online', paymentStatus: 'paid', ontSerial: 'HWTC-W9X0Y1Z2', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-04-05' },
  { id: 'CL-030', name: 'Dewi Anggraini', phone: '081234567919', address: 'Jl. Cihampelas No. 42', package: '50 Mbps', monthlyFee: 400000, odpId: 'ODP-005', portNumber: 2, lat: -6.8930, lng: 107.6042, status: 'online', paymentStatus: 'overdue', ontSerial: 'HWTC-A3B4C5D6', lastOnline: '2026-04-26T01:00:00', joinDate: '2025-05-18' },
]

export const pathData = [
  {
    id: 'PATH-001',
    name: 'Jalur Utama Selatan',
    from: 'OLT Pusat',
    to: 'ODP-001, ODP-002',
    distance: 4.2,
    cableType: 'FO 24 Core',
    hasRedundancy: true,
    redundancyPath: 'PATH-004',
    status: 'active',
    odpIds: ['ODP-001', 'ODP-002'],
    coordinates: [
      [-6.9100, 107.6150],
      [-6.9130, 107.6160],
      [-6.9160, 107.6175],
      [-6.9175, 107.6191],
      [-6.9190, 107.6130],
      [-6.9214, 107.6072],
    ]
  },
  {
    id: 'PATH-002',
    name: 'Jalur Utama Tengah',
    from: 'OLT Pusat',
    to: 'ODP-003, ODP-004',
    distance: 5.8,
    cableType: 'FO 48 Core',
    hasRedundancy: true,
    redundancyPath: 'PATH-005',
    status: 'active',
    odpIds: ['ODP-003', 'ODP-004'],
    coordinates: [
      [-6.9100, 107.6150],
      [-6.9120, 107.6130],
      [-6.9150, 107.6110],
      [-6.9172, 107.6098],
      [-6.9050, 107.6100],
      [-6.8950, 107.6120],
      [-6.8848, 107.6134],
    ]
  },
  {
    id: 'PATH-003',
    name: 'Jalur Barat',
    from: 'OLT Pusat',
    to: 'ODP-005',
    distance: 3.1,
    cableType: 'FO 12 Core',
    hasRedundancy: false,
    redundancyPath: null,
    status: 'active',
    odpIds: ['ODP-005'],
    coordinates: [
      [-6.9100, 107.6150],
      [-6.9080, 107.6120],
      [-6.9020, 107.6080],
      [-6.8970, 107.6050],
      [-6.8935, 107.6037],
    ]
  },
]

export const alertData = [
  { id: 'ALR-001', type: 'fiber_cut', severity: 'critical', title: 'Putus FO Jl. Braga', description: 'Kabel fiber optic putus di Jl. Braga km 2.3', pathId: 'PATH-002', affectedOdps: ['ODP-003'], affectedClients: 8, createdAt: '2026-04-25T22:30:00', resolved: false },
  { id: 'ALR-002', type: 'odp_full', severity: 'warning', title: 'ODP-003 Kapasitas Penuh', description: 'Semua port pada ODP-003 sudah terpakai', odpId: 'ODP-003', affectedClients: 0, createdAt: '2026-04-24T10:00:00', resolved: false },
  { id: 'ALR-003', type: 'ont_offline', severity: 'info', title: '3 ONT Offline', description: '3 modem pelanggan tidak merespon selama >24 jam', affectedClients: 3, createdAt: '2026-04-25T06:00:00', resolved: false },
  { id: 'ALR-004', type: 'fiber_cut', severity: 'critical', title: 'Putus FO Jl. Merdeka', description: 'Perbaikan selesai - jalur sudah normal', pathId: 'PATH-001', affectedOdps: ['ODP-001'], affectedClients: 3, createdAt: '2026-04-22T14:00:00', resolved: true },
]

// OLT (Pusat) location
export const oltLocation = {
  name: import.meta.env.VITE_OLT_NAME || 'OLT Pusat - NOC Bandung',
  lat: Number(import.meta.env.VITE_OLT_LAT) || -6.9100,
  lng: Number(import.meta.env.VITE_OLT_LNG) || 107.6150,
  address: import.meta.env.VITE_OLT_ADDRESS || 'Jl. Soekarno-Hatta No. 500, Bandung'
}

// Stats helper
export const getStats = () => {
  const totalOdp = odpData.length
  const totalClients = clientData.length
  const totalPorts = odpData.reduce((sum, o) => sum + o.totalPorts, 0)
  const usedPorts = odpData.reduce((sum, o) => sum + o.usedPorts, 0)
  const availablePorts = totalPorts - usedPorts
  const onlineClients = clientData.filter(c => c.status === 'online').length
  const offlineClients = clientData.filter(c => c.status === 'offline').length
  const overdueClients = clientData.filter(c => c.paymentStatus === 'overdue').length
  const activeAlerts = alertData.filter(a => !a.resolved).length

  return {
    totalOdp,
    totalClients,
    totalPorts,
    usedPorts,
    availablePorts,
    onlineClients,
    offlineClients,
    overdueClients,
    activeAlerts,
  }
}
