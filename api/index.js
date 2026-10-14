import connectDB from '../server/config/db.js';
import app from '../server/app.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless] Database connection error:', err);
      return res.status(500).json({
        success: false,
        message: `Database connection failed: ${err.message || 'Please check MONGO_URI in Vercel'}`,
        error: err.message,
      });
    }
  }

  return app(req, res);
}
