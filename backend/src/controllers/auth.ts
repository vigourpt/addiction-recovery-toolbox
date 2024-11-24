import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { createUser, getUserByEmail } from '../models/user';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting registration process...');
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    console.log('Creating Firebase Auth user...', { email, name });
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });
    console.log('Firebase Auth user created:', userRecord.uid);

    console.log('Creating Firestore user document...');
    // Create user in Firestore
    const user = await createUser({
      email,
      name,
      sobrietyDate: null,
      addictionType: null,
      dailyBudget: null
    });
    console.log('Firestore user document created:', user.id);

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
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      res.status(400).json({ 
        message: `Error creating user: ${error.message}`,
        error: error.name
      });
    } else {
      console.error('Unknown error type:', error);
      res.status(400).json({ message: 'Error creating user' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    console.log('Fetching user from Firestore...');
    const user = await getUserByEmail(email);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Note: With Firebase Auth, the actual authentication happens on the client side
    // Here we just return the user data after verifying they exist
    res.status(200).json({
      message: 'User found',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: `Login error: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Login error' });
    }
  }
};
