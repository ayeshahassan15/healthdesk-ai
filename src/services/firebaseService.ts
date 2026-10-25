import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export async function saveChatMessage(sessionId: string, role: string, content: string) {
  try {
    await addDoc(collection(db, 'chats'), {
      sessionId,
      role,
      content,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
  }
}

export async function getChatHistory(sessionId: string) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
}
