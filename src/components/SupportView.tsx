import React, { useState } from 'react';
import {
  PhoneCall,
  BookOpen,
  CheckCircle2,
  CalendarClock,
  GraduationCap,
} from 'lucide-react';
import { SUPPORT_GUIDES } from '../data/jobs';
import { ConsultationRequest } from '../types/job';

interface SupportViewProps {
  consultations: ConsultationRequest[];
  onSubmitConsultation: (req: Omit<ConsultationRequest, 'id' | 'createdAt'>) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  consultations,
  onSubmitConsultation,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('오전 10시 ~ 12시');
  const [topic, setTopic] = useState('나에게 맞는 사업단 추천');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('성함을 입력해 주세요.');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 9) {
      setErrorMsg('전화 받으실 연락처를 정확히 입력해 주세요.');
      return;
    }
    setErrorMsg('');
    onSubmitConsultation({
      name: name.trim(),
      phone: phone.trim(),
      preferredTime,
      topic,
    });
    setName('');
    setPhone('');
    setSubmitted(true);
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-12">
      <div>
        <h1 className="text-[24pt] sm:text-[28pt] font-bold text-slate-950">
          일자리 참여 안내 및 전화 상담
        </h1>
        <p className="senior-prose text-slate-700 hc-muted mt-2 max-w-3xl">
          인터넷 사용이나 서류 준비가 낯설어도 걱정하지 마세요. 사업단 안내부터
          1:1 전화 상담까지 친절히 도와드립니다.
        </p>
      </div>

      {/* Editorial Support Guides with generated images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SUPPORT_GUIDES.map((guide, index) => {
          const imgFailed = failedImages[guide.id];
          return (
            <article
              key={guide.id}
              className="bg-white border-2 border-slate-300 hc-card rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 border-b border-slate-300 overflow-hidden">
                {!imgFailed ? (
                  <img
                    src={guide.image}
                    alt={guide.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [guide.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-100">
                    {index === 0 ? (
                      <GraduationCap className="w-12 h-12 text-[#0b3b8c] mb-2" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-[#0b3b8c] mb-2" />
                    )}
                    <p className="text-[16pt] font-bold text-slate-900">
                      {guide.title}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-[13pt] font-bold text-[#0b3b8c] mb-1">
                    0{index + 1}. 취업 도움말
                  </p>
                  <h2 className="text-[20pt] font-bold text-slate-950 leading-[1.35] mb-3">
                    {guide.title}
                  </h2>
                  <p className="senior-prose text-slate-800 hc-muted mb-5">
                    {guide.subtitle}
                  </p>
                  <ul className="space-y-2.5 border-t border-slate-200 pt-4">
                    {guide.points.map((pt, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-[15pt] text-slate-900 leading-relaxed"
                      >
                        <CheckCircle2 className="w-6 h-6 text-[#005f73] shrink-0 mt-1" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 1:1 Free Phone Consultation Request Form */}
      <div className="bg-white border-2 border-slate-300 hc-card rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 text-[14pt] font-bold text-[#0b3b8c] mb-2">
              <PhoneCall className="w-5 h-5" />
              <span>무료 전화 상담 예약</span>
            </p>
            <h2 className="text-[22pt] font-bold text-slate-950 leading-[1.35] mb-3">
              전문 상담사가 직접 전화로 안내해 드립니다
            </h2>
            <p className="senior-prose text-slate-800 hc-muted mb-5">
              성함과 연락처를 남겨주시면 원하시는 시간대에 맞추어 전담
              상담사가 전화를 드려 일자리 추천과 지원을 도와드립니다.
            </p>

            {consultations.length > 0 && (
              <div className="border-t border-slate-300 pt-4 space-y-2">
                <p className="text-[14pt] font-bold text-slate-900 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-[#005f73]" />
                  <span>최근 신청된 상담 예약 ({consultations.length}건)</span>
                </p>
                {consultations.slice(0, 3).map((item) => (
                  <p
                    key={item.id}
                    className="text-[14pt] text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5"
                  >
                    {item.name}님 · {item.preferredTime} · {item.topic} (접수
                    완료)
                  </p>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            {submitted && (
              <div
                role="status"
                className="p-4 rounded-xl bg-slate-50 border-2 border-[#005f73] text-[#005f73] flex items-center gap-3 text-[15pt] font-bold"
              >
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>
                  전화 상담 예약이 정상적으로 접수되었습니다. 희망 시간에 연락
                  드리겠습니다.
                </span>
              </div>
            )}

            {errorMsg && (
              <p
                role="alert"
                className="p-4 rounded-xl bg-orange-50 border-2 border-[#9a3412] text-[#9a3412] text-[15pt] font-bold"
              >
                {errorMsg}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="consult-name"
                  className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                >
                  성함 (필수)
                </label>
                <input
                  id="consult-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 이순자"
                  className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="consult-phone"
                  className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                >
                  전화번호 (필수)
                </label>
                <input
                  id="consult-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="예: 010-5555-1234"
                  className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] font-num text-slate-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="consult-time"
                  className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                >
                  전화 받기 편한 시간
                </label>
                <select
                  id="consult-time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 bg-white cursor-pointer"
                >
                  <option value="오전 10시 ~ 12시">오전 10시 ~ 12시</option>
                  <option value="오후 1시 ~ 3시">오후 1시 ~ 3시</option>
                  <option value="오후 3시 ~ 5시">오후 3시 ~ 5시</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="consult-topic"
                  className="block text-[15pt] font-bold text-slate-900 mb-1.5"
                >
                  상담 받고 싶은 내용
                </label>
                <select
                  id="consult-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full min-h-[56px] px-4 py-3 border-2 border-slate-400 rounded-xl text-[16pt] text-slate-950 bg-white cursor-pointer"
                >
                  <option value="나에게 맞는 사업단 추천">
                    나에게 맞는 사업단 추천
                  </option>
                  <option value="방문 접수 및 준비 서류 안내">
                    방문 접수 및 준비 서류 안내
                  </option>
                  <option value="간편 이력서 작성 도움">
                    간편 이력서 작성 도움
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-senior btn-senior-primary">
                <PhoneCall className="w-5 h-5" />
                <span>무료 전화 상담 신청하기</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
