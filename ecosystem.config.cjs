module.exports = {
  apps: [
    {
      name: "gayuh-backend",
      script: "npx",
      args: "tsx src/app.ts",
      cwd: "./backend",
      interpreter: "none",
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
