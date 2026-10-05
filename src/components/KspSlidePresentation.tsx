import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Maximize2, Minimize2, 
  BookOpen, Building2, Target, Compass, Award, Layers, Sparkles, 
  Atom, ShieldCheck, Heart, Users, CheckCircle2, FileText, ExternalLink, 
  Grid, Info, Printer, Download, Share2, Flag, GraduationCap
} from 'lucide-react';
import { KSP_SLIDES } from '../data/kspSlideData';
import { KspSlide } from '../types';

interface KspSlidePresentationProps {
  initialSlideIndex?: number;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const KspSlidePresentation: React.FC<KspSlidePresentationProps> = ({
  initialSlideIndex = 0,
  onClose,
  isStandalonePage = false
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showThumbnailDrawer, setShowThumbnailDrawer] = useState<boolean>(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  
  const presentationContainerRef = useRef<HTMLDivElement>(null);
  const currentSlide: KspSlide = KSP_SLIDES[currentSlideIndex];

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % KSP_SLIDES.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentSlideIndex]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const goToNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < KSP_SLIDES.length - 1 ? prev + 1 : 0));
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : KSP_SLIDES.length - 1));
  };

  const handleToggleFullscreen = () => {
    if (!presentationContainerRef.current) return;

    if (!document.fullscreenElement) {
      presentationContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleCopyShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCategoryIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-amber-400 shrink-0" };
    switch (iconName) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Atom': return <Atom {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Users': return <Users {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <GraduationCap {...props} />;
    }
  };

  return (
    <div 
      ref={presentationContainerRef}
      className={`relative flex flex-col bg-slate-900 text-slate-100 rounded-sm border border-slate-700 shadow-xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'w-full my-8'
      }`}
    >
      {/* Presentation Top Navigation Bar */}
      <div className="bg-indigo-950 px-4 sm:px-6 py-3 border-b border-indigo-900 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Branding & Slide Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-indigo-900 border border-indigo-700 flex items-center justify-center text-amber-400 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                SLIDE PRESENTASI KSP
              </span>
              <span className="bg-amber-400 text-indigo-950 font-bold px-1.5 py-0.2 rounded-xs text-[10px] uppercase tracking-wider">
                T.A. 2026/2027
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              UPTD SDN 5 Barandasi • Kecamatan Lau, Kabupaten Maros
            </p>
          </div>
        </div>

        {/* Center: Slide Quick Navigation Chips */}
        <div className="hidden lg:flex items-center gap-1.5 bg-indigo-900/60 p-1 rounded-sm border border-indigo-800/80">
          <button
            onClick={() => setShowThumbnailDrawer(!showThumbnailDrawer)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              showThumbnailDrawer ? 'bg-amber-400 text-indigo-950' : 'text-slate-300 hover:text-white'
            }`}
            title="Daftar Semua Slide"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Indeks Slide ({currentSlideIndex + 1}/{KSP_SLIDES.length})</span>
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              isPlaying ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
            title={isPlaying ? "Hentikan Pemutaran Otomatis" : "Putar Slide Otomatis"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Putar Aktif' : 'Auto Play'}</span>
          </button>

          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              showSpeakerNotes ? 'bg-indigo-700 text-amber-300' : 'text-slate-300 hover:text-white'
            }`}
            title="Tampilkan Catatan Penjelasan Presenter"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Catatan Narasi</span>
          </button>
        </div>

        {/* Right: Actions (Fullscreen, Print, Share) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShare}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-indigo-900 rounded-sm transition-colors cursor-pointer"
            title="Salin Tautan Presentasi"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="hidden md:flex p-1.5 text-slate-300 hover:text-white hover:bg-indigo-900 rounded-sm transition-colors cursor-pointer"
            title="Cetak Slide (Print)"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-indigo-950 px-2.5 py-1.5 rounded-sm text-xs font-extrabold transition-colors cursor-pointer"
            title={isFullscreen ? "Keluar Layar Penuh" : "Tampilan Layar Penuh Proyektor"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-sm text-xs font-bold cursor-pointer"
            >
              Tutup
            </button>
          )}
        </div>
      </div>

      {/* Copied Link Toast */}
      {copiedLink && (
        <div className="absolute top-14 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-md transition-all">
          Tautan slide KSP berhasil disalin!
        </div>
      )}

      {/* Main Slide Canvas */}
      <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-[540px] md:min-h-[580px] bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 overflow-y-auto">
        
        {/* Slide Header: Badge, Category, Number */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {renderCategoryIcon(currentSlide.iconName)}
            <span className="bg-indigo-900 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-widest border border-indigo-700">
              {currentSlide.badge}
            </span>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider hidden sm:inline">
              • {currentSlide.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
              {currentSlide.slideNumber}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              {KSP_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    idx === currentSlideIndex 
                      ? 'w-6 bg-amber-400' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide Body: Title, Subtitle, Lead & Dynamic Visual Content */}
        <div className="my-auto py-6 space-y-6">
          
          {/* Titles */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-amber-300/90 text-sm sm:text-base font-semibold tracking-wide">
              {currentSlide.subtitle}
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl pt-1">
              {currentSlide.lead}
            </p>
          </div>

          {/* Special Visual Quote / Statement (e.g. Visi Satuan Pendidikan) */}
          {currentSlide.quoteOrHighlight && (
            <div className="p-4 sm:p-5 rounded-sm bg-indigo-900/40 border-l-4 border-amber-400 shadow-inner">
              <p className="text-sm sm:text-base text-amber-200 font-medium italic leading-relaxed">
                {currentSlide.quoteOrHighlight}
              </p>
            </div>
          )}

          {/* Metrics Row (if present) */}
          {currentSlide.metrics && currentSlide.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentSlide.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-800/80 p-3.5 rounded-sm border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    {m.label}
                  </span>
                  <div className="text-base sm:text-lg font-extrabold text-amber-300 mt-0.5">
                    {m.value}
                  </div>
                  {m.desc && (
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {m.desc}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Structured Table View (for Fase A, B, C or specific data) */}
          {currentSlide.tableData && (
            <div className="overflow-x-auto border border-slate-700 rounded-sm bg-slate-900/90">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-indigo-950 text-amber-300 uppercase font-bold tracking-wider text-[10px] sm:text-[11px]">
                    {currentSlide.tableData.headers.map((h, hIdx) => (
                      <th key={hIdx} className="py-2.5 px-3.5 border-b border-indigo-900">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {currentSlide.tableData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-indigo-900/20 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-2.5 px-3.5 ${cIdx === 0 ? 'font-bold text-white' : 'text-slate-300'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Key Points Grid */}
          {currentSlide.keyPoints && currentSlide.keyPoints.length > 0 && (
            <div className={`grid gap-3 ${
              currentSlide.keyPoints.length <= 2 
                ? 'grid-cols-1 md:grid-cols-2' 
                : currentSlide.keyPoints.length <= 4 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
                : currentSlide.keyPoints.length <= 7 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {currentSlide.keyPoints.map((point, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-sm border transition-all ${
                    point.highlight
                      ? 'bg-indigo-900/40 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-slate-800/70 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {point.title}
                    </h4>
                    {point.tag && (
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-xs shrink-0 tracking-wider ${
                        point.highlight 
                          ? 'bg-amber-400 text-indigo-950' 
                          : 'bg-indigo-950 text-amber-300 border border-indigo-800'
                      }`}>
                        {point.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Slide Footer: Bottom Controls & Navigation */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-widest text-[10px]">
              UPTD SDN 5 BARANDASI
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline">Kurikulum Merdeka 2026/2027</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline">Kec. Lau, Kab. Maros</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={goToPrevSlide}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-sm text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              title="Slide Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-mono font-bold text-amber-300 px-2 sm:hidden">
              {currentSlide.slideNumber}
            </span>

            <button
              onClick={goToNextSlide}
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-indigo-950 px-4 py-2 rounded-sm text-xs font-extrabold transition-colors cursor-pointer shadow-sm"
              title="Slide Berikutnya (Panah Kanan / Spasi)"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Speaker Notes Drawer (Collapsible) */}
      {showSpeakerNotes && currentSlide.speakerNotes && (
        <div className="bg-indigo-950/95 border-t border-indigo-800 p-4 sm:p-5 text-xs text-slate-200 animate-in slide-in-from-bottom duration-200 flex flex-col sm:flex-row items-start gap-3">
          <div className="bg-amber-400 text-indigo-950 font-bold px-2 py-0.5 rounded-xs text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>CATATAN PEMBINA / PRESENTER</span>
          </div>
          <p className="flex-1 text-slate-300 leading-relaxed italic">
            "{currentSlide.speakerNotes}"
          </p>
          <button
            onClick={() => setShowSpeakerNotes(false)}
            className="text-[10px] text-slate-400 hover:text-white uppercase font-bold shrink-0 self-end sm:self-center"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Thumbnails Drawer (Collapsible) */}
      {showThumbnailDrawer && (
        <div className="bg-slate-950/95 border-t border-slate-800 p-4 max-h-64 overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" />
              <span>DAFTAR SLIDE KSP (KLIK UNTUK PINDAH LANGSUNG)</span>
            </span>
            <button
              onClick={() => setShowThumbnailDrawer(false)}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              ✕ Tutup
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {KSP_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setShowThumbnailDrawer(false);
                }}
                className={`text-left p-2.5 rounded-sm border transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'bg-indigo-900 border-amber-400 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 font-bold mb-1">
                  <span>{slide.slideNumber}</span>
                  <span className="truncate max-w-[80px] text-slate-400">{slide.badge}</span>
                </div>
                <h5 className="text-[11px] font-bold leading-tight line-clamp-2">
                  {slide.title}
                </h5>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slide Navigation Help Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-900">
        <div className="flex items-center gap-3">
          <span>Tip: Gunakan tombol keyboard <strong>← / →</strong> atau <strong>Spasi</strong> untuk berpindah slide.</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span>Fokus: {currentSlide.category}</span>
        </div>
      </div>

    </div>
  );
};
