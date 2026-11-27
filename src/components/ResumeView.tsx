import React, { useState } from 'react';
import {
  CheckCircle2,
  CheckSquare,
  Square,
  Save,
  Search,
} from 'lucide-react';
import { CATEGORY_LABELS, CERTIFICATE_OPTIONS } from '../data/jobs';
import { JobCategory, SimpleResume } from '../types/job';

interface ResumeViewProps {
  initialResume: SimpleResume | null;
  onSaveResume: (resume: SimpleResume) => void;
  onGoToJobs: (desiredCategory?: JobCategory) => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  initialResume,
  onSaveResume,
  onGoToJobs,
}) => {
  const [name, setName] = useState(initialResume?.name ?? '');
  const [birthYear, setBirthYear] = useState(initialResume?.birthYear ?? '');
  const [phone, setPhone] = useState(initialResume?.phone ?? '');
  const [desiredCategory, setDesiredCategory] = useState<
    Exclude<JobCategory, 'all'>
  >(initialResume?.desiredCategory ?? 'public_interest');
  const [preferredTime, setPreferredTime] = useState(
    initialResume?.preferredTime ?? '오전 활동 희망 (09:00 ~ 12:00)'
  );
  const [careerSummary, setCareerSummary] = useState(
    initialResume?.careerSummary ?? ''
  );
  const [certificates, setCertificates] = useState<string[]>(
    initialResume?.certificates ?? []
  );
  const [introduction, setIntroduction] = useState(
    initialResume?.introduction ?? ''
  );

  const [errorMsg, setErrorMsg] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const toggleCertificate = (cert: string) => {
    setCertificates((prev) =>
      prev.includes(cert) ? prev.filter((item) => item !== cert) : [...prev, cert]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('성함을 입력해 주세요.');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 9) {
      setErrorMsg('연락 가능한 휴대폰 번호를 정확히 입력해 주세요.');
      return;
    }
    setErrorMsg('');

    const payload: SimpleResume = {
      name: name.trim(),
      birthYear: birthYear.trim(),
      phone: phone.trim(),
      desiredCategory,
      preferredTime,
      careerSummary: careerSummary.trim(),
      certificates,
      introduction: introduction.trim(),
      updatedAt: new Date().toLocaleDateString('ko-KR'),
    };
    onSaveResume(payload);
    setSavedNotice(true);
  };

  const selectableCategories: Exclude<JobCategory, 'all'>[] = [
    'public_interest',
    'capability',
    'community',
    'placement',
  ];

  return (
    <section className="max-w-[960px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-[24pt] sm:text-[28pt] font-bold text-slate-950">
          3분 간편 이력서 작성
        </h1>
        <p className="senior-prose text-slate-700 hc-muted mt-2">
          복잡한 학력이나 긴 자기소개서 없이, 꼭 필요한 정보만 적어 두시면
          일자리 지원 시 자동으로 입력됩니다.
        </p>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="mb-8 p-6 bg-slate-50 border-2 border-[#005f73] rounded-2xl flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-[#005f73]">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <p className="text-[18pt] font-bold">
                간편 이력서가 안전하게 저장되었습니다
              </p>
              <p className="text-[14pt] text-slate-800">
                이제 원하시는 일자리에 버튼 한 번으로 지원하실 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToJobs(desiredCategory)}
            className="btn-senior btn-senior-primary"
          >
            <Search className="w-5 h-5" />
            <span>내 희망 일자리 보러가기</span>
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-6 sm:p-8 space-y-8"
      >
        {errorMsg && (
          <p
            role="alert"
            className="p-4 rounded-xl bg-orange-50 border-2 border-[#9a3412] text-[#9a3412] text-[15pt] font-bold"
          >
            {errorMsg}
          </p>
        )}

        {/* 1. 기본 연락처 */}
        <div className="space-y-4">
          <h2 className="text-[19pt] font-bold text-slate-950 pb-2 border-b border-slate-300">
            01. 기본 연락처 정보
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="resume-name"
                className="block text-[15pt] font-bold text-slate-900 mb-1.5"
              >
                성함 (필수)
              </label>
              <input
                id="resume-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 박영호"
                className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="resume-birth"
                className="block text-[15pt] font-bold text-slate-900 mb-1.5"
              >
                출생연도 (선택)
              </label>
              <input
                id="resume-birth"
                type="text"
                inputMode="numeric"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="예: 1958년생"
                className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] font-num text-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="resume-phone"
                className="block text-[15pt] font-bold text-slate-900 mb-1.5"
              >
                휴대폰 번호 (필수)
              </label>
              <input
                id="resume-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="예: 010-1234-5678"
                className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] font-num text-slate-950"
              />
            </div>
          </div>
        </div>

        {/* 2. 희망 활동 조건 (근무지역 제거) */}
        <div className="space-y-4">
          <h2 className="text-[19pt] font-bold text-slate-950 pb-2 border-b border-slate-300">
            02. 희망하시는 사업 유형과 시간대
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="resume-category"
                className="block text-[15pt] font-bold text-slate-900 mb-1.5"
              >
                희망 사업 유형
              </label>
              <select
                id="resume-category"
                value={desiredCategory}
                onChange={(e) =>
                  setDesiredCategory(
                    e.target.value as Exclude<JobCategory, 'all'>
                  )
                }
                className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 bg-white cursor-pointer"
              >
                {selectableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="resume-time"
                className="block text-[15pt] font-bold text-slate-900 mb-1.5"
              >
                참여 가능 시간대
              </label>
              <select
                id="resume-time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 bg-white cursor-pointer"
              >
                <option value="오전 활동 희망 (09:00 ~ 12:00)">
                  오전 활동 희망 (09:00 ~ 12:00)
                </option>
                <option value="오후 활동 희망 (13:00 ~ 17:00)">
                  오후 활동 희망 (13:00 ~ 17:00)
                </option>
                <option value="전일 및 교대 근무 가능">
                  전일 및 교대 근무 가능
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. 보유 자격증·면허 체크 */}
        <div className="space-y-4">
          <h2 className="text-[19pt] font-bold text-slate-950 pb-2 border-b border-slate-300">
            03. 가지고 계신 자격증이나 경험을 선택해 주세요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CERTIFICATE_OPTIONS.map((cert) => {
              const checked = certificates.includes(cert);
              return (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCertificate(cert)}
                  aria-pressed={checked}
                  className={`flex items-center gap-3 px-4 py-3.5 min-h-[56px] rounded-xl border-2 text-left text-[15pt] font-bold cursor-pointer transition-colors ${
                    checked
                      ? 'bg-[#0b3b8c] border-[#0b3b8c] text-white'
                      : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-6 h-6 shrink-0" />
                  ) : (
                    <Square className="w-6 h-6 shrink-0 text-slate-500" />
                  )}
                  <span>{cert}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 경력 및 한 줄 소개 */}
        <div className="space-y-4">
          <h2 className="text-[19pt] font-bold text-slate-950 pb-2 border-b border-slate-300">
            04. 주요 경력 및 성실함 한마디
          </h2>
          <div>
            <label
              htmlFor="resume-career"
              className="block text-[15pt] font-bold text-slate-900 mb-1.5"
            >
              그동안 해오신 일 (간단히 적어주세요)
            </label>
            <textarea
              id="resume-career"
              rows={3}
              value={careerSummary}
              onChange={(e) => setCareerSummary(e.target.value)}
              placeholder="예: 학교 시설 관리 및 아동안전돌봄이 활동에 성실히 참여했습니다."
              className="w-full p-4 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 leading-relaxed"
            />
          </div>

          <div>
            <label
              htmlFor="resume-intro"
              className="block text-[15pt] font-bold text-slate-900 mb-1.5"
            >
              담당자께 드리는 한 말씀
            </label>
            <input
              id="resume-intro"
              type="text"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="예: 시간 약속을 철저히 지키며 동료들과 원만하게 활동합니다."
              className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex flex-wrap items-center justify-between gap-4">
          <button type="submit" className="btn-senior btn-senior-primary">
            <Save className="w-5 h-5" />
            <span>간편 이력서 저장하기</span>
          </button>
          {initialResume?.updatedAt && (
            <span className="text-[14pt] text-slate-600 font-medium">
              최근 저장일: {initialResume.updatedAt}
            </span>
          )}
        </div>
      </form>
    </section>
  );
};
