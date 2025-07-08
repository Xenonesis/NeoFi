import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { formatCurrency as formatCurrencyFromStore } from "./store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Legacy function, uses the one from store.ts
export function formatCurrency(amount: number, currency?: string) {
  return formatCurrencyFromStore(amount, currency);
}

export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

// Ensure the user has a profile record
export async function ensureUserProfile(
  userId: string, 
  email?: string, 
  name?: string | null, 
  currency?: string
) {
  try {
    if (!userId) {
      console.error("No user ID provided to ensureUserProfile");
      return false;
    }
    
    console.log("Checking profile for user:", userId);
    
    // Check if profile exists first
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const profileData = profileSnap.data();
      // Only update if name or currency is missing
      if (!profileData.name || !profileData.currency) {
        await updateDoc(profileRef, {
          name: name || profileData.name || 'User',
          currency: currency || profileData.currency || 'USD',
          updatedAt: new Date().toISOString()
        });
      }
      return true;
    }
    
    // Profile doesn't exist - create it
    await setDoc(profileRef, {
      id: userId,
      email: email || '',
      name: name || 'User',
      currency: currency || 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Profile check error:", error);
    return false;
  }
}

export function calculateNextRecurringDate(
  lastDate: Date | string, 
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "annually" | string,
  timezone?: string
): Date {
  try {
    // Convert to Date object if string
    const date = typeof lastDate === 'string' ? new Date(lastDate) : new Date(lastDate);
    
    // Create a new date object to avoid modifying the input
    const nextDate = new Date(date);
    
    // Apply timezone if provided
    if (timezone) {
      // Format with the timezone and then parse back to ensure correct date
      const dateStr = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone
      }).format(nextDate);
      
      const [month, day, year] = dateStr.split('/');
      nextDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    switch (frequency) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "biweekly":
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case "monthly":
        // Handle edge cases like Jan 31 -> Feb 28/29
        const currentMonth = nextDate.getMonth();
        nextDate.setMonth(currentMonth + 1);
        
        // If the day changed (due to month length differences), set to last day of target month
        if (nextDate.getMonth() !== ((currentMonth + 1) % 12)) {
          nextDate.setDate(0); // Set to last day of previous month
        }
        break;
      case "quarterly":
        // Similar edge case handling as monthly
        const currentMonthQ = nextDate.getMonth();
        nextDate.setMonth(currentMonthQ + 3);
        
        // Handle day overflow
        if (nextDate.getMonth() !== ((currentMonthQ + 3) % 12)) {
          nextDate.setDate(0);
        }
        break;
      case "annually":
        // Handle Feb 29 on leap years
        const currentYear = nextDate.getFullYear();
        nextDate.setFullYear(currentYear + 1);
        
        // Check if we were on Feb 29 and now on Mar 1 (meaning the next year is not a leap year)
        if (nextDate.getMonth() === 2 && nextDate.getDate() === 1 && 
            date.getMonth() === 1 && date.getDate() === 29) {
          // Set to Feb 28 instead
          nextDate.setDate(28);
          nextDate.setMonth(1);
        }
        break;
      default:
        // Default to monthly if unknown frequency
        nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    return nextDate;
  } catch (error) {
    console.error("Error calculating next recurring date:", error);
    // Return a safe default - one month from now
    const fallbackDate = new Date();
    fallbackDate.setMonth(fallbackDate.getMonth() + 1);
    return fallbackDate;
  }
}

/**
 * Gets the user's current timezone
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Error getting timezone:", error);
    return "UTC"; // Default fallback
  }
}

// Format date with timezone awareness
export function formatDateWithTimezone(dateString: string, timezone?: string): string {
  try {
    const userTimezone = timezone || getUserTimezone();
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: userTimezone
    }).format(date);
  } catch (error) {
    console.error("Error formatting date with timezone:", error);
    return dateString; // Return original string as fallback
  }
}

// Local Storage Utilities for Data Persistence
const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_tracker_transactions',
  USER_PREFERENCES: 'budget_tracker_preferences',
  CATEGORIES: 'budget_tracker_categories',
  LAST_SYNC: 'budget_tracker_last_sync',
  OFFLINE_CHANGES: 'budget_tracker_offline_changes'
};

/**
 * Save data to localStorage with TTL (time-to-live)
 */
