"use client";

import { useState, useEffect, useMemo } from "react";
import { dbService } from "@/lib/firebase-service";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Currency } from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Edit2, 
  Trash, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import AddTransactionForm from "./add-transaction-form";

interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  categoryId: string;
  categoryName?: string;
  amount: number;
  description: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  userId?: string;
  type?: 'income' | 'expense' | 'both';
}

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await dbService.getTransactions(user.uid);
      
      if (error) {
        toast.error("Failed to load transactions");
        console.error("Error fetching transactions:", error);
        return;
      }
      
      setTransactions(data || []);
      calculateSummary(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await dbService.getCategories(user.uid);
      
      if (error) {
        toast.error("Failed to load categories");
        console.error("Error fetching categories:", error);
        return;
      }
      
      let categoriesData = data || [];
      
      // Create default categories if none exist
      if (categoriesData.length === 0) {
        await createDefaultCategories();
        // Refetch after creating defaults
        const { data: newData } = await dbService.getCategories(user.uid);
        categoriesData = newData || [];
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Create default categories
  const createDefaultCategories = async () => {
    if (!user) return;

    const defaultCategories = [
      { name: "Food & Dining", icon: "🍽️", type: "expense" as const },
      { name: "Transportation", icon: "🚗", type: "expense" as const },
      { name: "Shopping", icon: "🛒", type: "expense" as const },
      { name: "Entertainment", icon: "🎬", type: "expense" as const },
      { name: "Bills & Utilities", icon: "💡", type: "expense" as const },
      { name: "Healthcare", icon: "🏥", type: "expense" as const },
      { name: "Salary", icon: "💰", type: "income" as const },
      { name: "Freelance", icon: "💻", type: "income" as const },
      { name: "Investment", icon: "📈", type: "income" as const },
      { name: "Other Income", icon: "💵", type: "income" as const },
      { name: "Other Expense", icon: "📝", type: "expense" as const }
    ];

    try {
      for (const category of defaultCategories) {
        await dbService.createCategory({
          userId: user.uid,
          ...category
        });
      }
      toast.success("Default categories created");
    } catch (error) {
      console.error("Error creating default categories:", error);
    }
  };

  // Calculate summary
  const calculateSummary = (transactionsData: Transaction[]) => {
    const summary = transactionsData.reduce((acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      
      if (transaction.type === "income") {
        acc.totalIncome += amount;
      } else {
        acc.totalExpense += amount;
      }
      return acc;
    }, {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    });
    
    summary.balance = summary.totalIncome - summary.totalExpense;
    setSummary(summary);
  };

  // Handle edit transaction
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle delete transaction
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const { error } = await dbService.deleteTransaction(id);
      
      if (error) {
        toast.error("Failed to delete transaction");
        return;
      }
      
      toast.success("Transaction deleted");
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  // Handle transaction form success
  const handleTransactionSuccess = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingTransaction(null);
    fetchTransactions();
    fetchCategories(); // Also refresh categories in case a new one was created
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.categoryName && t.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType]);

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Load data when user is available
  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view transactions.</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                <Currency value={summary.totalIncome} />
              </p>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                <Currency value={summary.totalExpense} />
              </p>
            </div>
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Net Balance</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <Currency value={summary.balance} />
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              summary.balance >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {summary.balance >= 0 ? '+' : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Filter by transaction type"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <Button onClick={fetchTransactions} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading transactions...</p>
          </div>
        ) : paginatedTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No transactions found</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Add your first transaction
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-right p-4 font-medium">Amount</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/30">
                      <td className="p-4">{formatDate(transaction.date)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {transaction.type === "income" ? (
                            <ArrowUpCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="p-4">{transaction.categoryName || "Uncategorized"}</td>
                      <td className="p-4">{transaction.description}</td>
                      <td className={`p-4 text-right font-medium ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        <Currency value={transaction.amount} />
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                  {filteredTransactions.length} transactions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Transaction Form */}
      {showForm && (
        <AddTransactionForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setIsEditing(false);
            setEditingTransaction(null);
          }}
          onTransactionAdded={handleTransactionSuccess}
          categories={categories}
          editTransaction={editingTransaction}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
