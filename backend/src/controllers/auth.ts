import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { createUser, getUserByEmail } from '../models/user';

export const register = async (req: Request, res: Response): Promise<void> => {
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
};
