import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Search, RotateCcw, CheckCircle2 } from 'lucide-react';
import { INITIAL_JOBS, CATEGORY_LABELS } from './data/jobs';
import {
  ActiveTab,
  ConsultationRequest,
  FontSizeLevel,
  JobApplication,
  JobCategory,
  JobPosting,
  SimpleResume,
  WorkFilterKey,
} from './types/job';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { RecruitmentNotice } from './components/RecruitmentNotice';
import { IconCategoryMenu } from './components/IconCategoryMenu';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { ResumeView } from './components/ResumeView';
import { SupportView } from './components/SupportView';
import { ApplicationsView } from './components/ApplicationsView';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  savedIds: 'naeilteo_saved_ids_v2',
  resume: 'naeilteo_simple_resume_v2',
  applications: 'naeilteo_applications_v2',
  consultations: 'naeilteo_consultations_v2',
  fontSize: 'naeilteo_font_size_v1',
  highContrast: 'naeilteo_high_contrast_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('all');
  const [workFilters, setWorkFilters] = useState<Record<WorkFilterKey, boolean>>({
    age60Plus: false,
    basicPension: false,
    shortHours: false,
    beginnerOk: false,
  });

  const [fontSize, setFontSize] = useState<FontSizeLevel>(() =>
    readStorage<FontSizeLevel>(STORAGE_KEYS.fontSize, 'normal')
  );
  const [highContrast, setHighContrast] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEYS.highContrast, false)
  );

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.savedIds, [])
  );
  const [resume, setResume] = useState<SimpleResume | null>(() =>
    readStorage<SimpleResume | null>(STORAGE_KEYS.resume, null)
  );
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    readStorage<JobApplication[]>(STORAGE_KEYS.applications, [])
  );
  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() =>
    readStorage<ConsultationRequest[]>(STORAGE_KEYS.consultations, [])
  );

  const [modalJob, setModalJob] = useState<JobPosting | null>(null);
  const [modalShowApply, setModalShowApply] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const jobListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scaleMap: Record<FontSizeLevel, string> = {
      normal: '1',
      large: '1.1',
      xlarge: '1.2',
    };
    document.documentElement.style.setProperty(
      '--senior-text-scale',
      scaleMap[fontSize]
    );
    window.localStorage.setItem(STORAGE_KEYS.fontSize, JSON.stringify(fontSize));
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    window.localStorage.setItem(
      STORAGE_KEYS.highContrast,
      JSON.stringify(highContrast)
    );
  }, [highContrast]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.savedIds, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.applications,
      JSON.stringify(applications)
    );
  }, [applications]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.consultations,
      JSON.stringify(consultations)
    );
  }, [consultations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<JobCategory, number> = {
      all: 0,
      public_interest: 0,
      capability: 0,
      community: 0,
      placement: 0,
    };
    const kw = keyword.trim().toLowerCase();

    for (const job of INITIAL_JOBS) {
      if (workFilters.age60Plus && !job.isAge60Plus) continue;
      if (workFilters.basicPension && !job.isBasicPension) continue;
      if (workFilters.shortHours && !job.isShortHours) continue;
      if (workFilters.beginnerOk && !job.isBeginnerOk) continue;
      if (
        kw &&
        !`${job.title} ${job.company} ${job.categoryLabel} ${job.workplace} ${job.summary}`
          .toLowerCase()
          .includes(kw)
      ) {
        continue;
      }
      counts.all += 1;
      counts[job.category] += 1;
    }
    return counts;
  }, [keyword, workFilters]);

  const filteredJobs = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return INITIAL_JOBS.filter((job) => {
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }
      if (workFilters.age60Plus && !job.isAge60Plus) return false;
      if (workFilters.basicPension && !job.isBasicPension) return false;
      if (workFilters.shortHours && !job.isShortHours) return false;
      if (workFilters.beginnerOk && !job.isBeginnerOk) return false;
      if (
        kw &&
        !`${job.title} ${job.company} ${job.categoryLabel} ${job.workplace} ${job.summary}`
          .toLowerCase()
          .includes(kw)
      ) {
        return false;
      }
      return true;
    });
  }, [keyword, selectedCategory, workFilters]);

  const savedJobs = useMemo(
    () => INITIAL_JOBS.filter((job) => savedIds.includes(job.id)),
    [savedIds]
  );

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.jobId)),
    [applications]
  );

  const hasActiveFilters =
    Boolean(keyword.trim()) ||
    selectedCategory !== 'all' ||
    Object.values(workFilters).some(Boolean);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setWorkFilters({
      age60Plus: false,
      basicPension: false,
      shortHours: false,
      beginnerOk: false,
    });
  };

  const handleToggleSave = (jobId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('관심 일자리에서 해제했습니다.');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast('관심 일자리에 저장했습니다.');
        return [...prev, jobId];
      }
    });
  };

  const handleSaveResume = (newResume: SimpleResume) => {
    setResume(newResume);
    window.localStorage.setItem(STORAGE_KEYS.resume, JSON.stringify(newResume));
    showToast('간편 이력서가 저장되었습니다.');
  };

  const handleSubmitApplication = ({
    job,
    applicantName,
    applicantPhone,
    memo,
  }: {
    job: JobPosting;
    applicantName: string;
    applicantPhone: string;
    memo: string;
  }) => {
    if (appliedJobIds.has(job.id)) return;
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      workplace: job.workplace,
      salaryText: job.salaryText,
      applicantName,
      applicantPhone,
      memo,
      appliedAt: new Date().toLocaleDateString('ko-KR'),
      status: '지원 완료',
    };
    setApplications((prev) => [newApp, ...prev]);
    showToast(`'${job.title}' 사업단에 지원이 완료되었습니다.`);
  };

  const handleWithdrawApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    showToast('지원이 취소되었습니다.');
  };

  const handleSubmitConsultation = (
    req: Omit<ConsultationRequest, 'id' | 'createdAt'>
  ) => {
    const newConsult: ConsultationRequest = {
      ...req,
      id: `consult-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };
    setConsultations((prev) => [newConsult, ...prev]);
    showToast('무료 전화 상담 예약이 접수되었습니다.');
  };

  const scrollToJobs = () => {
    jobListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedIds.length}
        applicationCount={applications.length}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-950 text-white border-2 border-white rounded-2xl px-5 py-4 shadow-lg flex items-center gap-3 text-[15pt] font-bold"
        >
          <CheckCircle2 className="w-6 h-6 text-teal-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSearch
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSubmitSearch={scrollToJobs}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              highContrast={highContrast}
              onToggleHighContrast={() => setHighContrast((prev) => !prev)}
              hasResume={Boolean(resume)}
              onOpenResume={() => setActiveTab('resume')}
              totalJobsCount={INITIAL_JOBS.length}
            />

            <RecruitmentNotice
              onSelectCategoryAndScroll={(category) => {
                setSelectedCategory(category);
                window.setTimeout(() => {
                  scrollToJobs();
                }, 60);
              }}
            />

            <IconCategoryMenu
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
              activeFilters={workFilters}
              onToggleFilter={(key) =>
                setWorkFilters((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <section
              ref={jobListRef}
              aria-label="일자리 사업단 목록"
              className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-300">
                <h2 className="text-[20pt] sm:text-[22pt] font-bold text-slate-950">
                  {CATEGORY_LABELS[selectedCategory]} 목록{' '}
                  <span className="font-num text-[#0b3b8c]">
                    ({filteredJobs.length}건)
                  </span>
                </h2>
                <p className="text-[14pt] font-semibold text-slate-700 hc-muted">
                  원하시는 일자리의 &lsquo;자세히 보기&rsquo; 버튼을 눌러주세요.
                </p>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-10 text-center space-y-4">
                  <Search className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-[20pt] font-bold text-slate-950">
                    선택하신 조건에 맞는 일자리가 없습니다
                  </h3>
                  <p className="senior-prose text-slate-700 hc-muted max-w-lg mx-auto">
                    검색어를 지우거나 선택 조건을 해제하시면 더 많은 사업단
                    일자리를 보실 수 있습니다.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="btn-senior btn-senior-primary"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>전체 일자리 다시 보기</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedIds.includes(job.id)}
                      isApplied={appliedJobIds.has(job.id)}
                      onToggleSave={handleToggleSave}
                      onOpenDetail={(selected) => {
                        setModalJob(selected);
                        setModalShowApply(false);
                      }}
                      onQuickApply={(selected) => {
                        setModalJob(selected);
                        setModalShowApply(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'saved' && (
          <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
              <h1 className="text-[24pt] sm:text-[28pt] font-bold text-slate-950">
                내가 저장한 관심 일자리{' '}
                <span className="font-num text-[#0b3b8c]">
                  ({savedJobs.length}건)
                </span>
              </h1>
              <p className="senior-prose text-slate-700 hc-muted mt-2">
                마음에 드는 사업단을 모아 천천히 비교해 보시고 지원하실 수
                있습니다.
              </p>
            </div>

            {savedJobs.length === 0 ? (
              <div className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-10 text-center space-y-4">
                <Heart className="w-12 h-12 text-slate-500 mx-auto" />
                <h2 className="text-[20pt] font-bold text-slate-950">
                  아직 저장하신 관심 일자리가 없습니다
                </h2>
                <p className="senior-prose text-slate-700 hc-muted max-w-lg mx-auto">
                  일자리 목록에서 &lsquo;관심 저장&rsquo; 버튼을 누르시면 이곳에
                  모아둘 수 있습니다.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('jobs')}
                    className="btn-senior btn-senior-primary"
                  >
                    <Search className="w-5 h-5" />
                    <span>일자리 찾아보기</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={true}
                    isApplied={appliedJobIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    onOpenDetail={(selected) => {
                      setModalJob(selected);
                      setModalShowApply(false);
                    }}
                    onQuickApply={(selected) => {
                      setModalJob(selected);
                      setModalShowApply(true);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'resume' && (
          <ResumeView
            initialResume={resume}
            onSaveResume={handleSaveResume}
            onGoToJobs={(desiredCategory) => {
              if (desiredCategory) {
                setSelectedCategory(desiredCategory);
              }
              setActiveTab('jobs');
            }}
          />
        )}

        {activeTab === 'support' && (
          <SupportView
            consultations={consultations}
            onSubmitConsultation={handleSubmitConsultation}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsView
            applications={applications}
            onViewJob={(jobId) => {
              const found = INITIAL_JOBS.find((j) => j.id === jobId);
              if (found) {
                setModalJob(found);
                setModalShowApply(false);
              }
            }}
            onWithdraw={handleWithdrawApplication}
            onGoToJobs={() => setActiveTab('jobs')}
          />
        )}
      </main>

      <Footer onSelectTab={setActiveTab} />

      <JobDetailModal
        job={modalJob}
        initialShowApplyForm={modalShowApply}
        isSaved={modalJob ? savedIds.includes(modalJob.id) : false}
        isApplied={modalJob ? appliedJobIds.has(modalJob.id) : false}
        resume={resume}
        onClose={() => setModalJob(null)}
        onToggleSave={handleToggleSave}
        onSubmitApplication={handleSubmitApplication}
      />
    </div>
  );
}
