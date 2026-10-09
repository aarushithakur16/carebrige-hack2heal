import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes';
import carePlanRoutes from './routes/carePlanRoutes';

// Add type for req.user used in mock auth
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/documents', documentRoutes);
app.use('/patients', carePlanRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CareBridge Backend' });
});

app.listen(PORT, () => {
  console.log(`CareBridge Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database Mode: ${process.env.USE_MOCK_DB !== 'false' ? 'MOCK' : 'POSTGRES'}`);
});
