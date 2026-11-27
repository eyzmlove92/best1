import React, { useEffect, useState } from 'react';
import {
  X,
  Phone,
  Copy,
  Check,
  MapPin,
  Clock,
  Heart,
  Send,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { JobPosting, SimpleResume } from '../types/job';

interface JobDetailModalProps {
  job: JobPosting | null;
  initialShowApplyForm: boolean;
  isSaved: boolean;
  isApplied: boolean;
  resume: SimpleResume | null;
  onClose: () => void;
  onToggleSave: (jobId: string) => void;
  onSubmitApplication: (payload: {
    job: JobPosting;
    applicantName: string;
    applicantPhone: string;
    memo: string;
  }) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  initialShowApplyForm,
  isSaved,
  isApplied,
  resume,
  onClose,
  onToggleSave,
  onSubmitApplication,
}) => {
  const [showApplyForm, setShowApplyForm] = useState(initialShowApplyForm);
  const [applicantName, setApplicantName] = useState(resume?.name ?? '');
  const [applicantPhone, setApplicantPhone] = useState(resume?.phone ?? '');
  const [memo, setMemo] = useState(resume?.careerSummary ?? '');
  const [formError, setFormError] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    setShowApplyForm(initialShowApplyForm);
    setApplicantName(resume?.name ?? '');
    setApplicantPhone(resume?.phone ?? '');
    setMemo(resume?.careerSummary ?? '');
    setFormError('');
    setCopiedPhone(false);
  }, [job, initialShowApplyForm, resume]);

  useEffect(() => {
    if (!job) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [job, onClose]);

  if (!job) return null;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(job.contactPhone);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2500);
    } catch {
      setCopiedPhone(true);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      setFormError('성함을 입력해 주세요.');
      return;
    }
    const cleanedPhone = applicantPhone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 9) {
      setFormError('연락 가능한 전화번호를 정확히 입력해 주세요.');
      return;
    }
    setFormError('');
    onSubmitApplication({
      job,
      applicantName: applicantName.trim(),
      applicantPhone: applicantPhone.trim(),
      memo: memo.trim() || '성실히 활동하겠습니다.',
    });
    setShowApplyForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-detail-title"
    >
      <div className="bg-white border-2 border-slate-400 hc-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {/* Top bar with large accessible close button */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-300">
          <div>
            <p className="text-[14pt] font-bold text-[#0b3b8c]">
              {job.categoryLabel} · {job.deadline}
            </p>
            <h2
              id="job-detail-title"
              className="text-[22pt] sm:text-[24pt] font-bold leading-[1.35] text-slate-950 mt-1"
            >
              {job.title}
            </h2>
            <p className="inline-flex items-center gap-2 text-[16pt] font-bold text-slate-800 mt-2">
              <Building2 className="w-5 h-5 text-slate-600 shrink-0" />
              <span>{job.company}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="창 닫기"
            className="btn-senior btn-senior-secondary min-w-[96px] px-4 shrink-0"
          >
            <X className="w-6 h-6" />
            <span>닫기</span>
          </button>
        </div>

        {/* Summary & Key conditions */}
        <div className="py-6 border-b border-slate-300">
          <p className="senior-prose text-slate-900 mb-6">{job.summary}</p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 border border-slate-300 rounded-xl p-5">
            <div>
              <dt className="text-[13pt] font-bold text-slate-600">
                활동비 · 급여 조건
              </dt>
              <dd className="font-num text-[19pt] font-bold text-[#0b3b8c] mt-0.5">
                {job.salaryText}
              </dd>
            </div>
            <div>
              <dt className="text-[13pt] font-bold text-slate-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>활동 요일 및 시간</span>
              </dt>
              <dd className="text-[16pt] font-bold text-slate-950 mt-0.5">
                {job.workDays} / {job.workHours}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[13pt] font-bold text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>주요 활동처 및 접수 안내</span>
              </dt>
              <dd className="text-[16pt] font-semibold text-slate-950 mt-0.5">
                {job.workplace} — {job.address}
              </dd>
            </div>
            <div>
              <dt className="text-[13pt] font-bold text-slate-600">
                이 사업단 참여 대상
              </dt>
              <dd className="text-[15pt] font-bold text-[#005f73] mt-0.5">
                {job.eligibilityText}
              </dd>
            </div>
            <div>
              <dt className="text-[13pt] font-bold text-slate-600">
                준비 필요서류
              </dt>
              <dd className="text-[15pt] font-bold text-slate-950 mt-0.5">
                {job.requiredDocuments.join(' · ')}
              </dd>
            </div>
          </dl>
        </div>

        {/* Detailed duties, requirements, benefits */}
        <div className="py-6 space-y-6 border-b border-slate-300">
          <div>
            <h3 className="text-[18pt] font-bold text-slate-950 mb-2">
              주요 하실 일
            </h3>
            <ul className="list-disc pl-6 space-y-1.5 senior-prose text-slate-900">
              {job.duties.map((duty, idx) => (
                <li key={idx}>{duty}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[18pt] font-bold text-slate-950 mb-2">
              참여 자격 및 우대 사항
            </h3>
            <ul className="list-disc pl-6 space-y-1.5 senior-prose text-slate-900">
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[18pt] font-bold text-slate-950 mb-2">
              지원 혜택 및 안내 사항
            </h3>
            <ul className="list-disc pl-6 space-y-1.5 senior-prose text-slate-900">
              {job.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Phone Box */}
        <div className="py-6 border-b border-slate-300">
          <h3 className="text-[18pt] font-bold text-slate-950 mb-3">
            담당 기관 전화 문의
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-300 rounded-xl p-5">
            <div>
              <p className="text-[14pt] font-semibold text-slate-700">
                {job.contactName}
              </p>
              <p className="font-num text-[22pt] font-bold text-slate-950 mt-0.5">
                {job.contactPhone}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${job.contactPhone.replace(/-/g, '')}`}
                className="btn-senior btn-senior-primary"
              >
                <Phone className="w-5 h-5" />
                <span>바로 전화 걸기</span>
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="btn-senior btn-senior-secondary"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-5 h-5 text-[#005f73]" />
                    <span>번호 복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>번호 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Application Status or 1-Minute Quick Apply Form */}
        <div className="pt-6">
          {isApplied ? (
            <div className="bg-slate-50 border-2 border-[#005f73] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-[#005f73]">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <p className="text-[18pt] font-bold">
                    이 일자리에 지원이 완료되었습니다
                  </p>
                  <p className="text-[14pt] text-slate-800">
                    상단 &lsquo;지원 내역&rsquo; 메뉴에서 언제든 확인하실 수
                    있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-senior btn-senior-secondary"
              >
                <span>확인</span>
              </button>
            </div>
          ) : showApplyForm ? (
            <form
              onSubmit={handleApplySubmit}
              className="bg-slate-50 border-2 border-[#0b3b8c] rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[20pt] font-bold text-slate-950">
                  1분 간편 지원하기
                </h3>
                {resume && (
                  <span className="text-[13pt] font-bold text-[#005f73]">
                    저장된 내 이력서 정보가 자동으로 입력되었습니다
                  </span>
                )}
              </div>

              {formError && (
                <p
                  role="alert"
                  className="p-4 rounded-xl bg-orange-50 border-2 border-[#9a3412] text-[#9a3412] text-[15pt] font-bold"
                >
                  {formError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="apply-name"
                    className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                  >
                    성함 (필수)
                  </label>
                  <input
                    id="apply-name"
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="예: 김영수"
                    className="w-full min-h-[56px] px-4 py-3 bg-white border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 font-medium"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apply-phone"
                    className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                  >
                    연락처 (필수)
                  </label>
                  <input
                    id="apply-phone"
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full min-h-[56px] px-4 py-3 bg-white border-2 border-slate-400 rounded-xl text-[16pt] font-num text-slate-950 font-medium"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="apply-memo"
                  className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                >
                  간단한 경력 또는 인사 말씀 (선택)
                </label>
                <textarea
                  id="apply-memo"
                  rows={3}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="예: 시간 약속을 잘 지키며 성실하게 활동할 수 있습니다."
                  className="w-full p-4 bg-white border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-senior btn-senior-primary">
                  <Send className="w-5 h-5" />
                  <span>지원서 제출하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="btn-senior btn-senior-secondary"
                >
                  <span>취소</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(true)}
                  className="btn-senior btn-senior-primary"
                >
                  <Send className="w-5 h-5" />
                  <span>1분 간편 지원하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSave(job.id)}
                  className={`btn-senior ${
                    isSaved
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'btn-senior-secondary'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                  />
                  <span>{isSaved ? '관심 저장됨' : '관심 일자리 저장'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-senior btn-senior-secondary"
              >
                <span>목록으로 돌아가기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
