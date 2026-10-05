import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserCheck, CheckCircle2, Clock, Calendar, 
  Search, Printer, Share2, RefreshCw, Send, ShieldCheck, 
  AlertCircle, Download, Award, FileText, Check, Lock, 
  MapPin, Building, Eye, ChevronRight, AlertTriangle, Sparkles,
  Activity, BellRing, Edit3, ShieldAlert, MessageSquare, Phone, ExternalLink,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { TEACHERS_LIST } from '../data/schoolData';
import { SCHOOL_CLASSES, CLASS_STUDENTS_ROSTER } from '../data/studentAttendanceData';
import { 
  TeacherAttendanceStatus, 
  TeacherAttendanceRecord, 
  DailyTeacherAttendanceReport,
  getTeacherAttendanceForDate, 
  checkInTeacher, 
  checkOutTeacher, 
  verifyTeacherAttendanceByAuthorities,
  getCurrentWitaTimeString,
  TEACHER_ATTENDANCE_UPDATED_EVENT 
} from '../utils/teacherAttendanceStore';
import { 
  DailyClassAttendance, 
  AttendanceStatus, 
  StudentAttendanceRecord,
  StudentMonthlyWarning,
  MonthlyClassReport 
} from '../types';
import { 
  getClassAttendance, 
  saveClassAttendance, 
  updateStudentRecord, 
  markAllStudentsPresent, 
  getClassStudents,
  getActiveSelectedTeacher,
  setActiveSelectedTeacher,
  getMonthlyClassReport 
} from '../utils/studentAttendanceStore';
import { 
  getAllMonthlyWarnings, 
  DEFAULT_MONTHLY_WARNINGS,
  WARNINGS_UPDATED_EVENT,
  updateWarningAction 
} from '../utils/attendanceWarningStore';
import { exportTeacherAttendancePDF } from '../utils/teacherAttendancePdfExport';
import { exportMonthlyAttendancePDF, formatIndonesianDate } from '../utils/attendancePdfExport';

interface Props {
  onNavigateToTeacher?: (teacherId: string) => void;
  onNavigateToSupervisor?: () => void;
}

export type SimakMode = 'dashboard' | 'input-kelas' | 'input-guru' | 'warning' | 'supervisi';

