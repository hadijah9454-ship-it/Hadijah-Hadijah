import React, { useState } from 'react';
import { 
  Trophy, Award, Users, Calendar, ShieldCheck, Sparkles, 
  Search, CheckCircle2, ChevronRight, Star 
} from 'lucide-react';
import { EXTRACURRICULARS_LIST, ACHIEVEMENTS_LIST } from '../data/schoolData';

export const Extracurriculars: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Sains & Teknologi', 'Olahraga', 'Seni & Budaya', 'Kepemimpinan'];

  const filteredClubs = EXTRACURRICULARS_LIST.filter(club => 
    selectedCategory === 'Semua' || club.category === selectedCategory
  );

  return (
    <section id="ekstra" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-[1px] w-8 bg-indigo-900" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
              MINAT & BAKAT SISWA
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-indigo-950 tracking-tight">
            EKSTRAKURIKULER & <span className="font-bold italic text-indigo-900">PRESTASI GEMILANG</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Wadahi potensi diri melalui lebih dari 15 klub kegiatan minat bakat berprestasi hingga kancah internasional.
          </p>
        </div>

        {/* Achievements Showcase */}
        <div className="bg-amber-400 text-indigo-950 rounded-sm p-6 sm:p-8 border border-amber-500">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] mb-4 text-indigo-950">
            <Sparkles className="w-4 h-4 text-indigo-950" />
            <span>SOROTAN PRESTASI TERBARU 2025/2026</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACHIEVEMENTS_LIST.map((ach) => (
              <div key={ach.id} className="bg-white rounded-sm p-4 border border-amber-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-indigo-950 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                      {ach.level}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{ach.year}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-indigo-950 uppercase tracking-wide leading-snug">{ach.title}</h4>
                  <p className="text-xs text-indigo-900 font-semibold mt-1">{ach.competition}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                  Peraih: <span className="font-bold text-indigo-950">{ach.studentName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extracurricular Clubs */}
        <div className="space-y-8">
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-light text-indigo-950">
                DAFTAR <span className="font-bold italic text-indigo-900">KLUB EKSTRAKURIKULER</span>
              </h3>
              <p className="text-slate-600 text-xs mt-0.5">Pilih bidang minat yang ingin kamu kembangkan.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-indigo-900 text-amber-300 border-indigo-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-sm border border-slate-200 overflow-hidden hover:border-indigo-900 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-indigo-950 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border border-indigo-800">
                    {club.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white text-indigo-950 text-[11px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 border border-slate-200">
                    <Users className="w-3 h-3 text-indigo-900" />
                    <span>{club.membersCount} Anggota</span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold uppercase tracking-wider text-indigo-950">{club.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{club.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-indigo-900 shrink-0" />
                      <span>{club.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Pembina: {club.coach}</span>
                    </div>
                  </div>

                  {club.achievements.length > 0 && (
                    <div className="bg-amber-50 p-2.5 rounded-sm border border-amber-200 text-[11px] text-amber-950 font-semibold space-y-1">
                      <span className="font-bold block text-[10px] text-amber-900 uppercase tracking-widest">Prestasi Utama:</span>
                      {club.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
