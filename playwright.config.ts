import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:60000,fullyParallel:false,workers:1,use:{baseURL:'http://localhost:4173',headless:true},webServer:{command:`${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run preview -- --port 4173`,url:'http://localhost:4173',reuseExistingServer:!process.env.CI},reporter:'list'});