export function saveToLocalStorage<T>(key: string, data: T, ttlInMinutes: number = 60): void {
  try {
    const item = {
      data,
      expiry: ttlInMinutes ? Date.now() + ttlInMinutes * 60 * 1000 : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get data from localStorage with expiry check
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    
    // Check if the item has expired
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data as T;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
}

/**
 * Queue changes when offline to sync later
 */
export function queueOfflineChange(change: { 
  type: 'create' | 'update' | 'delete', 
  entity: 'transaction' | 'category' | 'profile', 
  data: any 
}): void {
  try {
    const offlineChanges = getFromLocalStorage<any[]>(STORAGE_KEYS.OFFLINE_CHANGES) || [];
    offlineChanges.push({
      ...change,
      timestamp: Date.now(),
      id: change.data.id || crypto.randomUUID()
    });
    saveToLocalStorage(STORAGE_KEYS.OFFLINE_CHANGES, offlineChanges);
  } catch (error) {
    console.error('Error queuing offline change:', error);
  }
}

/**
 * Check if the user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Sync offline changes with Firebase when back online
 */
export async function syncOfflineChanges(offlineChanges: any[]): Promise<{ 
  success: boolean, 
  syncedCount: number, 
  errors: any[] 
}> {
  if (!isOnline()) {
    return { success: false, syncedCount: 0, errors: [{ message: 'Currently offline' }] };
  }
  
  if (offlineChanges.length === 0) {
    return { success: true, syncedCount: 0, errors: [] };
  }
  
  const results = {
    success: true,
    syncedCount: 0,
    errors: [] as any[]
  };
  
  // Import Firebase service functions
  const { transactionService, categoryService } = await import('./firebase-service');
  
  // Sort by timestamp to maintain order of operations
  const sortedChanges = [...offlineChanges].sort((a, b) => a.timestamp - b.timestamp);
  
  for (const change of sortedChanges) {
    try {
      switch (change.type) {
        case 'create':
          if (change.entity === 'transaction') {
            await transactionService.create(change.data);
          } else if (change.entity === 'category') {
            await categoryService.create(change.data);
          }
          break;
          
        case 'update':
          if (change.entity === 'transaction') {
            await transactionService.update(change.data.id, change.data);
          } else if (change.entity === 'category') {
            await categoryService.update(change.data.id, change.data);
          }
          break;
          
        case 'delete':
          if (change.entity === 'transaction') {
            await transactionService.delete(change.data.id);
          } else if (change.entity === 'category') {
            await categoryService.delete(change.data.id);
          }
          break;
      }
      
      results.syncedCount++;
    } catch (error) {
      results.errors.push({
        change,
        error
      });
      results.success = false;
    }
  }
  
  // Update the last sync time
  saveToLocalStorage(STORAGE_KEYS.LAST_SYNC, Date.now());
  
  return results;
}

// Export the storage keys for use in components
export { STORAGE_KEYS };

export function getRandomColor(text: string): string {
  // These color options match the Tailwind color palette
  const colors = [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#f59e0b", // amber-500
    "#eab308", // yellow-500
    "#84cc16", // lime-500
    "#22c55e", // green-500
    "#10b981", // emerald-500
    "#14b8a6", // teal-500
    "#06b6d4", // cyan-500
    "#0ea5e9", // sky-500
    "#3b82f6", // blue-500
    "#6366f1", // indigo-500
    "#8b5cf6", // violet-500
    "#a855f7", // purple-500
    "#d946ef", // fuchsia-500
    "#ec4899", // pink-500
    "#f43f5e", // rose-500
  ];
  
  // Generate a deterministic index based on the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get a color from the array using the hash
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Get the current application version and version history
 * @returns The current app version as a string
 */
export function getAppVersion(): string {
  // Current version
  const currentVersion = '0.30.0-alpha';
  
  // Version history
  const versionHistory = [
    { version: '0.10.0-alpha', releaseDate: '2025-07-05' },
    { version: '0.20.0-alpha', releaseDate: '2025-07-07' },
    { version: '0.30.0-alpha', releaseDate: '2025-07-08' }
  ];
  
  return process.env.NEXT_PUBLIC_APP_VERSION || currentVersion;
} 