import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PrincipalGreeting } from './components/PrincipalGreeting';
import { NewsAnnouncements } from './components/NewsAnnouncements';
import { SchoolProfile } from './components/SchoolProfile';
import { AcademicSection } from './components/AcademicSection';
import { Extracurriculars } from './components/Extracurriculars';
import { TeachersDirectory } from './components/TeachersDirectory';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Footer } from './components/Footer';
import { KspSlidePresentation } from './components/KspSlidePresentation';
import { GovPortalsAndRaporSection } from './components/GovPortalsAndRaporSection';
import { StudentAttendanceModule } from './components/StudentAttendanceModule';
import { TeacherAttendanceModule } from './components/TeacherAttendanceModule';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { FileText, ExternalLink, ArrowLeft, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 relative">
      
      {/* Viewport Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 z-50 transition-all duration-75 ease-out shadow-xs pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <>
            <HeroSection
              onNavigate={handleNavigate}
              onOpenAi={() => setIsAiModalOpen(true)}
            />
            <PrincipalGreeting />
            <NewsAnnouncements />
            <SchoolProfile />
            <AcademicSection />
            <TeacherAttendanceModule onNavigateToSupervisor={() => handleNavigate('pengawas')} />
            <StudentAttendanceModule />
            <GovPortalsAndRaporSection />
            <Extracurriculars />
            <TeachersDirectory />
            <GallerySection />
            <ContactSection />
          </>
        )}

        {activeTab === 'profil' && (
          <>
            <SchoolProfile />
            <PrincipalGreeting />
          </>
        )}

        {activeTab === 'rapor' && <GovPortalsAndRaporSection />}

        {activeTab === 'pengawas' && <SupervisorDashboard />}

        {activeTab === 'absensi-guru' && (
          <TeacherAttendanceModule onNavigateToSupervisor={() => handleNavigate('pengawas')} />
        )}

        {activeTab === 'absensi' && <StudentAttendanceModule />}

        {activeTab === 'akademik' && <AcademicSection />}

        {activeTab === 'ksp' && (
          <div className="py-10 bg-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
              {/* Back to Home & Breadcrumbs */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleNavigate('beranda')}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-950 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-sm border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>KEMBALI KE BERANDA</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-1.5 bg-indigo-950 hover:bg-indigo-900 text-white px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tanya AI KSP</span>
                  </button>
                </div>
              </div>

              {/* Title Banner */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-[1px] w-8 bg-indigo-900" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                    DOKUMEN KURIKULUM OPERASIONAL (KSP)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-950 tracking-tight uppercase">
                  SLIDE PRESENTASI RESMI UPTD SDN 5 BARANDASI
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-4xl leading-relaxed">
                  Tahun Ajaran 2026/2027 • Kecamatan Lau, Kabupaten Maros. Presentasi kurikulum resmi untuk Kepala Sekolah, Pengawas Pembina, Tim Pengembang Kurikulum, Dewan Guru, dan Komite Sekolah.
                </p>
              </div>

              {/* Slide Deck Component */}
              <KspSlidePresentation isStandalonePage={true} />

              {/* Key Documentation Highlights Summary */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider block">Landasan Regulasi</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">Permendikdasmen No. 6/2026</p>
                  <p className="text-[11px] text-slate-500 mt-1">Budaya Sekolah Aman dan Nyaman (BSAN) tanpa kekerasan.</p>
                </div>
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider block">Fokus Pembelajaran</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">Deep Learning Adaptif</p>
                  <p className="text-[11px] text-slate-500 mt-1">Pemulihan fondasi literasi & numerasi yang bermakna.</p>
                </div>
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider block">Karakter Ekologis</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">Gerakan Adiwiyata Maros</p>
                  <p className="text-[11px] text-slate-500 mt-1">Konservasi lingkungan dan pengelolaan sampah terpadu.</p>
                </div>
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider block">Kesehatan & Ketahanan</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">GSS, 7 KAIH, MBG & IKAN</p>
                  <p className="text-[11px] text-slate-500 mt-1">Makan bergizi seimbang dan kurikulum anti-narkoba.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'berita' && <NewsAnnouncements />}

        {activeTab === 'ekstra' && <Extracurriculars />}

        {activeTab === 'guru' && <TeachersDirectory />}

        {activeTab === 'galeri' && <GallerySection />}

        {activeTab === 'kontak' && <ContactSection />}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
      />

    </div>
  );
}
