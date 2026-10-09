import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';
import carePlanRoutes from './routes/carePlanRoutes';
import { checkDatabaseHealth } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseHealth();
  res.status(200).json({
    status: 'ok',
    service: 'CareBridge Backend',
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/patients', carePlanRoutes);

app.listen(PORT, () => {
  console.log(`CareBridge Backend running on http://localhost:${PORT}`);
});
