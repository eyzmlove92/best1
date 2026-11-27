import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Search,
  CheckSquare,
  Square,
  Image as ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react';
import { JobCategory } from '../types/job';

interface RecruitmentNoticeProps {
  onSelectCategoryAndScroll: (category: JobCategory) => void;
}

type RecruitTypeId = 'public_interest' | 'capability' | 'community';

interface RecruitTypeInfo {
  id: RecruitTypeId;
  title: string;
  activities: string[];
  eligibility: string[];
  documents: string[];
}

const RECRUIT_TYPES: RecruitTypeInfo[] = [
  {
    id: 'public_interest',
    title: '노인공익활동사업',
    activities: ['월 10회 (주 2~3회 / 일 3시간)', '단체 상해보험 가입 지원'],
    eligibility: ['65세 이상 기초연금 수급자', '직역연금수급자 (배우자 포함)'],
    documents: ['기초연금 확인서', '주민등록등본 (상세★)'],
  },
  {
    id: 'capability',
    title: '노인역량활용사업',
    activities: ['월 60시간 (주 5회 / 일 3시간)', '사회보험 가입 지원'],
    eligibility: ['65세 이상', '일부 유형 60세 이상 참여 가능'],
    documents: ['주민등록등본 (상세★)', '사업 유형별 자격증'],
  },
  {
    id: 'community',
    title: '공동체사업단',
    activities: ['월 4~10회 (일 3~8시간)', '사업단 별로 변동 있음'],
    eligibility: ['만 60세 이상 사업특성 적합자'],
    documents: ['주민등록등본 (상세★)'],
  },
];

const EXCLUSION_RULES = [
  '과거 부정수급 등으로 사업 참여가 제한된 자',
  '국내 거주자 중 외국인 자',
  '국민기초생활 보장법에 의한 생계급여 수급자',
  '국민건강보험 직장가입자',
  '장기요양보험 등급 판정자 1~5등급, 인지지원등급',
];

const LOCATIONS = [
  {
    id: 'main',
    number: '1',
    name: '천안시시니어클럽 본관',
    address: '천안천공원3길 27-20 어르신일자리복지센터 2층',
  },
  {
    id: 'annex',
    number: '2',
    name: '천안시시니어클럽 별관',
    address: '천안시 동남구 충무로 418-1 청솔빌딩 4층',
  },
];

const DOC_CHECKLIST = [
  '주민등록등본 (상세★ 표시 발급)',
  '신분증 (주민등록증 또는 운전면허증)',
  '기초연금 확인서 (공익활동 신청 시)',
  '사업 유형별 자격증 사본 (역량활용 해당 시)',
];

type AgeGroup = '65_pension' | '65_general' | '60_64' | 'under_60' | null;

