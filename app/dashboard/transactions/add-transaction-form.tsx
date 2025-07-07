"use client";

import { useState, useEffect } from "react";
import { transactionService } from "@/lib/firebase-service";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  icon?: string;
  userId?: string;
  type?: 'income' | 'expense' | 'both';
}

interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  categoryId: string;
  categoryName?: string;
  amount: number;
  description: string;
  date: string;
}

interface FormData {
  type: "income" | "expense";
  categoryId: string;
  amount: string;
  description: string;
  date: string;
}

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  categories: Category[];
  editTransaction?: Transaction | null;
  isEditing?: boolean;
}

export default function AddTransactionForm({
  isOpen,
  onClose,
  onTransactionAdded,
  categories,
  editTransaction = null,
  isEditing = false
}: AddTransactionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📝");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: "expense",
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Load transaction data if editing
  useEffect(() => {
    if (isEditing && editTransaction) {
      setFormData({
        type: editTransaction.type,
        categoryId: editTransaction.categoryId,
        amount: editTransaction.amount.toString(),
        description: editTransaction.description,
        date: editTransaction.date
      });
    } else {
      // Reset form for new transaction
      setFormData({
        type: "expense",
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [isEditing, editTransaction]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setCreatingCategory(true);

    try {
      const { data: newCategory, error } = await transactionService.createCategory({
        userId: user.uid,
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        type: formData.type
      });

      if (error) {
        toast.error("Failed to create category");
        return;
      }

      if (newCategory) {
        // Add to local categories list
        const updatedCategories = [...categories, newCategory];
        
        // Set the new category as selected
        setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
        
        // Reset category creation form
        setNewCategoryName("");
        setNewCategoryIcon("📝");
        setShowCreateCategory(false);
        
        toast.success("Category created successfully");
        
        // Trigger parent to refresh categories
        onTransactionAdded();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    // Validation
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);

    try {
      // Find the selected category name
      const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
      
      const transactionData = {
        userId: user.uid,
        type: formData.type,
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.name || '',
        amount: amount,
        description: formData.description,
        date: formData.date
      };

      if (isEditing && editTransaction) {
        // Update existing transaction
        const { error } = await transactionService.updateTransaction(editTransaction.id, transactionData);
        
        if (error) {
          toast.error("Failed to update transaction");
          return;
        }
        
        toast.success("Transaction updated");
      } else {
        // Create new transaction
        const { error } = await transactionService.createTransaction(transactionData);
        
        if (error) {
          toast.error("Failed to create transaction");
          return;
        }
        
        toast.success("Transaction created");
      }

      // Reset form and close
      setFormData({
        type: "expense",
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      
      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card rounded-lg border shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="categoryId" className="block text-sm font-medium">
                Category
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateCategory(!showCreateCategory)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create New
              </Button>
            </div>

            {/* Create New Category Form */}
            {showCreateCategory && (
              <div className="mb-4 p-3 border rounded-lg bg-muted/30">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="newCategoryName" className="block text-xs font-medium mb-1">
                      Category Name
                    </label>
                    <input
                      id="newCategoryName"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newCategoryIcon" className="block text-xs font-medium mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      id="newCategoryIcon"
                      type="text"
                      value={newCategoryIcon}
                      onChange={(e) => setNewCategoryIcon(e.target.value)}
                      placeholder="📝"
                      className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateCategory}
                      disabled={creatingCategory || !newCategoryName.trim()}
                      className="flex-1"
                    >
                      {creatingCategory ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white mr-1"></div>
                          Creating...
                        </>
                      ) : (
                        "Create Category"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCreateCategory(false);
                        setNewCategoryName("");
                        setNewCategoryIcon("📝");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Selection */}
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              required
            >
              <option value="">Select a category</option>
              {categories
                .filter(category => category.type === formData.type || category.type === 'both')
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
            </select>
            
            {categories.filter(category => category.type === formData.type || category.type === 'both').length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                No categories available for {formData.type}. Create one above.
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter transaction details"
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Save"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
