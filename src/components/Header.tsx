import React, { useState } from 'react';
import {
  Search,
  Heart,
  FileText,
  PhoneCall,
  ClipboardCheck,
  Menu,
  X,
} from 'lucide-react';
import { ActiveTab } from '../types/job';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedCount: number;
  applicationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  applicationCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'jobs', label: '일자리 찾기', icon: Search },
    { id: 'saved', label: '관심 일자리', icon: Heart, count: savedCount },
    { id: 'resume', label: '간편 이력서', icon: FileText },
    { id: 'support', label: '취업 안내', icon: PhoneCall },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-300 hc-card">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single clean wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('jobs')}
          className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer hover:text-blue-900 transition-colors"
        >
          내일터
        </button>

        {/* Zone 2: 4 single-line intuitive icon + text nav links */}
        <nav
          aria-label="주요 메뉴"
          className="hidden md:flex items-center gap-6 lg:gap-8"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-2 py-2 border-b-[3px] text-[1.05rem] font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isActive
                    ? 'border-blue-800 text-blue-900'
                    : 'border-transparent text-slate-700 hover:text-slate-950 hover:border-slate-400'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive
                      ? 'text-blue-800'
                      : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                />
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="font-num text-sm font-bold text-blue-900">
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + Mobile drawer toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('applications')}
            aria-current={activeTab === 'applications' ? 'page' : undefined}
            className={`hidden sm:inline-flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-lg text-[1rem] font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeTab === 'applications'
                ? 'bg-slate-900 text-white'
                : 'bg-blue-900 text-white hover:bg-blue-800'
            }`}
          >
            <ClipboardCheck className="w-5 h-5 shrink-0" />
            <span>
              지원 내역{applicationCount > 0 ? ` (${applicationCount})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '전체 메뉴 열기'}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-lg border border-slate-400 bg-white text-slate-900 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
            <span>{mobileMenuOpen ? '닫기' : '메뉴'}</span>
          </button>
        </div>
      </div>

      {/* Mobile full-width large icon menu drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="모바일 전체 메뉴"
          className="md:hidden border-t border-slate-300 bg-white px-4 py-4 grid grid-cols-2 gap-3"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 min-h-[84px] rounded-xl border text-base font-bold cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-900 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-7 h-7" />
                <span className="whitespace-nowrap">
                  {item.label}
                  {typeof item.count === 'number' && item.count > 0
                    ? ` (${item.count})`
                    : ''}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNavClick('applications')}
            className={`col-span-2 flex items-center justify-center gap-2.5 p-4 min-h-[56px] rounded-xl border text-lg font-bold cursor-pointer transition-colors ${
              activeTab === 'applications'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-blue-50 text-blue-950 border-blue-300 hover:bg-blue-100'
            }`}
          >
            <ClipboardCheck className="w-6 h-6" />
            <span>
              내 지원 내역 보기
              {applicationCount > 0 ? ` (${applicationCount}건)` : ''}
            </span>
          </button>
        </nav>
      )}
    </header>
  );
};
