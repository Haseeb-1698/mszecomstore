import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Settings, LogOut, Menu, X, Package, BarChart3, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import SubscriptionCard from './SubscriptionCard.tsx';
import UserStats from './UserStats.tsx';
import OrderHistory from './OrderHistory.tsx';

// Mock data for user dashboard
const mockUserData = {
  name: "Ahmed Hassan",
  email: "ahmed.hassan@email.com",
  joinDate: "January 2024",
  stats: {
    totalSpent: 25000,
    activeSubscriptions: 3,
    savedThisYear: 15000,
    loyaltyPoints: 1250
  },
  subscriptions: [
    {
      id: "1",
      serviceName: "Netflix Premium",
      serviceLogo: "/icons/netflix.svg",
      expiryDate: new Date("2024-02-15"),
      daysRemaining: 12,
      planDuration: "3 months",
      autoRenew: true,
      price: 3200
    },
    {
      id: "2",
      serviceName: "Spotify Premium",
      serviceLogo: "/icons/spotify.svg",
      expiryDate: new Date("2024-03-20"),
      daysRemaining: 45,
      planDuration: "12 months",
      autoRenew: false,
      price: 7500
    },
    {
      id: "3",
      serviceName: "Adobe Creative Cloud",
      serviceLogo: "/icons/adobe-creative-cloud.svg",
      expiryDate: new Date("2024-01-25"),
      daysRemaining: 3,
      planDuration: "1 month",
      autoRenew: true,
      price: 2500
    }
  ],
  recentOrders: [
    {
      id: "ORD-2024-001",
      serviceName: "Netflix Premium",
      date: new Date("2024-01-15"),
      amount: 3200,
      status: "delivered" as const,
      paymentMethod: "EasyPaisa"
    },
    {
      id: "ORD-2024-002",
      serviceName: "Spotify Premium",
      date: new Date("2024-01-10"),
      amount: 7500,
      status: "delivered" as const,
      paymentMethod: "JazzCash"
    },
    {
      id: "ORD-2024-003",
      serviceName: "Adobe Creative Cloud",
      date: new Date("2024-01-08"),
      amount: 2500,
      status: "pending" as const,
      paymentMethod: "Bank Transfer"
    },
    {
      id: "ORD-2024-004",
      serviceName: "Canva Pro",
      date: new Date("2024-01-05"),
      amount: 1800,
      status: "delivered" as const,
      paymentMethod: "EasyPaisa"
    },
    {
      id: "ORD-2024-005",
      serviceName: "Disney+",
      date: new Date("2024-01-02"),
      amount: 4500,
      status: "failed" as const,
      paymentMethod: "JazzCash"
    }
  ]
};

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "subscriptions", label: "My Subscriptions", icon: Package },
  { id: "orders", label: "Order History", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell }
];

export default function DashboardWrapper() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleRenewSubscription = (subscriptionId: string) => {
    console.log(`Renewing subscription: ${subscriptionId}`);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900">
      <div className="flex">
        {/* Left Sidebar Navigation */}
        <div className="w-80 bg-white dark:bg-charcoal-800 min-h-screen">
          <div className="p-6">
            {/* Navigation Items - No title, just navigation */}
            <nav className="space-y-2 mt-8">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id 
                        ? "bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400" 
                        : "text-charcoal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-charcoal-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-8">
            {/* Welcome Section */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Dashboard Title - Only on overview page */}
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-charcoal-900 dark:text-white mb-4">
                    Dashboard
                  </h1>
                  <p className="text-charcoal-600 dark:text-cream-400">
                    Manage your subscriptions and account settings.
                  </p>
                </div>

                {/* Quick Stats */}
                <UserStats stats={mockUserData.stats} />

                {/* Recent Activity */}
                <Card className="bg-white dark:bg-charcoal-800 border-cream-300 dark:border-charcoal-700">
                  <CardHeader>
                    <CardTitle className="text-charcoal-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUserData.recentOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-cream-50 dark:bg-charcoal-700 rounded-lg">
                          <div>
                            <p className="font-medium text-charcoal-900 dark:text-white">
                              {order.serviceName}
                            </p>
                            <p className="text-sm text-charcoal-600 dark:text-cream-400">
                              {order.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-charcoal-900 dark:text-white">
                              PKR {order.amount.toLocaleString()}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "subscriptions" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">
                  My Subscriptions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockUserData.subscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onRenew={handleRenewSubscription}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6">
                  Order History
                </h2>
                <OrderHistory orders={mockUserData.recentOrders} />
              </div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">
                  Account Settings
                </h2>
                <Card className="bg-white dark:bg-charcoal-800 border-cream-300 dark:border-charcoal-700">
                  <CardHeader>
                    <CardTitle className="text-charcoal-900 dark:text-white">
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-charcoal-600 dark:text-cream-400">
                        Full Name
                      </label>
                      <div className="mt-1 p-3 bg-cream-50 dark:bg-charcoal-700 rounded-lg text-charcoal-900 dark:text-white">
                        {mockUserData.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal-600 dark:text-cream-400">
                        Email Address
                      </label>
                      <div className="mt-1 p-3 bg-cream-50 dark:bg-charcoal-700 rounded-lg text-charcoal-900 dark:text-white">
                        {mockUserData.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal-600 dark:text-cream-400">
                        Member Since
                      </label>
                      <div className="mt-1 p-3 bg-cream-50 dark:bg-charcoal-700 rounded-lg text-charcoal-900 dark:text-white">
                        {mockUserData.joinDate}
                      </div>
                    </div>
                    <Button className="bg-coral-500 hover:bg-coral-600 text-white">
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">
                  Notifications
                </h2>
                <Card className="bg-white dark:bg-charcoal-800 border-cream-300 dark:border-charcoal-700">
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-charcoal-400 dark:text-cream-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-2">
                      No notifications yet
                    </h3>
                    <p className="text-charcoal-600 dark:text-cream-400">
                      You'll see important updates about your subscriptions here.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}