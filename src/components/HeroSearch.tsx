import React, { useState } from 'react';
import {
  Search,
  Type,
  Eye,
  FileEdit,
  Briefcase,
  Check,
  Megaphone,
} from 'lucide-react';
import { FontSizeLevel } from '../types/job';

interface HeroSearchProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSubmitSearch: () => void;
  fontSize: FontSizeLevel;
  onFontSizeChange: (level: FontSizeLevel) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  hasResume: boolean;
  onOpenResume: () => void;
  onOpenNotice: () => void;
  totalJobsCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  keyword,
  onKeywordChange,
  onSubmitSearch,
  fontSize,
  onFontSizeChange,
  highContrast,
  onToggleHighContrast,
  hasResume,
  onOpenResume,
  onOpenNotice,
  totalJobsCount,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSearch();
  };

  return (
    <section className="bg-white border-b border-slate-300 hc-card">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 2-Column balanced hero split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left column: Clear headline + single-step keyword search */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-[2rem] sm:text-[2.65rem] lg:text-[2.9rem] font-bold leading-[1.22] tracking-tight text-slate-950 text-balance mb-4">
              경험이 빛나는 든든한 새 일터를 찾아보세요
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 hc-muted leading-relaxed mb-7 max-w-2xl">
              작은 글씨와 복잡한 절차 없이, 큰 글자와 직관적인 아이콘으로 나에게
              맞는 일자리를 바로 찾아보실 수 있습니다.
            </p>

            {/* Accessible large single-step search form (no region selector) */}
            <form
              onSubmit={handleFormSubmit}
              className="bg-slate-100 border border-slate-300 hc-card rounded-2xl p-4 sm:p-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Keyword input */}
                <div className="sm:col-span-8">
                  <label
                    htmlFor="job-keyword-input"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    찾으시는 일자리
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="job-keyword-input"
                      type="text"
                      value={keyword}
                      onChange={(e) => onKeywordChange(e.target.value)}
                      placeholder="예: 학교가꿈이, 실버카페, 돌봄이, 안전지킴이"
                      className="w-full min-h-[56px] pl-11 pr-4 py-3 bg-white border-2 border-slate-400 rounded-xl text-lg text-slate-950 placeholder:text-slate-500 font-medium"
                    />
                  </div>
                </div>

                {/* Large search CTA button */}
                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="submit"
                    className="btn-senior btn-senior-primary w-full"
                  >
                    <Search className="w-5 h-5 shrink-0" />
                    <span>검색하기</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right column: Warm dignified editorial image */}
          <div className="lg:col-span-5">
            <div className="h-64 sm:h-80 lg:h-full rounded-2xl overflow-hidden border border-slate-300 hc-card bg-slate-100">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_senior_workplace_1795755291752.jpg"
                  alt="밝은 공간에서 환하게 웃으며 함께 활동하고 있는 어르신들의 모습"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-blue-50">
                  <Briefcase className="w-14 h-14 text-[#0b3b8c] mb-3" />
                  <p className="text-xl font-bold text-slate-900">
                    맞춤 일자리 사업단 {totalJobsCount}건
                  </p>
                  <p className="text-base text-slate-700 mt-1">
                    공익활동부터 공동체사업단까지 한눈에 확인하세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dedicated Accessibility & Quick Setup Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {/* Text Size Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-base font-bold text-slate-800 mr-1">
                <Type className="w-5 h-5 text-[#0b3b8c]" />
                <span>글자 크기</span>
              </span>
              <div
                role="group"
                aria-label="글자 크기 조절"
                className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-300 rounded-xl"
              >
                {(
                  [
                    { id: 'normal', label: '보통' },
                    { id: 'large', label: '크게' },
                    { id: 'xlarge', label: '아주 크게' },
                  ] as const
                ).map((option) => {
                  const active = fontSize === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onFontSizeChange(option.id)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 min-h-[44px] rounded-lg text-base font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#0b3b8c] text-white'
                          : 'text-slate-800 hover:bg-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-xl border-2 text-base font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                highContrast
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-white text-slate-900 border-slate-400 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-5 h-5 shrink-0" />
              <span>고대비 화면</span>
              {highContrast && <Check className="w-5 h-5 shrink-0" />}
            </button>
          </div>

          {/* Quick Actions: Recruitment Popup & Resume */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenNotice}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[48px] rounded-xl border-2 border-[#0b3b8c] bg-[#0b3b8c] hover:bg-[#082b68] text-white text-base font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Megaphone className="w-5 h-5 shrink-0" />
              <span>2027년 모집 공고 보기</span>
            </button>

            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[48px] rounded-xl border-2 border-[#0b3b8c] bg-blue-50 hover:bg-blue-100 text-[#0b3b8c] text-base font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <FileEdit className="w-5 h-5 shrink-0" />
              <span>
                {hasResume ? '내 간편 이력서 수정하기' : '3분 간편 이력서 작성하기'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
