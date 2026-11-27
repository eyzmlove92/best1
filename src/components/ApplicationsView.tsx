import React from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Eye,
  Trash2,
  Search,
} from 'lucide-react';
import { JobApplication } from '../types/job';

interface ApplicationsViewProps {
  applications: JobApplication[];
  onViewJob: (jobId: string) => void;
  onWithdraw: (applicationId: string) => void;
  onGoToJobs: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onViewJob,
  onWithdraw,
  onGoToJobs,
}) => {
  return (
    <section className="max-w-[960px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-[24pt] sm:text-[28pt] font-bold text-slate-950">
          내 일자리 지원 내역
        </h1>
        <p className="senior-prose text-slate-700 hc-muted mt-2">
          지원하신 일자리 목록과 진행 상태를 한눈에 확인하실 수 있습니다.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-10 text-center space-y-4">
          <ClipboardCheck className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-[20pt] font-bold text-slate-950">
            아직 지원하신 일자리가 없습니다
          </h2>
          <p className="senior-prose text-slate-700 hc-muted max-w-lg mx-auto">
            일자리 찾기 화면에서 마음에 드는 사업단을 골라 &lsquo;1분 바로
            지원&rsquo; 버튼을 눌러보세요.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToJobs}
              className="btn-senior btn-senior-primary"
            >
              <Search className="w-5 h-5" />
              <span>일자리 찾으러 가기</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <article
              key={app.id}
              className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[14pt] font-bold text-[#005f73]">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{app.status}</span>
                  </span>
                  <span className="text-[14pt] text-slate-600 hc-muted font-num">
                    · 지원일: {app.appliedAt}
                  </span>
                </div>

                <h2 className="text-[19pt] font-bold text-slate-950">
                  {app.jobTitle}
                </h2>
                <p className="text-[15pt] font-semibold text-slate-800 hc-muted">
                  {app.company} · {app.workplace} ·{' '}
                  <span className="font-num text-[#0b3b8c]">
                    {app.salaryText}
                  </span>
                </p>
                <p className="text-[14pt] text-slate-700 hc-muted">
                  지원자: {app.applicantName} ({app.applicantPhone})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onViewJob(app.jobId)}
                  className="btn-senior btn-senior-primary"
                >
                  <Eye className="w-5 h-5" />
                  <span>공고 보기</span>
                </button>
                <button
                  type="button"
                  onClick={() => onWithdraw(app.id)}
                  className="btn-senior btn-senior-secondary"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>지원 취소</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
