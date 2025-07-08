import { syncDatabase } from '../models/index.js';

console.log('Initializing database...');

syncDatabase(false)
  .then(() => {
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  });