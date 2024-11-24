import { db } from '../config/firebase';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  sobrietyDate?: Date;
  addictionType?: string;
  dailyBudget?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const usersCollection = db.collection('users');

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date();
  const userRef = usersCollection.doc();
  
  const user: User = {
    id: userRef.id,
    ...userData,
    createdAt: now,
    updatedAt: now
  };

  await userRef.set(user);
  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const userDoc = await usersCollection.doc(id).get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (userSnapshot.empty) return null;
  const userDoc = userSnapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  const userRef = usersCollection.doc(id);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) return null;
  
  const updates = {
    ...userData,
    updatedAt: new Date()
  };
  
  await userRef.update(updates);
  return { id: userDoc.id, ...userDoc.data(), ...updates } as User;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const userRef = usersCollection.doc(id);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) return false;
  
  await userRef.delete();
  return true;
};
