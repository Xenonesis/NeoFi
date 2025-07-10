"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { TechLogo } from "@/components/ui/tech-logo";
import { getAppVersion } from "@/lib/utils";
import { 
  BarChart4, 
  BookOpen, 
  Code, 
  Github, 
  GitBranch, 
  LayoutGrid, 
  Lightbulb, 
  Linkedin, 
  Mail, 
  MessageCircle, 
  Award, 
  Calendar, 
  Trophy,
  ExternalLink,
  Globe,
  Instagram,
  UserCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Table,
  Cpu,
  Check,
  X,
  ArrowUpRight,
  DollarSign,
  BarChart,
  Layers,
  Database,
  Home,
  Info,
  Sparkles,
  History,
  FileQuestion,
  Network,
  Star,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table as UITable, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Background patterns
const gridPatternStyle = {
  backgroundSize: '40px 40px',
  backgroundImage: `
    linear-gradient(to right, rgba(128, 128, 128, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
  `,
  backgroundAttachment: 'fixed'
};

// Floating particles animation
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};

// Stats counter animation
const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Animation helper component
const AnimateInView = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Scroll progress indicator
const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const calculateScrollProgress = () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = scrollPx / winHeightPx;
    setScrollProgress(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", calculateScrollProgress);
    return () => window.removeEventListener("scroll", calculateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-background/30 backdrop-blur-sm z-50">
      <div 
        className="h-full bg-gradient-to-r from-primary/80 via-violet-500/80 to-primary/80" 
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
};

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState("mission");
  const [expandedFaqs, setExpandedFaqs] = useState([0]);

  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setExpandedFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Smooth scroll to section
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in">
      <ScrollProgressBar />
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-violet-500/20 mb-8 backdrop-blur-sm relative overflow-hidden">
        <FloatingParticles />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-10 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full" style={gridPatternStyle}></div>
        
        <div className="container max-w-5xl px-4 py-10 sm:py-14 relative z-10">
          <div className="relative text-center">
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-4 -right-8 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="mb-6">
              <Logo size="xl" withText animated={true} className="mx-auto mb-4" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 text-primary relative z-10 bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-to-r">About NeoFi</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg relative z-10 sm:text-xl leading-relaxed">Your personal finance companion for smarter decisions and financial freedom. Empowering millions to take control of their financial future.</p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              {[
                { label: "Active Users", value: 50000, suffix: "+" },
                { label: "Transactions", value: 2500000, suffix: "+" },
                { label: "Money Saved", value: 15, suffix: "M+" },
                { label: "Countries", value: 25, suffix: "+" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Navigation Tabs */}
      <div className="sticky top-[60px] z-30 bg-background/80 backdrop-blur-md border-b border-primary/10 mb-6 shadow-sm">
        <div className="container max-w-5xl px-4">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="overflow-x-auto">
              <TabsList className="h-14 bg-transparent w-full justify-start gap-2 px-4">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 gap-2 rounded-full"
                  onClick={() => scrollToSection("mission")}
                >
                  <Info className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 gap-2 rounded-full"
                  onClick={() => scrollToSection("features")}
                >
                  <Star className="w-4 h-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="versions" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 gap-2 rounded-full"
                  onClick={() => scrollToSection("app-details")}
                >
                  <GitBranch className="w-4 h-4" />
                  Versions
                </TabsTrigger>
                <TabsTrigger 
                  value="developer" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 gap-2 rounded-full"
                  onClick={() => scrollToSection("developer")}
                >
                  <UserCircle className="w-4 h-4" />
                  Developer
                </TabsTrigger>
                <TabsTrigger 
                  value="tech" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 gap-2 rounded-full"
                  onClick={() => scrollToSection("stack")}
                >
                  <Layers className="w-4 h-4" />
                  Tech Stack
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 gap-2 rounded-full"
                  onClick={() => scrollToSection("faq")}
                >
                  <FileQuestion className="w-4 h-4" />
                  FAQ
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container max-w-5xl px-4 pb-12">
        {/* Mission Section */}
        <section id="mission" className="scroll-mt-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <AnimateInView className="md:col-span-2">
              <Card className="h-full overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 p-6 relative z-10">
                  <CardTitle className="flex items-center gap-2 text-xl group-hover:text-primary transition-colors">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    Our Mission
                  </CardTitle>
                  <CardDescription className="text-base">
                    Empowering individuals and businesses to take control of their finances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <p className="leading-relaxed text-sm">
                        NeoFi is designed to help you manage your finances effectively and achieve your financial goals with intuitive tools for tracking expenses, creating budgets, and analyzing spending patterns.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <p className="leading-relaxed text-sm">
                        We believe financial management should be accessible to everyone, providing insights for informed decisions while maintaining complete privacy and security.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <p className="leading-relaxed text-sm">
                        Built with modern web technologies, NeoFi offers a seamless experience across all devices with focus on security, performance, and exceptional user experience.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {[
                      { label: "Security Focused", color: "bg-green-500/10 text-green-700 border-green-200" },
                      { label: "Privacy First", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
                      { label: "User Centered", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
                      { label: "AI Powered", color: "bg-orange-500/10 text-orange-700 border-orange-200" }
                    ].map((badge, i) => (
                      <Badge key={i} variant="outline" className={`${badge.color} px-3 py-1 font-medium hover:scale-105 transition-transform cursor-default`}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimateInView>
            
            <AnimateInView delay={200}>
              <Card className="h-full shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 p-6 relative z-10">
                  <CardTitle className="flex items-center gap-2 text-xl group-hover:text-primary transition-colors">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    Key Features
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    <CountUp end={14} suffix=" powerful features" /> to manage your finances
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 relative z-10">
                  <div className="space-y-1">
                    {[
                      { icon: <BarChart className="w-4 h-4" />, text: "Expense tracking and categorization", color: "text-blue-600" },
                      { icon: <DollarSign className="w-4 h-4" />, text: "Custom budget creation and visualization", color: "text-green-600" },
                      { icon: <BarChart4 className="w-4 h-4" />, text: "Financial analytics with multiple chart types", color: "text-purple-600" },
                      { icon: <Globe className="w-4 h-4" />, text: "Multi-currency support", color: "text-orange-600" },
                      { icon: <Cpu className="w-4 h-4" />, text: "AI-powered financial insights", color: "text-violet-600" },
                      { icon: <Sparkles className="w-4 h-4" />, text: "Dark & light theme support", color: "text-indigo-600" },
                      { icon: <Users className="w-4 h-4" />, text: "Responsive mobile design", color: "text-pink-600" },
                      { icon: <Award className="w-4 h-4" />, text: "Personalized spending recommendations", color: "text-emerald-600" },
                      { icon: <Trophy className="w-4 h-4" />, text: "Automated saving goals tracking", color: "text-amber-600" },
                      { icon: <Network className="w-4 h-4" />, text: "Predictive spending patterns", color: "text-cyan-600" },
                      { icon: <Calendar className="w-4 h-4" />, text: "Bill payment reminders", color: "text-red-600" },
                      { icon: <ArrowUpRight className="w-4 h-4" />, text: "Real-time sync across devices", color: "text-teal-600" },
                      { icon: <FileQuestion className="w-4 h-4" />, text: "Export financial reports", color: "text-slate-600" },
                      { icon: <Check className="w-4 h-4" />, text: "Secure data encryption", color: "text-lime-600" }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-all duration-200 group/item hover:scale-[1.02]"
                      >
                        <div className={`${feature.color} group-hover/item:scale-110 transition-transform`}>
                          {feature.icon}
                        </div>
                        <span className="text-sm group-hover/item:translate-x-1 transition-transform">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-3 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                      <Sparkles className="w-4 h-4" />
                      What's New
                    </div>
                    <p className="text-xs text-muted-foreground">Latest updates include AI-powered insights, enhanced security, and improved mobile experience.</p>
                  </div>
                </CardContent>
              </Card>
            </AnimateInView>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="scroll-mt-20 mb-16">
          <AnimateInView>
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-violet-400/10 border-b border-primary/10 p-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="w-5 h-5 text-primary" />
                  Feature Highlights
                </CardTitle>
                <CardDescription className="text-base">
                  Comprehensive tools to manage your finances
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Budget Management",
                      features: [
                        "Create custom budget categories",
                        "Set monthly or weekly spending limits",
                        "Track progress with visual indicators",
                        "Receive alerts when approaching limits",
                        "Adjust budgets based on AI recommendations"
                      ],
                      icon: <DollarSign className="w-6 h-6 text-emerald-500" />
                    },
                    {
                      title: "Expense Tracking",
                      features: [
                        "Automatic categorization of transactions",
                        "Receipt scanning and storage",
                        "Split expenses with friends and family",
                        "Tag and search transactions",
                        "Export transaction history"
                      ],
                      icon: <BarChart className="w-6 h-6 text-blue-500" />
                    },
                    {
                      title: "Financial Analytics",
                      features: [
                        "Interactive spending charts and graphs",
                        "Monthly and yearly comparison reports",
                        "Category breakdown analysis",
                        "Spending pattern detection",
                        "Customizable dashboard widgets"
                      ],
                      icon: <Cpu className="w-6 h-6 text-violet-500" />
                    },
                    {
                      title: "Security & Privacy",
                      features: [
                        "End-to-end encryption",
                        "Biometric authentication",
                        "Two-factor authentication",
                        "Privacy-focused data policies",
                        "Regular security audits"
                      ],
                      icon: <Check className="w-6 h-6 text-green-500" />
                    }
                  ].map((section, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {section.icon}
                        </div>
                        <h3 className="text-xl font-medium">{section.title}</h3>
                      </div>
                      
                      <ul className="space-y-2 pl-4">
                        {section.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Coming Soon
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "Investment tracking and portfolio analysis",
                        "Financial goal planning and milestone tracking",
                        "Bill payment reminders and automation",
                        "Tax preparation assistance",
                        "Custom financial reports and exports",
                        "Family account sharing with permissions"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimateInView>
        </section>
        
        {/* App Details / Versions Section */}
        <section id="app-details" className="scroll-mt-20 mb-16">
          <AnimateInView>
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-violet-400/10 border-b border-primary/10 p-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Version History
                </CardTitle>
                <CardDescription className="text-base">
                  Our journey from alpha to beta and beyond
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-md"></div>
                      <Logo size="lg" withText animated={false} className="relative z-10" />
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <p className="text-sm text-muted-foreground">Version {getAppVersion()}</p>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm">Beta</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-9 border-primary/30 hover:bg-primary/10 text-xs w-full sm:w-auto group transition-all"
                    asChild
                  >
                    <Link href="https://github.com/Xenonesis" target="_blank" rel="noopener noreferrer">
                      <Github className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-0.5 transition-transform">View on GitHub</span>
                    </Link>
                  </Button>
                </div>
                
                <div className="relative pt-2">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 to-primary/10 rounded-full"></div>
                  
                  {/* Version 0.70 - Latest Beta */}
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/30 z-10">
                      <span className="text-xs font-semibold text-white">0.70</span>
                    </div>
                    <div className="absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-gradient-to-b from-primary/70 via-primary/50 to-transparent"></div>
                    <div className="bg-card rounded-lg border border-primary/10 shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 px-4 py-2.5 border-b border-primary/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shadow-sm">v0.70</Badge>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Beta</Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Latest</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">Released on September 5, 2025</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Smart Notifications for budget alerts and bill reminders</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Redesigned dashboard UI with customizable widgets</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Performance improvements and bug fixes</span>
                          </li>
                        </ul>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Dark Mode Enhancements with better contrast and readability</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Mobile App Optimization for iOS and Android platforms</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Automated Backup System for data protection</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Version 0.60 - Beta */}
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-gradient-to-tr from-primary to-violet-500/90 flex items-center justify-center shadow-lg shadow-primary/25 z-10">
                      <span className="text-xs font-semibold text-white">0.60</span>
                    </div>
                    <div className="absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary/40 to-transparent"></div>
                    <div className="bg-card rounded-lg border border-primary/10 shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 px-4 py-2.5 border-b border-primary/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shadow-sm">v0.60</Badge>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Beta</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">Released on August 15, 2025</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>AI-powered transaction categorization</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Enhanced Data Export capabilities (PDF, Excel, CSV)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Improved Performance with 40% faster load times</span>
                          </li>
                        </ul>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Early access to new dashboard UI</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Enhanced security features for user data protection</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Integration with more financial tools and services</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Alpha Versions (Collapsed) */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-gradient-to-tr from-primary/80 to-violet-500/70 flex items-center justify-center shadow-md shadow-primary/15 z-10">
                      <span className="text-xs font-semibold text-white">0.50</span>
                    </div>
                    <div className="bg-card rounded-lg border border-primary/10 shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 px-4 py-2.5 border-b border-primary/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shadow-sm">Alpha Versions</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">v0.10 - v0.50</span>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {[
                            { version: "0.50", date: "July 9, 2025", features: ["Advanced Analytics", "Multi-Currency"] },
                            { version: "0.40", date: "June 20, 2025", features: ["Performance", "Recurring Transactions"] },
                            { version: "0.30", date: "May 30, 2025", features: ["Analytics Charts", "Custom Categories"] },
                            { version: "0.20", date: "May 10, 2025", features: ["Budget Creation", "Transaction Categories"] },
                            { version: "0.10", date: "April 20, 2025", features: ["Initial Release", "Basic Tracking"] }
                          ].map((version, i) => (
                            <div key={i} className="bg-muted/30 rounded-md p-2 text-xs flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 h-5">v{version.version}</Badge>
                              <span className="text-muted-foreground">{version.features.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                          View detailed alpha version history
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimateInView>
        </section>
        
        {/* Developer Section */}
        <section id="developer" className="scroll-mt-20 mb-16">
          <AnimateInView>
            <Card className="shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-violet-400/10 border-b border-primary/10 p-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UserCircle className="w-5 h-5 text-primary" />
                  </div>
                  Meet the Developer
                </CardTitle>
                <CardDescription className="text-base">
                  The talented mind behind NeoFi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-primary/10 via-violet-500/10 to-blue-500/10">
                    <FloatingParticles />
                  </div>
                  
                  <div className="relative z-10 p-6 pt-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="flex flex-col items-center">
                        <div className="relative group/avatar">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-background shadow-xl relative group-hover/avatar:scale-105 transition-transform duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/20 opacity-60 group-hover/avatar:opacity-40 transition-opacity"></div>
                            <Image
                              src="/1.png"
                              alt="Aditya Kumar Tiwari"
                              width={160}
                              height={160}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          {[
                            { icon: <Github className="w-4 h-4" />, href: "https://github.com/Xenonesis", color: "hover:bg-gray-100 hover:text-gray-900" },
                            { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/in/itisaddy/", color: "hover:bg-blue-100 hover:text-blue-700" },
                            { icon: <Instagram className="w-4 h-4" />, href: "https://www.instagram.com/i__aditya7/", color: "hover:bg-pink-100 hover:text-pink-700" },
                            { icon: <Globe className="w-4 h-4" />, href: "https://iaddy.netlify.app/", color: "hover:bg-green-100 hover:text-green-700" }
                          ].map((social, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="icon" 
                              className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${social.color}`}
                              asChild
                            >
                              <Link href={social.href} target="_blank" rel="noopener noreferrer">
                                {social.icon}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent mb-2">
                            Aditya Kumar Tiwari
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            Cybersecurity Specialist • Full-Stack Developer
                          </p>
                          <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Available for collaboration</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {[
                            { skill: "Digital Forensics", color: "bg-red-100 text-red-700 border-red-200" },
                            { skill: "Linux", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                            { skill: "Python", color: "bg-blue-100 text-blue-700 border-blue-200" },
                            { skill: "JavaScript", color: "bg-green-100 text-green-700 border-green-200" },
                            { skill: "ReactJS", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
                            { skill: "HTML/CSS", color: "bg-purple-100 text-purple-700 border-purple-200" }
                          ].map((item, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className={`${item.color} text-xs hover:scale-105 transition-transform cursor-default`}
                            >
                              {item.skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-sm leading-relaxed">
                            Aditya is a passionate Cybersecurity Specialist and Full-Stack Developer currently pursuing a BCA in Cybersecurity at 
                            Sushant University. He thrives on the intersection of technology and innovation, crafting secure and scalable solutions 
                            for real-world challenges.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-lg">
                            <div className="text-2xl font-bold text-primary"><CountUp end={3} suffix="+" /></div>
                            <div className="text-xs text-muted-foreground">Years Experience</div>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-lg">
                            <div className="text-2xl font-bold text-primary"><CountUp end={15} suffix="+" /></div>
                            <div className="text-xs text-muted-foreground">Projects Completed</div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            Featured Projects
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { name: "SEO Optimized Website", badge: "Website", color: "bg-amber-100 text-amber-800" },
                              { name: "PropDekho", badge: "Real Estate", color: "bg-emerald-100 text-emerald-800" },
                              { name: "Real Estate ChatBot", badge: "AI Assistant", color: "bg-violet-100 text-violet-800" }
                            ].map((project, i) => (
                              <div key={i} className="p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-all duration-200 hover:scale-105 group/project">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-medium group-hover/project:text-primary transition-colors">{project.name}</h5>
                                  <Badge className={`text-[10px] ${project.color}`}>{project.badge}</Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-xs rounded-full group-hover/project:bg-primary/10 transition-colors">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Project
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimateInView>
        </section>
        
        {/* Tech Stack Section */}
        <section id="stack" className="scroll-mt-20 mb-16">
          <AnimateInView>
            <Card className="shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-violet-400/10 border-b border-primary/10 p-6 relative z-10">
                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-primary transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  Tech Stack
                </CardTitle>
                <CardDescription className="text-base flex items-center gap-2">
                  <CountUp end={15} suffix=" cutting-edge technologies" /> powering NeoFi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 relative z-10">
                <div className="space-y-10">
                  {/* Frontend Technologies */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-3 text-primary">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Code className="w-5 h-5 text-blue-600" />
                        </div>
                        Frontend Technologies
                      </h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <CountUp end={6} /> tools
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { name: "Next.js", desc: "React framework for production", fallback: "⚡", bgColor: "bg-black/10" },
                        { name: "React", desc: "UI component library", fallback: "⚛️", bgColor: "bg-blue-500/10" },
                        { name: "TypeScript", desc: "Type-safe JavaScript", fallback: "📘", bgColor: "bg-blue-600/10" },
                        { name: "Tailwind CSS", desc: "Utility-first CSS framework", fallback: "🎨", bgColor: "bg-cyan-500/10" },
                        { name: "Shadcn UI", desc: "Modern UI component system", fallback: "🎯", bgColor: "bg-gray-700/10" },
                        { name: "Framer Motion", desc: "Animation library", fallback: "🎭", bgColor: "bg-pink-500/10" }
                      ].map((tech, i) => (
                        <AnimateInView key={i} delay={i * 100}>
                          <div className="group/tech relative">
                            <div className="flex flex-col items-center p-4 rounded-xl border border-muted hover:border-primary/30 transition-all duration-300 bg-card hover:bg-accent/5 hover:shadow-lg hover:scale-105 cursor-pointer">
                              <div className="w-16 h-16 mb-3 relative flex items-center justify-center">
                                <div className={`absolute inset-0 ${tech.bgColor} rounded-full group-hover/tech:bg-primary/20 transition-colors`}></div>
                                <div className="relative z-10 w-12 h-12 flex items-center justify-center text-3xl group-hover/tech:scale-110 transition-transform">
                                  {tech.fallback}
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background opacity-0 group-hover/tech:opacity-100 transition-opacity">
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5 animate-pulse"></div>
                                </div>
                              </div>
                              <h4 className="text-sm font-semibold text-center group-hover/tech:text-primary transition-colors mb-1">{tech.name}</h4>
                              <p className="text-xs text-center text-muted-foreground leading-tight">{tech.desc}</p>
                            </div>
                          </div>
                        </AnimateInView>
                      ))}
                    </div>
                  </div>
                  
                  {/* Backend Technologies */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-3 text-primary">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Database className="w-5 h-5 text-green-600" />
                        </div>
                        Backend & Infrastructure
                      </h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CountUp end={5} /> services
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { name: "Firebase", desc: "Google's app development platform", fallback: "🔥", bgColor: "bg-orange-500/10" },
                        { name: "Node.js", desc: "JavaScript runtime environment", fallback: "🟢", bgColor: "bg-green-500/10" },
                        { name: "PostgreSQL", desc: "Advanced relational database", fallback: "🐘", bgColor: "bg-blue-600/10" },
                        { name: "Vercel", desc: "Deployment and hosting platform", fallback: "▲", bgColor: "bg-black/10" },
                        { name: "Auth.js", desc: "Authentication for Next.js", fallback: "🔐", bgColor: "bg-purple-500/10" }
                      ].map((tech, i) => (
                        <AnimateInView key={i} delay={i * 100}>
                          <div className="group/tech relative">
                            <div className="flex flex-col items-center p-4 rounded-xl border border-muted hover:border-primary/30 transition-all duration-300 bg-card hover:bg-accent/5 hover:shadow-lg hover:scale-105 cursor-pointer">
                              <div className="w-16 h-16 mb-3 relative flex items-center justify-center">
                                <div className={`absolute inset-0 ${tech.bgColor} rounded-full group-hover/tech:bg-primary/20 transition-colors`}></div>
                                <div className="relative z-10 w-12 h-12 flex items-center justify-center text-3xl group-hover/tech:scale-110 transition-transform">
                                  {tech.fallback}
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background opacity-0 group-hover/tech:opacity-100 transition-opacity">
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5 animate-pulse"></div>
                                </div>
                              </div>
                              <h4 className="text-sm font-semibold text-center group-hover/tech:text-primary transition-colors mb-1">{tech.name}</h4>
                              <p className="text-xs text-center text-muted-foreground leading-tight">{tech.desc}</p>
                            </div>
                          </div>
                        </AnimateInView>
                      ))}
                    </div>
                  </div>
                  
                  {/* Development Tools */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-3 text-primary">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <ArrowUpRight className="w-5 h-5 text-purple-600" />
                        </div>
                        Development & Tools
                      </h3>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <CountUp end={4} /> tools
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { name: "GitHub", desc: "Version control & collaboration", fallback: "🐙", bgColor: "bg-gray-700/10" },
                        { name: "VS Code", desc: "Code editor & development", fallback: "💻", bgColor: "bg-blue-500/10" },
                        { name: "Figma", desc: "Design & prototyping tool", fallback: "🎨", bgColor: "bg-purple-500/10" },
                        { name: "Postman", desc: "API development & testing", fallback: "📮", bgColor: "bg-orange-500/10" }
                      ].map((tech, i) => (
                        <AnimateInView key={i} delay={i * 100}>
                          <div className="group/tech relative">
                            <div className="flex flex-col items-center p-4 rounded-xl border border-muted hover:border-primary/30 transition-all duration-300 bg-card hover:bg-accent/5 hover:shadow-lg hover:scale-105 cursor-pointer">
                              <div className="w-16 h-16 mb-3 relative flex items-center justify-center">
                                <div className={`absolute inset-0 ${tech.bgColor} rounded-full group-hover/tech:bg-primary/20 transition-colors`}></div>
                                <div className="relative z-10 w-12 h-12 flex items-center justify-center text-3xl group-hover/tech:scale-110 transition-transform">
                                  {tech.fallback}
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-background opacity-0 group-hover/tech:opacity-100 transition-opacity">
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5 animate-pulse"></div>
                                </div>
                              </div>
                              <h4 className="text-sm font-semibold text-center group-hover/tech:text-primary transition-colors mb-1">{tech.name}</h4>
                              <p className="text-xs text-center text-muted-foreground leading-tight">{tech.desc}</p>
                            </div>
                          </div>
                        </AnimateInView>
                      ))}
                    </div>
                  </div>
                  
                  {/* Architecture Overview */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 via-violet-500/5 to-blue-500/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Network className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-primary">Architecture Highlights</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          title: "Modern Stack",
                          desc: "Built with Next.js 14, React 18, and TypeScript for type safety and performance",
                          icon: "⚡"
                        },
                        {
                          title: "Scalable Backend",
                          desc: "Firebase for real-time data, authentication, and cloud functions",
                          icon: "🚀"
                        },
                        {
                          title: "Responsive Design",
                          desc: "Mobile-first approach with Tailwind CSS and Shadcn UI components",
                          icon: "📱"
                        }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* GitHub Link */}
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full gap-3 border-primary/20 hover:bg-primary/5 text-sm group/btn"
                      asChild
                    >
                      <Link href="https://github.com/Xenonesis" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        <span className="group-hover/btn:translate-x-1 transition-transform">Explore Source Code</span>
                        <ExternalLink className="w-4 h-4 ml-1 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimateInView>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-20 mb-16">
          <AnimateInView>
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-violet-400/10 border-b border-primary/10 p-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileQuestion className="w-5 h-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-base">
                  Get answers to common questions about NeoFi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      question: "Is NeoFi free to use?",
                      answer: "Yes, NeoFi's core features are completely free to use. We do offer a premium tier with advanced features like AI-powered insights, unlimited budget categories, and priority support."
                    },
                    {
                      question: "How secure is my financial data?",
                      answer: "NeoFi uses end-to-end encryption and follows industry-standard security protocols. Your data is stored securely and is never shared with third parties without your explicit permission."
                    },
                    {
                      question: "Can I import transactions from my bank?",
                      answer: "Yes, NeoFi supports CSV imports from most major banks. We're also working on direct bank integrations for seamless transaction syncing, which will be available in our next major update."
                    },
                    {
                      question: "Is NeoFi available on mobile devices?",
                      answer: "NeoFi is fully responsive and works on all devices. We also have dedicated iOS and Android apps available for download, providing a native mobile experience with features like fingerprint authentication."
                    },
                    {
                      question: "How do I create custom budget categories?",
                      answer: "Navigate to Settings > Categories to create, edit, or delete custom budget categories. You can also set category icons and colors to personalize your experience and make your budget visually intuitive."
                    }
                  ].map((faq, index) => (
                    <div 
                      key={index} 
                      className="rounded-lg border border-muted hover:border-primary/20 transition-all duration-300 hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                      >
                        <h3 className="font-medium text-sm flex items-center">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary mr-2 text-xs">
                            {index + 1}
                          </span>
                          {faq.question}
                        </h3>
                        <ChevronDown 
                          className={`h-4 w-4 text-primary transition-transform ${expandedFaqs.includes(index) ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {expandedFaqs.includes(index) && (
                        <div className="px-4 pb-4 pt-0">
                          <Separator className="mb-3" />
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center p-4 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-lg border border-border">
                  <h3 className="text-sm font-medium mb-2">Still have questions?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you can't find the answer to your question, feel free to reach out to our support team.
                  </p>
                  <Button variant="default" size="sm" className="rounded-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimateInView>
        </section>
        
        {/* Back to Dashboard */}
        <div className="text-center mb-8">
          <Button variant="ghost" size="sm" className="rounded-full gap-2" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}