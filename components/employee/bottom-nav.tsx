'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Today',
      href: '/dashboard/employee',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: 'History',
      href: '/dashboard/employee/history',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: '/dashboard/employee/profile',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
