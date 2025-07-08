import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { auth } from './firebase';
import { dbService } from './firebase-service';

export interface UserPreferences {
  userId: string | null;
  username: string;
  currency: string; 
  theme: 'light' | 'dark' | 'system';
  initialized: boolean;
  timezone: string;
  setUserId: (userId: string | null) => void;
  setUsername: (username: string) => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  syncWithDatabase: () => Promise<void>;
  setInitialized: (initialized: boolean) => void;
  resetPreferences: () => void;
  setTimezone: (timezone: string) => void;
}

// Valid currency codes
const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'CAD', 'AUD', 'SGD', 'CHF'];

// Safe way to access localStorage that works in both client and server contexts
const getDefaultCurrency = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('budget-currency') || 'USD';
    // Clean and validate stored currency
    const cleanCurrency = stored.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanCurrency.length === 3 && VALID_CURRENCIES.includes(cleanCurrency)) {
      return cleanCurrency;
    } else {
      // Clear invalid currency and set to USD
      localStorage.setItem('budget-currency', 'USD');
      return 'USD';
    }
  }
  return 'USD'; // Default for server-side rendering
}

const getDefaultTheme = () => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('budget-theme') as 'light' | 'dark' | 'system') || 'system';
  }
  return 'system'; // Default for server-side rendering
}

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set, get) => ({
      userId: null,
      username: '',
      currency: getDefaultCurrency(),
      theme: getDefaultTheme(),
      initialized: false,
      timezone: 'UTC',
      setUserId: (userId: string | null) => set({ userId }),
      setUsername: (username: string) => set({ username }),
      setCurrency: (currency: string) => {
        // Clean and validate currency before setting
        const cleanCurrency = currency.replace(/[^A-Za-z]/g, '').toUpperCase();
        const validCurrency = (cleanCurrency.length === 3 && VALID_CURRENCIES.includes(cleanCurrency)) ? cleanCurrency : 'USD';
        if (typeof window !== 'undefined') {
          localStorage.setItem('budget-currency', validCurrency);
        }
        set({ currency: validCurrency });
      },
      setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
      setInitialized: (initialized: boolean) => set({ initialized }),
      setTimezone: (timezone: string) => set({ timezone }),
      resetPreferences: () => set({
        userId: null,
        username: '',
        currency: 'USD',
        theme: 'system',
        initialized: false,
        timezone: 'UTC'
      }),
      syncWithDatabase: async () => {
        const { userId } = get();
        if (!userId) return;

        try {
          // Fetch user profile from Firebase
          const { data: profile } = await dbService.getProfile(userId);
          
          if (profile) {
            // Clean and validate currency from profile
            const profileCurrency = profile.currency || 'USD';
            const cleanCurrency = profileCurrency.replace(/[^A-Za-z]/g, '').toUpperCase();
            const defaultCurrency = (cleanCurrency.length === 3 && VALID_CURRENCIES.includes(cleanCurrency)) ? cleanCurrency : 'USD';
            // Default to UTC if no timezone is set
            const defaultTimezone = profile.timezone || 'UTC';
            
            // Update local store with database values
            set({
              username: profile.name || get().username,
              currency: defaultCurrency,
              timezone: defaultTimezone,
              initialized: true
            });

            // Also update localStorage for redundancy
            if (typeof window !== 'undefined') {
              localStorage.setItem('budget-currency', defaultCurrency);
              console.log('Currency set in localStorage:', defaultCurrency);
            }
            
            console.log('User preferences synced from database');
          }
        } catch (error) {
          console.error('Error syncing user preferences with database:', error);
        }
      }
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(name);
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, value);
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      })),
      partialize: (state) => ({ 
        userId: state.userId,
        username: state.username, 
        currency: state.currency,
        theme: state.theme,
        initialized: state.initialized,
        timezone: state.timezone
      }),
    }
  )
);

// Initialize theme and currency based on stored preference - CLIENT SIDE ONLY
if (typeof window !== 'undefined') {
  // Clear invalid currency on app start
  const storedCurrency = localStorage.getItem('budget-currency');
  if (storedCurrency) {
    const cleanCurrency = storedCurrency.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanCurrency.length !== 3 || !VALID_CURRENCIES.includes(cleanCurrency)) {
      localStorage.setItem('budget-currency', 'USD');
      // Also clear the zustand store
      localStorage.removeItem('user-preferences');
    }
  }
  
  const storedTheme = localStorage.getItem('budget-theme') || 
                      useUserPreferences.getState().theme || 
                      'system';
                      
  if (storedTheme === 'dark' || 
      (storedTheme === 'system' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Update currency and theme in user profile when they change - CLIENT SIDE ONLY
if (typeof window !== 'undefined') {
  useUserPreferences.subscribe((state) => {
    if (state.currency) {
      localStorage.setItem('budget-currency', state.currency);
    }
    if (state.theme) {
      localStorage.setItem('budget-theme', state.theme);
      
      if (state.theme === 'system') {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}

export const formatCurrency = (
  amount: number,
  currency?: string
) => {
  // Get from parameter, or get from store, or fallback to USD as last resort
  let currencyToUse = currency || useUserPreferences.getState().currency || 
    (typeof window !== 'undefined' ? localStorage.getItem('budget-currency') : null) || 'USD';
  
  // Clean up currency code - remove any non-alphabetic characters and ensure proper length
  currencyToUse = currencyToUse.replace(/[^A-Za-z]/g, '').toUpperCase();
  
  // Validate currency code and clear invalid ones
  if (!currencyToUse || currencyToUse.length !== 3 || !VALID_CURRENCIES.includes(currencyToUse)) {
    currencyToUse = 'USD';
    // Clear invalid currency from localStorage and store
    if (typeof window !== 'undefined') {
      localStorage.setItem('budget-currency', 'USD');
    }
    useUserPreferences.getState().setCurrency('USD');
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // If there's an invalid currency code, fall back to USD
    console.error('Error formatting currency:', error);
    if (typeof window !== 'undefined') {
      localStorage.setItem('budget-currency', 'USD');
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}; 