#!/bin/bash
# ============================================
# Script Deploy & Keep Running - Gayuh Web
# Jalankan di server Linux dengan: bash deploy.sh
# ============================================

set -e  # Stop jika ada error

PROJECT_DIR="/var/www/web-gayuh-management-odp"  # Ganti sesuai path di server kamu
LOG_DIR="$PROJECT_DIR/logs"

echo "======================================"
echo "  🚀 DEPLOY GAYUH WEB - $(date)"
echo "======================================"

# 1. Masuk ke direktori project
cd $PROJECT_DIR

# 2. Pull update terbaru dari GitHub
echo ""
echo "📥 [1/6] Pull update dari GitHub..."
git pull origin main

# 3. Install dependencies backend
echo ""
echo "📦 [2/6] Install backend dependencies..."
cd backend && npm install --production=false && cd ..

# 4. Install dependencies frontend
echo ""
echo "📦 [3/6] Install frontend dependencies..."
npm install

# 5. Build frontend
echo ""
echo "🔨 [4/6] Build frontend..."
npm run build

# 6. Buat folder logs jika belum ada
mkdir -p $LOG_DIR

# 7. Setup & Restart PM2
echo ""
echo "⚡ [5/6] Restart backend dengan PM2..."
if pm2 list | grep -q "gayuh-backend"; then
    pm2 restart gayuh-backend
    echo "   ✅ Backend di-restart"
else
    pm2 start ecosystem.config.cjs
    echo "   ✅ Backend dijalankan pertama kali"
fi

# 8. Simpan konfigurasi PM2
echo ""
echo "💾 [6/6] Simpan konfigurasi PM2..."
pm2 save

echo ""
echo "======================================"
echo "  ✅ DEPLOY SELESAI!"
echo "======================================"
echo ""
echo "📊 Status PM2:"
pm2 list
echo ""
echo "📋 Perintah berguna:"
echo "  pm2 logs gayuh-backend    → Lihat log realtime"
echo "  pm2 monit                 → Monitor CPU & Memory"
echo "  pm2 restart gayuh-backend → Restart manual"
