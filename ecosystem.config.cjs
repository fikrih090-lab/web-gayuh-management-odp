module.exports = {
  apps: [
    {
      name: "gayuh-backend",
      // Pakai tsx dari node_modules lokal backend
      script: "./node_modules/.bin/tsx",
      args: "src/app.ts",
      cwd: "./backend",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      // Auto restart jika crash
      autorestart: true,
      // Restart jika memory melebihi 500MB
      max_memory_restart: "500M",
      // Log files
      out_file: "./logs/backend-out.log",
      error_file: "./logs/backend-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
