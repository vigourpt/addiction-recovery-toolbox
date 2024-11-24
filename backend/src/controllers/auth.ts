import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { createUser, getUserByEmail } from '../models/user';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Create Firebase auth user
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

export const login = async (req: Request, res: Response) => {
  try {
    // Note: With Firebase Auth, login is handled on the client side
    // This endpoint can be used to fetch additional user data after Firebase authentication
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
};