export const TeacherAttendanceModule: React.FC<Props> = ({ 
  onNavigateToTeacher,
  onNavigateToSupervisor 
}) => {
  // Modes: 'dashboard' (Monitoring), 'input-kelas' (Input Presensi Kelas), 'input-guru' (Presensi Guru), 'warning' (Peringatan Dini), 'supervisi' (Kepala Sekolah & Pengawas)
  const [activeMode, setActiveMode] = useState<SimakMode>('dashboard');

  // Selected date (default 2026-10-05)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-05');

  // Active Teacher Account (default Mantasia, S.Pd. - t13)
  const [activeTeacherId, setActiveTeacherId] = useState<string>(() => {
    return getActiveSelectedTeacher() || 't13';
  });

  // Selected Class ID for Input Presensi Kelas (defaults to active teacher's class e.g. 6A)
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const tId = getActiveSelectedTeacher() || 't13';
    const matched = SCHOOL_CLASSES.find(c => c.teacherId === tId);
    return matched ? matched.id : '6A';
  });

  // Search and status filters for Teacher Monitoring
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TeacherAttendanceStatus>('ALL');

  // Teacher Attendance Report state
  const [report, setReport] = useState<DailyTeacherAttendanceReport>(() => 
    getTeacherAttendanceForDate(selectedDate)
  );

  // Class Attendance state for Input Presensi Kelas
  const [classAttendance, setClassAttendance] = useState<DailyClassAttendance>(() => 
    getClassAttendance(selectedDate, selectedClassId)
  );
  const [classStudentSearch, setClassStudentSearch] = useState<string>('');
  const [classStatusFilter, setClassStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL');

  // Self check-in form state for Teacher
  const [inputStatus, setInputStatus] = useState<TeacherAttendanceStatus>('HADIR_TEPAT_WAKTU');
  const [teachingJournal, setTeachingJournal] = useState<string>('Pembelajaran IPAS Bab Ekosistem & Latihan Asesmen Standar Kelulusan Kelas VI');
  const [locationStatus, setLocationStatus] = useState<TeacherAttendanceRecord['locationStatus']>('Sekolah (GPS Terverifikasi)');

  // Early Warnings state (<80%)
  const [monthlyWarnings, setMonthlyWarnings] = useState<StudentMonthlyWarning[]>(() => {
    try {
      return getAllMonthlyWarnings();
    } catch {
      return DEFAULT_MONTHLY_WARNINGS;
    }
  });
  const [warningFilter, setWarningFilter] = useState<'ALL' | 'kritis' | 'waspada'>('ALL');

  // Quick live clock string
  const [currentClock, setCurrentClock] = useState<string>(getCurrentWitaTimeString());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Live timer tick for WITA clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentClock(getCurrentWitaTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync teacher report when date changes or update event received
  useEffect(() => {
    setReport(getTeacherAttendanceForDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const handleUpdate = () => {
      setReport(getTeacherAttendanceForDate(selectedDate));
    };
    window.addEventListener(TEACHER_ATTENDANCE_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(TEACHER_ATTENDANCE_UPDATED_EVENT, handleUpdate);
  }, [selectedDate]);

  // Sync warnings when update event received
  useEffect(() => {
    const handleWarningUpdate = () => {
      try {
        setMonthlyWarnings(getAllMonthlyWarnings());
      } catch {
        // ignore
      }
    };
    window.addEventListener(WARNINGS_UPDATED_EVENT, handleWarningUpdate);
    return () => window.removeEventListener(WARNINGS_UPDATED_EVENT, handleWarningUpdate);
  }, []);

  // Sync class attendance when selectedClassId or selectedDate changes
  useEffect(() => {
    setClassAttendance(getClassAttendance(selectedDate, selectedClassId));
  }, [selectedDate, selectedClassId]);

  // Currently logged-in active teacher object
  const activeTeacher = useMemo(() => {
    return TEACHERS_LIST.find(t => t.id === activeTeacherId) || TEACHERS_LIST[0];
  }, [activeTeacherId]);

  // Current active teacher record for today
  const activeTeacherRecord = useMemo(() => {
    return report.records[activeTeacherId];
  }, [report, activeTeacherId]);

  // Current Class Info for Input Presensi Kelas
  const currentClassInfo = useMemo(() => {
    return SCHOOL_CLASSES.find(c => c.id === selectedClassId) || SCHOOL_CLASSES[10]; // Kelas 6A default
  }, [selectedClassId]);

  // Students roster for selected class
  const classStudents = useMemo(() => {
    return getClassStudents(selectedClassId);
  }, [selectedClassId]);

  // Filtered students for class attendance table
  const filteredClassStudents = useMemo(() => {
    return classStudents.filter(st => {
      const matchesSearch = 
        st.name.toLowerCase().includes(classStudentSearch.toLowerCase()) ||
        st.nisn.includes(classStudentSearch);
      
      const rec = classAttendance.records[st.id];
      const matchesStatus = classStatusFilter === 'ALL' || (rec && rec.status === classStatusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [classStudents, classStudentSearch, classStatusFilter, classAttendance]);

  // Filtered teachers list for Monitoring table
  const filteredTeacherRecords = useMemo(() => {
    const records = Object.values(report.records) as TeacherAttendanceRecord[];
    return records.filter(r => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [report, searchQuery, statusFilter]);

  // Recharts Chart Data for GTK Status Composition
  const statusPieData = useMemo(() => {
    return [
      { name: 'Tepat Waktu', value: report.summary.hadirTepatWaktu, color: '#059669' },
      { name: 'Terlambat', value: report.summary.terlambat, color: '#d97706' },
      { name: 'Izin Dinas', value: report.summary.izinDinas, color: '#0284c7' },
      { name: 'Sakit', value: report.summary.sakit, color: '#e11d48' },
      { name: 'Cuti', value: report.summary.cuti, color: '#7c3aed' },
      { name: 'Belum Absen', value: report.summary.belumAbsen, color: '#94a3b8' },
    ].filter(item => item.value > 0);
  }, [report]);

  // Weekly Discipline Bar Data (SDN 5 Barandasi)
  const weeklyAttendanceTrend = [
    { day: 'Senin', hadir: 22, terlambat: 0, izin: 0, persentase: 100 },
    { day: 'Selasa', hadir: 21, terlambat: 1, izin: 0, persentase: 95.5 },
    { day: 'Rabu', hadir: 20, terlambat: 1, izin: 1, persentase: 95.5 },
    { day: 'Kamis', hadir: 22, terlambat: 0, izin: 0, persentase: 100 },
    { day: 'Jumat', hadir: 21, terlambat: 0, izin: 1, persentase: 95.5 },
    { day: 'Hari Ini (05/10)', hadir: report.summary.hadirTepatWaktu, terlambat: report.summary.terlambat, izin: report.summary.izinDinas, persentase: report.summary.attendanceRate },
  ];

  // Filtered Early Warnings
  const filteredWarnings = useMemo(() => {
    if (warningFilter === 'ALL') return monthlyWarnings;
    return monthlyWarnings.filter(w => w.riskLevel === warningFilter);
  }, [monthlyWarnings, warningFilter]);

  // Handle active teacher selection
  const handleTeacherChange = (newTeacherId: string) => {
    setActiveTeacherId(newTeacherId);
    setActiveSelectedTeacher(newTeacherId);

    // If teacher is associated with a class, auto switch to that class
    const matched = SCHOOL_CLASSES.find(c => c.teacherId === newTeacherId);
    if (matched) {
      setSelectedClassId(matched.id);
    }

    const tObj = TEACHERS_LIST.find(t => t.id === newTeacherId);
    setToastMessage({
      text: `Beralih ke Akun Guru: ${tObj?.name || 'Pendidik'} (${tObj?.subject || ''})`,
      type: 'info'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Self Check-in action (JAM TERKUNCI OTOMATIS TIDAK BISA DIEDIT GURU)
  const handleTeacherCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = checkInTeacher(
      selectedDate,
      activeTeacherId,
      inputStatus,
      teachingJournal,
      locationStatus
    );

    setToastMessage({
      text: `Presensi ${activeTeacher.name} berhasil dicatat pada ${updated.checkInTime} (Terkunci Otomatis oleh Server WITA)!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleTeacherCheckOut = () => {
    checkOutTeacher(selectedDate, activeTeacherId);
    setToastMessage({
      text: `Jam pulang ${activeTeacher.name} berhasil dicatat pada ${getCurrentWitaTimeString()}!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Class Attendance Record Actions (JAM TERKUNCI TIDAK BISA DIEDIT GURU)
  const handleClassStatusChange = (studentId: string, status: AttendanceStatus) => {
    const existingRec = classAttendance.records[studentId];
    updateStudentRecord(selectedDate, selectedClassId, studentId, status, existingRec?.note);
    setClassAttendance(getClassAttendance(selectedDate, selectedClassId));
  };

  const handleClassNoteChange = (studentId: string, note: string) => {
    const existingRec = classAttendance.records[studentId];
    const status = existingRec?.status || 'H';
    updateStudentRecord(selectedDate, selectedClassId, studentId, status, note);
    setClassAttendance(getClassAttendance(selectedDate, selectedClassId));
  };

  const handleClassMarkAllPresent = () => {
    markAllStudentsPresent(selectedDate, selectedClassId);
    setClassAttendance(getClassAttendance(selectedDate, selectedClassId));
    setToastMessage({
      text: `Seluruh siswa ${currentClassInfo.name} berhasil ditandai Hadir (H)!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveClassAttendance = () => {
    saveClassAttendance(classAttendance);
    setToastMessage({
      text: `Presensi ${currentClassInfo.name} berhasil disimpan dan disinkronkan ke SIMAK Real-Time!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Authority Verification
  const handleAuthorityVerify = (authority: 'principal' | 'pengawas' | 'both') => {
    verifyTeacherAttendanceByAuthorities(selectedDate, authority);
    setToastMessage({
      text: authority === 'both' 
        ? 'Presensi harian guru telah resmi disahkan oleh Kepala Sekolah & Pengawas Bina!'
        : 'Presensi harian guru berhasil divalidasi dan disahkan!',
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Universal Unduh PDF
  const handleDownloadPdf = () => {
    if (activeMode === 'input-kelas') {
      try {
        const monthlyReport = getMonthlyClassReport(selectedClassId);
        exportMonthlyAttendancePDF(monthlyReport);
        setToastMessage({
          text: `Dokumen PDF Laporan Presensi ${currentClassInfo.name} berhasil diunduh!`,
          type: 'success'
        });
      } catch (err) {
        exportTeacherAttendancePDF(report);
      }
    } else {
      exportTeacherAttendancePDF(report);
      setToastMessage({
        text: 'Dokumen PDF Rekapitulasi Presensi Guru (SIMAK) resmi berhasil diunduh!',
        type: 'success'
      });
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Copy WhatsApp Summary for Dinas & Pengawas Bina
  const handleCopyWaSummary = () => {
    const formattedDate = formatIndonesianDate(selectedDate);
    
    if (activeMode === 'input-kelas') {
      const waClassText = 
`*LAPORAN PRESENSI HARIAN SISWA (SIMAK)*
*UPTD SDN 5 BARANDASI, KEC. LAU, KAB. MAROS*
📅 *Hari/Tanggal:* ${formattedDate}
🏫 *Kelas / Rombel:* ${currentClassInfo.name}
👩‍🏫 *Wali Kelas:* ${currentClassInfo.teacherName} (NIP: ${currentClassInfo.teacherNip})
⏰ *Jam Tercatat Server:* 07:15 WITA (Terkunci Otomatis)

📊 *REKAPITULASI KEHADIRAN KELAS:*
• Total Siswa Terdaftar: ${currentClassInfo.totalStudents} Siswa
• Hadir (H): ${classAttendance.summary.hadir} Siswa
• Sakit (S): ${classAttendance.summary.sakit} Siswa
• Izin (I): ${classAttendance.summary.izin} Siswa
• Alpa (A): ${classAttendance.summary.alpa} Siswa
📈 *Persentase Kehadiran Kelas:* ${classAttendance.summary.rate}%

📍 _Data terintegrasi langsung dengan SIMAK UPTD SDN 5 Barandasi, Kepala Sekolah (Hadijah, S.Pd., M.Pd.), dan Pengawas Bina (Hj. Mirna, S.Pd., M.Pd.)._`;

      navigator.clipboard.writeText(waClassText);
      setToastMessage({
        text: `Format laporan presensi ${currentClassInfo.name} berhasil disalin ke clipboard!`,
        type: 'success'
      });
    } else {
      const waText = 
`*LAPORAN REKAPITULASI PRESENSI GURU & TENDIK (SIMAK)*
*UPTD SDN 5 BARANDASI, KEC. LAU, KAB. MAROS*
📅 *Hari/Tanggal:* ${formattedDate}
⏰ *Waktu Pemantauan:* ${getCurrentWitaTimeString()}

📊 *RINGKASAN KEHADIRAN GTK:*
• Total Tenaga Pendidik & Kependidikan: ${report.summary.totalTeachers} Orang
• Hadir Tepat Waktu: ${report.summary.hadirTepatWaktu} Orang
• Terlambat: ${report.summary.terlambat} Orang
• Izin Dinas / KKG: ${report.summary.izinDinas} Orang
• Sakit: ${report.summary.sakit} Orang
• Cuti: ${report.summary.cuti} Orang
• Belum Absen: ${report.summary.belumAbsen} Orang
📈 *Tingkat Kehadiran Sekolah:* ${report.summary.attendanceRate}%

✅ *STATUS SUPERVISI KEDINASAN:*
• Pengesahan Kepala Sekolah: *${report.isVerifiedByPrincipal ? 'SUDAH DISAHKAN (Hadijah, S.Pd., M.Pd.)' : 'Belum Diverifikasi'}*
• Pengawasan Pengawas Bina: *${report.isVerifiedByPengawas ? 'SUDAH DITERIMA & DIVERIFIKASI (Hj. Mirna, S.Pd., M.Pd.)' : 'Menunggu Validasi'}*

📍 _Data terintegrasi langsung secara Real-Time dengan Sistem Informasi Manajemen Akademik (SIMAK) UPTD SDN 5 Barandasi._`;

      navigator.clipboard.writeText(waText);
      setToastMessage({
        text: 'Format laporan presensi guru resmi WhatsApp telah disalin ke clipboard!',
        type: 'success'
      });
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section id="absensi-guru" className="py-12 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* HEADER: SISTEM INFORMASI MANAJEMEN AKADEMIK (SIMAK GURU)                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          {/* Top Decorative Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-950 via-amber-400 to-indigo-950" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-950 text-amber-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-xs shadow-2xs border border-indigo-900">
                  SISTEM INFORMASI MANAJEMEN AKADEMIK
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-xs border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  REAL-TIME SYNC
                </span>
                <span className="bg-amber-100 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-amber-300 uppercase">
                  Akreditasi B
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase tracking-tight">
                MODUL ABSENSI HARIAN GURU & DASHBOARD MONITORING GURU
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                Pemantauan kehadiran guru secara real-time terintegrasi langsung dengan data <strong>Kepala Sekolah UPTD SDN 5 Barandasi, Kecamatan Lau, Kabupaten Maros</strong> (Hadijah, S.Pd., M.Pd.) dan <strong>Pengawas Bina</strong> (Hj. Mirna, S.Pd., M.Pd.) guna penegakan disiplin ASN/PPPK & kualitas pembelajaran.
              </p>
            </div>

            {/* Quick Live System Clock Widget & Teacher Profile */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <div className="bg-indigo-950 text-white p-3.5 sm:p-4 rounded-sm border border-indigo-900 shadow-sm flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                  <Clock className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Waktu Server Resmi (WITA)
                  </span>
                  <div className="text-xl font-mono font-black text-amber-300 tracking-tight">
                    {currentClock}
                  </div>
                  <div className="text-[10px] text-slate-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-300" />
                    <span>Jam Terkunci Otomatis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Action Bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Mode Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMode('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'dashboard'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-300" />
                <span>Dashboard Live Monitoring</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('input-kelas')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'input-kelas'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Input Presensi Kelas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('warning')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeMode === 'warning'
                    ? 'bg-rose-900 text-white shadow-xs border border-rose-800'
                    : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <BellRing className={`w-4 h-4 ${monthlyWarnings.length > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span>Peringatan Dini (&lt;80%)</span>
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                  {monthlyWarnings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('input-guru')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'input-guru'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Presensi Mandiri Guru</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('supervisi')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'supervisi'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Supervisi KS & Pengawas Bina</span>
              </button>
            </div>

            {/* Date Picker, Ganti Akun Guru, Unduh PDF, Salin WA, Cetak */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Tanggal Selector: 05/10/2026 */}
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

              {/* Ganti Akun Guru Selector: Mantasia, S.Pd. (Guru Kelas 6A) default */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm text-xs">
                <span className="font-bold text-slate-700 shrink-0">Ganti Akun Guru:</span>
                <select
                  value={activeTeacherId}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className="bg-transparent font-bold text-indigo-950 focus:outline-hidden cursor-pointer max-w-[210px] truncate"
                >
                  {TEACHERS_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Unduh PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                title="Unduh format PDF laporan presensi resmi"
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs border border-indigo-700"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh PDF</span>
              </button>

              {/* Salin Format WA Button */}
              <button
                type="button"
                onClick={handleCopyWaSummary}
                title="Salin rekap pesan WA resmi untuk Dinas & Pengawas Bina"
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salin Format WA</span>
              </button>

              {/* Cetak Button */}
              <button
                type="button"
                onClick={() => window.print()}
                title="Cetak format cetak resmi kedinasan"
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
        {/* MODE 1: DASHBOARD LIVE MONITORING GURU                                    */}
        {/* ========================================================================= */}
        {activeMode === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Top 6 KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-sm border-l-4 border-indigo-900 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total GTK</span>
                <span className="text-2xl font-black text-indigo-950">{report.summary.totalTeachers}</span>
                <span className="text-[10px] text-slate-400 block">Guru & Tendik</span>
              </div>

              <div className="bg-white p-4 rounded-sm border-l-4 border-emerald-600 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Hadir Tepat Waktu</span>
                <span className="text-2xl font-black text-emerald-700">{report.summary.hadirTepatWaktu}</span>
                <span className="text-[10px] text-slate-400 block">&lt; 07:00 WITA</span>
              </div>

              <div className="bg-white p-4 rounded-sm border-l-4 border-amber-500 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Terlambat</span>
                <span className="text-2xl font-black text-amber-700">{report.summary.terlambat}</span>
                <span className="text-[10px] text-slate-400 block">&gt; 07:00 WITA</span>
              </div>

              <div className="bg-white p-4 rounded-sm border-l-4 border-sky-500 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Izin Dinas / KKG</span>
                <span className="text-2xl font-black text-sky-700">{report.summary.izinDinas}</span>
                <span className="text-[10px] text-slate-400 block">Surat Tugas Ada</span>
              </div>

              <div className="bg-white p-4 rounded-sm border-l-4 border-rose-500 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Sakit / Cuti</span>
                <span className="text-2xl font-black text-rose-700">{report.summary.sakit + report.summary.cuti}</span>
                <span className="text-[10px] text-slate-400 block">Keterangan Dokter</span>
              </div>

              <div className="bg-white p-4 rounded-sm border-l-4 border-teal-600 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Persentase Kehadiran</span>
                <span className="text-2xl font-black text-teal-700">{report.summary.attendanceRate}%</span>
                <span className="text-[10px] text-slate-400 block">Tingkat Sekolah</span>
              </div>
            </div>

            {/* Supervisi Kepala Sekolah & Pengawas Bina Authority Banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-sm shadow-md border border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Sinkronisasi Supervisi & Evaluasi Kedinasan
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Terhubung Real-Time
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Kepala Sekolah: Hadijah, S.Pd., M.Pd. & Pengawas Bina: Hj. Mirna, S.Pd., M.Pd.
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Data kehadiran guru tersimpan terpusat untuk pelaporan absensi Dinas Pendidikan Kabupaten Maros dan validasi TPP/Sertifikasi GTK.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAuthorityVerify('both')}
                  className="bg-amber-400 hover:bg-amber-300 text-indigo-950 px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-950" />
                  <span>Sahkan Presensi Hari Ini</span>
                </button>
              </div>
            </div>

            {/* Recharts Data Visualization: Teacher Attendance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Bar Chart Status Kehadiran Guru Harian */}
              <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-indigo-950 tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Tren & Persentase Disiplin Kehadiran Guru Mingguan (%)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pemantauan konsistensi jam masuk kerja GTK UPTD SDN 5 Barandasi
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    Rata-rata: {report.summary.attendanceRate}%
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyAttendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '4px', color: '#fff', fontSize: '11px', border: 'none' }}
                        formatter={(val: any) => [`${val}%`, 'Tingkat Kehadiran']}
                      />
                      <Bar dataKey="persentase" fill="#1e1b4b" radius={[4, 4, 0, 0]}>
                        {weeklyAttendanceTrend.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.persentase >= 98 ? '#059669' : '#1e1b4b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Komposisi Kehadiran GTK Hari Ini */}
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold uppercase text-indigo-950 tracking-wide">
                    Komposisi Kehadiran Hari Ini
                  </h3>
                  <p className="text-xs text-slate-500">Distribusi 22 Guru & Tenaga Kependidikan</p>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '4px', color: '#fff', fontSize: '11px', border: 'none' }}
                        formatter={(val: any, name: any) => [`${val} Guru`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {statusPieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 text-[11px] truncate">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GTK Attendance Roster Table */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-indigo-950 uppercase tracking-tight">
                    Daftar Hadir Harian Guru & Tenaga Kependidikan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jam masuk & jam pulang tercatat otomatis dari sistem WITA dan terkunci untuk akurasi data.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-2.5 py-1 rounded-sm text-xs">
                    <span className="font-bold text-slate-600">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-transparent font-bold text-indigo-950 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">Semua ({Object.keys(report.records).length})</option>
                      <option value="HADIR_TEPAT_WAKTU">Hadir Tepat Waktu</option>
                      <option value="TERLAMBAT">Terlambat</option>
                      <option value="IZIN_DINAS">Izin Dinas</option>
                      <option value="SAKIT">Sakit</option>
                    </select>
                  </div>

                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari guru / NIP / tugas..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">No</th>
                      <th className="py-3 px-3">Nama Guru / Tendik</th>
                      <th className="py-3 px-3">Tugas / Rombel</th>
                      <th className="py-3 px-3 text-center">Status Presensi</th>
                      <th className="py-3 px-3 text-center">
                        <span className="flex items-center justify-center gap-1" title="Jam presensi otomatis terkunci oleh server WITA dan tidak dapat diedit bagi guru">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Jam Masuk*</span>
                        </span>
                      </th>
                      <th className="py-3 px-3 text-center">
                        <span className="flex items-center justify-center gap-1" title="Jam pulang otomatis terkunci oleh server WITA dan tidak dapat diedit bagi guru">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Jam Pulang*</span>
                        </span>
                      </th>
                      <th className="py-3 px-3">Lokasi Presensi</th>
                      <th className="py-3 px-3">Agenda / Jurnal Hari Ini</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTeacherRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          Tidak ada guru yang sesuai kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredTeacherRecords.map((tRec, idx) => (
                        <tr key={tRec.teacherId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 text-center text-slate-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-indigo-950 text-xs sm:text-sm">
                              {tRec.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              NIP: {tRec.nip}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            {tRec.role}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                              tRec.status === 'HADIR_TEPAT_WAKTU' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              tRec.status === 'TERLAMBAT' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              tRec.status === 'IZIN_DINAS' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                              tRec.status === 'SAKIT' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {tRec.status === 'HADIR_TEPAT_WAKTU' ? 'Hadir Tepat Waktu' :
                               tRec.status === 'TERLAMBAT' ? 'Terlambat' :
                               tRec.status === 'IZIN_DINAS' ? 'Izin Dinas' :
                               tRec.status === 'SAKIT' ? 'Sakit' : tRec.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span 
                              title="Waktu presensi otomatis terkunci oleh server WITA (Tidak dapat diedit bagi guru)"
                              className="font-mono text-xs font-bold text-indigo-950 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200 flex items-center justify-center gap-1"
                            >
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{tRec.checkInTime || '-'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span 
                              title="Waktu presensi otomatis terkunci oleh server WITA (Tidak dapat diedit bagi guru)"
                              className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-xs border border-slate-200 flex items-center justify-center gap-1"
                            >
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{tRec.checkOutTime || '-'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{tRec.locationStatus}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs truncate" title={tRec.teachingJournal}>
                            {tRec.teachingJournal || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 italic flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>*Aturan Kedinasan: Waktu presensi guru terikat otomatis dengan NTP/Server Time WITA dan tidak dapat diubah secara manual bagi guru guna menjamin keaslian data.</span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: INPUT PRESENSI KELAS (SISWA PER ROMBEL)                           */}
        {/* ========================================================================= */}
        {activeMode === 'input-kelas' && (
          <div className="space-y-6">
            
            {/* Class Selector Bar */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 block">
                    Pilih Rombongan Belajar (Rombel)
                  </span>
                  <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                    <span>{currentClassInfo.name}</span>
                    <span className="text-xs font-medium text-slate-500">• {currentClassInfo.room}</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Wali Kelas: <strong>{currentClassInfo.teacherName}</strong> (NIP: {currentClassInfo.teacherNip})
                  </p>
                </div>

                {/* Quick actions for class attendance */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClassMarkAllPresent}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Semua Hadir</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveClassAttendance}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Presensi Kelas</span>
                  </button>
                </div>
              </div>

              {/* Rombel Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                {SCHOOL_CLASSES.map(cls => (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                      selectedClassId === cls.id
                        ? 'bg-indigo-950 text-amber-300 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Attendance Summary KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-sm border-l-4 border-indigo-900 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Siswa</span>
                <span className="text-xl font-black text-indigo-950">{classStudents.length}</span>
              </div>
              <div className="bg-white p-3.5 rounded-sm border-l-4 border-emerald-600 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Hadir</span>
                <span className="text-xl font-black text-emerald-700">{classAttendance.summary.hadir}</span>
              </div>
              <div className="bg-white p-3.5 rounded-sm border-l-4 border-sky-600 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Sakit</span>
                <span className="text-xl font-black text-sky-700">{classAttendance.summary.sakit}</span>
              </div>
              <div className="bg-white p-3.5 rounded-sm border-l-4 border-amber-600 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Izin</span>
                <span className="text-xl font-black text-amber-700">{classAttendance.summary.izin}</span>
              </div>
              <div className="bg-white p-3.5 rounded-sm border-l-4 border-rose-600 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Alpa</span>
                <span className="text-xl font-black text-rose-700">{classAttendance.summary.alpa}</span>
              </div>
            </div>

            {/* Attendance Table per Rombel */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Daftar Hadir Murid:</span>
                  <span className="text-xs text-indigo-950 font-black">{currentClassInfo.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={classStudentSearch}
                      onChange={(e) => setClassStudentSearch(e.target.value)}
                      placeholder="Cari murid / NISN..."
                      className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">No</th>
                      <th className="py-3 px-3">Nama Siswa</th>
                      <th className="py-3 px-3 w-14 text-center">L/P</th>
                      <th className="py-3 px-3 w-56 text-center">Status Kehadiran</th>
                      <th className="py-3 px-3">Keterangan / Catatan</th>
                      <th className="py-3 px-3 w-36 text-center">
                        <span className="inline-flex items-center justify-center gap-1 text-slate-700" title="Jam presensi otomatis terkunci oleh server WITA dan tidak dapat diedit bagi guru">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Jam Masuk*</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClassStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          Tidak ada siswa yang sesuai pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredClassStudents.map((st, idx) => {
                        const rec: StudentAttendanceRecord = classAttendance.records[st.id] || {
                          studentId: st.id,
                          status: 'H',
                          checkInTime: '07:15 WITA'
                        };

                        return (
                          <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-indigo-950 text-xs sm:text-sm">
                                {st.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                NISN: {st.nisn}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                st.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                              }`}>
                                {st.gender}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => handleClassStatusChange(st.id, 'H')}
                                  title="Hadir"
                                  className={`px-2 py-0.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'H'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  H
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleClassStatusChange(st.id, 'S')}
                                  title="Sakit"
                                  className={`px-2 py-0.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'S'
                                      ? 'bg-sky-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  S
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleClassStatusChange(st.id, 'I')}
                                  title="Izin"
                                  className={`px-2 py-0.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'I'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  I
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleClassStatusChange(st.id, 'A')}
                                  title="Alpa / Tanpa Keterangan"
                                  className={`px-2 py-0.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'A'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  A
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="text"
                                value={rec.note || ''}
                                onChange={(e) => handleClassNoteChange(st.id, e.target.value)}
                                placeholder="Keterangan sakit / alasan izin..."
                                className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-sm text-xs focus:outline-hidden focus:border-indigo-900"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span 
                                title="Waktu presensi otomatis terkunci oleh server WITA (Tidak dapat diedit bagi guru)"
                                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200"
                              >
                                <Lock className="w-2.5 h-2.5 text-amber-600" />
                                <span>{rec.checkInTime || '07:15 WITA'}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Strict Notice: Jam tidak bisa diedit bagi guru */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 italic flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>*Ketentuan SIMAK Kedinasan: Waktu presensi siswa dan guru terikat otomatis dengan jam server WITA dan tidak dapat diedit secara manual bagi guru guna menjamin keabsahan data.</span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: PERINGATAN DINI (<80%)                                            */}
        {/* ========================================================================= */}
        {activeMode === 'warning' && (
          <div className="space-y-6">
            
            {/* Warning Header Alert Banner */}
            <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-rose-500/40 text-white p-5 sm:p-6 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-600/30 border-2 border-rose-400 flex items-center justify-center shrink-0">
                  <BellRing className="w-6 h-6 text-rose-300 animate-bounce" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                      PERINGATAN DINI OTOMATIS
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      Ambang Batas Kehadiran Bulanan &lt; 80%
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    Terdeteksi {monthlyWarnings.length} Siswa Memerlukan Perhatian Khusus ({monthlyWarnings[0]?.monthName || 'September 2026'})
                  </h3>
                  <p className="text-xs text-rose-200/90 mt-0.5">
                    Tingkat kehadiran di bawah 80% berpotensi menghambat capaian pembelajaran dan membutuhkan tindak lanjut koordinasi wali murid.
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWarningFilter('ALL')}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                    warningFilter === 'ALL' ? 'bg-white text-rose-950' : 'bg-rose-900 text-white hover:bg-rose-800'
                  }`}
                >
                  Semua ({monthlyWarnings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWarningFilter('kritis')}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                    warningFilter === 'kritis' ? 'bg-white text-rose-950' : 'bg-rose-900 text-white hover:bg-rose-800'
                  }`}
                >
                  Kritis &lt;70% (2)
                </button>
                <button
                  type="button"
                  onClick={() => setWarningFilter('waspada')}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                    warningFilter === 'waspada' ? 'bg-white text-rose-950' : 'bg-rose-900 text-white hover:bg-rose-800'
                  }`}
                >
                  Waspada (4)
                </button>
              </div>
            </div>

            {/* Warning Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWarnings.map((warn) => (
                <div key={warn.id} className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    warn.riskLevel === 'kritis' ? 'bg-rose-600' : 'bg-amber-500'
                  }`} />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-xs ${
                        warn.riskLevel === 'kritis'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {warn.riskLevel === 'kritis' ? 'Status Kritis (<70%)' : 'Status Waspada (<80%)'}
                      </span>
                      <h4 className="text-sm font-extrabold text-indigo-950 mt-1.5">
                        {warn.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NISN: {warn.nisn} • {warn.className}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-rose-600">
                        {warn.attendanceRate}%
                      </div>
                      <span className="text-[10px] text-slate-400">Kehadiran</span>
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 rounded-sm text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Hadir</span>
                      <strong className="text-emerald-700">{warn.hadir}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Sakit</span>
                      <strong className="text-sky-700">{warn.sakit}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Izin</span>
                      <strong className="text-amber-700">{warn.izin}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Alpa</span>
                      <strong className="text-rose-700">{warn.alpa}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/50 p-2.5 rounded-sm border border-slate-100">
                    "{warn.notes}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Orang Tua / Wali:</span>
                      <strong className="text-slate-800 text-[11px]">{warn.parentName} ({warn.parentPhone})</strong>
                    </div>

                    <a
                      href={`https://wa.me/62${warn.parentPhone.replace(/^0/, '')}?text=${encodeURIComponent(`Yth. ${warn.parentName}, kami dari UPTD SDN 5 Barandasi memberitahukan kehadiran ananda ${warn.studentName} pada bulan ${warn.monthName} tercatat ${warn.attendanceRate}%. Mohon kesediaan Bapak/Ibu untuk berkoordinasi bersama pihak sekolah.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Kirim WA</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 4: PRESENSI MANDIRI GURU (JAM TIDAK BISA DIEDIT GURU)                */}
        {/* ========================================================================= */}
        {activeMode === 'input-guru' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-200 shadow-sm space-y-6">
              {/* Form Title & Teacher Profile */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-900 text-amber-300 font-black flex items-center justify-center text-lg">
                    {activeTeacher.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 block">
                      Akun Pendidik Terpilih
                    </span>
                    <h3 className="text-lg font-black text-indigo-950">
                      {activeTeacher.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      NIP: {activeTeacher.nip} • {activeTeacher.subject}
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-sm border border-emerald-300">
                  Aktif Bertugas
                </span>
              </div>

              {/* STRICT RULE NOTICE: JAM TIDAK BISA DIEDIT GURU */}
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-sm text-xs space-y-1.5">
                <div className="font-extrabold text-amber-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>KETENTUAN JAM PRESENSI SISTEM SIMAK UPTD SDN 5 BARANDASI:</span>
                </div>
                <p className="text-amber-900 leading-relaxed">
                  Sesuai arahan Kepala Sekolah dan Pengawas Bina, <strong>jam masuk dan jam pulang terkunci otomatis oleh sistem server WITA</strong> saat tombol presensi ditekan dan <strong>TIDAK DAPAT DIEDIT</strong> secara manual oleh guru guna menjamin keaslian data presensi kedinasan.
                </p>
              </div>

              <form onSubmit={handleTeacherCheckIn} className="space-y-5 text-xs">
                
                {/* Waktu Sekarang Terkunci */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-300">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Waktu Masuk Server (Otomatis & Terkunci):</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={`${currentClock} (WITA)`}
                      className="w-full bg-slate-200/80 border border-slate-300 rounded-sm px-3 py-2 font-mono text-sm font-black text-indigo-950 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Waktu diambil langsung dari jam server, bebas manipulasi manual bagi guru.
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-300">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lokasi Presensi:</span>
                    </label>
                    <select
                      value={locationStatus}
                      onChange={(e) => setLocationStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 font-semibold text-slate-800 focus:outline-hidden"
                    >
                      <option value="Sekolah (GPS Terverifikasi)">Sekolah (UPTD SDN 5 Barandasi - GPS Valid)</option>
                      <option value="Tugas Luar / Dinas">Tugas Luar / Dinas (Dinas Pendidikan Kab. Maros)</option>
                      <option value="Rumah / Sakit">Rumah (Izin Sakit / Cuti)</option>
                    </select>
                  </div>
                </div>

                {/* Status Kehadiran Radio Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Status Kehadiran Hari Ini:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setInputStatus('HADIR_TEPAT_WAKTU')}
                      className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                        inputStatus === 'HADIR_TEPAT_WAKTU'
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs">Hadir Tepat Waktu</div>
                      <div className="text-[10px] text-slate-500">Sebelum 07:00 WITA</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInputStatus('TERLAMBAT')}
                      className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                        inputStatus === 'TERLAMBAT'
                          ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 text-amber-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs">Terlambat</div>
                      <div className="text-[10px] text-slate-500">Setelah 07:00 WITA</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInputStatus('IZIN_DINAS')}
                      className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                        inputStatus === 'IZIN_DINAS'
                          ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/20 text-sky-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs">Izin Dinas / KKG</div>
                      <div className="text-[10px] text-slate-500">Workshop / Pelatihan</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInputStatus('SAKIT')}
                      className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                        inputStatus === 'SAKIT'
                          ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-600/20 text-rose-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs">Sakit / Cuti</div>
                      <div className="text-[10px] text-slate-500">Surat Dokter</div>
                    </button>
                  </div>
                </div>

                {/* Jurnal Mengajar / Agenda Harian */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jurnal Mengajar & Agenda Pembelajaran Hari Ini:
                  </label>
                  <textarea
                    rows={3}
                    value={teachingJournal}
                    onChange={(e) => setTeachingJournal(e.target.value)}
                    placeholder="Tuliskan mata pelajaran, topik bahasan, aktivitas KBM, atau agenda tugas kedinasan..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
                  />
                </div>

                {/* Status Tercatat Saat Ini */}
                {activeTeacherRecord?.checkInTime && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block">Presensi Masuk Hari Ini Telah Tercatat:</span>
                      <span className="text-slate-600 font-mono">
                        Jam Masuk: <strong>{activeTeacherRecord.checkInTime}</strong> | Jam Pulang: <strong>{activeTeacherRecord.checkOutTime || 'Belum Check-Out'}</strong>
                      </span>
                    </div>

                    {!activeTeacherRecord.checkOutTime && (
                      <button
                        type="button"
                        onClick={handleTeacherCheckOut}
                        className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs rounded-sm cursor-pointer shadow-xs"
                      >
                        Catat Jam Pulang ({currentClock})
                      </button>
                    )}
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-black uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md border border-indigo-700"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Catat Presensi Saya Sekarang ({currentClock})</span>
                  </button>
                </div>
              </form>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 5: SUPERVISI KEPALA SEKOLAH & PENGAWAS BINA                          */}
        {/* ========================================================================= */}
        {activeMode === 'supervisi' && (
          <div className="space-y-6">
            
            {/* Supervisi Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Kepala Sekolah */}
              <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-950 text-amber-300 font-black flex items-center justify-center border-2 border-amber-400">
                      KS
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900 block">
                        Kepala UPTD SDN 5 Barandasi
                      </span>
                      <h4 className="text-base font-extrabold text-indigo-950">
                        Hadijah, S.Pd., M.Pd.
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NIP Terdaftar KSP UPTD SDN 5 Barandasi
                      </p>
                    </div>
                  </div>

                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                    Otoritas Penilai
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Memverifikasi kepatuhan jam kerja, kesiapan jurnal harian guru, dan pengesahan presensi untuk laporan Dapodik & Tunjangan Kinerja Daerah.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">
                    Status: <strong className="text-emerald-700">{report.isVerifiedByPrincipal ? 'Telah Disahkan' : 'Menunggu Pengesahan'}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAuthorityVerify('principal')}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                  >
                    Sahkan Sebagai Kepala Sekolah
                  </button>
                </div>
              </div>

              {/* Card 2: Pengawas Pembina (Hj. Mirna, S.Pd., M.Pd.) */}
              <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-300 font-black flex items-center justify-center border-2 border-amber-400">
                      HM
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">
                        Pengawas Pembina Jenjang SD Kec. Lau
                      </span>
                      <h4 className="text-base font-extrabold text-indigo-950">
                        Hj. Mirna, S.Pd., M.Pd.
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NIP: 19740612 199903 2 003 • Pembina Tk. I, IV/b
                      </p>
                    </div>
                  </div>

                  <span className="bg-sky-100 text-sky-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-sky-300">
                    Dinas Pendidikan Maros
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Supervisi akademik & pemantauan real-time disiplin GTK di 6 sekolah binaan Kecamatan Lau, validasi jam mengajar, dan penegakan kehadiran ASN/PPPK.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-bold">
                    Status: <strong className="text-sky-700">{report.isVerifiedByPengawas ? 'Terverifikasi Pengawas' : 'Menunggu Validasi'}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {onNavigateToSupervisor && (
                      <button
                        type="button"
                        onClick={onNavigateToSupervisor}
                        className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs border border-indigo-800 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                        <span>Buka Dashboard Pengawas</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAuthorityVerify('pengawas')}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                    >
                      Sahkan Sebagai Pengawas
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Export Banner for Authorities */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-900" />
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-indigo-950">
                    Ekspor Berkas Resmi Supervisi Presensi Guru
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Format cetak dokumen resmi lengkap Kop Surat Dinas Pendidikan Kabupaten Maros & Tanda Tangan Berkolom Ganda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => exportTeacherAttendancePDF(report)}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unduh Dokumen PDF (.pdf)</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
