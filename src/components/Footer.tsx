import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ActiveTab } from '../types/job';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-white border-t border-slate-300 hc-card mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3">
          <a
            href="https://www.cascsniorclub.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-senior btn-senior-primary inline-flex"
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span>천안시시니어클럽 홈페이지 바로가기</span>
          </a>
          <p className="font-num text-[14pt] text-slate-700 hc-muted">
            상담 안내: 041-415-2000 / 041-415-2090 · 평일 09:00 ~ 18:00
          </p>
        </div>

        <nav
          aria-label="하단 바로가기 메뉴"
          className="flex flex-wrap items-center gap-5"
        >
          {(
            [
              { id: 'jobs', label: '일자리 찾기' },
              { id: 'saved', label: '관심 일자리' },
              { id: 'resume', label: '간편 이력서' },
              { id: 'support', label: '취업 안내·상담' },
              { id: 'applications', label: '지원 내역' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[15pt] font-bold text-slate-800 hover:text-[#0b3b8c] hover:underline py-2 px-1 whitespace-nowrap cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
};
