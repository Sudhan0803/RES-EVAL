import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  Timestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { AnalysisHistoryItem, AnalysisResultData } from '../types';
import type { User } from 'firebase/auth';

const getHistoryCollection = (userId: string) => {
  return collection(db, 'users', userId, 'history');
};

// Type for the data structure when adding to Firestore
interface NewHistoryData {
  resumeFileName: string;
  jdFileName: string;
  result: AnalysisResultData;
}

export const getHistory = async (userId: string): Promise<AnalysisHistoryItem[]> => {
  if (!userId) return [];

  const historyCollection = getHistoryCollection(userId);
  const q = query(historyCollection, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to a JS Date object
    const timestamp = (data.timestamp as Timestamp)?.toDate() || new Date();
    return {
      id: doc.id,
      timestamp: timestamp,
      resumeFileName: data.resumeFileName,
      jdFileName: data.jdFileName,
      result: data.result,
    };
  });
};

export const addHistoryItem = async (userId: string, item: NewHistoryData): Promise<void> => {
   if (!userId) return;
   
   const historyCollection = getHistoryCollection(userId);
   await addDoc(historyCollection, {
     ...item,
     timestamp: serverTimestamp(),
   });
};

export const addUserOnSignup = async (user: User): Promise<void> => {
  if (!user) return;

  const userDocRef = doc(db, 'signup', user.uid);
  await setDoc(userDocRef, {
    email: user.email,
    createdAt: serverTimestamp(),
  });
};

export const checkUserDocument = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  try {
    const userDocRef = doc(db, 'signup', userId);
    await getDoc(userDocRef);
    // If getDoc doesn't throw, we have a connection and permissions.
    // It doesn't matter if the doc exists or not for this check.
    return true;
  } catch (error) {
    console.error("Firestore connection check failed:", error);
    return false;
  }
};

export const clearHistoryForUser = async (userId: string): Promise<void> => {
  if (!userId) return;

  const historyCollection = getHistoryCollection(userId);
  const querySnapshot = await getDocs(historyCollection);
  
  if (querySnapshot.empty) {
    return;
  }

  const batch = writeBatch(db);
  querySnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};