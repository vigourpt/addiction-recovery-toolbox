import { db } from '../config/firebase';

export interface User {
  id: string;
  email: string;
  name: string;
  sobrietyDate: Date | null;
  addictionType: string | null;
  dailyBudget: number | null;
}

export const usersCollection = db.collection('users');

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const userRef = await db.collection('users').add({
    ...userData,
    sobrietyDate: null,
    addictionType: null,
    dailyBudget: null
  });
  return {
    id: userRef.id,
    ...userData,
    sobrietyDate: null,
    addictionType: null,
    dailyBudget: null
  };
};

export const getUserById = async (id: string): Promise<User | null> => {
  const userDoc = await usersCollection.doc(id).get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data() as Omit<User, 'id'>
  };
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const userRef = db.collection('users').doc(userId);
  await userRef.update(updates);
  
  const doc = await userRef.get();
  if (!doc.exists) {
    throw new Error('User not found');
  }

  return {
    id: doc.id,
    ...doc.data() as Omit<User, 'id'>
  };
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const userRef = usersCollection.doc(id);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) return false;
  
  await userRef.delete();
  return true;
};
