import connectDB from './config/db.js';
import app from './app.js';

// Start Server only after successful DB connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB...');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] Expense Tracker API running on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
    });
  } catch (err) {
    console.error(`[Server] Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
