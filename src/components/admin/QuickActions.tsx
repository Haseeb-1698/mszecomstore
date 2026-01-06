import React from 'react';

interface QuickAction {
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
  color: 'coral' | 'purple' | 'green' | 'blue';
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      title: 'Add New Service',
      description: 'Create a new subscription service',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      href: '/admin/services/new',
      color: 'coral'
    },
    {
      title: 'View Orders',
      description: 'Manage all customer orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      href: '/admin/orders',
      color: 'purple'
    },
    {
      title: 'Customer Support',
      description: 'View and respond to tickets',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      href: '/admin/support',
      color: 'green'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/admin/analytics',
      color: 'blue'
    }
  ];

  const getColorClasses = (color: QuickAction['color']) => {
    const colors = {
      coral: {
        bg: 'bg-coral-100 dark:bg-coral-900/30',
        text: 'text-coral-600 dark:text-coral-400',
        hover: 'hover:bg-coral-200 dark:hover:bg-coral-900/50'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:bg-purple-200 dark:hover:bg-purple-900/50'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        hover: 'hover:bg-green-200 dark:hover:bg-green-900/50'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/50'
      }
    };
    return colors[color];
  };

  return (
    <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700">
      <h2 className="text-xl font-bold text-charcoal-800 dark:text-cream-100 mb-6">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => {
          const colors = getColorClasses(action.color);
          return (
            <a
              key={action.title}
              href={action.href}
              className={`block p-4 rounded-xl ${colors.bg} ${colors.hover} transition-colors group`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.text}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${colors.text} mb-1 group-hover:underline`}>
                    {action.title}
                  </h3>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">
                    {action.description}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
