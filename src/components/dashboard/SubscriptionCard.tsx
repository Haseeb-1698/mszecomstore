import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

interface Subscription {
  id: string;
  serviceName: string;
  serviceLogo: string;
  expiryDate: Date;
  daysRemaining: number;
  planDuration: string;
  autoRenew: boolean;
  price: number;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onRenew: (subscriptionId: string) => void;
}

export default function SubscriptionCard({ subscription, onRenew }: SubscriptionCardProps) {
  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 7) return "text-red-600 dark:text-red-400";
    if (daysRemaining <= 30) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getStatusBadge = (daysRemaining: number) => {
    if (daysRemaining <= 7) return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    if (daysRemaining <= 30) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
    return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  };

  return (
    <Card className="bg-cream-100 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img 
            src={subscription.serviceLogo} 
            alt={subscription.serviceName}
            className="w-10 h-10 rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-charcoal-900 dark:text-white">
              {subscription.serviceName}
            </h3>
            <p className="text-sm text-charcoal-600 dark:text-cream-400">
              {subscription.planDuration}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal-600 dark:text-cream-400">Price</span>
          <span className="font-semibold text-charcoal-900 dark:text-white">
            PKR {subscription.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal-600 dark:text-cream-400">Expires</span>
          <span className={`text-sm font-medium ${getStatusColor(subscription.daysRemaining)}`}>
            {subscription.daysRemaining} days
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal-600 dark:text-cream-400">Auto Renew</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            subscription.autoRenew 
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400"
          }`}>
            {subscription.autoRenew ? "On" : "Off"}
          </span>
        </div>

        <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${getStatusBadge(subscription.daysRemaining)}`}>
          {subscription.daysRemaining <= 7 ? "Expires Soon!" : 
           subscription.daysRemaining <= 30 ? "Renewal Due" : "Active"}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-charcoal-700 dark:text-cream-300 border-cream-400 dark:border-charcoal-600 hover:bg-cream-200 dark:hover:bg-charcoal-700"
            onClick={() => onRenew(subscription.id)}
          >
            Renew
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-charcoal-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700"
          >
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}