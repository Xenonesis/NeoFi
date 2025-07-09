import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
  subtitle?: string;
  onClick?: () => void;
  href?: string;
}

export const StatCard = React.memo<StatCardProps>(({ 
  title, 
  value, 
  icon, 
  className = "", 
  valueClassName = "",
  subtitle,
  onClick,
  href
}) => {
  const CardWrapper = href ? "a" : "div";
  
  return (
    <CardWrapper 
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-xl border bg-card p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300",
        (onClick || href) && "cursor-pointer",
        className
      )}
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3 md:mb-4">
            {icon}
            {title}
          </div>
          <div className={cn("text-2xl md:text-3xl font-bold", valueClassName)}>
            {value}
          </div>
          {subtitle && (
            <div className="mt-2 flex items-center text-xs sm:text-sm text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
});

StatCard.displayName = 'StatCard';