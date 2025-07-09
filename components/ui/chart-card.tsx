import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  height?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export const ChartCard = React.memo<ChartCardProps>(({ 
  title, 
  description, 
  icon, 
  children, 
  className = "",
  height = "h-64",
  emptyMessage = "No data available",
  isEmpty = false
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className={cn("flex flex-col items-center justify-center text-center p-4", height)}>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className={height}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ChartCard.displayName = 'ChartCard';