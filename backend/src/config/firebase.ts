import * as admin from 'firebase-admin';

try {
  console.log('Initializing Firebase Admin...');
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('../../firebase-service-account.json');

  console.log('Service account project id:', serviceAccount.project_id);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  throw error;
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
