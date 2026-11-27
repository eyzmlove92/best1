import React from 'react';
import {
  LayoutGrid,
  HeartHandshake,
  ShieldCheck,
  Store,
  Briefcase,
  CheckSquare,
  Square,
  UserCheck,
  Award,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { CATEGORY_CONDITION_SUMMARY } from '../data/jobs';
import { JobCategory, WorkFilterKey } from '../types/job';

interface IconCategoryMenuProps {
  selectedCategory: JobCategory;
  onSelectCategory: (category: JobCategory) => void;
  categoryCounts: Record<JobCategory, number>;
  activeFilters: Record<WorkFilterKey, boolean>;
  onToggleFilter: (key: WorkFilterKey) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORY_ITEMS: {
  id: JobCategory;
  label: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'all',
    label: '전체 일자리',
    subtitle: '모든 사업단 보기',
    icon: LayoutGrid,
  },
  {
    id: 'public_interest',
    label: '노인공익활동사업',
    subtitle: '만 65세+ 연금수급',
    icon: HeartHandshake,
  },
  {
    id: 'capability',
    label: '노인역량활용사업',
    subtitle: '65세+ (일부 60세+)',
    icon: ShieldCheck,
  },
  {
    id: 'community',
    label: '공동체사업단',
    subtitle: '만 60세+ (사업단별 상이)',
    icon: Store,
  },
  {
    id: 'placement',
    label: '취업알선형',
    subtitle: '만 60세+ 구직 연계',
    icon: Briefcase,
  },
];

const WORK_FILTERS: {
  key: WorkFilterKey;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { key: 'age60Plus', label: '만 60세 이상 가능 사업단', icon: UserCheck },
  { key: 'basicPension', label: '기초·직역연금 수급 대상', icon: Award },
  { key: 'shortHours', label: '일 3~5시간 단시간', icon: Clock },
  { key: 'beginnerOk', label: '자격증 없이 신청 가능', icon: Sparkles },
];

export const IconCategoryMenu: React.FC<IconCategoryMenuProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  activeFilters,
  onToggleFilter,
  onResetFilters,
  hasActiveFilters,
}) => {
  const conditionInfo = CATEGORY_CONDITION_SUMMARY[selectedCategory];

  return (
    <section
      aria-label="사업 유형별 아이콘 메뉴 및 참여 조건 선택"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-950">
            원하시는 사업 유형을 눌러보세요
          </h2>
          <p className="text-base sm:text-lg text-slate-700 hc-muted mt-1">
            사업 유형과 세부 사업단마다 참여 조건·연령·필요서류가 다릅니다.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2.5 min-h-[48px] rounded-xl border-2 border-slate-400 bg-white hover:bg-slate-100 text-base font-bold text-slate-900 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            선택 조건 모두 지우기
          </button>
        )}
      </div>

      {/* 5-Button Large Intuitive Icon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {CATEGORY_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = selectedCategory === item.id;
          const count = categoryCounts[item.id] ?? 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center justify-center gap-2 p-5 min-h-[144px] rounded-2xl border-2 hc-card cursor-pointer transition-colors text-center ${
                isActive
                  ? 'bg-[#0b3b8c] border-[#0b3b8c] text-white'
                  : 'bg-white border-slate-300 text-slate-900 hover:border-[#0b3b8c] hover:bg-blue-50/60'
              }`}
            >
              <Icon
                className={`w-10 h-10 shrink-0 ${
                  isActive ? 'text-white' : 'text-[#0b3b8c]'
                }`}
              />
              <span className="text-[16pt] font-bold whitespace-nowrap">
                {item.label}
              </span>
              <span
                className={`text-[13pt] font-medium whitespace-nowrap ${
                  isActive ? 'text-blue-100' : 'text-slate-600 hc-muted'
                }`}
              >
                {item.subtitle}
              </span>
              <span
                className={`font-num text-[14pt] font-bold ${
                  isActive ? 'text-white' : 'text-[#0b3b8c]'
                }`}
              >
                {count}건
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Per-Category Participation Conditions Box */}
      <div className="mt-5 bg-white border-2 border-slate-300 hc-card rounded-2xl p-5 space-y-2">
        <p className="inline-flex items-center gap-2 text-[15pt] font-bold text-[#0b3b8c]">
          <Info className="w-5 h-5 shrink-0" />
          <span>{conditionInfo.title}</span>
        </p>
        <p className="text-[15pt] font-semibold text-slate-950 leading-relaxed">
          {conditionInfo.summary}
        </p>
        <p className="text-[14pt] text-slate-700 hc-muted leading-relaxed">
          {conditionInfo.note}
        </p>
      </div>

      {/* Participation Condition Checkbox Filters */}
      <div className="mt-5 pt-5 border-t border-slate-200 flex flex-wrap items-center gap-3">
        <span className="text-base font-bold text-slate-800 mr-1 whitespace-nowrap">
          조건별 골라보기:
        </span>
        {WORK_FILTERS.map((filter) => {
          const checked = activeFilters[filter.key];
          const Icon = filter.icon;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onToggleFilter(filter.key)}
              aria-pressed={checked}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[50px] rounded-xl border-2 text-base font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                checked
                  ? 'bg-[#005f73] border-[#005f73] text-white'
                  : 'bg-white border-slate-300 text-slate-900 hover:border-slate-500 hover:bg-slate-50'
              }`}
            >
              {checked ? (
                <CheckSquare className="w-5 h-5 shrink-0" />
              ) : (
                <Square className="w-5 h-5 shrink-0 text-slate-500" />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
