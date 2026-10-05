import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MapPin, Search, Menu, X, Sparkles, UserCheck, 
  GraduationCap, Calendar, Award, PhoneCall, ChevronRight, HelpCircle,
  BellRing
} from 'lucide-react';
import { getAllMonthlyWarnings, WARNINGS_UPDATED_EVENT } from '../utils/attendanceWarningStore';
import { getSupervisorSummary, SUPERVISOR_UPDATED_EVENT } from '../utils/supervisorStore';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  onOpenPpdbModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [warningCount, setWarningCount] = useState<number>(() => {
    try {
      return getAllMonthlyWarnings().length;
    } catch {
      return 0;
    }
  });

  const [uncheckedGtkCount, setUncheckedGtkCount] = useState<number>(() => {
    try {
      return getSupervisorSummary().totalBelumAbsen;
    } catch {
      return 5;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setWarningCount(getAllMonthlyWarnings().length);
      } catch {
        // ignore
      }
    };
    window.addEventListener(WARNINGS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(WARNINGS_UPDATED_EVENT, handleUpdate);
  }, []);

  useEffect(() => {
    const handleSupervisorUpdate = () => {
      try {
        setUncheckedGtkCount(getSupervisorSummary().totalBelumAbsen);
      } catch {
        // ignore
      }
    };
    window.addEventListener(SUPERVISOR_UPDATED_EVENT, handleSupervisorUpdate);
    return () => window.removeEventListener(SUPERVISOR_UPDATED_EVENT, handleSupervisorUpdate);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'pengawas', label: 'Pengawas Bina' },
    { id: 'absensi-guru', label: 'SIMAK Guru' },
    { id: 'absensi', label: 'Absensi Siswa' },
    { id: 'akademik', label: 'Akademik' },
    { id: 'ksp', label: 'Slide KSP' },
    { id: 'rapor', label: 'Literasi & Rapor' },
    { id: 'berita', label: 'Berita' },
    { id: 'ekstra', label: 'Ekstrakurikuler' },
    { id: 'guru', label: 'Guru & Staf' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Bar Announcement & Contacts */}
      <div className="bg-indigo-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-indigo-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Running Announcement */}
          <div className="flex items-center gap-3 overflow-hidden w-full md:w-auto">
            <span className="bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider text-[10px] shrink-0">
              SPMB 2026
            </span>
            <p className="truncate text-slate-200 text-[11px] font-medium tracking-wide">
              Pendaftaran SPMB 2026 UPTD SDN 5 Barandasi via Pusdatin Maros Resmi Dibuka
            </p>
          </div>

          {/* Contact & AI Button */}
          <div className="flex items-center gap-4 text-slate-300 shrink-0 text-[11px] uppercase tracking-wider font-semibold">
            <a href="tel:081234567890" className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Maros, Sulawesi Selatan</span>
            </a>
            <a href="https://spmb2026.pusdatinmaros.id/dashboard" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-1.5 text-amber-300 hover:underline">
              <span>spmb2026.pusdatinmaros.id</span>
            </a>
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-indigo-900 hover:bg-indigo-800 text-amber-300 px-3 py-1 rounded-sm font-bold transition-all border border-indigo-700 cursor-pointer text-[11px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>TANYA AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick('beranda')}
        >
          <div className="w-10 h-10 bg-indigo-900 flex items-center justify-center rounded-sm text-white shadow-sm transition-transform group-hover:scale-105 border border-indigo-800">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-indigo-950 tracking-tight uppercase">
                UPTD SDN 5 BARANDASI
              </h1>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-emerald-300 uppercase tracking-wider">
                AKREDITASI B
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Kec. Lau, Kab. Maros, Sulawesi Selatan</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 transition-all cursor-pointer relative flex items-center gap-1 ${
                  isActive
                    ? 'text-indigo-900 border-b-2 border-indigo-900 font-bold'
                    : 'text-slate-500 hover:text-indigo-900'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'absensi' && warningCount > 0 && (
                  <span 
                    title={`${warningCount} siswa tingkat kehadiran di bawah 80%`}
                    className="inline-flex items-center justify-center bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full animate-pulse shadow-2xs"
                  >
                    {warningCount}
                  </span>
                )}
                {item.id === 'pengawas' && uncheckedGtkCount > 0 && (
                  <span 
                    title={`${uncheckedGtkCount} guru belum presensi melewati batas toleransi`}
                    className="inline-flex items-center justify-center bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full animate-pulse shadow-2xs"
                  >
                    {uncheckedGtkCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="https://spmb2026.pusdatinmaros.id/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 px-4 py-2 rounded-sm text-xs uppercase font-extrabold tracking-wider transition-colors cursor-pointer border border-amber-500 shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-indigo-950" />
            <span>PORTAL SPMB MAROS</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="mb-3 pt-2">
            <button
              onClick={onOpenAiAssistant}
              className="w-full flex items-center justify-center gap-2 bg-indigo-950 text-amber-300 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest border border-indigo-800"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tanya AI Sekolah</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between text-left px-3 py-2.5 rounded-sm text-xs uppercase font-bold tracking-wider cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-indigo-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.id === 'absensi' && warningCount > 0 && (
                    <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      {warningCount}
                    </span>
                  )}
                  {item.id === 'pengawas' && uncheckedGtkCount > 0 && (
                    <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      {uncheckedGtkCount}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
