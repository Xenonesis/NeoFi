"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { budgetService, categoryService, transactionService } from "@/lib/firebase-service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
  category_name?: string;
  spent?: number;
  remaining?: number;
  percentage?: number;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  userId?: string;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly'
  });

  const fetchData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const [budgetsData, categoriesData, transactionsData] = await Promise.all([
        budgetService.getByUserId(user.uid),
        categoryService.getAll(),
        transactionService.getByUserId(user.uid)
      ]);

      // Calculate spending for each budget
      const budgetsWithSpending = budgetsData.map(budget => {
        const categoryTransactions = transactionsData?.filter(t => 
          t.categoryId === budget.categoryId && 
          t.type === 'expense' &&
          isWithinPeriod(t.date, budget.period)
        ) || [];
        
        const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        const remaining = Math.max(0, budget.amount - spent);
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        
        return {
          ...budget,
          category_name: categoriesData.find(cat => cat.id === budget.categoryId)?.name || 'Unknown',
          spent,
          remaining,
          percentage
        };
      });

      setBudgets(budgetsWithSpending);
      setCategories(categoriesData);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const isWithinPeriod = (transactionDate: string, period: string) => {
    const now = new Date();
    const transDate = new Date(transactionDate);
    
    switch (period) {
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transDate >= weekAgo;
      case 'monthly':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return transDate >= monthAgo;
      case 'yearly':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return transDate >= yearAgo;
      default:
        return true;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const budgetData = {
        userId: user.uid,
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        period: formData.period
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.id, budgetData);
      } else {
        await budgetService.create(budgetData);
      }

      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await budgetService.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ categoryId: '', amount: '', period: 'monthly' });
    setEditingBudget(null);
    setShowForm(false);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  const chartData = budgets.map(budget => ({
    name: budget.category_name,
    budget: budget.amount,
    spent: budget.spent || 0,
    remaining: budget.remaining || 0
  }));

  const pieData = budgets.map((budget, index) => ({
    name: budget.category_name,
    value: budget.spent || 0,
    color: COLORS[index % COLORS.length]
  }));

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            Budget Management
          </h1>
          <p className="text-muted-foreground">Set and track your spending limits</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button onClick={() => setShowForm(true)} className="hidden md:flex">
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link href="/dashboard/budget" className="block">
          <Card className="h-full hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(totalSpent)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalRemaining)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget Usage</p>
                <p className="text-2xl font-bold">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                  <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingBudget ? 'Edit Budget' : 'Create Budget'}</CardTitle>
            <CardDescription>Set spending limits for your categories</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingBudget ? 'Update' : 'Create'} Budget
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Budget Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <Card key={budget.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{budget.category_name}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(budget.id)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget:</span>
                  <span className="font-medium">{formatCurrency(budget.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Spent:</span>
                  <span className="font-medium text-red-500">{formatCurrency(budget.spent || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-medium text-green-500">{formatCurrency(budget.remaining || 0)}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Usage</span>
                    <span>{Math.round(budget.percentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        (budget.percentage || 0) > 90 ? 'bg-red-500' : 
                        (budget.percentage || 0) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                    />
                  </div>
                </div>
                
                {(budget.percentage || 0) > 90 && (
                  <div className="flex items-center gap-1 text-xs text-red-500 mt-2">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Budget exceeded!</span>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground capitalize mt-2">{budget.period} budget</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No budgets created yet</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Budget
          </Button>
        </div>
      )}

      {/* Mobile Add Button */}
      {!showForm && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <Button
            onClick={() => setShowForm(true)}
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}