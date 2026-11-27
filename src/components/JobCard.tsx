import React from 'react';
import {
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
} from 'lucide-react';
import { JobPosting } from '../types/job';

interface JobCardProps {
  job: JobPosting;
  isSaved: boolean;
  isApplied: boolean;
  onToggleSave: (jobId: string) => void;
  onOpenDetail: (job: JobPosting) => void;
  onQuickApply: (job: JobPosting) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  isApplied,
  onToggleSave,
  onOpenDetail,
  onQuickApply,
}) => {
  return (
    <article className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6">
      <div>
        {/* Clean unboxed 1-line metadata kicker + explicit icon+text status */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <p className="text-[15pt] font-semibold text-slate-700 hc-muted">
            <span>{job.categoryLabel}</span>
            <span aria-hidden="true" className="mx-2 text-slate-400">
              ·
            </span>
            <span>{job.deadline}</span>
          </p>

          {job.isUrgent ? (
            <span className="inline-flex items-center gap-1.5 text-[14pt] font-bold text-[#9a3412]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>마감 임박</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[14pt] font-bold text-[#005f73]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>모집 중</span>
            </span>
          )}
        </div>

        {/* Direct large job title & company */}
        <h3 className="text-[20pt] sm:text-[22pt] font-bold leading-[1.35] text-slate-950 mb-1.5">
          <button
            type="button"
            onClick={() => onOpenDetail(job)}
            className="text-left hover:text-[#0b3b8c] hover:underline cursor-pointer"
          >
            {job.title}
          </button>
        </h3>
        <p className="text-[16pt] font-semibold text-slate-800 hc-muted mb-4">
          {job.company}
        </p>

        <p className="senior-prose text-slate-800 hc-muted mb-5">
          {job.summary}
        </p>

        {/* Clean divider-separated key facts (no region tag) */}
        <dl className="border-t border-b border-slate-300 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-[13pt] font-bold text-slate-600 hc-muted">
              활동비 · 급여
            </dt>
            <dd className="font-num text-[17pt] font-bold text-[#0b3b8c] mt-0.5 leading-snug">
              {job.salaryText}
            </dd>
          </div>
          <div>
            <dt className="text-[13pt] font-bold text-slate-600 hc-muted flex items-center gap-1.5">
              <Clock className="w-4 h-4 shrink-0" />
              <span>활동 시간</span>
            </dt>
            <dd className="text-[15pt] font-semibold text-slate-950 mt-0.5 leading-snug">
              {job.workDays}
              <br />
              <span className="font-num text-[14pt] text-slate-700 hc-muted">
                {job.workHours}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-[13pt] font-bold text-slate-600 hc-muted flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>활동처 · 자격</span>
            </dt>
            <dd className="text-[15pt] font-semibold text-slate-950 mt-0.5 leading-snug">
              {job.workplace}
              <br />
              <span className="text-[14pt] text-slate-700 hc-muted">
                {job.eligibilityText}
              </span>
            </dd>
          </div>
        </dl>

        <p className="text-[14pt] font-semibold text-slate-800 hc-muted mt-3">
          <span className="text-[#0b3b8c] font-bold">필요서류:</span>{' '}
          {job.requiredDocuments.join(' · ')}
        </p>
      </div>

      {/* Wide clickable-area button controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenDetail(job)}
          className="btn-senior btn-senior-primary flex-1 sm:flex-none"
        >
          <Eye className="w-5 h-5 shrink-0" />
          <span>자세히 보기</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickApply(job)}
          disabled={isApplied}
          className={`btn-senior flex-1 sm:flex-none ${
            isApplied
              ? 'bg-[#005f73] border-[#005f73] text-white cursor-default'
              : 'bg-[#eef2f6] border-[#0b3b8c] text-[#0b3b8c] hover:bg-blue-100'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>지원 완료</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 shrink-0" />
              <span>1분 바로 지원</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(job.id)}
          aria-pressed={isSaved}
          className={`btn-senior ${
            isSaved
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'btn-senior-secondary'
          }`}
        >
          <Heart
            className={`w-5 h-5 shrink-0 ${isSaved ? 'fill-current' : ''}`}
          />
          <span>{isSaved ? '관심 저장됨' : '관심 저장'}</span>
        </button>
      </div>
    </article>
  );
};
