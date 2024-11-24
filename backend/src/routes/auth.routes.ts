import express from 'express';
import { register } from '../controllers/auth';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await register(req, res);
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Login logic is now handled by Firebase Authentication on the frontend
    res.status(400).json({ message: 'Please use Firebase Authentication' });
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
