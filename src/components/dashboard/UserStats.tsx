import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface UserStatsProps {
  stats: {
    totalSpent: number;
    activeSubscriptions: number;
    savedThisYear: number;
    loyaltyPoints: number;
  };
}

export default function UserStats({ stats }: UserStatsProps) {
  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const statsData = [
    {
      label: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      icon: "💰",
      color: "text-coral-600 dark:text-coral-400"
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions.toString(),
      icon: "📱",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      label: "Saved This Year",
      value: formatCurrency(stats.savedThisYear),
      icon: "💎",
      color: "text-green-600 dark:text-green-400"
    },
    {
      label: "Loyalty Points",
      value: stats.loyaltyPoints.toLocaleString(),
      icon: "⭐",
      color: "text-yellow-600 dark:text-yellow-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-cream-100 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-600 dark:text-cream-400">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className="text-3xl">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}