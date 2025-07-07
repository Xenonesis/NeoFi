import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';

// Types
export interface Profile {
  id: string;
  email: string;
  name?: string;
  currency?: string;
  timezone?: string;
  phone?: string;
  gender?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName?: string;
  description: string;
  date: string;
  recurring?: boolean;
  recurringId?: string;
  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  recurringEndDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  userId?: string;
  type?: 'income' | 'expense' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  categoryName?: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Services
export const authService = {
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        return { error: null };
      }
      return { error: 'No user logged in' };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};

// Database Services
export const dbService = {
  // Profiles
  async getProfile(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          data: {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Profile,
          error: null
        };
      }
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createProfile(userId: string, profileData: Partial<Profile>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'profiles', userId);
      await setDoc(docRef, {
        id: userId,
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'profiles', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Transactions
  async getTransactions(userId: string, filters?: any): Promise<{ data: Transaction[] | null; error: string | null }> {
    try {
      let q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Transaction[];

      return { data: transactions, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Transaction | null; error: string | null }> {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      const newDoc = await getDoc(docRef);
      const data = newDoc.data();
      
      return {
        data: {
          id: docRef.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate() || new Date()
        } as Transaction,
        error: null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async deleteTransaction(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, 'transactions', id));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Categories
  async getCategories(userId?: string): Promise<{ data: Category[] | null; error: string | null }> {
    try {
      let q;
      
      if (userId) {
        q = query(collection(db, 'categories'), where('userId', 'in', [userId, null]));
      } else {
        q = query(collection(db, 'categories'));
      }

      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Category[];

      return { data: categories, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Category | null; error: string | null }> {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      const newDoc = await getDoc(docRef);
      const data = newDoc.data();
      
      return {
        data: {
          id: docRef.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate() || new Date()
        } as Category,
        error: null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'categories', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async deleteCategory(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, 'categories', id));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Budgets
  async getBudgets(userId: string): Promise<{ data: Budget[] | null; error: string | null }> {
    try {
      const q = query(
        collection(db, 'budgets'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const budgets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Budget[];

      return { data: budgets, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async createBudget(budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Budget | null; error: string | null }> {
    try {
      const docRef = await addDoc(collection(db, 'budgets'), {
        ...budgetData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      const newDoc = await getDoc(docRef);
      const data = newDoc.data();
      
      return {
        data: {
          id: docRef.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate() || new Date()
        } as Budget,
        error: null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateBudget(id: string, updates: Partial<Budget>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'budgets', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async deleteBudget(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, 'budgets', id));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};

// Transaction Service
export const transactionService = {
  async getByUserId(userId: string) {
    const { data } = await dbService.getTransactions(userId);
    return data;
  },
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.createTransaction(transactionData);
  },
  async updateTransaction(id: string, updates: Partial<Transaction>) {
    return await dbService.updateTransaction(id, updates);
  },
  async delete(id: string) {
    return await dbService.deleteTransaction(id);
  },
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.createCategory(categoryData);
  }
};

// Category Service
export const categoryService = {
  async getAll() {
    const { data } = await dbService.getCategories();
    return data || [];
  },
  async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.createCategory(categoryData);
  },
  async update(id: string, updates: Partial<Category>) {
    return await dbService.updateCategory(id, updates);
  },
  async delete(id: string) {
    return await dbService.deleteCategory(id);
  }
};

// Budget Service
export const budgetService = {
  async getByUserId(userId: string) {
    const { data } = await dbService.getBudgets(userId);
    return data || [];
  },
  async create(budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.createBudget(budgetData);
  },
  async update(id: string, updates: Partial<Budget>) {
    return await dbService.updateBudget(id, updates);
  },
  async delete(id: string) {
    return await dbService.deleteBudget(id);
  }
};

// Profile Service
export const profileService = {
  async get(userId: string) {
    const { data } = await dbService.getProfile(userId);
    return data;
  },
  async create(userId: string, profileData: Partial<Profile>) {
    return await dbService.createProfile(userId, profileData);
  },
  async update(userId: string, updates: Partial<Profile>) {
    return await dbService.updateProfile(userId, updates);
  }
};

// Utility function for offline sync
export async function syncOfflineChanges(offlineData: any[]) {
  let syncedCount = 0;
  
  for (const item of offlineData) {
    try {
      if (item.type === 'transaction') {
        if (item.operation === 'create') {
          await transactionService.createTransaction(item.data);
        } else if (item.operation === 'update') {
          await transactionService.updateTransaction(item.id, item.data);
        } else if (item.operation === 'delete') {
          await transactionService.delete(item.id);
        }
        syncedCount++;
      }
    } catch (error) {
      console.error('Error syncing item:', item, error);
    }
  }
  
  return { syncedCount };
}