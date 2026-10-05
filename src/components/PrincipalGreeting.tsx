import React, { useState, useEffect } from 'react';
import { Quote, CheckCircle, Award, Sparkles, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { PRINCIPAL_IMAGE, PRINCIPAL_INFO } from '../data/schoolData';
import { getStoredTeacherPhotos, PHOTO_UPDATED_EVENT } from '../utils/teacherPhotoStore';

export const PrincipalGreeting: React.FC = () => {
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    setCustomPhotos(getStoredTeacherPhotos());
    const handler = () => {
      setCustomPhotos(getStoredTeacherPhotos());
    };
    window.addEventListener(PHOTO_UPDATED_EVENT, handler);
    return () => window.removeEventListener(PHOTO_UPDATED_EVENT, handler);
  }, []);

  const effectivePrincipalPhoto = customPhotos['t1'] || PRINCIPAL_IMAGE;

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="border border-slate-200 rounded-sm p-6 sm:p-10 bg-slate-50 relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Principal Photo */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative border-2 border-indigo-900 p-1.5 bg-white rounded-sm">
                <img
                  src={effectivePrincipalPhoto}
                  alt={PRINCIPAL_INFO.name}
                  className="w-60 h-60 sm:w-64 sm:h-64 object-cover rounded-sm shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-bold text-indigo-950 uppercase tracking-tight">{PRINCIPAL_INFO.name}</h3>
                <p className="text-xs text-indigo-900 font-bold uppercase tracking-wider">{PRINCIPAL_INFO.title}</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP. {PRINCIPAL_INFO.nip}</p>
                
                <div className="pt-2">
                  <a
                    href="#akademik"
                    className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-900 hover:text-indigo-950 bg-amber-300 hover:bg-amber-400 px-3 py-1.5 rounded-sm border border-amber-400 transition-colors uppercase tracking-wider"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Slide KSP Sekolah</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Principal Content */}
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="flex items-center space-x-3">
                <div className="h-[1px] w-8 bg-indigo-900" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                  SAMBUTAN KEPALA SEKOLAH
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-light text-indigo-950 leading-snug">
                "Menyiapkan Pemimpin Masa Depan <span className="font-bold italic text-indigo-900">Berlandaskan Imtaq & Iptek</span>"
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {PRINCIPAL_INFO.greeting}
              </p>

              {/* Highlight Quote Box */}
              <div className="bg-white border-l-4 border-indigo-900 border-y border-r border-slate-200 p-4 rounded-sm italic text-slate-800 text-sm font-medium">
                {PRINCIPAL_INFO.quote}
              </div>

              {/* Key Pillars */}
              <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                {PRINCIPAL_INFO.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-white p-3 rounded-sm border border-slate-200 uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-indigo-900 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
