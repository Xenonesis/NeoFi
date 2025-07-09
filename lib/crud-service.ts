import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrudResult<T> {
  data: T | null;
  error: string | null;
}

export interface CrudListResult<T> {
  data: T[] | null;
  error: string | null;
}

export function createCrudService<T extends BaseEntity>(collectionName: string) {
  return {
    async getAll(userId?: string): Promise<CrudListResult<T>> {
      try {
        let q = collection(db, collectionName);
        
        if (userId) {
          q = query(collection(db, collectionName), where('userId', '==', userId));
        }

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as T[];

        return { data: items, error: null };
      } catch (error: any) {
        return { data: null, error: error.message };
      }
    },

    async getById(id: string): Promise<CrudResult<T>> {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            data: {
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date()
            } as T,
            error: null
          };
        }
        return { data: null, error: 'Document not found' };
      } catch (error: any) {
        return { data: null, error: error.message };
      }
    },

    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<CrudResult<T>> {
      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });

        const newDoc = await getDoc(docRef);
        const docData = newDoc.data();
        
        return {
          data: {
            id: docRef.id,
            ...docData,
            createdAt: docData?.createdAt?.toDate() || new Date(),
            updatedAt: docData?.updatedAt?.toDate() || new Date()
          } as T,
          error: null
        };
      } catch (error: any) {
        return { data: null, error: error.message };
      }
    },

    async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ error: string | null }> {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: Timestamp.now()
        });
        return { error: null };
      } catch (error: any) {
        return { error: error.message };
      }
    },

    async delete(id: string): Promise<{ error: string | null }> {
      try {
        await deleteDoc(doc(db, collectionName, id));
        return { error: null };
      } catch (error: any) {
        return { error: error.message };
      }
    },

    async getByUserId(userId: string, orderByField?: string): Promise<CrudListResult<T>> {
      try {
        let q = query(collection(db, collectionName), where('userId', '==', userId));
        
        if (orderByField) {
          q = query(q, orderBy(orderByField, 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as T[];

        return { data: items, error: null };
      } catch (error: any) {
        return { data: null, error: error.message };
      }
    }
  };
}