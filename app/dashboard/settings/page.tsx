"use client";

import { useState, useEffect } from "react";
import { authService, dbService } from "@/lib/firebase-service";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/lib/store";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import type { AIProvider, AIModel } from "@/lib/ai";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  address?: string;
  preferred_language?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  profile_photo?: string;
  gender?: string;
  timezone?: string;
  ai_settings?: {
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
    enabled: boolean;
    mistral_model?: string;
    defaultModel: {
      provider: 'mistral' | 'google' | 'anthropic' | 'groq' | 'deepseek' | 'llama' | 'cohere' | 'gemini' | 'qwen' | 'openrouter';
      model: string;
    };
  };
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  app_metadata?: {
    provider?: string;
  };
  user_metadata?: {
    name?: string;
    preferred_currency?: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { 
    username, setCurrency, setUsername, theme, setTheme, 
    syncWithDatabase, setUserId 
  } = useUserPreferences();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    currency: string;
    phone: string;
    address: string;
    preferred_language: string;
    profile_photo: string;
    gender: string;
    timezone: string;
    notification_preferences: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    ai_settings: Profile['ai_settings'];
  }>({
    name: "",
    email: "",
    currency: "USD",
    phone: "",
    address: "",
    preferred_language: "en",
    profile_photo: "",
    gender: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notification_preferences: {
      email: true,
      push: false,
      sms: false
    },
    ai_settings: {
      google_api_key: "",
      mistral_api_key: "",
      anthropic_api_key: "",
      groq_api_key: "",
      deepseek_api_key: "",
      llama_api_key: "",
      cohere_api_key: "",
      gemini_api_key: "",
      qwen_api_key: "",
      openrouter_api_key: "",
      mistral_model: "mistral-small",
      enabled: false,
      defaultModel: {
        provider: 'mistral' as AIProvider,
        model: 'mistral-small' as AIModel
      }
    }
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [themeChoice, setThemeChoice] = useState<"light" | "dark" | "system">(theme || "system");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      console.log("Auth user data:", currentUser);
      
      // Map the Firebase User to AuthUser interface
      const mappedAuthUser: AuthUser = {
        id: currentUser.uid,
        email: currentUser.email || '',
        created_at: currentUser.metadata.creationTime || new Date().toISOString(),
        last_sign_in_at: currentUser.metadata.lastSignInTime,
        email_confirmed_at: currentUser.emailVerified ? currentUser.metadata.creationTime : undefined,
        app_metadata: {},
        user_metadata: {}
      };
      
      setAuthUser(mappedAuthUser);
      
      // Set user ID in preferences store
      setUserId(currentUser.uid);

      // Check if a profile exists for this user
      const { data, error } = await dbService.getProfile(currentUser.uid);

      if (error || !data) {
        console.error("Error fetching profile:", error);
        
        // If the profile doesn't exist, create one
        if (!data) {
          console.log("Profile not found, creating a new one...");
          
          const newProfile = {
            email: currentUser.email || '',
            name: currentUser.displayName || currentUser.email?.split('@')[0] || '',
            currency: 'USD',
            phone: '',
            address: '',
            preferred_language: 'en',
            notification_preferences: {
              email: true,
              push: false,
              sms: false
            },
            profile_photo: '',
            gender: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ai_settings: {
              google_api_key: '',
              mistral_api_key: '',
              anthropic_api_key: '',
              groq_api_key: '',
              deepseek_api_key: '',
              llama_api_key: '',
              cohere_api_key: '',
              gemini_api_key: '',
              qwen_api_key: '',
              openrouter_api_key: '',
              mistral_model: 'mistral-small',
              enabled: false,
              defaultModel: {
                provider: 'mistral' as AIProvider,
                model: 'mistral-small' as AIModel
              }
            }
          };
          
          const { error: insertError } = await dbService.createProfile(currentUser.uid, newProfile);
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          } else {
            console.log("New profile created successfully");
            setProfile(newProfile as Profile);
            
            // Update the global store
            setUsername(newProfile.name || '');
            setCurrency(newProfile.currency);
            
            setFormData({
              name: newProfile.name || '',
              email: newProfile.email || '',
              currency: newProfile.currency,
              phone: newProfile.phone || '',
              address: newProfile.address || '',
              preferred_language: newProfile.preferred_language || 'en',
              profile_photo: newProfile.profile_photo || '',
              gender: newProfile.gender || '',
              timezone: newProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              notification_preferences: newProfile.notification_preferences || {
                email: true,
                push: false,
                sms: false
              },
              ai_settings: {
                google_api_key: "",
                mistral_api_key: "",
                anthropic_api_key: "",
                groq_api_key: "",
                deepseek_api_key: "",
                llama_api_key: "",
                cohere_api_key: "",
                gemini_api_key: "",
                qwen_api_key: "",
                openrouter_api_key: "",
                mistral_model: "mistral-small",
                enabled: false,
                defaultModel: {
                  provider: 'mistral' as AIProvider,
                  model: 'mistral-small' as AIModel
                }
              }
            });
          }
        }
      } else {
        setProfile(data as Profile);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          currency: data.currency,
          phone: data.phone || '',
          address: data.address || '',
          preferred_language: data.preferred_language || 'en',
          profile_photo: data.profile_photo || '',
          gender: data.gender || '',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          notification_preferences: data.notification_preferences || {
            email: true,
            push: false,
            sms: false
          },
          ai_settings: data.ai_settings || {
            google_api_key: "",
            mistral_api_key: "",
            anthropic_api_key: "",
            groq_api_key: "",
            deepseek_api_key: "",
            llama_api_key: "",
            cohere_api_key: "",
            gemini_api_key: "",
            qwen_api_key: "",
            openrouter_api_key: "",
            mistral_model: "mistral-small",
            enabled: false,
            defaultModel: {
              provider: 'mistral' as AIProvider,
              model: 'mistral-small' as AIModel
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      const updatedProfile = {
        email: formData.email,
        name: formData.name,
        currency: formData.currency,
        phone: formData.phone,
        address: formData.address,
        preferred_language: formData.preferred_language,
        profile_photo: formData.profile_photo,
        gender: formData.gender,
        timezone: formData.timezone,
        notification_preferences: formData.notification_preferences,
        ai_settings: formData.ai_settings
      };

      const { error: updateError } = await dbService.updateProfile(currentUser.uid, updatedProfile);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        setMessage({ type: "error", text: "Failed to update profile. Please try again later." });
      } else {
        console.log("Profile updated successfully");
        setProfile(updatedProfile);
        setFormData({
          name: updatedProfile.name || '',
          email: updatedProfile.email || '',
          currency: updatedProfile.currency,
          phone: updatedProfile.phone || '',
          address: updatedProfile.address || '',
          preferred_language: updatedProfile.preferred_language || 'en',
          profile_photo: updatedProfile.profile_photo || '',
          gender: updatedProfile.gender || '',
          timezone: updatedProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          notification_preferences: updatedProfile.notification_preferences || {
            email: true,
            push: false,
            sms: false
          },
          ai_settings: updatedProfile.ai_settings || {
            google_api_key: "",
            mistral_api_key: "",
            anthropic_api_key: "",
            groq_api_key: "",
            deepseek_api_key: "",
            llama_api_key: "",
            cohere_api_key: "",
            gemini_api_key: "",
            qwen_api_key: "",
            openrouter_api_key: "",
            mistral_model: "mistral-small",
            enabled: false,
            defaultModel: {
              provider: 'mistral' as AIProvider,
              model: 'mistral-small' as AIModel
            }
          }
        });
        setMessage({ type: "success", text: "Profile updated successfully" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again later." });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setThemeChoice(value);
    setTheme(value);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const exportProfileToPDF = async () => {
    try {
      setSaving(true);
      
      // Dynamic import to reduce bundle size
      const jsPDF = (await import('jspdf')).default;
      
      // Create document
      const doc = new jsPDF();
      
      // Add title and styling
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text("User Profile", 105, 20, { align: 'center' });
      
      // Add horizontal line
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Add profile information
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      
      let yPosition = 40;
      const leftMargin = 20;
      const lineHeight = 10;
      
      // Add user details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Personal Information", leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      yPosition += lineHeight + 5;
      doc.text(`Name: ${formData.name || 'Not provided'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Email: ${formData.email}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Phone: ${formData.phone || 'Not provided'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Address: ${formData.address || 'Not provided'}`, leftMargin, yPosition);
      
      yPosition += lineHeight + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Preferences", leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      yPosition += lineHeight + 5;
      doc.text(`Currency: ${formData.currency}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Language: ${formData.preferred_language || 'English'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Theme: ${themeChoice}`, leftMargin, yPosition);

      yPosition += lineHeight;
      doc.text(`Gender: ${formData.gender || 'Not specified'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Timezone: ${formData.timezone || 'UTC'}`, leftMargin, yPosition);
      
      yPosition += lineHeight + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Notification Preferences", leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      yPosition += lineHeight + 5;
      doc.text(`Email notifications: ${formData.notification_preferences?.email ? 'Enabled' : 'Disabled'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Push notifications: ${formData.notification_preferences?.push ? 'Enabled' : 'Disabled'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`SMS notifications: ${formData.notification_preferences?.sms ? 'Enabled' : 'Disabled'}`, leftMargin, yPosition);
      
      yPosition += lineHeight + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("AI Assistant Settings", leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      yPosition += lineHeight + 5;
      doc.text(`AI Assistant: ${formData.ai_settings?.enabled ? 'Enabled' : 'Disabled'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Google AI API Key: ${formData.ai_settings?.google_api_key ? '**********' : 'Not set'}`, leftMargin, yPosition);
      
      yPosition += lineHeight;
      doc.text(`Mistral AI API Key: ${formData.ai_settings?.mistral_api_key ? '**********' : 'Not set'}`, leftMargin, yPosition);
      
      // Add footer with generation date
      doc.setFontSize(10);
      doc.setTextColor(127, 140, 141);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        105,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      
      // Save PDF
      doc.save(`user_profile_${new Date().toISOString().slice(0,10)}.pdf`);
      
      toast.success("Profile exported to PDF successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export profile");
    } finally {
      setSaving(false);
    }
  };

  const getDefaultModelForProvider = (provider: string): string => {
    switch (provider) {
      case 'mistral': return 'mistral-small';
      case 'anthropic': return 'claude-3-haiku';
      case 'groq': return 'llama3-8b';
      case 'deepseek': return 'deepseek-chat';
      case 'llama': return 'llama-3-8b';
      case 'cohere': return 'command';
      case 'gemini': return 'gemini-1.5-flash';
      case 'qwen': return 'qwen-turbo';
      case 'openrouter': return 'openrouter-default';
      default: return 'mistral-small';
    }
  };
  
  const renderModelOptions = (provider: string) => {
    switch (provider) {
      case 'mistral':
        return (
          <>
            <option value="mistral-tiny">Mistral Tiny (Fastest)</option>
            <option value="mistral-small">Mistral Small (Balanced)</option>
            <option value="mistral-medium">Mistral Medium (Advanced)</option>
            <option value="mistral-large-latest">Mistral Large (Most Powerful)</option>
          </>
        );
      case 'anthropic':
        return (
          <>
            <option value="claude-3-haiku">Claude 3 Haiku (Fast)</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
            <option value="claude-3-opus">Claude 3 Opus (Most Powerful)</option>
          </>
        );
      case 'groq':
        return (
          <>
            <option value="llama3-8b">Llama 3 8B (Fast)</option>
            <option value="llama3-70b">Llama 3 70B (Powerful)</option>
            <option value="mixtral-8x7b">Mixtral 8x7B (Balanced)</option>
          </>
        );
      case 'deepseek':
        return (
          <>
            <option value="deepseek-chat">DeepSeek Chat</option>
            <option value="deepseek-coder">DeepSeek Coder</option>
          </>
        );
      case 'llama':
        return (
          <>
            <option value="llama-2-7b">Llama 2 7B</option>
            <option value="llama-2-13b">Llama 2 13B</option>
            <option value="llama-2-70b">Llama 2 70B</option>
            <option value="llama-3-8b">Llama 3 8B</option>
            <option value="llama-3-70b">Llama 3 70B</option>
          </>
        );
      case 'cohere':
        return (
          <>
            <option value="command">Command</option>
            <option value="command-light">Command Light (Faster)</option>
            <option value="command-r">Command R</option>
            <option value="command-r-plus">Command R+ (Most Powerful)</option>
          </>
        );
      case 'gemini':
        return (
          <>
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          </>
        );
      case 'qwen':
        return (
          <>
            <option value="qwen-turbo">Qwen Turbo</option>
            <option value="qwen-plus">Qwen Plus</option>
            <option value="qwen-max">Qwen Max</option>
          </>
        );
      case 'openrouter':
        return (
          <>
            <option value="openrouter-default">OpenRouter Default</option>
            <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
            <option value="google/gemini-pro">Gemini Pro</option>
            <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B</option>
          </>
        );
      default:
        return <option value="mistral-small">Mistral Small</option>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportProfileToPDF}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Export Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground ring-offset-background"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                        Phone Number (optional)
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="mb-2 block text-sm font-medium">
                        Address (optional)
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your address"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currency" className="mb-2 block text-sm font-medium">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        title="Select currency"
                      >
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="JPY">Japanese Yen (JPY)</option>
                        <option value="CNY">Chinese Yuan (CNY)</option>
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="CAD">Canadian Dollar (CAD)</option>
                        <option value="AUD">Australian Dollar (AUD)</option>
                        <option value="SGD">Singapore Dollar (SGD)</option>
                        <option value="CHF">Swiss Franc (CHF)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="preferred_language" className="mb-2 block text-sm font-medium">
                        Language
                      </label>
                      <select
                        id="preferred_language"
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        title="Select language"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="ar">Arabic</option>
                        <option value="ru">Russian</option>
                        <option value="pt">Portuguese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="mb-2 block text-sm font-medium">
                        Gender (optional)
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        title="Select gender"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timezone" className="mb-2 block text-sm font-medium">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        title="Select timezone"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/Anchorage">Alaska Time</option>
                        <option value="Pacific/Honolulu">Hawaii Time</option>
                        <option value="Europe/London">London (GMT/BST)</option>
                        <option value="Europe/Paris">Central European (CET/CEST)</option>
                        <option value="Europe/Helsinki">Eastern European (EET/EEST)</option>
                        <option value="Asia/Tokyo">Japan (JST)</option>
                        <option value="Asia/Shanghai">China (CST)</option>
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={themeChoice === "light" ? "default" : "outline"}
                          onClick={() => handleThemeChange("light")}
                          className="justify-start"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="mr-2 h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="4" strokeWidth="2" />
                            <path
                              strokeLinecap="round"
                              strokeWidth="2"
                              d="M12 2v2m0 16v2M4 12H2m20 0h-2m-14 6l-2 2m2-16L4 4m16 16l2 2m-2-16l2-2"
                            />
                          </svg>
                          Light
                        </Button>
                        <Button
                          type="button"
                          variant={themeChoice === "dark" ? "default" : "outline"}
                          onClick={() => handleThemeChange("dark")}
                          className="justify-start"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="mr-2 h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="2"
                              d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                            />
                          </svg>
                          Dark
                        </Button>
                        <Button
                          type="button"
                          variant={themeChoice === "system" ? "default" : "outline"}
                          onClick={() => handleThemeChange("system")}
                          className="justify-start"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="mr-2 h-4 w-4"
                          >
                            <rect width="18" height="14" x="3" y="3" rx="2" strokeWidth="2" />
                            <path strokeLinecap="round" strokeWidth="2" d="M4 17h16M12 21v-4" />
                          </svg>
                          System
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium">Notification Preferences</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="email_notifications"
                            checked={formData.notification_preferences?.email ?? true}
                            onChange={(e) => setFormData({
                              ...formData,
                              notification_preferences: {
                                ...formData.notification_preferences,
                                email: e.target.checked
                              }
                            })}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="email_notifications" className="ml-2 text-sm">
                            Email Notifications
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="push_notifications"
                            checked={formData.notification_preferences?.push ?? false}
                            onChange={(e) => setFormData({
                              ...formData,
                              notification_preferences: {
                                ...formData.notification_preferences,
                                push: e.target.checked
                              }
                            })}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="push_notifications" className="ml-2 text-sm">
                            Push Notifications
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="sms_notifications"
                            checked={formData.notification_preferences?.sms ?? false}
                            onChange={(e) => setFormData({
                              ...formData,
                              notification_preferences: {
                                ...formData.notification_preferences,
                                sms: e.target.checked
                              }
                            })}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="sms_notifications" className="ml-2 text-sm">
                            SMS Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium">AI Assistant Settings</label>
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ai_enabled"
                            checked={formData.ai_settings?.enabled ?? false}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                ai_settings: {
                                  ...formData.ai_settings,
                                  enabled: e.target.checked,
                                  defaultModel: formData.ai_settings?.defaultModel || {
                                    provider: 'mistral' as AIProvider,
                                    model: 'mistral-small' as AIModel
                                  }
                                }
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="ai_enabled" className="ml-2 text-sm">
                            Enable AI Assistant
                          </label>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Default AI Provider & Model
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <select
                              value={formData.ai_settings?.defaultModel?.provider || "mistral"}
                              onChange={(e) => setFormData({
                                ...formData,
                                ai_settings: {
                                  ...formData.ai_settings,
                                  defaultModel: {
                                    provider: (e.target.value || 'mistral') as AIProvider,
                                    model: getDefaultModelForProvider(e.target.value)
                                  },
                                  enabled: formData.ai_settings?.enabled ?? false
                                }
                              })}
                              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                              aria-label="Select AI provider"
                              title="Select AI provider"
                            >
                              <option value="mistral">Mistral AI</option>
                              <option value="anthropic">Claude (Anthropic)</option>
                              <option value="groq">Groq</option>
                              <option value="deepseek">DeepSeek</option>
                              <option value="llama">Llama</option>
                              <option value="cohere">Cohere</option>
                              <option value="gemini">Gemini (Google)</option>
                              <option value="qwen">Qwen</option>
                              <option value="openrouter">OpenRouter</option>
                            </select>
                            <select
                              value={formData.ai_settings?.defaultModel?.model || "mistral-small"}
                              onChange={(e) => setFormData({
                                ...formData,
                                ai_settings: {
                                  ...formData.ai_settings,
                                  defaultModel: {
                                    provider: (formData.ai_settings?.defaultModel?.provider || 'mistral') as AIProvider,
                                    model: e.target.value
                                  },
                                  enabled: formData.ai_settings?.enabled ?? false
                                }
                              })}
                              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                              aria-label="Select AI model"
                              title="Select AI model"
                            >
                              {renderModelOptions(formData.ai_settings?.defaultModel?.provider || "mistral")}
                            </select>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Select your preferred AI provider and model for financial insights and chat
                          </p>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <h4 className="text-sm font-medium mb-2">API Keys</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="google_api_key" className="mb-1 block text-sm font-medium">
                                Google AI API Key
                              </label>
                              <input
                                id="google_api_key"
                                type="password"
                                value={formData.ai_settings?.google_api_key ?? ""}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ai_settings: {
                                      ...formData.ai_settings,
                                      google_api_key: e.target.value,
                                      enabled: formData.ai_settings?.enabled ?? false,
                                      defaultModel: formData.ai_settings?.defaultModel || {
                                        provider: 'mistral' as AIProvider,
                                        model: 'mistral-small' as AIModel
                                      }
                                    }
                                  });
                                }}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter your Google AI API key"
                              />
                              <p className="mt-1 text-xs text-muted-foreground">
                                Used for financial insights and analytics
                              </p>
                            </div>
                            
                            <div>
                              <label htmlFor="mistral_api_key" className="mb-1 block text-sm font-medium">
                                Mistral AI API Key
                              </label>
                              <input
                                id="mistral_api_key"
                                type="password"
                                value={formData.ai_settings?.mistral_api_key ?? ""}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ai_settings: {
                                      ...formData.ai_settings,
                                      mistral_api_key: e.target.value,
                                      enabled: formData.ai_settings?.enabled ?? false,
                                      defaultModel: formData.ai_settings?.defaultModel || {
                                        provider: 'mistral' as AIProvider,
                                        model: 'mistral-small' as AIModel
                                      }
                                    }
                                  });
                                }}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter your Mistral AI API key"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="anthropic_api_key" className="mb-1 block text-sm font-medium">
                                Claude (Anthropic) API Key
                              </label>
                              <input
                                id="anthropic_api_key"
                                type="password"
                                value={formData.ai_settings?.anthropic_api_key ?? ""}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ai_settings: {
                                      ...formData.ai_settings,
                                      anthropic_api_key: e.target.value,
                                      enabled: formData.ai_settings?.enabled ?? false,
                                      defaultModel: formData.ai_settings?.defaultModel || {
                                        provider: 'mistral' as AIProvider,
                                        model: 'mistral-small' as AIModel
                                      }
                                    }
                                  });
                                }}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter your Claude API key"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="groq_api_key" className="mb-1 block text-sm font-medium">
                                Groq API Key
                              </label>
                              <input
                                id="groq_api_key"
                                type="password"
                                value={formData.ai_settings?.groq_api_key ?? ""}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ai_settings: {
                                      ...formData.ai_settings,
                                      groq_api_key: e.target.value,
                                      enabled: formData.ai_settings?.enabled ?? false,
                                      defaultModel: formData.ai_settings?.defaultModel || {
                                        provider: 'mistral' as AIProvider,
                                        model: 'mistral-small' as AIModel
                                      }
                                    }
                                  });
                                }}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter your Groq API key"
                              />
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Your API keys are stored securely and only used for AI feature processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {message && (
                <div
                  className={`mt-6 rounded-md p-4 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50"
                      : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-50"
                  }`}
                >
                  {message.text}
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}