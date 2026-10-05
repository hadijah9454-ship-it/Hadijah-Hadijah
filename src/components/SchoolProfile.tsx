import React, { useState, useEffect } from 'react';
import { 
  Building2, Target, Compass, Award, ShieldCheck, CheckCircle2, 
  MapPin, Clock, Sparkles, ChevronRight, BookOpen, ExternalLink, FileText
} from 'lucide-react';
import { FACILITIES_LIST, PRINCIPAL_INFO, PRINCIPAL_IMAGE, SCHOOL_VISION, SCHOOL_MISSIONS } from '../data/schoolData';
import { Facility } from '../types';
import { getStoredTeacherPhotos, PHOTO_UPDATED_EVENT } from '../utils/teacherPhotoStore';

export const SchoolProfile: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility>(FACILITIES_LIST[0]);
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
    <section id="profil" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-[1px] w-8 bg-indigo-900" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
              PROFIL UPTD SDN 5 BARANDASI
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-indigo-950 tracking-tight">
            PENDIDIKAN DASAR BERKARAKTER <span className="font-bold italic text-indigo-900">& RAMAH ANAK INOVATIF</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            UPTD SDN 5 Barandasi merupakan sekolah dasar di Kecamatan Lau, Kabupaten Maros yang berkomitmen menghadirkan proses belajar mengajar berkualitas berbasis Kurikulum Merdeka (KSP) dan Profil Pelajar Pancasila.
          </p>
          
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="#akademik"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors border border-amber-500 shadow-xs"
            >
              <FileText className="w-4 h-4 text-indigo-950" />
              <span>Lihat Slide KSP Interaktif</span>
            </a>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-indigo-950 text-white rounded-sm p-8 border border-indigo-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-indigo-900 text-amber-400 rounded-sm flex items-center justify-center font-bold border border-indigo-700">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 uppercase tracking-wide">Visi UPTD SDN 5 Barandasi</h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic font-medium">
                "{SCHOOL_VISION}"
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-indigo-900 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>KSP Terakreditasi & Terdaftar di Disdik Maros</span>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-indigo-900 text-white rounded-sm flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-indigo-950 uppercase tracking-wide">Misi Satuan Pendidikan</h3>
              <ul className="space-y-3 text-slate-700 text-xs sm:text-sm">
                {SCHOOL_MISSIONS.map((misi, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-950 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{misi}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 text-xs text-slate-600 font-bold uppercase tracking-wider">
              Akreditasi B (Baik) — Dinas Pendidikan Kab. Maros
            </div>
          </div>
        </div>

        {/* Principal Welcome Section */}
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-sm grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <img
              src={effectivePrincipalPhoto}
              alt={PRINCIPAL_INFO.name}
              className="w-36 h-36 rounded-sm object-cover shadow-md border-2 border-indigo-900 mb-3"
              referrerPolicy="no-referrer"
            />
            <h4 className="text-sm font-extrabold text-indigo-950 uppercase">{PRINCIPAL_INFO.name}</h4>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">{PRINCIPAL_INFO.title}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {PRINCIPAL_INFO.nip}</p>
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-900 bg-amber-100 px-2.5 py-1 rounded-sm border border-amber-300 inline-block">
              Sambutan Kepala Sekolah
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {PRINCIPAL_INFO.greeting}
            </p>
            <blockquote className="border-l-4 border-indigo-900 pl-4 py-1 text-xs italic text-indigo-950 font-bold bg-indigo-50/50">
              {PRINCIPAL_INFO.quote}
            </blockquote>
          </div>
        </div>

        {/* Facilities Interactive Showcase */}
        <div className="space-y-8">
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-[1px] w-8 bg-indigo-900" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                SARANA & PRASARANA SEKOLAH
              </span>
            </div>
            <h3 className="text-2xl font-light text-indigo-950">
              FASILITAS <span className="font-bold italic text-indigo-900">PENDIDIKAN SD</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Lingkungan sekolah yang kondusif, aman, dan mendukung minat bakat anak.</p>
          </div>

          {/* Facility Viewer Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* List Selector */}
            <div className="lg:col-span-5 space-y-2">
              {FACILITIES_LIST.map((facility) => {
                const isSelected = selectedFacility.id === facility.id;
                return (
                  <button
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility)}
                    className={`w-full text-left p-4 rounded-sm transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-indigo-900 text-white border-indigo-900'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
                        isSelected ? 'text-amber-300' : 'text-indigo-900'
                      }`}>
                        {facility.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">{facility.name}</h4>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Selected Facility Display */}
            <div className="lg:col-span-7 bg-indigo-950 rounded-sm overflow-hidden text-white border border-indigo-900">
              <div className="relative h-64 sm:h-80 bg-slate-900">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-indigo-950 text-amber-300 border border-indigo-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                  {selectedFacility.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold uppercase text-white tracking-wide">{selectedFacility.name}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {selectedFacility.description}
                </p>

                <div className="pt-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3">
                    Keunggulan & Fitur Utama:
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedFacility.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-indigo-900/60 p-2.5 rounded-sm border border-indigo-800/80">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

