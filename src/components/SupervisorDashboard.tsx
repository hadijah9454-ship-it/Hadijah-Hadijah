import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building, Users, UserCheck, Clock, Calendar, 
  Search, Printer, Share2, RefreshCw, Send, ShieldCheck, 
  AlertCircle, Download, Award, FileText, Check, Lock, 
  MapPin, Eye, ChevronRight, AlertTriangle, Sparkles,
  Activity, BellRing, Phone, ExternalLink, Filter, CheckCircle2,
  PhoneCall, ShieldAlert, School, ArrowRight, MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  SupervisedSchool, 
  UncheckedTeacherAlert, 
  SUPERVISOR_PROFILE, 
  getSupervisedSchools, 
  saveSupervisedSchools, 
  getSupervisorCutoffTime, 
  setSupervisorCutoffTime, 
  verifySchoolBySupervisor, 
  verifyAllSchoolsBySupervisor, 
  getSupervisorSummary, 
  INITIAL_UNCHECKED_TEACHERS, 
  SUPERVISOR_UPDATED_EVENT 
} from '../utils/supervisorStore';
import { exportSupervisorReportPDF } from '../utils/supervisorPdfExport';
import { formatIndonesianDate } from '../utils/attendancePdfExport';
import { getCurrentWitaTimeString } from '../utils/teacherAttendanceStore';

interface Props {
  onNavigateToSchool?: (schoolId: string) => void;
  onNavigateToAttendance?: () => void;
}

