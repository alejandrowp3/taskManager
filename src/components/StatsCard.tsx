
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  subtitle?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    text: 'text-blue-900',
    subtitle: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-900',
    subtitle: 'text-green-700',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    text: 'text-orange-900',
    subtitle: 'text-orange-700',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-900',
    subtitle: 'text-red-700',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    text: 'text-purple-900',
    subtitle: 'text-purple-700',
  },
};

export function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <div className={`${colors.bg} p-6 rounded-lg border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
          {subtitle && (
            <p className={`text-sm ${colors.subtitle} mt-1`}>{subtitle}</p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${colors.icon}`} />
      </div>
    </div>
  );
}