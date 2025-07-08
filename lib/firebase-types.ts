// Firebase data types for the application

export interface Profile {
  id: string;
  email: string;
  name?: string;
  currency?: string;
  timezone?: string;
  phone?: string;
  gender?: string;
  address?: string;
  preferred_language?: string;
  profile_photo?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  ai_settings?: {
    enabled: boolean;
    google_api_key?: string;
    mistral_api_key?: string;
    anthropic_api_key?: string;
    groq_api_key?: string;
    deepseek_api_key?: string;
    llama_api_key?: string;
    cohere_api_key?: string;
    gemini_api_key?: string;
    qwen_api_key?: string;
    openrouter_api_key?: string;
    mistral_model?: string;
    defaultModel: {
      provider: 'mistral' | 'google' | 'anthropic' | 'groq' | 'deepseek' | 'llama' | 'cohere' | 'gemini' | 'qwen' | 'openrouter';
      model: string;
      apiKey?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  userId: string | null;
  type?: 'income' | 'expense' | 'both';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  categoryName?: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  isActive: boolean;
  lastProcessed?: string;
  createdAt: string;
  updatedAt: string;
}