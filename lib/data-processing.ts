// Common data processing utilities to eliminate duplicate calculations

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryId: string;
  date: string;
}

export interface MonthlyData {
  name: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface TopCategory {
  name: string;
  count: number;
  total: number;
  color: string;
}

// Standard color palette for consistency
export const CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#F97316', '#6366F1', '#14B8A6', '#A855F7'
];

/**
 * Calculate monthly data from transactions
 */
export function getMonthlyData(transactions: Transaction[], months: number = 6): MonthlyData[] {
  if (!transactions || transactions.length === 0) {
    return [];
  }
  
  const now = new Date();
  const monthsMap: Record<string, MonthlyData> = {};
  
  // Initialize months
  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    monthsMap[monthKey] = {
      name: monthName,
      income: 0,
      expense: 0,
      balance: 0
    };
  }
  
  // Process transactions
  transactions.forEach(tx => {
    if (!tx.date) return;
    
    const monthKey = tx.date.substring(0, 7);
    if (monthsMap[monthKey]) {
      const amount = Number(tx.amount) || 0;
      
      if (tx.type === 'income') {
        monthsMap[monthKey].income += amount;
      } else if (tx.type === 'expense') {
        monthsMap[monthKey].expense += amount;
      }
    }
  });
  
  // Calculate balance and return sorted
  return Object.values(monthsMap)
    .map(month => ({
      ...month,
      balance: month.income - month.expense
    }))
    .reverse();
}

/**
 * Get category data for pie charts
 */
export function getCategoryData(transactions: Transaction[], type: 'income' | 'expense' = 'expense'): CategoryData[] {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  if (filteredTransactions.length === 0) {
    return [];
  }
  
  const categorySums = new Map<string, number>();
  
  filteredTransactions.forEach(t => {
    const category = t.category || 'Uncategorized';
    categorySums.set(category, (categorySums.get(category) || 0) + t.amount);
  });
  
  return Array.from(categorySums.entries())
    .map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get top categories by usage and spending
 */
export function getTopCategories(transactions: Transaction[], limit: number = 5): TopCategory[] {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  if (expenseTransactions.length === 0) {
    return [];
  }
  
  const categories = expenseTransactions.reduce((acc, t) => {
    const categoryName = t.category || 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = { count: 0, total: 0 };
    }
    
    acc[categoryName].count += 1;
    acc[categoryName].total += t.amount;
    
    return acc;
  }, {} as Record<string, { count: number; total: number }>);
  
  return Object.keys(categories)
    .map((name, index) => ({
      name,
      count: categories[name].count,
      total: categories[name].total,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/**
 * Calculate financial summary
 */
export function calculateSummary(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      
      if (transaction.type === 'income') {
        acc.totalIncome += amount;
      } else {
        acc.totalExpense += amount;
      }
      
      return acc;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
      get balance() {
        return this.totalIncome - this.totalExpense;
      }
    }
  );
}

/**
 * Filter transactions by search term
 */
export function filterTransactions(
  transactions: Transaction[], 
  searchTerm: string, 
  type?: 'income' | 'expense' | 'all'
): Transaction[] {
  let filtered = [...transactions];
  
  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(t => 
      (t.category && t.category.toLowerCase().includes(term)) ||
      (t.date && t.date.includes(term))
    );
  }
  
  // Apply type filter
  if (type && type !== 'all') {
    filtered = filtered.filter(t => t.type === type);
  }
  
  // Sort by date (newest first)
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Paginate array
 */
export function paginate<T>(array: T[], page: number, itemsPerPage: number): T[] {
  const startIndex = (page - 1) * itemsPerPage;
  return array.slice(startIndex, startIndex + itemsPerPage);
}

/**
 * Calculate total pages
 */
export function getTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}