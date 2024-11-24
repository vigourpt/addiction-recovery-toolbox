import express, { Router, Request, Response } from 'express';
import { auth } from '../config/firebase';
import { createUser, getUserByEmail, updateUser } from '../models/user';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Create user in Firestore
    const user = await createUser({
      email,
      name,
      sobrietyDate: undefined,
      addictionType: undefined,
      dailyBudget: undefined
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Login - Note: Actual login is handled by Firebase on the client
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        sobrietyDate: user.sobrietyDate,
        addictionType: user.addictionType,
        dailyBudget: user.dailyBudget
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await getUserByEmail(req.user.email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Error getting user data' });
  }
});

// Update user profile
router.patch('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await getUserByEmail(req.user.email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'sobrietyDate', 'addictionType', 'dailyBudget'];
    
    // Filter out non-allowed updates
    Object.keys(updates).forEach(key => {
      if (!allowedUpdates.includes(key)) {
        delete updates[key];
      }
    });

    const updatedUser = await updateUser(user.id, updates);
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Error updating user data' });
  }
});

export default router;