export const SupervisorDashboard: React.FC<Props> = ({ 
  onNavigateToSchool,
  onNavigateToAttendance 
}) => {
  // Selected supervision date (default 2026-10-05)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-05');

  // Interactive Cutoff Time for flagging absent teachers (default: "07:30")
  const [cutoffTime, setCutoff] = useState<string>(() => getSupervisorCutoffTime());

  // Supervised schools data
  const [schools, setSchools] = useState<SupervisedSchool[]>(() => getSupervisedSchools());

  // Unchecked teachers alert list
  const [alerts, setAlerts] = useState<UncheckedTeacherAlert[]>(() => INITIAL_UNCHECKED_TEACHERS);

  // Active view tab: 'overview' (Ringkasan & Komparasi), 'alerts' (Peringatan Belum Presensi), 'schools' (Daftar Sekolah)
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'schools'>('overview');

  // Selected school for modal inspection
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SupervisedSchool | null>(null);

  // Search and filters
  const [schoolSearchQuery, setSchoolSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SANGAT_BAIK' | 'BAIK' | 'PERLU_PEMBINAAN'>('ALL');

  // Live WITA server clock
  const [currentClock, setCurrentClock] = useState<string>(getCurrentWitaTimeString());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Live timer tick for WITA clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentClock(getCurrentWitaTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to store updates
  useEffect(() => {
    const handleUpdate = () => {
      setSchools(getSupervisedSchools());
    };
    window.addEventListener(SUPERVISOR_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SUPERVISOR_UPDATED_EVENT, handleUpdate);
  }, []);

  // Dynamic summary
  const summary = useMemo(() => {
    return getSupervisorSummary();
  }, [schools]);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
        s.npsn.includes(schoolSearchQuery) ||
        s.principalName.toLowerCase().includes(schoolSearchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [schools, schoolSearchQuery, statusFilter]);

  // Recharts Data: Discipline Comparison Bar Chart
  const disciplineChartData = useMemo(() => {
    return schools.map(s => ({
      name: s.name.replace('UPTD ', ''),
      disiplin: s.disciplineRate,
      hadir: s.hadirTepatWaktu,
      terlambat: s.terlambat,
      belumAbsen: s.belumAbsen
    }));
  }, [schools]);

  // Recharts Data: Status Composition Pie Chart Se-Wilayah Binaan
  const statusPieData = useMemo(() => {
    return [
      { name: 'Tepat Waktu', value: summary.totalHadir, color: '#059669' },
      { name: 'Terlambat', value: summary.totalTerlambat, color: '#d97706' },
      { name: 'Izin Dinas / KKG', value: summary.totalIzin, color: '#0284c7' },
      { name: 'Sakit / Cuti', value: summary.totalSakit, color: '#7c3aed' },
      { name: 'Belum Presensi', value: summary.totalBelumAbsen, color: '#e11d48' },
    ].filter(item => item.value > 0);
  }, [summary]);

  // Handle changing cutoff time
  const handleCutoffChange = (newTime: string) => {
    setCutoff(newTime);
    setSupervisorCutoffTime(newTime);
    setToastMessage({
      text: `Batas jam toleransi presensi diubah menjadi ${newTime} WITA. Peringatan dini guru otomatis diperbarui!`,
      type: 'info'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle individual school verification
  const handleVerifySchool = (schoolId: string, schoolName: string) => {
    verifySchoolBySupervisor(schoolId);
    setToastMessage({
      text: `Presensi ${schoolName} berhasil disahkan secara resmi oleh Pengawas Bina (${SUPERVISOR_PROFILE.name})!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle verify all schools
  const handleVerifyAllSchools = () => {
    verifyAllSchoolsBySupervisor();
    setToastMessage({
      text: `Seluruh (${schools.length}) sekolah binaan berhasil disahkan oleh Pengawas Bina (${SUPERVISOR_PROFILE.name})!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle action status on alert
  const handleUpdateAlertStatus = (alertId: string, status: UncheckedTeacherAlert['lastActionStatus'], note: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          lastActionStatus: status,
          actionNote: note
        };
      }
      return a;
    }));
    setToastMessage({
      text: 'Status tindak lanjut teguran kedisiplinan guru berhasil diperbarui!',
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Copy WA Broadcast for Koordinator Pengawas / Kadis Pendidikan
  const handleCopyWaReport = () => {
    const formattedDate = formatIndonesianDate(selectedDate);
    const waText = 
`*LAPORAN HASIL PENGAWASAN REAL-TIME DISIPLIN GTK (SIMAK)*
*WILAYAH BINAAN KECAMATAN LAU - DINAS PENDIDIKAN KAB. MAROS*
📅 *Hari/Tanggal:* ${formattedDate}
⏰ *Waktu Pemantauan:* ${getCurrentWitaTimeString()}
👩‍💼 *Pengawas Pembina:* ${SUPERVISOR_PROFILE.name} (NIP: ${SUPERVISOR_PROFILE.nip})

📊 *RINGKASAN EKSEKUTIF SE-WILAYAH BINAAN:*
• Total Satuan Pendidikan Binaan: ${summary.totalSchools} Sekolah
• Total Tenaga Pendidik & Kependidikan: ${summary.totalTeachers} Orang
• Hadir Tepat Waktu (< 07:00 WITA): ${summary.totalHadir} Orang
• Terlambat (> 07:00 WITA): ${summary.totalTerlambat} Orang
• Izin Dinas / Pelatihan: ${summary.totalIzin} Orang
• Sakit / Cuti: ${summary.totalSakit} Orang
• 🚨 *Belum Melakukan Presensi (> ${cutoffTime} WITA):* ${summary.totalBelumAbsen} Orang
📈 *Rata-rata Tingkat Kedisiplinan:* ${summary.overallRate}%

🏫 *RINCIAN KEDISIPLINAN PER SEKOLAH BINAAN:*
${schools.map((s, idx) => `${idx + 1}. *${s.name}*: ${s.disciplineRate}% (${s.hadirTepatWaktu}/${s.totalTeachers} Hadir, Belum: ${s.belumAbsen}) - ${s.isVerifiedBySupervisor ? '✅ Disahkan' : '⏳ Menunggu Validasi'}`).join('\n')}

📍 _Data terintegrasi langsung secara Real-Time dengan Sistem Informasi Manajemen Akademik (SIMAK) UPTD SDN 5 Barandasi dan Satuan Pendidikan Binaan Kec. Lau._`;

    navigator.clipboard.writeText(waText);
    setToastMessage({
      text: 'Format laporan resmi Pengawas Bina WhatsApp telah disalin ke clipboard!',
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section id="dashboard-pengawas" className="py-10 bg-slate-100/70 border-b border-slate-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* HEADER: DASHBOARD PENGAWAS BINA (HJ. MIRNA, S.PD., M.PD.)                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-950 via-amber-400 to-indigo-950" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Title & Organization Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-950 text-amber-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-xs shadow-2xs border border-indigo-900">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN MAROS
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-xs border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  REAL-TIME SYNC GUGUS BINAAN
                </span>
                <span className="bg-amber-100 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-amber-300 uppercase">
                  Akreditasi B
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase tracking-tight">
                DASHBOARD MONITORING PENGAWAS BINA
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                Pemantauan terpusat tingkat kedisiplinan dan data kehadiran guru secara real-time dari <strong>seluruh 6 sekolah binaan Kecamatan Lau, Kabupaten Maros</strong> oleh Pengawas Pembina <strong>{SUPERVISOR_PROFILE.name}</strong> guna penjaminan mutu KBM dan kepatuhan ASN/PPPK.
              </p>
            </div>

            {/* Profile Pengawas Bina & Server Clock Widget */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              
              {/* Supervisor Identity Card */}
              <div className="bg-indigo-950 text-white p-3.5 sm:p-4 rounded-sm border border-indigo-900 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-950 font-black flex items-center justify-center text-lg border-2 border-white/20 shrink-0 shadow-xs">
                  HM
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    Pengawas Pembina Wilayah:
                  </span>
                  <div className="text-sm font-black text-white">
                    {SUPERVISOR_PROFILE.name}
                  </div>
                  <div className="text-[10px] text-slate-300 flex items-center gap-1.5 mt-0.5 font-mono">
                    <span>NIP: {SUPERVISOR_PROFILE.nip}</span>
                    <span>•</span>
                    <span className="text-amber-200/90">{SUPERVISOR_PROFILE.district}</span>
                  </div>
                </div>
              </div>

              {/* Server Clock Widget */}
              <div className="bg-slate-900 text-white p-3.5 rounded-sm border border-slate-800 shadow-xs flex flex-col justify-center min-w-[140px]">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Jam Server (WITA)
                </span>
                <div className="text-lg font-mono font-black text-amber-300">
                  {currentClock}
                </div>
                <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  <span>Terkunci Otomatis</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Toolbar & Navigation Tabs */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Mode Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-300" />
                <span>Ringkasan & Visualisasi Disiplin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === 'alerts'
                    ? 'bg-rose-900 text-white shadow-xs border border-rose-800'
                    : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <BellRing className={`w-4 h-4 ${summary.totalBelumAbsen > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span>Peringatan Belum Presensi</span>
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                  {summary.totalBelumAbsen} Guru
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schools')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'schools'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <School className="w-4 h-4 text-amber-300" />
                <span>Daftar 6 Sekolah Binaan</span>
              </button>
            </div>

            {/* Cutoff Time Controller, Date Picker, Export PDF, Salin WA, Cetak */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Cutoff Time Selector (Batas Jam Presensi) */}
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-sm text-xs shadow-2xs" title="Batas jam toleransi kehadiran sebelum sistem membunyikan peringatan dini ke Pengawas Bina">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-bold text-amber-950 shrink-0">Batas Toleransi:</span>
                <select
                  value={cutoffTime}
                  onChange={(e) => handleCutoffChange(e.target.value)}
                  className="bg-transparent font-black text-amber-950 focus:outline-hidden cursor-pointer"
                >
                  <option value="07:15">07:15 WITA</option>
                  <option value="07:30">07:30 WITA (Standar)</option>
                  <option value="07:45">07:45 WITA</option>
                  <option value="08:00">08:00 WITA (Maksimal)</option>
                </select>
              </div>

              {/* Tanggal Selector */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm text-xs">
                <Calendar className="w-4 h-4 text-indigo-900" />
                <span className="font-bold text-slate-700 shrink-0">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-semibold text-indigo-950 focus:outline-hidden cursor-pointer"
                />
              </div>

              {/* Unduh PDF Button */}
              <button
                type="button"
                onClick={() => exportSupervisorReportPDF(selectedDate, schools, alerts, cutoffTime)}
                title="Unduh laporan pengawasan resmi berformat PDF lengkap tanda tangan Hj. Mirna, S.Pd., M.Pd."
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs border border-indigo-700"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh PDF</span>
              </button>

              {/* Salin WA Button */}
              <button
                type="button"
                onClick={handleCopyWaReport}
                title="Salin rekap pesan WA resmi untuk Koordinator Pengawas & Kepala Dinas Pendidikan Maros"
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salin WA</span>
              </button>

              {/* Cetak Button */}
              <button
                type="button"
                onClick={() => window.print()}
                title="Cetak berita acara pengawasan"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Cetak</span>
              </button>
            </div>

          </div>

        </div>

        {/* Feedback Alert Toast */}
        {toastMessage && (
          <div className="p-4 rounded-sm text-xs font-semibold flex items-center justify-between shadow-md bg-emerald-600 text-white animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white font-bold cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CRITICAL EARLY WARNING BANNER: GURU BELUM MELAKUKAN PRESENSI              */}
        {/* ========================================================================= */}
        {summary.totalBelumAbsen > 0 && (
          <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-2 border-rose-500/50 text-white p-5 sm:p-6 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-600/30 border-2 border-rose-400 flex items-center justify-center shrink-0">
                <BellRing className="w-6 h-6 text-rose-300 animate-bounce" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                    PERINGATAN DINI KEDISIPLINAN PENGAWAS
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    Batas Jam Toleransi: {cutoffTime} WITA
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  Terdeteksi {summary.totalBelumAbsen} Guru dari 4 Sekolah Binaan Belum Melakukan Presensi Melewati Batas Toleransi!
                </h3>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  Pengawas Pembina <strong>{SUPERVISOR_PROFILE.name}</strong> dapat langsung mengirimkan surat teguran digital via WhatsApp ke guru bersangkutan atau menginstruksikan Kepala Sekolah penanggung jawab.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className="bg-white hover:bg-rose-50 text-rose-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Buka Detail Peringatan Guru ({summary.totalBelumAbsen})</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6 TOP EXECUTIVE KPI CARDS SE-WILAYAH BINAAN                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-white p-4 rounded-sm border-l-4 border-indigo-900 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Sekolah Binaan</span>
            <div className="text-2xl font-black text-indigo-950">{summary.totalSchools}</div>
            <span className="text-[10px] text-slate-400 block">Jenjang SD Kec. Lau</span>
          </div>

          <div className="bg-white p-4 rounded-sm border-l-4 border-blue-900 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total GTK Terdaftar</span>
            <div className="text-2xl font-black text-blue-950">{summary.totalTeachers}</div>
            <span className="text-[10px] text-slate-400 block">Pendidik & Tendik</span>
          </div>

          <div className="bg-white p-4 rounded-sm border-l-4 border-emerald-600 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Hadir Tepat Waktu</span>
            <div className="text-2xl font-black text-emerald-700">{summary.totalHadir}</div>
            <span className="text-[10px] text-slate-400 block">&lt; 07:00 WITA</span>
          </div>

          <div className="bg-white p-4 rounded-sm border-l-4 border-amber-500 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Terlambat</span>
            <div className="text-2xl font-black text-amber-700">{summary.totalTerlambat}</div>
            <span className="text-[10px] text-slate-400 block">&gt; 07:00 WITA</span>
          </div>

          <div className="bg-white p-4 rounded-sm border-l-4 border-rose-600 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Belum Presensi</span>
            <div className="text-2xl font-black text-rose-700">{summary.totalBelumAbsen}</div>
            <span className="text-[10px] text-rose-600 font-bold block">&gt; {cutoffTime} WITA (Perlu Aksi)</span>
          </div>

          <div className="bg-white p-4 rounded-sm border-l-4 border-teal-600 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Rata-rata Disiplin</span>
            <div className="text-2xl font-black text-teal-700">{summary.overallRate}%</div>
            <span className="text-[10px] text-emerald-700 font-bold block">Tingkat Wilayah</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & DATA VISUALIZATION (RECHARTS)                           */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Visualisasi Data: Recharts Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Perbandingan Tingkat Kedisiplinan Antar Sekolah Binaan */}
              <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-indigo-950 tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Perbandingan Tingkat Kedisiplinan Kehadiran Guru Antar Sekolah Binaan (%)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluasi komparatif kehadiran GTK dari 6 Satuan Pendidikan di Kecamatan Lau
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xs border border-teal-200">
                    Rata-rata: {summary.overallRate}%
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={disciplineChartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: '#334155' }} 
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#334155' }} unit="%" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '4px', color: '#fff', fontSize: '11px', border: 'none' }}
                        formatter={(val: any) => [`${val}%`, 'Tingkat Kedisiplinan']}
                      />
                      <Bar dataKey="disiplin" fill="#1e1b4b" radius={[4, 4, 0, 0]}>
                        {disciplineChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.disiplin >= 94 ? '#059669' : // emerald
                              entry.disiplin >= 85 ? '#0284c7' : // sky
                              '#e11d48' // rose
                            } 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-emerald-600 rounded-2xs inline-block" />
                      <span>Sangat Baik (&ge;94%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-sky-600 rounded-2xs inline-block" />
                      <span>Baik (85% - 93.9%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-rose-600 rounded-2xs inline-block" />
                      <span>Perlu Pembinaan (&lt;85%)</span>
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700">
                    Sekolah Tertinggi: <strong>UPTD SDN 5 Barandasi (95.5%)</strong>
                  </span>
                </div>
              </div>

              {/* Chart 2: Komposisi Kehadiran GTK Se-Kecamatan Lau */}
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold uppercase text-indigo-950 tracking-wide">
                    Komposisi Kehadiran Se-Wilayah Binaan
                  </h3>
                  <p className="text-xs text-slate-500">Distribusi 107 GTK di 6 Satuan Pendidikan</p>
                </div>

                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '4px', color: '#fff', fontSize: '11px', border: 'none' }}
                        formatter={(val: any, name: any) => [`${val} Pendidik`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs pt-1">
                  {statusPieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 text-[11px]">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800 text-[11px]">{item.value} GTK</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Summary Roster of 6 Schools */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-indigo-950 uppercase tracking-tight">
                    Tingkat Kedisiplinan 6 Sekolah Binaan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pengesahan berkala kehadiran GTK langsung oleh Pengawas Bina {SUPERVISOR_PROFILE.name}.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVerifyAllSchools}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sahkan Seluruh Sekolah ({schools.length})</span>
                  </button>
                </div>
              </div>

              {/* Schools Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schools.map((sch) => (
                  <div key={sch.id} className="p-4 rounded-sm border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-xs ${
                          sch.status === 'SANGAT_BAIK' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          sch.status === 'BAIK' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                          'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {sch.status === 'SANGAT_BAIK' ? 'Disiplin Sangat Baik' :
                           sch.status === 'BAIK' ? 'Disiplin Baik' : 'Perlu Pembinaan'}
                        </span>
                        <h4 className="text-sm font-extrabold text-indigo-950 mt-1">
                          {sch.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-mono">
                          NPSN: {sch.npsn} • KS: {sch.principalName}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className={`text-xl font-black ${
                          sch.disciplineRate >= 94 ? 'text-emerald-700' :
                          sch.disciplineRate >= 85 ? 'text-sky-700' : 'text-rose-700'
                        }`}>
                          {sch.disciplineRate}%
                        </div>
                        <span className="text-[10px] text-slate-400">Kehadiran</span>
                      </div>
                    </div>

                    {/* Mini Stats Bar */}
                    <div className="grid grid-cols-4 gap-1 p-2 bg-white rounded-sm border border-slate-100 text-center text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 block">Total</span>
                        <strong className="text-indigo-950">{sch.totalTeachers}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">Hadir</span>
                        <strong className="text-emerald-700">{sch.hadirTepatWaktu}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">Terlambat</span>
                        <strong className="text-amber-700">{sch.terlambat}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">Belum</span>
                        <strong className={sch.belumAbsen > 0 ? 'text-rose-600 font-black' : 'text-slate-500'}>
                          {sch.belumAbsen}
                        </strong>
                      </div>
                    </div>

                    {/* Verification and Action */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-[11px]">
                        Status: <strong className={sch.isVerifiedBySupervisor ? 'text-emerald-700' : 'text-amber-700'}>
                          {sch.isVerifiedBySupervisor ? `Disahkan (${sch.verifiedAt || 'OK'})` : 'Menunggu Validasi'}
                        </strong>
                      </span>

                      {!sch.isVerifiedBySupervisor ? (
                        <button
                          type="button"
                          onClick={() => handleVerifySchool(sch.id, sch.name)}
                          className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white rounded-sm text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Sahkan
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: NOTIFIKASI PERINGATAN GURU BELUM MELAKUKAN PRESENSI                */}
        {/* ========================================================================= */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            
            {/* Top Controller Bar for Cutoff and Count */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-xs border border-rose-300">
                    SISTEM DETEKSI OTOMATIS PENGAWAS
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Peringatan Dini Keterlambatan GTK
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-indigo-950 mt-1">
                  Daftar Guru yang Belum Melakukan Presensi Hingga {cutoffTime} WITA
                </h3>
                <p className="text-xs text-slate-600">
                  Data real-time sinkron dari aplikasi SIMAK seluruh sekolah binaan. Guru yang belum presensi melewati batas toleransi wajib diberikan teguran kedinasan.
                </p>
              </div>

              {/* Cutoff Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Pilih Batas Toleransi:</span>
                {['07:15', '07:30', '07:45', '08:00'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleCutoffChange(t)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-sm cursor-pointer transition-all ${
                      cutoffTime === t
                        ? 'bg-rose-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {t} WITA
                  </button>
                ))}
              </div>
            </div>

            {/* Warning Table / Cards */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">No</th>
                      <th className="py-3.5 px-4">Nama Guru / Tendik</th>
                      <th className="py-3.5 px-4">Tugas / Rombel</th>
                      <th className="py-3.5 px-4">Satuan Pendidikan Binaan</th>
                      <th className="py-3.5 px-4 text-center">Status Peringatan</th>
                      <th className="py-3.5 px-4">Catatan Keterlambatan</th>
                      <th className="py-3.5 px-4 text-center">Aksi Pengawas Bina</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alerts.map((al, idx) => (
                      <tr key={al.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-indigo-950 text-xs sm:text-sm">
                            {al.teacherName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NIP: {al.teacherNip} • HP: {al.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {al.role}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{al.schoolName}</div>
                          <div className="text-[10px] text-slate-500">KS: {al.principalName}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-rose-100 text-rose-900 text-[10px] font-black px-2 py-0.5 rounded-xs border border-rose-300 uppercase">
                            Belum Absen ({al.minutesOverdue} Menit)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs">
                          {al.actionNote}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            
                            {/* Send WA Notice from Pengawas */}
                            <a
                              href={`https://wa.me/62${al.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `Yth. Bapak/Ibu ${al.teacherName} (${al.role} ${al.schoolName}).\n\nKami dari Pengawas Pembina Dinas Pendidikan Kab. Maros (${SUPERVISOR_PROFILE.name}) memantau melalui SIMAK bahwa hingga pukul ${currentClock} WITA, Anda belum melakukan presensi masuk di sekolah (batas toleransi ${cutoffTime} WITA). Mohon segera konfirmasi keberadaan atau kehadiran Anda ke Kepala Sekolah guna kelancaran KBM siswa. Terima kasih.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleUpdateAlertStatus(al.id, 'WA_TERKIRIM', 'Teguran resmi WA telah dikirim oleh Pengawas Bina.')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                              title="Kirim pesan teguran resmi WhatsApp dari Pengawas Bina"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Tegur WA</span>
                            </a>

                            {/* Contact Principal */}
                            <a
                              href={`https://wa.me/62${al.principalPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `Yth. ${al.principalName} (Kepala ${al.schoolName}).\n\nMohon perhatian terkait guru binaan ${al.teacherName} (${al.role}) yang terdeteksi di SIMAK belum presensi hingga ${currentClock} WITA. Mohon dicek dan dikoordinasikan. Salam hormat, ${SUPERVISOR_PROFILE.name} (Pengawas Bina).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleUpdateAlertStatus(al.id, 'KS_DIHUBUNGI', 'Kepala Sekolah telah dihubungi oleh Pengawas.')}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-sm font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                              title="Hubungi Kepala Sekolah penanggung jawab"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Kontak KS</span>
                            </a>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Policy Notice */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 italic flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  *Prosedur Disiplin Pengawas: Guru yang belum presensi melewati pukul {cutoffTime} WITA tanpa surat tugas luar resmi akan dicatat dalam Lembar Evaluasi Disiplin ASN/PPPK Dinas Pendidikan Kabupaten Maros.
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DAFTAR LENGKAP 6 SEKOLAH BINAAN                                    */}
        {/* ========================================================================= */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-indigo-950 uppercase tracking-tight">
                  Daftar Satuan Pendidikan Binaan Kecamatan Lau
                </h3>
                <p className="text-xs text-slate-500">
                  Total 6 sekolah dasar dalam pengawasan aktif Hj. Mirna, S.Pd., M.Pd.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-2.5 py-1 rounded-sm text-xs">
                  <span className="font-bold text-slate-600">Kategori:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-transparent font-bold text-indigo-950 focus:outline-hidden cursor-pointer"
                  >
                    <option value="ALL">Semua ({schools.length})</option>
                    <option value="SANGAT_BAIK">Sangat Baik (&ge;94%)</option>
                    <option value="BAIK">Baik (85% - 93.9%)</option>
                    <option value="PERLU_PEMBINAAN">Perlu Pembinaan (&lt;85%)</option>
                  </select>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={schoolSearchQuery}
                    onChange={(e) => setSchoolSearchQuery(e.target.value)}
                    placeholder="Cari sekolah / NPSN / KS..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Full Schools Table */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 w-10 text-center">No</th>
                      <th className="py-3.5 px-4">Nama Sekolah & NPSN</th>
                      <th className="py-3.5 px-4">Kepala Sekolah</th>
                      <th className="py-3.5 px-4 text-center">Total GTK</th>
                      <th className="py-3.5 px-4 text-center">Tepat Waktu</th>
                      <th className="py-3.5 px-4 text-center">Terlambat</th>
                      <th className="py-3.5 px-4 text-center">Izin / Sakit</th>
                      <th className="py-3.5 px-4 text-center">Belum Absen</th>
                      <th className="py-3.5 px-4 text-center">Kedisiplinan</th>
                      <th className="py-3.5 px-4 text-center">Status Supervisi</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchools.map((sch, idx) => (
                      <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-indigo-950 text-xs sm:text-sm">
                            {sch.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NPSN: {sch.npsn} • {sch.address}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{sch.principalName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">NIP: {sch.principalNip}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {sch.totalTeachers}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-700 bg-emerald-50/40">
                          {sch.hadirTepatWaktu}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-700">
                          {sch.terlambat}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-600">
                          {sch.izinDinas + sch.sakit}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span className={sch.belumAbsen > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}>
                            {sch.belumAbsen}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-black text-xs px-2 py-0.5 rounded-xs ${
                            sch.disciplineRate >= 94 ? 'text-emerald-800 bg-emerald-100' :
                            sch.disciplineRate >= 85 ? 'text-sky-800 bg-sky-100' : 'text-rose-800 bg-rose-100'
                          }`}>
                            {sch.disciplineRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {sch.isVerifiedBySupervisor ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Telah Disahkan</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                              Menunggu Validasi
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {!sch.isVerifiedBySupervisor && (
                              <button
                                type="button"
                                onClick={() => handleVerifySchool(sch.id, sch.name)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                              >
                                Sahkan
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedSchoolModal(sch)}
                              className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white rounded-sm text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: DETAIL SUPERVISI SEKOLAH BINAAN                                    */}
        {/* ========================================================================= */}
        {selectedSchoolModal && (
          <div className="fixed inset-0 z-50 bg-indigo-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-sm max-w-2xl w-full border border-slate-300 shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
              
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                    Detail Catatan Supervisi Sekolah Binaan
                  </span>
                  <h3 className="text-lg font-black text-indigo-950">
                    {selectedSchoolModal.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    NPSN: {selectedSchoolModal.npsn} • {selectedSchoolModal.address}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSchoolModal(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-sm">
                <div>
                  <span className="text-[10px] text-slate-400 block">Kepala Sekolah:</span>
                  <strong className="text-slate-900 text-sm">{selectedSchoolModal.principalName}</strong>
                  <div className="text-slate-500 font-mono text-[11px]">NIP: {selectedSchoolModal.principalNip}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">No. Kontak HP/WhatsApp:</span>
                  <strong className="text-slate-900">{selectedSchoolModal.principalPhone}</strong>
                  <div className="mt-1">
                    <a
                      href={`https://wa.me/62${selectedSchoolModal.principalPhone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat WhatsApp KS</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-100 rounded-sm">
                  <span className="text-[10px] text-slate-500 block">Total GTK</span>
                  <strong className="text-indigo-950 text-sm">{selectedSchoolModal.totalTeachers}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-sm border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">Hadir</span>
                  <strong className="text-emerald-800 text-sm">{selectedSchoolModal.hadirTepatWaktu}</strong>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-sm border border-amber-200">
                  <span className="text-[10px] text-amber-700 block">Terlambat</span>
                  <strong className="text-amber-800 text-sm">{selectedSchoolModal.terlambat}</strong>
                </div>
                <div className="p-2.5 bg-sky-50 rounded-sm border border-sky-200">
                  <span className="text-[10px] text-sky-700 block">Izin/Sakit</span>
                  <strong className="text-sky-800 text-sm">{selectedSchoolModal.izinDinas + selectedSchoolModal.sakit}</strong>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-sm border border-rose-200">
                  <span className="text-[10px] text-rose-700 block">Belum</span>
                  <strong className="text-rose-800 text-sm">{selectedSchoolModal.belumAbsen}</strong>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Pengawas Pembina ({SUPERVISOR_PROFILE.name}):
                </label>
                <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  "{selectedSchoolModal.notes || 'Tidak ada catatan khusus.'}"
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tingkat Kedisiplinan: <strong className="text-emerald-700 text-sm">{selectedSchoolModal.disciplineRate}%</strong>
                </span>

                <div className="flex items-center gap-2">
                  {!selectedSchoolModal.isVerifiedBySupervisor && (
                    <button
                      type="button"
                      onClick={() => {
                        handleVerifySchool(selectedSchoolModal.id, selectedSchoolModal.name);
                        setSelectedSchoolModal(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Sahkan Presensi Sekolah Ini
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedSchoolModal(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-sm text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
