import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_hackathon';

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, contact } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    
    if (!['PATIENT', 'CAREGIVER', 'CLINICIAN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const hash = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rowCount && userCheck.rowCount > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    const insertRes = await query(
      'INSERT INTO users (name, email, password_hash, role, contact) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, hash, role, contact]
    );

    const user = insertRes.rows[0];

    // If role is PATIENT, create patient profile
    if (role === 'PATIENT') {
      await query('INSERT INTO patients (user_id) VALUES ($1)', [user.id]);
    }

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
