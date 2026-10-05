import React, { useState } from 'react';
import { 
  BarChart3, UserCheck, BookOpen, GraduationCap, FileCheck2, Home, 
  ExternalLink, Copy, Check, TrendingDown, Sparkles, ArrowUpRight, 
  Lightbulb, Languages, Bookmark, Library, Layers, Smile, BookCheck,
  Search, Compass, Laptop, Info
} from 'lucide-react';
import { 
  OFFICIAL_GOV_PORTALS, 
  DIGITAL_LITERACY_PORTALS,
  RAPOR_PENDIDIKAN_2025_INFO, 
  RAPOR_PENDIDIKAN_URL 
} from '../data/schoolData';
import { GovPortal, DigitalLiteracyPortal } from '../types';

export const GovPortalsAndRaporSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeGovFilter, setActiveGovFilter] = useState<'semua' | 'guru' | 'publik'>('semua');
  const [activeLiteracyCategory, setActiveLiteracyCategory] = useState<string>('semua');
  const [searchLiteracy, setSearchLiteracy] = useState<string>('');

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getGovPortalIcon = (iconName: string) => {
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-indigo-900" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-indigo-900" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-900" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-900" />;
      case 'FileCheck2':
        return <FileCheck2 className="w-5 h-5 text-indigo-900" />;
      case 'Home':
        return <Home className="w-5 h-5 text-indigo-900" />;
      default:
        return <ExternalLink className="w-5 h-5 text-indigo-900" />;
    }
  };

  const getLiteracyIcon = (id: string) => {
    switch (id) {
      case 'sibi':
        return <BookOpen className="w-6 h-6 text-indigo-950" />;
      case 'penjaring':
        return <Languages className="w-6 h-6 text-amber-950" />;
      case 'lets-read':
        return <Library className="w-6 h-6 text-emerald-950" />;
      case 'literacy-cloud':
        return <Layers className="w-6 h-6 text-sky-950" />;
      case 'bacapibo':
        return <Smile className="w-6 h-6 text-rose-950" />;
      default:
        return <BookCheck className="w-6 h-6 text-indigo-950" />;
    }
  };

  const filteredGovPortals = OFFICIAL_GOV_PORTALS.filter((p) => {
    if (activeGovFilter === 'guru') return p.targetUser === 'Guru & Tendik' || p.targetUser === 'ASN / PNS / PPPK';
    if (activeGovFilter === 'publik') return p.targetUser === 'Umum & Orang Tua';
    return true;
  });

  const filteredLiteracyPortals = DIGITAL_LITERACY_PORTALS.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchLiteracy.toLowerCase()) ||
      item.description.toLowerCase().includes(searchLiteracy.toLowerCase()) ||
      item.category.toLowerCase().includes(searchLiteracy.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchLiteracy.toLowerCase());

    if (!matchesSearch) return false;
    if (activeLiteracyCategory === 'semua') return true;
    return item.category === activeLiteracyCategory;
  });

  const literacyCategories = ['semua', ...Array.from(new Set(DIGITAL_LITERACY_PORTALS.map(p => p.category)))];

  return (
    <section id="layanan-dan-rapor" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-20">
        
        {/* =========================================================================
            BAGIAN 1: LITERASI DIGITAL (SIBI, PENJARING, LET'S READ, LITERACY CLOUD, BACAPIBO)
            ========================================================================= */}
        <div id="literasi-digital" className="space-y-8 bg-white p-6 sm:p-10 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-800 text-emerald-100 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Literasi Digital & Sumber Bacaan
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-amber-300">
                  Kemendikdasmen & Mitra Pendidikan
                </span>
                <span className="bg-indigo-50 text-indigo-900 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-indigo-200">
                  5 Portal Terpadu
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight uppercase">
                POJOK LITERASI DIGITAL UPTD SDN 5 BARANDASI
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Platform terpadu untuk menyatukan <strong>SIBI (Buku Kurikulum Kemendikdasmen)</strong>, <strong>Penjaring Bahasa</strong>, <strong>Let's Read</strong>, <strong>Literacy Cloud</strong>, dan <strong>BacaPibo</strong>. Solusi konkret meningkatkan minat baca, kemampuan literasi teks fiksi/nonfiksi, serta kecintaan membaca murid sejak dini.
              </p>
            </div>

            {/* Quick Context Callout for Rapor Pendidikan */}
            <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-sm text-xs text-amber-950 max-w-xs shrink-0 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-[11px] text-amber-900 uppercase">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                Intervensi Literasi AN
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                Mendukung rekomendasi <strong>Rapor Pendidikan 2025</strong> dengan bacaan berjenjang, buku audio, dan cerita dwibahasa daerah (Bugis & Makassar).
              </p>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {literacyCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveLiteracyCategory(cat)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer capitalize ${
                    activeLiteracyCategory === cat
                      ? 'bg-indigo-950 text-amber-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-950'
                  }`}
                >
                  {cat === 'semua' ? `Semua Portal (${DIGITAL_LITERACY_PORTALS.length})` : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLiteracy}
                onChange={(e) => setSearchLiteracy(e.target.value)}
                placeholder="Cari buku, cerita, platform..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-900 focus:bg-white pl-9 pr-3 py-1.5 text-xs rounded-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* 5 Digital Literacy Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLiteracyPortals.map((portal) => {
              const isCopied = copiedId === portal.id;

              return (
                <div
                  key={portal.id}
                  className="bg-slate-50/50 rounded-sm border border-slate-200 hover:border-indigo-900 p-6 flex flex-col justify-between group transition-all hover:shadow-md relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Card Top: Provider & Icon */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-sm bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {getLiteracyIcon(portal.id)}
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-white text-indigo-950 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-slate-200 shadow-2xs">
                          {portal.badge}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium truncate max-w-[170px]">
                          {portal.provider}
                        </p>
                      </div>
                    </div>

                    {/* Title & Audience */}
                    <div>
                      <h3 className="text-base font-extrabold text-indigo-950 group-hover:text-indigo-900 transition-colors leading-snug">
                        {portal.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Sasaran: {portal.targetAudience}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>

                    {/* Feature Bullets */}
                    <div className="bg-white p-3 rounded-sm border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Keunggulan & Fitur Utama:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {portal.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[10.5px] text-slate-700">
                            <span className="text-amber-500 font-bold">•</span>
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Domain & Copy link */}
                    <div className="bg-white px-2.5 py-1.5 rounded-sm border border-slate-200 text-[11px] font-mono text-indigo-950 flex items-center justify-between">
                      <span className="truncate text-slate-700">{portal.domain}</span>
                      <button
                        onClick={() => handleCopy(portal.id, portal.url)}
                        title="Salin Tautan Platform"
                        className="text-slate-400 hover:text-indigo-900 ml-2 shrink-0 cursor-pointer transition-colors p-1"
                      >
                        {isCopied ? (
                          <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Tersalin
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-5 border-t border-slate-200 flex items-center justify-between gap-3">
                    <span className="text-[10.5px] font-bold text-indigo-950 uppercase tracking-wide">
                      {portal.category}
                    </span>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-indigo-950 hover:bg-indigo-900 text-amber-300 px-3.5 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-colors shadow-2xs"
                    >
                      <span>Jelajahi Buku</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BAGIAN 2: RAPOR PENDIDIKAN 2025 MILIK UPTD SDN 5 BARANDASI
            ========================================================================= */}
        <div id="rapor-sekolah" className="bg-white rounded-sm border-2 border-indigo-900 p-6 sm:p-10 shadow-lg space-y-8">
          
          {/* Header Banner - Kemendikdasmen Style */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-950 text-amber-300 rounded-sm flex items-center justify-center font-black text-xl border border-indigo-900 shadow-xs">
                  2025
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-[0.2em] text-indigo-900 uppercase">
                      RAPOR PENDIDIKAN SATUAN PENDIDIKAN
                    </span>
                    <span className="bg-indigo-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      Identifikasi • Refleksi • Benahi
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight uppercase mt-0.5">
                    RAPOR PENDIDIKAN MILIK {RAPOR_PENDIDIKAN_2025_INFO.schoolName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href={RAPOR_PENDIDIKAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-900 hover:bg-indigo-800 text-amber-300 px-4 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <BarChart3 className="w-4 h-4 text-amber-300" />
                  <span>Kunjungi Portal Resmi Rapor</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>

            {/* Explanatory narrative from official document */}
            <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                {RAPOR_PENDIDIKAN_2025_INFO.narrative}
              </p>
              <p className="font-bold text-indigo-950 mt-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {RAPOR_PENDIDIKAN_2025_INFO.ctaTitle}
              </p>
            </div>
          </div>

          {/* 6 Indicators Grid matching the uploaded image */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RAPOR_PENDIDIKAN_2025_INFO.indicators.map((ind) => {
              const isKurang = ind.status === 'Kurang';

              return (
                <div
                  key={ind.id}
                  className={`rounded-sm border p-5 flex flex-col justify-between space-y-4 relative ${
                    isKurang 
                      ? 'bg-rose-50/40 border-rose-200' 
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  {/* Top Special Badges */}
                  {ind.tag && (
                    <div className="absolute -top-3 left-4">
                      <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-sm shadow-xs ${
                        ind.tag === 'PENINGKATAN PALING TINGGI' ? 'bg-emerald-700 text-white' :
                        ind.tag === 'CAPAIAN TERBAIK' ? 'bg-indigo-900 text-amber-300' :
                        'bg-rose-700 text-white'
                      }`}>
                        {ind.tag}
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    <h4 className="text-sm font-bold text-indigo-950 leading-snug">
                      {ind.title}
                    </h4>

                    {/* Status Pill & Trend */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-sm text-xs font-extrabold uppercase tracking-wider text-white shadow-2xs ${
                        isKurang ? 'bg-rose-500' : 'bg-amber-500'
                      }`}>
                        {ind.status}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-rose-700 font-semibold">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>{ind.trendText}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>

                  {/* Parental Inspiration Box for Numerasi */}
                  {ind.inspiration && (
                    <div className="bg-rose-100/70 p-3 rounded-sm border border-rose-200 text-xs text-rose-950 space-y-1 mt-2">
                      <span className="font-extrabold flex items-center gap-1 text-[11px] uppercase tracking-wider text-rose-900">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        Inspirasi Cara Meningkatkan Hasil:
                      </span>
                      <p className="text-[11px] leading-relaxed text-rose-900">
                        {ind.inspiration}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Call to Action Card: Kolaborasi Guru & Orang Tua */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white p-6 sm:p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-900 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-amber-400 text-indigo-950 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm inline-block">
                Ruang Solusi Bersama
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {RAPOR_PENDIDIKAN_2025_INFO.ctaDiscussion}
              </h4>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Manfaatkan <strong>Pojok Literasi Digital</strong> di atas (SIBI, Penjaring, Let's Read, Literacy Cloud, BacaPibo) untuk mendampingi anak membaca 15-20 menit setiap hari di rumah dan di sekolah!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="#literasi-digital"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold px-6 py-3 rounded-sm text-xs uppercase tracking-wider transition-colors text-center border border-amber-500 shadow-xs flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Pojok Literasi Digital</span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BAGIAN 3: PORTAL LAYANAN RESMI KEMENDIKDASMEN & KEPEGAWAIAN ASN BKN
            ========================================================================= */}
        <div id="portal-layanan" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-950 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                  Portal Layanan Digital Terpadu
                </span>
                <span className="bg-amber-100 text-indigo-950 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-amber-200">
                  Resmi Pemerintah
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight uppercase">
                PORTAL RESMI KEMENDIKDASMEN & KEPEGAWAIAN ASN
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
                Tautan cepat ke platform layanan administrasi kepegawaian ASN BKN, manajemen keprofesian GTK Belajar, sistem validasi data Dapodik & TPG, serta portal pusat Rumah Pendidikan.
              </p>
            </div>

            {/* Filter Pill */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-sm border border-slate-200 shrink-0 self-start md:self-auto shadow-2xs">
              <button
                onClick={() => setActiveGovFilter('semua')}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  activeGovFilter === 'semua'
                    ? 'bg-indigo-900 text-amber-300'
                    : 'text-slate-600 hover:text-indigo-950'
                }`}
              >
                Semua ({OFFICIAL_GOV_PORTALS.length})
              </button>
              <button
                onClick={() => setActiveGovFilter('guru')}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  activeGovFilter === 'guru'
                    ? 'bg-indigo-900 text-amber-300'
                    : 'text-slate-600 hover:text-indigo-950'
                }`}
              >
                Khusus GTK & ASN
              </button>
              <button
                onClick={() => setActiveGovFilter('publik')}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  activeGovFilter === 'publik'
                    ? 'bg-indigo-900 text-amber-300'
                    : 'text-slate-600 hover:text-indigo-950'
                }`}
              >
                Umum & Orang Tua
              </button>
            </div>
          </div>

          {/* Grid Gov Portal Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGovPortals.map((portal) => {
              const isCopied = copiedId === portal.id;

              return (
                <div
                  key={portal.id}
                  className="bg-white rounded-sm border border-slate-200 hover:border-indigo-900 p-6 flex flex-col justify-between group transition-all shadow-xs hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-900 group-hover:text-amber-300 transition-colors">
                        {getGovPortalIcon(portal.iconName)}
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-slate-100 text-indigo-950 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-slate-200">
                          {portal.category}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium">
                          {portal.targetUser}
                        </p>
                      </div>
                    </div>

                    {/* Portal Name & Description */}
                    <div>
                      <h3 className="text-base font-bold text-indigo-950 group-hover:text-indigo-900 transition-colors leading-snug">
                        {portal.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {portal.description}
                      </p>
                    </div>

                    {/* Official Domain */}
                    <div className="bg-slate-50 p-2 rounded-sm border border-slate-200 text-[11px] font-mono text-indigo-950 flex items-center justify-between">
                      <span className="truncate">{portal.officialDomain}</span>
                      <button
                        onClick={() => handleCopy(portal.id, portal.url)}
                        title="Salin Tautan Lengkap"
                        className="text-slate-400 hover:text-indigo-900 ml-2 shrink-0 cursor-pointer transition-colors p-1"
                      >
                        {isCopied ? (
                          <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Tersalin
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">
                      {portal.badge}
                    </span>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-indigo-950 hover:bg-indigo-900 text-amber-300 px-3.5 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-colors shadow-2xs group-hover:bg-indigo-900"
                    >
                      <span>Buka Portal</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
