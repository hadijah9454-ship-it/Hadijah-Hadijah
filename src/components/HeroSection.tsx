import React from 'react';
import { 
  GraduationCap, Award, Users, TrendingUp, Sparkles, UserCheck, 
  BookOpen, Calendar, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, ExternalLink, FileText
} from 'lucide-react';
import { HERO_CAMPUS_IMAGE, SCHOOL_STATS, SPMB_PORTAL_URL, PRINCIPAL_INFO } from '../data/schoolData';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenPpdb?: () => void;
  onOpenAi: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenPpdb,
  onOpenAi
}) => {
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        
        {/* Left Hero Panel: Geometric Narrative */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-6 flex items-center space-x-3">
            <div className="h-[1px] w-12 bg-indigo-900" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
              UPTD SDN 5 BARANDASI — KAB. MAROS
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-indigo-950 leading-[1.05] mb-6">
            MENDIDIK DENGAN <br />
            <span className="font-extrabold italic text-indigo-900">AKHLAK & KARAKTER</span> <br />
            PROFIL PELAJAR PANCASILA
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed mb-8">
            Selamat datang di portal resmi UPTD SDN 5 Barandasi, Kecamatan Lau, Kabupaten Maros. Kami menyelenggarakan Kurikulum Merdeka yang inovatif, ramah anak, dan berbudaya lokal. Pendaftaran peserta didik baru kini beralih menjadi <strong>SPMB (Sistem Penerimaan Murid Baru) 2026</strong> via Pusdatin Maros.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a
              href={SPMB_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-400 text-indigo-950 border border-amber-500 px-5 py-3 rounded-sm font-extrabold uppercase tracking-wider text-xs hover:bg-amber-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-indigo-950" />
              <span>DAFTAR SPMB 2026</span>
            </a>

            <button
              onClick={() => onNavigate('ksp')}
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-5 py-3 rounded-sm font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs border border-indigo-700"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>SLIDE DOKUMEN KSP</span>
            </button>

            <button
              onClick={() => onNavigate('absensi')}
              className="bg-white hover:bg-slate-100 text-indigo-950 px-4 py-3 rounded-sm font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs border border-slate-300"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>ABSENSI SISWA</span>
            </button>

            <button
              onClick={onOpenAi}
              className="bg-indigo-950 text-amber-300 px-4 py-3 rounded-sm font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-indigo-900 transition-colors cursor-pointer border border-indigo-800"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>TANYA AI</span>
            </button>
          </div>

          <div className="flex flex-wrap space-x-6 sm:space-x-10 pt-4 border-t border-slate-200">
            <div>
              <div className="text-xl sm:text-2xl font-black text-indigo-900">280+</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mt-1 font-bold">Siswa Aktif SD</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-indigo-900">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mt-1 font-bold">Kelulusan SD ke SMP</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-indigo-900">AKREDITASI B</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mt-1 font-bold">Kurikulum Merdeka</div>
            </div>
          </div>
        </div>

        {/* Right Geometric Grid Panel */}
        <div className="w-full lg:w-5/12 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 grid grid-cols-2 grid-rows-3">
          
          {/* Grid Item 1: Announcement */}
          <div className="col-span-2 border-b border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-wider rounded-sm">
                  Pengumuman SPMB 2026
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">T.A. 2026/2027</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4 leading-snug">
                Pendaftaran SPMB — Akses pendaftaran online murid baru kini via Portal Pusdatin Maros.
              </h3>
            </div>
            <a
              href={SPMB_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 flex items-center mt-6 group cursor-pointer"
            >
              <span>Akses Portal Pusdatin Maros</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-amber-500" />
            </a>
          </div>

          {/* Grid Item 2: Admissions Quote */}
          <div className="bg-indigo-950 p-6 sm:p-8 flex flex-col justify-center text-white border-r border-indigo-900">
            <p className="text-xs sm:text-sm italic opacity-90 mb-4 leading-relaxed">
              "Pendidikan dasar adalah pondasi awal pembentukan budi pekerti, akhlak mulia, dan semangat belajar anak."
            </p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              — {PRINCIPAL_INFO.name} (Kepala Sekolah)
            </span>
          </div>

          {/* Grid Item 3: Upcoming Event / KSP */}
          <div className="border-b border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-indigo-900 font-extrabold text-xs mb-1 tracking-wider uppercase">KURIKULUM OPERASIONAL</div>
              <p className="text-xs font-semibold text-slate-800">Slide Kurikulum Satuan Pendidikan (KSP)</p>
            </div>
            <button
              onClick={() => onNavigate('ksp')}
              className="text-[10px] uppercase tracking-wider text-amber-600 font-extrabold mt-3 hover:underline flex items-center gap-1 cursor-pointer text-left"
            >
              <span>Buka Slide Presentasi KSP</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid Item 4: Geometric Badge / Visual */}
          <div className="bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden border-r border-slate-200">
            <div className="absolute -bottom-4 -right-4 w-28 h-28 border-8 border-white opacity-60 rotate-12" />
            <div className="w-12 h-12 bg-indigo-900 rounded-sm flex items-center justify-center text-white shadow-md border border-indigo-800">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
          </div>

          {/* Grid Item 5: Virtual Tour & Gallery */}
          <div className="p-6 sm:p-8 flex items-center justify-between hover:bg-slate-50 cursor-pointer" onClick={() => onNavigate('galeri')}>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block">Galeri Kegiatan Sekolah</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Foto & Lingkungan Belajar</span>
            </div>
            <div className="w-8 h-8 rounded-sm border border-slate-300 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-indigo-900" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