export const RecruitmentNotice: React.FC<RecruitmentNoticeProps> = ({
  onSelectCategoryAndScroll,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedType, setSelectedType] =
    useState<RecruitTypeId>('public_interest');
  const [activeSubTool, setActiveSubTool] = useState<
    'table' | 'checker' | 'checklist'
  >('table');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);
  const [hasExclusion, setHasExclusion] = useState<boolean | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [copiedLocId, setCopiedLocId] = useState<string | null>(null);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const activeTypeInfo =
    RECRUIT_TYPES.find((t) => t.id === selectedType) ?? RECRUIT_TYPES[0];

  const handleCopyAddress = async (id: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedLocId(id);
      window.setTimeout(() => {
        setCopiedLocId((prev) => (prev === id ? null : prev));
      }, 2500);
    } catch {
      setCopiedLocId(id);
    }
  };

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) =>
      prev.includes(doc) ? prev.filter((item) => item !== doc) : [...prev, doc]
    );
  };

  const getEligibilityResult = () => {
    if (ageGroup === null || hasExclusion === null) return null;
    if (hasExclusion) {
      return {
        eligible: false,
        title: '안내: 신청 자격 제외 대상에 해당하실 수 있습니다',
        desc: '생계급여 수급자, 건강보험 직장가입자, 장기요양보험 1~5등급(인지지원등급) 판정자 등은 참여가 제한됩니다. 정확한 확인은 본관·별관(041-415-2090)으로 문의해 주세요.',
        recommendedCategory: null as JobCategory | null,
      };
    }
    if (ageGroup === 'under_60') {
      return {
        eligible: false,
        title: '안내: 만 60세 이상부터 참여 신청이 가능합니다',
        desc: '노인일자리 및 사회활동 지원사업은 만 60세 이상 어르신을 대상으로 운영됩니다.',
        recommendedCategory: null as JobCategory | null,
      };
    }
    if (ageGroup === '65_pension') {
      return {
        eligible: true,
        title: '모든 모집 유형(공익활동·역량활용·공동체사업단) 신청 가능합니다',
        desc: '공통 서류(주민등록등본 상세★, 기초연금 확인서) 외에 급식·보육·카페·안전 등 세부 사업단별로 보건증이나 자격증이 추가로 필요할 수 있습니다.',
        recommendedCategory: 'public_interest' as JobCategory,
      };
    }
    if (ageGroup === '65_general') {
      return {
        eligible: true,
        title: '노인역량활용사업 및 공동체사업단 신청이 가능합니다',
        desc: '주민등록등본(상세★)이 필요하며, 세부 사업단에 따라 자격증·경력·보건증 등 개별 참여 조건이 다르니 아래 일자리 카드에서 확인해 주세요.',
        recommendedCategory: 'capability' as JobCategory,
      };
    }
    return {
      eligible: true,
      title: '공동체사업단 및 일부 노인역량활용사업(60세+ 유형) 신청이 가능합니다',
      desc: '만 60세 이상 사업특성 적합자 대상이며, 사업단마다 근무시간(일 3~8시간)·보건증·경력 조건이 다릅니다. 필요서류: 주민등록등본(상세★)',
      recommendedCategory: 'community' as JobCategory,
    };
  };

  const eligibilityResult = getEligibilityResult();

  return (
    <section
      aria-label="2027년 노인일자리 및 사회활동 지원사업 참여자 모집 공고"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8"
    >
      <div className="bg-white border-2 border-[#0b3b8c] hc-card rounded-2xl overflow-hidden">
        {/* Top Notice Header */}
        <div className="bg-[#eef2f6] border-b-2 border-slate-300 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[14pt] font-bold text-[#0b3b8c]">
              천안시시니어클럽 공식 참여자 모집 안내
            </p>
            <h2 className="text-[21pt] sm:text-[25pt] font-bold text-slate-950 leading-tight mt-1">
              2027년 노인일자리 및 사회활동 지원사업 참여자 모집
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPosterModal(true)}
              className="btn-senior btn-senior-secondary"
            >
              <ImageIcon className="w-5 h-5 shrink-0" />
              <span>원본 안내문 크게 보기</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="btn-senior btn-senior-secondary min-w-[110px]"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-5 h-5 shrink-0" />
                  <span>접어두기</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 shrink-0" />
                  <span>자세히 펼치기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 sm:p-8 space-y-8">
            {/* Key Schedule & Locations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 모집기간 */}
              <div className="lg:col-span-4 bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-[14pt] font-bold text-[#0b3b8c] mb-2">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span>모집기간</span>
                  </p>
                  <p className="font-num text-[20pt] sm:text-[22pt] font-bold text-slate-950 leading-snug">
                    26. 11. 30.(월)
                    <br />~ 26. 12. 18.(금)
                  </p>
                </div>
                <p className="text-[14pt] font-semibold text-[#9a3412] mt-3">
                  ※ 평일 방문 접수 (주말·공휴일 제외)
                </p>
              </div>

              {/* 모집장소 (본관 / 별관 주소 복사 기능) */}
              <div className="lg:col-span-8 bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4">
                <p className="inline-flex items-center gap-2 text-[14pt] font-bold text-[#0b3b8c]">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span>모집장소 (방문 접수처 · 주소를 눌러 복사하세요)</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {LOCATIONS.map((loc) => {
                    const isCopied = copiedLocId === loc.id;
                    return (
                      <div
                        key={loc.id}
                        className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <p className="text-[16pt] font-bold text-slate-950">
                            {loc.number}. {loc.name}
                          </p>
                          <p className="text-[14pt] text-slate-800 mt-1 leading-snug">
                            ({loc.address})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(loc.id, loc.address)}
                          className="btn-senior btn-senior-secondary min-h-[48px] py-2 px-4 text-[14pt] w-full"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-5 h-5 text-[#005f73] shrink-0" />
                              <span>주소가 복사되었습니다</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5 shrink-0" />
                              <span>주소 복사하기</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Mode Switcher Tabs */}
            <div>
              <div
                role="tablist"
                aria-label="모집 안내 도구 선택"
                className="flex flex-wrap gap-3 border-b-2 border-slate-300 pb-4"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTool === 'table'}
                  onClick={() => setActiveSubTool('table')}
                  className={`btn-senior ${
                    activeSubTool === 'table'
                      ? 'btn-senior-primary'
                      : 'btn-senior-secondary'
                  }`}
                >
                  <FileText className="w-5 h-5 shrink-0" />
                  <span>모집유형별 안내표</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTool === 'checker'}
                  onClick={() => setActiveSubTool('checker')}
                  className={`btn-senior ${
                    activeSubTool === 'checker'
                      ? 'btn-senior-primary'
                      : 'btn-senior-secondary'
                  }`}
                >
                  <UserCheck className="w-5 h-5 shrink-0" />
                  <span>내 신청 자격 10초 확인</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTool === 'checklist'}
                  onClick={() => setActiveSubTool('checklist')}
                  className={`btn-senior ${
                    activeSubTool === 'checklist'
                      ? 'btn-senior-primary'
                      : 'btn-senior-secondary'
                  }`}
                >
                  <CheckSquare className="w-5 h-5 shrink-0" />
                  <span>
                    방문 서류 챙기기 ({checkedDocs.length}/{DOC_CHECKLIST.length}
                    )
                  </span>
                </button>
              </div>

              {/* TAB 1: Interactive Recruitment Types Table & Quick Link */}
              {activeSubTool === 'table' && (
                <div className="pt-6 space-y-6">
                  {/* Clickable type selector buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {RECRUIT_TYPES.map((typeItem) => {
                      const active = selectedType === typeItem.id;
                      return (
                        <button
                          key={typeItem.id}
                          type="button"
                          onClick={() => setSelectedType(typeItem.id)}
                          aria-pressed={active}
                          className={`p-4 min-h-[64px] rounded-xl border-2 text-left cursor-pointer transition-colors ${
                            active
                              ? 'bg-[#0b3b8c] border-[#0b3b8c] text-white'
                              : 'bg-slate-50 border-slate-300 text-slate-950 hover:border-[#0b3b8c]'
                          }`}
                        >
                          <p className="text-[17pt] font-bold">
                            {typeItem.title}
                          </p>
                          <p
                            className={`text-[14pt] mt-0.5 ${
                              active ? 'text-blue-100' : 'text-slate-700'
                            }`}
                          >
                            {typeItem.activities[0]}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Large readable selected type detail */}
                  <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-300">
                      <h3 className="text-[20pt] font-bold text-slate-950">
                        {activeTypeInfo.title} 상세 안내
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectCategoryAndScroll(activeTypeInfo.id)
                        }
                        className="btn-senior btn-senior-primary"
                      >
                        <Search className="w-5 h-5 shrink-0" />
                        <span>{activeTypeInfo.title} 일자리 바로 보기</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                      <div>
                        <p className="text-[14pt] font-bold text-[#0b3b8c] mb-2">
                          활동 및 지원 사항
                        </p>
                        <ul className="space-y-1.5 text-[15pt] font-semibold text-slate-950 list-disc pl-5">
                          {activeTypeInfo.activities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[14pt] font-bold text-[#0b3b8c] mb-2">
                          신청대상
                        </p>
                        <ul className="space-y-1.5 text-[15pt] font-semibold text-slate-950 list-disc pl-5">
                          {activeTypeInfo.eligibility.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[14pt] font-bold text-[#0b3b8c] mb-2">
                          필요서류
                        </p>
                        <ul className="space-y-1.5 text-[15pt] font-semibold text-slate-950 list-disc pl-5">
                          {activeTypeInfo.documents.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Interactive 10-Second Eligibility Self-Checker */}
              {activeSubTool === 'checker' && (
                <div className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Question 1 */}
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-3">
                      <p className="text-[16pt] font-bold text-slate-950">
                        1. 연령과 기초연금 해당 여부를 눌러주세요
                      </p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {(
                          [
                            {
                              id: '65_pension',
                              label: '만 65세 이상 · 기초연금(또는 직역연금) 수급',
                            },
                            {
                              id: '65_general',
                              label: '만 65세 이상 · 기초연금 미수급',
                            },
                            {
                              id: '60_64',
                              label: '만 60세 ~ 64세',
                            },
                            {
                              id: 'under_60',
                              label: '만 60세 미만',
                            },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setAgeGroup(opt.id)}
                            aria-pressed={ageGroup === opt.id}
                            className={`btn-senior justify-start text-left w-full ${
                              ageGroup === opt.id
                                ? 'btn-senior-primary'
                                : 'btn-senior-secondary'
                            }`}
                          >
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-3">
                      <p className="text-[16pt] font-bold text-slate-950">
                        2. 아래 제외 항목에 해당하시는 사항이 있나요?
                      </p>
                      <ul className="text-[14pt] text-slate-800 space-y-1 list-disc pl-5">
                        <li>생계급여 수급자 / 건강보험 직장가입자</li>
                        <li>장기요양보험 1~5등급 또는 인지지원등급 판정자</li>
                      </ul>
                      <div className="grid grid-cols-1 gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setHasExclusion(false)}
                          aria-pressed={hasExclusion === false}
                          className={`btn-senior justify-start text-left w-full ${
                            hasExclusion === false
                              ? 'bg-[#005f73] border-[#005f73] text-white'
                              : 'btn-senior-secondary'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                          <span>아니요, 해당 사항이 없습니다</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasExclusion(true)}
                          aria-pressed={hasExclusion === true}
                          className={`btn-senior justify-start text-left w-full ${
                            hasExclusion === true
                              ? 'bg-[#9a3412] border-[#9a3412] text-white'
                              : 'btn-senior-secondary'
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <span>네, 위 항목 중 해당하는 내용이 있습니다</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Result Box */}
                  {eligibilityResult && (
                    <div
                      role="status"
                      className={`p-6 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-4 ${
                        eligibilityResult.eligible
                          ? 'bg-slate-50 border-[#005f73]'
                          : 'bg-orange-50 border-[#9a3412]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {eligibilityResult.eligible ? (
                          <CheckCircle2 className="w-8 h-8 text-[#005f73] shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-[#9a3412] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`text-[18pt] font-bold ${
                              eligibilityResult.eligible
                                ? 'text-[#005f73]'
                                : 'text-[#9a3412]'
                            }`}
                          >
                            {eligibilityResult.title}
                          </p>
                          <p className="text-[15pt] text-slate-900 mt-1">
                            {eligibilityResult.desc}
                          </p>
                        </div>
                      </div>

                      {eligibilityResult.recommendedCategory && (
                        <button
                          type="button"
                          onClick={() =>
                            onSelectCategoryAndScroll(
                              eligibilityResult.recommendedCategory!
                            )
                          }
                          className="btn-senior btn-senior-primary"
                        >
                          <Search className="w-5 h-5 shrink-0" />
                          <span>추천 일자리 바로 보기</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Interactive Document Preparation Checklist */}
              {activeSubTool === 'checklist' && (
                <div className="pt-6 space-y-4">
                  <p className="text-[16pt] font-bold text-slate-950">
                    방문 접수 전, 준비하신 서류를 하나씩 눌러 표시해 보세요
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOC_CHECKLIST.map((doc) => {
                      const checked = checkedDocs.includes(doc);
                      return (
                        <button
                          key={doc}
                          type="button"
                          onClick={() => toggleDoc(doc)}
                          aria-pressed={checked}
                          className={`flex items-center gap-3 p-4 min-h-[60px] rounded-xl border-2 text-left text-[15pt] font-bold cursor-pointer transition-colors ${
                            checked
                              ? 'bg-[#005f73] border-[#005f73] text-white'
                              : 'bg-white border-slate-300 text-slate-950 hover:bg-slate-50'
                          }`}
                        >
                          {checked ? (
                            <CheckSquare className="w-6 h-6 shrink-0" />
                          ) : (
                            <Square className="w-6 h-6 shrink-0 text-slate-500" />
                          )}
                          <span>{doc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Exclusion Notice Summary */}
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
                <h3 className="text-[17pt] font-bold">신청 자격 제외자 안내</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-[14pt] text-slate-100 list-disc pl-5">
                {EXCLUSION_RULES.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Original Poster Lightbox Modal */}
      {showPosterModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="2027년 노인일자리 참여자 모집 원본 안내문"
        >
          <div className="bg-white border-2 border-slate-400 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[18pt] font-bold text-slate-950">
                모집 안내문 원본 크게 보기
              </h3>
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="btn-senior btn-senior-secondary min-w-[96px] px-4"
              >
                <X className="w-5 h-5" />
                <span>닫기</span>
              </button>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
              <img
                src="/assets/aistudio/image_4e08769e.png"
                alt="2027년 노인일자리 및 사회활동 지원사업 참여자 모집 공식 안내 포스터"
                referrerPolicy="no-referrer"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
