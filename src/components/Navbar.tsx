import { useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import type { AuthUser } from '../types/authTypes';

export type ActiveTab =
  | 'home'
  | 'streams'
  | 'finder'
  | 'resources'
  | 'guide_report'
  | 'account';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: AuthUser | null;
}

const NAV_ITEMS: Array<{ id: ActiveTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'streams', label: 'Explore Streams' },
  { id: 'finder', label: 'Career Finder' },
  { id: 'resources', label: 'Study Hub' },
  { id: 'guide_report', label: 'Project Report' },
];

export function Navbar({ activeTab, onSelectTab, currentUser }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const firstName = currentUser?.fullName?.split(' ')[0] || 'Account';

  return (
    <header className="frosted-header sticky top-0 z-40">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-md"
        >
          Smart Career Advisor
        </button>

        {/* Zone 2: 5 Clean Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`py-6 text-[15px] transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-teal-700 text-teal-950 font-bold'
                    : 'border-transparent text-slate-600 font-medium hover:text-slate-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Account Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('account')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm sm:text-[15px] font-semibold transition-all whitespace-nowrap shrink-0 shadow-xs ${
              activeTab === 'account'
                ? 'bg-slate-900 text-white'
                : currentUser
                  ? 'border border-teal-800/20 bg-teal-50/80 text-teal-950 hover:bg-teal-100/80'
                  : 'bg-teal-700 text-white hover:bg-teal-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span>{currentUser ? `My Account · ${firstName}` : 'Sign In / Sign Up'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="inline-flex lg:hidden items-center justify-center rounded-xl border border-teal-900/15 bg-white/80 p-2.5 text-slate-800 hover:bg-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-teal-900/10 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`block w-full rounded-xl px-4 py-3 text-left text-base font-medium ${
                  active
                    ? 'bg-teal-50 text-teal-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
