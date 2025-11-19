import { Card, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent';
}

export function KPICard({ title, value, change, changeType = 'neutral', icon: Icon, color = 'primary' }: KPICardProps) {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-[#0D1B2A] to-[#1B2B3A] text-white',
    secondary: 'bg-gradient-to-br from-[#3E92CC] to-[#5BA3D4] text-white',
    accent: 'bg-gradient-to-br from-[#E0E1DD] to-[#F5F5F5] text-[#0D1B2A]'
  };

  const changeColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-0">
      <CardContent className={`p-6 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs ${changeColors[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}