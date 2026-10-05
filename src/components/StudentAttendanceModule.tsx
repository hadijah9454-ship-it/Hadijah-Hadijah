import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserCheck, CheckCircle2, AlertCircle, Clock, Calendar, 
  Search, ArrowRight, Printer, Share2, Sparkles, RefreshCw, 
  Send, ShieldCheck, HeartPulse, Info, MessageSquare, Phone, 
  Edit3, Check, Filter, Layers, Download, ChevronRight, School,
  Activity, X, BellRing, AlertTriangle, FileWarning, ShieldAlert, 
  FileText, PhoneCall, ExternalLink, Eye, UserPlus, ArrowLeft, Lock
} from 'lucide-react';
import { 
  DailyClassAttendance, 
  AttendanceStatus, 
  StudentAttendanceRecord, 
  SchoolClassInfo,
  Teacher,
  StudentMonthlyWarning,
  AttendanceRiskLevel,
  AttendanceActionStatus
} from '../types';
import { TEACHERS_LIST } from '../data/schoolData';
import { SCHOOL_CLASSES, CLASS_STUDENTS_ROSTER } from '../data/studentAttendanceData';
import { 
  getTodayDateString, 
  getClassAttendance, 
  saveClassAttendance, 
  markAllStudentsPresent, 
  verifyAttendanceByPrincipal, 
  getSchoolRealtimeSummary,
  getActiveSelectedTeacher,
  setActiveSelectedTeacher,
  updateStudentRecord,
  getClassStudents,
  STUDENT_ROSTER_UPDATED_EVENT
} from '../utils/studentAttendanceStore';
import { 
  getAllMonthlyWarnings, 
  updateWarningAction, 
  WARNINGS_UPDATED_EVENT 
} from '../utils/attendanceWarningStore';
import { getStoredTeacherPhotos, getTeacherEffectivePhoto } from '../utils/teacherPhotoStore';
import { AddStudentModal } from './AddStudentModal';
import { AttendancePdfExportModal } from './AttendancePdfExportModal';

interface Props {
  onNavigateToTeacher?: (teacherId: string) => void;
}

export const StudentAttendanceModule: React.FC<Props> = ({ onNavigateToTeacher }) => {
  // Main view modes: 'dashboard' (Real-time monitoring), 'input' (Class attendance sheet), or 'warning' (Early warning <80%)
  const [activeMode, setActiveMode] = useState<'dashboard' | 'input' | 'warning'>('dashboard');
  
  // Date selection
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  
  // Currently logged-in / active teacher context
  const [activeTeacherId, setActiveTeacherId] = useState<string>(getActiveSelectedTeacher());

  // Selected class for input or detail (defaults to active teacher's class e.g. 6A for Mantasia, S.Pd.)
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const tId = getActiveSelectedTeacher();
    const matched = SCHOOL_CLASSES.find(c => c.teacherId === tId);
    return matched ? matched.id : '6A';
  });
  
  // Search and filters for daily attendance
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL');

  // Attendance state
  const [currentAttendance, setCurrentAttendance] = useState<DailyClassAttendance>(() => 
    getClassAttendance(selectedDate, selectedClassId)
  );
  
  // Realtime summary
  const [realtimeSummary, setRealtimeSummary] = useState(() => 
    getSchoolRealtimeSummary(selectedDate)
  );

  // Custom teacher photos map
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>(() => getStoredTeacherPhotos());

  // Early Warning System (<80% monthly attendance) state
  const [monthlyWarnings, setMonthlyWarnings] = useState<StudentMonthlyWarning[]>(getAllMonthlyWarnings);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | AttendanceRiskLevel>('ALL');
  const [selectedWarningClassFilter, setSelectedWarningClassFilter] = useState<string>('ALL');
  const [selectedActionFilter, setSelectedActionFilter] = useState<'ALL' | AttendanceActionStatus>('ALL');
  const [warningSearch, setWarningSearch] = useState<string>('');

  // Modals for early warning actions
  const [waWarningModalStudent, setWaWarningModalStudent] = useState<StudentMonthlyWarning | null>(null);
  const [scheduleCounselingModal, setScheduleCounselingModal] = useState<StudentMonthlyWarning | null>(null);
  const [counselingDate, setCounselingDate] = useState<string>('2026-09-26');
  const [counselingTime, setCounselingTime] = useState<string>('09:00 WITA');
  const [counselingNote, setCounselingNote] = useState<string>('Pertemuan tatap muka bersama Wali Murid dan Guru BK di Ruang Konseling.');
  const [printableLetterStudent, setPrintableLetterStudent] = useState<StudentMonthlyWarning | null>(null);

  // Modals for Adding Student & Exporting PDF
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState<boolean>(false);
  const [rosterVersion, setRosterVersion] = useState<number>(0);

  // Class Selection Step before inputting attendance per rombel
  const [inputViewStep, setInputViewStep] = useState<'select-class' | 'roster-sheet'>('select-class');
  const [classLevelFilter, setClassLevelFilter] = useState<'ALL' | number>('ALL');
  const [classSearchQuery, setClassSearchQuery] = useState<string>('');

  // Quick feedback toasts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Modal for sending WhatsApp message to parent for daily absence
  const [waModalStudent, setWaModalStudent] = useState<{
    studentName: string;
    parentName: string;
    parentPhone: string;
    status: AttendanceStatus;
    className: string;
    note?: string;
  } | null>(null);

  // Refresh attendance when date or class changes
  useEffect(() => {
    setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
    setRealtimeSummary(getSchoolRealtimeSummary(selectedDate));
  }, [selectedDate, selectedClassId, rosterVersion]);

  // Listen to custom store events for multi-tab or reactive sync
  useEffect(() => {
    const handleUpdate = () => {
      setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
      setRealtimeSummary(getSchoolRealtimeSummary(selectedDate));
      setCustomPhotos(getStoredTeacherPhotos());
    };

    const handleTeacherChange = (e: any) => {
      if (e.detail?.teacherId) {
        setActiveTeacherId(e.detail.teacherId);
      }
    };

    const handleWarningsUpdate = () => {
      setMonthlyWarnings(getAllMonthlyWarnings());
    };

    const handleRosterUpdate = () => {
      setRosterVersion(v => v + 1);
      setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
      setRealtimeSummary(getSchoolRealtimeSummary(selectedDate));
    };

    window.addEventListener('sdn5_student_attendance_updated', handleUpdate);
    window.addEventListener('sdn5_active_teacher_changed', handleTeacherChange);
    window.addEventListener('sdn5_teacher_photos_updated', handleUpdate);
    window.addEventListener(WARNINGS_UPDATED_EVENT, handleWarningsUpdate);
    window.addEventListener(STUDENT_ROSTER_UPDATED_EVENT, handleRosterUpdate);

    return () => {
      window.removeEventListener('sdn5_student_attendance_updated', handleUpdate);
      window.removeEventListener('sdn5_active_teacher_changed', handleTeacherChange);
      window.removeEventListener('sdn5_teacher_photos_updated', handleUpdate);
      window.removeEventListener(WARNINGS_UPDATED_EVENT, handleWarningsUpdate);
      window.removeEventListener(STUDENT_ROSTER_UPDATED_EVENT, handleRosterUpdate);
    };
  }, [selectedDate, selectedClassId]);

  // Current active teacher object
  const activeTeacher = useMemo(() => {
    return TEACHERS_LIST.find(t => t.id === activeTeacherId) || TEACHERS_LIST[1]; // default Hastuti
  }, [activeTeacherId]);

  // Current class info
  const currentClassInfo = useMemo(() => {
    return SCHOOL_CLASSES.find(c => c.id === selectedClassId) || SCHOOL_CLASSES[0];
  }, [selectedClassId]);

  // Current class students (retrieved from base roster + custom added students)
  const currentStudents = useMemo(() => {
    return getClassStudents(selectedClassId);
  }, [selectedClassId, rosterVersion]);

  // Filtered classes list for the Class Selection Step
  const filteredClassesForSelection = useMemo(() => {
    return SCHOOL_CLASSES.filter(cls => {
      const matchesLevel = classLevelFilter === 'ALL' || cls.level === classLevelFilter;
      const matchesQuery = 
        cls.name.toLowerCase().includes(classSearchQuery.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(classSearchQuery.toLowerCase()) ||
        cls.room.toLowerCase().includes(classSearchQuery.toLowerCase());
      return matchesLevel && matchesQuery;
    });
  }, [classLevelFilter, classSearchQuery]);

  // Filtered students for attendance sheet
  const filteredStudents = useMemo(() => {
    return currentStudents.filter(st => {
      const matchesSearch = st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                            st.nisn.includes(studentSearch);
      
      const record = currentAttendance.records[st.id];
      const matchesStatus = statusFilter === 'ALL' || (record && record.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [currentStudents, studentSearch, statusFilter, currentAttendance]);

  // Handle active teacher selection
  const handleSelectTeacher = (tId: string) => {
    setActiveTeacherId(tId);
    setActiveSelectedTeacher(tId);

    // If teacher is associated with a specific class, auto switch to that class
    const matchedClass = SCHOOL_CLASSES.find(c => c.teacherId === tId);
    if (matchedClass) {
      setSelectedClassId(matchedClass.id);
    }

    const tObj = TEACHERS_LIST.find(t => t.id === tId);
    setToastMessage({
      text: `Kini bertindak sebagai: ${tObj?.name || 'Guru'} (${tObj?.subject || ''})`,
      type: 'info'
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle single student status
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    const existingRec = currentAttendance.records[studentId];
    updateStudentRecord(selectedDate, selectedClassId, studentId, newStatus, existingRec?.note);
    setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
    setRealtimeSummary(getSchoolRealtimeSummary(selectedDate));
  };

  // Update note for student
  const handleNoteChange = (studentId: string, note: string) => {
    const existingRec = currentAttendance.records[studentId];
    const status = existingRec?.status || 'H';
    updateStudentRecord(selectedDate, selectedClassId, studentId, status, note);
    setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    markAllStudentsPresent(selectedDate, selectedClassId);
    setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
    setRealtimeSummary(getSchoolRealtimeSummary(selectedDate));
    setToastMessage({
      text: `Seluruh siswa ${currentClassInfo.name} berhasil ditandai Hadir!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Verify all by principal
  const handlePrincipalVerify = () => {
    verifyAttendanceByPrincipal(selectedDate);
    setCurrentAttendance(getClassAttendance(selectedDate, selectedClassId));
    setRealtimeSummary(getSchoolRealtimeSummary(selectedDate));
    setToastMessage({
      text: `Rekapitulasi Kehadiran Tanggal ${selectedDate} telah disahkan oleh Kepala Sekolah!`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Generate WhatsApp text for parent
  const generateWaTextForParent = (student: typeof waModalStudent) => {
    if (!student) return '';
    const statusText = student.status === 'S' ? 'Sakit' : student.status === 'I' ? 'Izin' : 'Alpa (Tanpa Keterangan)';
    return `Assalamu’alaikum Wr. Wb. / Selamat pagi Bapak/Ibu ${student.parentName || 'Orang Tua Siswa'},

Semoga Bapak/Ibu sekeluarga senantiasa sehat.
Kami dari pihak sekolah UPTD SDN 5 Barandasi (Wali Kelas ${student.className}) mengonfirmasi presensi harian ananda:

• Nama Siswa : ${student.studentName}
• Kelas : ${student.className}
• Tanggal : ${selectedDate}
• Status Presensi : ${statusText}
${student.note ? `• Catatan : ${student.note}\n` : ''}
${student.status === 'S' 
  ? 'Semoga ananda lekas sembuh dan dapat beraktivitas kembali bersama teman-teman di sekolah. Aamiin ya Rabbal Alamin. 🤲'
  : student.status === 'A'
  ? 'Mohon konfirmasi terkait kehadiran ananda hari ini melalui balasan pesan ini demi kelancaran dan keselamatan ananda. Terima kasih banyak atas kerja samanya. 🙏'
  : 'Terima kasih atas informasi izin yang telah disampaikan kepada pihak sekolah. 🙏'}

Wassalamu’alaikum Wr. Wb.
Wali Kelas ${student.className}
UPTD SDN 5 Barandasi, Maros`;
  };

  // Generate WhatsApp summary text for school group
  const handleCopySchoolWaSummary = () => {
    const summary = realtimeSummary;
    const formatted = `*LAPORAN REKAPITULASI KEHADIRAN SISWA HARIAN*
*UPTD SDN 5 BARANDASI - KABUPATEN MAROS*
📅 Tanggal: ${selectedDate}
⏰ Waktu Pembaruan: Real-Time Dashboard

*RINGKASAN KEHADIRAN SEKOLAH:*
• Total Siswa Terdata: ${summary.totalStudents} Siswa
• Hadir: ${summary.totalHadir} Siswa (${summary.overallRate}%)
• Sakit: ${summary.totalSakit} Siswa
• Izin: ${summary.totalIzin} Siswa
• Alpa: ${summary.totalAlpa} Siswa
• Rombel Selesai Presensi: ${summary.submittedClassesCount} dari ${summary.totalClasses} Rombel

*RINCIAN PER KELAS:*
${summary.classSummaries.map(cs => {
  const att = cs.attendance;
  if (!att) return `• ${cs.classInfo.name} (${cs.classInfo.teacherName}): Menunggu Input`;
  return `• ${cs.classInfo.name}: Hadir ${att.summary.hadir}/${att.summary.total} (${att.summary.rate}%) | S:${att.summary.sakit} I:${att.summary.izin} A:${att.summary.alpa} [Wali: ${cs.classInfo.teacherName}]`;
}).join('\n')}

_Laporan resmi dihasilkan otomatis melalui Portal Absensi Digital UPTD SDN 5 Barandasi._`;

    navigator.clipboard?.writeText(formatted);
    setToastMessage({
      text: 'Format Rekap WhatsApp telah disalin ke clipboard!',
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Helper for status badge
  const renderStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'H':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-emerald-300">Hadir</span>;
      case 'S':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-sky-300">Sakit</span>;
      case 'I':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-amber-300">Izin</span>;
      case 'A':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-rose-300">Alpa</span>;
    }
  };

  // Helper for risk badge in Early Warning System
  const renderRiskBadge = (risk: AttendanceRiskLevel) => {
    if (risk === 'kritis') {
      return (
        <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm flex items-center gap-1 shadow-2xs">
          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
          <span>KRITIS (&lt; 70%)</span>
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm flex items-center gap-1 shadow-2xs">
        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
        <span>WASPADA (70% - 79.9%)</span>
      </span>
    );
  };

  // Helper for action status badge in Early Warning System
  const renderActionStatusBadge = (status: AttendanceActionStatus) => {
    switch (status) {
      case 'belum_tindak':
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Belum Ditindak</span>
          </span>
        );
      case 'wa_terkirim':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Send className="w-2.5 h-2.5 text-emerald-600" />
            <span>WA Terkirim</span>
          </span>
        );
      case 'jadwal_konseling':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 text-purple-600" />
            <span>Jadwal Konseling</span>
          </span>
        );
      case 'selesai_konseling':
        return (
          <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-2.5 h-2.5 text-indigo-700" />
            <span>Selesai Dibina</span>
          </span>
        );
    }
  };

  // Generate WhatsApp text for early warning (<80%)
  const generateWarningWaMessage = (warn: StudentMonthlyWarning) => {
    return `*SURAT PEMBERITAHUAN & PERINGATAN DINI KEHADIRAN SISWA*
*UPTD SDN 5 BARANDASI - KABUPATEN MAROS*
Nomor: 421.2/088/SDN.5-BRD/DISDIK/2026
Periode Pemantauan: ${warn.monthName}

Kepada Yth.
Bapak/Ibu: ${warn.parentName}
Orang Tua / Wali dari Ananda: *${warn.studentName}*
NISN: ${warn.nisn} | Kelas: *${warn.className}*

Assalamu’alaikum Wr. Wb. / Selamat pagi Bapak/Ibu,

Semoga Bapak/Ibu dan keluarga senantiasa berada dalam lindungan Tuhan Yang Maha Esa.

Berdasarkan rekapitulasi kehadiran digital siswa UPTD SDN 5 Barandasi selama satu bulan terakhir (${warn.monthName}), kami memberitahukan perkembangan presensi ananda sebagai berikut:

• Total Hari Belajar Efektif : ${warn.totalEffectiveDays} Hari
• Jumlah Hadir di Sekolah : ${warn.hadir} Hari
• Sakit (S) : ${warn.sakit} Hari
• Izin (I) : ${warn.izin} Hari
• Alpa (Tanpa Keterangan) : ${warn.alpa} Hari
• *Tingkat Kehadiran Kumulatif : ${warn.attendanceRate}%*
• *Status Kategori : ${warn.riskLevel === 'kritis' ? 'KRITIS (< 70%)' : 'PERINGATAN WASPADA (70% - 79.9%)'}*

*PENTING DIKETAHUI:*
Sesuai Pedoman Penilaian Akademik Kurikulum Nasional dan Standar Pelayanan Minimal (SPM) Pendidikan, tingkat kehadiran minimal siswa adalah *80%* sebagai prasyarat pemenuhan ketuntasan capaian pembelajaran dan syarat keikutsertaan asesmen sumatif.

Mengingat ananda berada di bawah ambang batas 80%, pihak sekolah memohon kerja sama Bapak/Ibu untuk:
1. Memastikan ananda hadir secara tertib dan disiplin setiap hari sekolah.
2. Melampirkan surat keterangan dokter atau memberitahukan wali kelas bila ananda berhalangan hadir.
3. Meluangkan waktu berkonsultasi dengan Wali Kelas ananda guna mendampingi kendala belajar di rumah.

Demikian pemberitahuan ini kami sampaikan demi masa depan dan keberhasilan belajar ananda. Atas perhatian dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih banyak.

Wassalamu’alaikum Wr. Wb.

*Wali Kelas ${warn.className}:*
${warn.teacherName}

*Mengetahui,*
*Kepala UPTD SDN 5 Barandasi:*
Hadijah, S.Pd., M.Pd.
NIP. Terdaftar KSP UPTD SDN 5 Barandasi`;
  };

  // Warning calculations & filtered list
  const kritisCount = useMemo(() => monthlyWarnings.filter(w => w.riskLevel === 'kritis').length, [monthlyWarnings]);
  const waspadaCount = useMemo(() => monthlyWarnings.filter(w => w.riskLevel === 'waspada').length, [monthlyWarnings]);
  const pendingActionCount = useMemo(() => monthlyWarnings.filter(w => w.actionStatus === 'belum_tindak').length, [monthlyWarnings]);

  const filteredWarnings = useMemo(() => {
    return monthlyWarnings.filter(w => {
      const matchRisk = selectedRiskFilter === 'ALL' || w.riskLevel === selectedRiskFilter;
      const matchClass = selectedWarningClassFilter === 'ALL' || w.classId === selectedWarningClassFilter;
      const matchAction = selectedActionFilter === 'ALL' || w.actionStatus === selectedActionFilter;
      const matchSearch = w.studentName.toLowerCase().includes(warningSearch.toLowerCase()) ||
                          w.nisn.includes(warningSearch) ||
                          w.parentName.toLowerCase().includes(warningSearch.toLowerCase()) ||
                          w.className.toLowerCase().includes(warningSearch.toLowerCase());
      return matchRisk && matchClass && matchAction && matchSearch;
    });
  }, [monthlyWarnings, selectedRiskFilter, selectedWarningClassFilter, selectedActionFilter, warningSearch]);

  const handleConfirmSendWarningWa = (warn: StudentMonthlyWarning) => {
    updateWarningAction(warn.id, 'wa_terkirim');
    setMonthlyWarnings(getAllMonthlyWarnings());
    setToastMessage({
      text: `Notifikasi WA Peringatan Dini telah dikirim ke ${warn.parentName} (${warn.studentName})! Status diperbarui.`,
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmCounseling = (warningId: string) => {
    updateWarningAction(
      warningId, 
      'jadwal_konseling', 
      `Dijadwalkan: ${counselingDate} pukul ${counselingTime}. Catatan: ${counselingNote}`
    );
    setMonthlyWarnings(getAllMonthlyWarnings());
    setScheduleCounselingModal(null);
    setToastMessage({
      text: 'Jadwal Bimbingan Konseling / Home Visit berhasil dicatat dan diperbarui!',
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkFinished = (warningId: string) => {
    updateWarningAction(warningId, 'selesai_konseling', 'Telah dilakukan pembinaan dan komitmen kehadiran terpenuhi.');
    setMonthlyWarnings(getAllMonthlyWarnings());
    setToastMessage({
      text: 'Status pembinaan siswa berhasil ditandai selesai.',
      type: 'success'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find all students absent across all classes today for monitoring alert
  const absentStudentsToday = useMemo(() => {
    const list: Array<{
      student: (typeof CLASS_STUDENTS_ROSTER)['1A'][0];
      classInfo: SchoolClassInfo;
      record: StudentAttendanceRecord;
    }> = [];

    SCHOOL_CLASSES.forEach(cls => {
      const att = getClassAttendance(selectedDate, cls.id);
      const students = CLASS_STUDENTS_ROSTER[cls.id] || [];
      students.forEach(st => {
        const rec = att.records[st.id];
        if (rec && (rec.status === 'S' || rec.status === 'I' || rec.status === 'A')) {
          list.push({
            student: st,
            classInfo: cls,
            record: rec
          });
        }
      });
    });

    return list;
  }, [selectedDate, realtimeSummary]);

  return (
    <section id="absensi" className="py-12 bg-slate-50 border-b border-slate-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Top Header Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-200 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-[1px] w-8 bg-indigo-900" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                  SISTEM INFORMASI MANAJEMEN AKADEMIK
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  REAL-TIME SYNC
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight uppercase">
                MODUL ABSENSI HARIAN SISWA & DASHBOARD MONITORING GURU
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                Pemantauan kehadiran peserta didik secara real-time terintegrasi langsung dengan data Dewan Guru dan Wali Kelas UPTD SDN 5 Barandasi, Kecamatan Lau, Kabupaten Maros.
              </p>
            </div>

            {/* Quick Context: Active Teacher Switcher */}
            <div className="bg-indigo-950 text-white p-4 rounded-sm border border-indigo-900 flex items-center gap-4 shrink-0 shadow-md">
              <div className="relative">
                <img
                  src={getTeacherEffectivePhoto(activeTeacher, customPhotos)}
                  alt={activeTeacher.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-amber-400"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-indigo-950 rounded-full" title="Online" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Pendidik / Pengguna Aktif:
                </span>
                <div className="font-bold text-xs sm:text-sm text-white">
                  {activeTeacher.name}
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                  <span>{activeTeacher.subject}</span>
                  <span>•</span>
                  <span className="text-amber-200/80 font-mono text-[10px]">NIP: {activeTeacher.nip.slice(0, 16)}...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation View Switcher & Date Selector */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Mode Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMode('dashboard')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
                onClick={() => {
                  setActiveMode('input');
                  setInputViewStep('select-class');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'input'
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeMode === 'warning'
                    ? 'bg-rose-900 text-white shadow-xs border border-rose-800'
                    : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <BellRing className={`w-4 h-4 ${monthlyWarnings.length > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span>Peringatan Dini (&lt;80%)</span>
                {monthlyWarnings.length > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {monthlyWarnings.length}
                  </span>
                )}
              </button>
            </div>

            {/* Date Picker & Teacher Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm text-xs">
                <Calendar className="w-4 h-4 text-indigo-900" />
                <span className="font-bold text-slate-700">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-medium text-indigo-950 focus:outline-hidden cursor-pointer"
                />
              </div>

              {/* Quick Teacher Dropdown selector */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm text-xs">
                <span className="font-bold text-slate-700">Ganti Akun Guru:</span>
                <select
                  value={activeTeacherId}
                  onChange={(e) => handleSelectTeacher(e.target.value)}
                  className="bg-transparent font-semibold text-indigo-950 focus:outline-hidden cursor-pointer max-w-[180px] truncate"
                >
                  {TEACHERS_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Export PDF Button */}
              <button
                type="button"
                onClick={() => setIsPdfExportModalOpen(true)}
                title="Ekspor Laporan Kehadiran Bulanan / Harian ke Format PDF Resmi"
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs border border-indigo-700"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh PDF</span>
              </button>

              {/* Copy WA summary */}
              <button
                type="button"
                onClick={handleCopySchoolWaSummary}
                title="Salin rekap pesan WA untuk grup sekolah / wali murid"
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salin Format WA</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                title="Cetak format cetak resmi"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className={`p-4 rounded-sm text-xs font-semibold flex items-center gap-2 shadow-md transition-all ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-indigo-900 text-white'
          }`}>
            <Check className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 1: DASHBOARD PEMANTAUAN REAL-TIME                                    */}
        {/* ========================================================================= */}
        {activeMode === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Early Warning System (<80%) Notification Alert Banner */}
            {monthlyWarnings.length > 0 && (
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
                      {kritisCount} siswa berstatus <strong className="text-white">Kritis (&lt;70%)</strong> dan {waspadaCount} siswa berstatus <strong className="text-white">Waspada (70% - 79.9%)</strong>. Sesuai standar akademik, ketidakhadiran di bawah 80% berpotensi menghambat pemenuhan capaian belajar.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveMode('warning')}
                    className="bg-white hover:bg-rose-50 text-rose-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Buka Modul Peringatan Dini ({monthlyWarnings.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Stat Cards (Realtime KPI) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Overall Rate */}
              <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-sm border-l-4 border-indigo-900 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Kehadiran Sekolah</span>
                  <Activity className="w-4 h-4 text-indigo-900" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-950">{realtimeSummary.overallRate}%</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Optimal</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-900 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${realtimeSummary.overallRate}%` }} 
                  />
                </div>
              </div>

              {/* Total Hadir */}
              <div className="bg-white p-5 rounded-sm border-l-4 border-emerald-600 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Siswa Hadir</span>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-700">
                  {realtimeSummary.totalHadir}
                  <span className="text-xs text-slate-400 font-normal ml-1">/ {realtimeSummary.totalStudents}</span>
                </div>
                <p className="text-[11px] text-slate-500">Mengikuti KBM di kelas fisik</p>
              </div>

              {/* Sakit */}
              <div className="bg-white p-5 rounded-sm border-l-4 border-sky-500 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Sakit (S)</span>
                  <HeartPulse className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-3xl font-black text-sky-700">
                  {realtimeSummary.totalSakit}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Izin dokter / surat sakit</p>
              </div>

              {/* Izin */}
              <div className="bg-white p-5 rounded-sm border-l-4 border-amber-500 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Izin (I)</span>
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-700">
                  {realtimeSummary.totalIzin}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Keperluan keluarga / dinas</p>
              </div>

              {/* Alpa */}
              <div className="bg-white p-5 rounded-sm border-l-4 border-rose-500 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Alpa (A)</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-3xl font-black text-rose-700">
                  {realtimeSummary.totalAlpa}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Belum ada keterangan</p>
              </div>
            </div>

            {/* Principal Verification Banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white p-5 sm:p-6 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Supervisi & Validasi Kepala Sekolah
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Resmi
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Hadijah, S.Pd., M.Pd. (Kepala UPTD SDN 5 Barandasi)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Memastikan data kehadiran harian seluruh 13 Rombel valid untuk pelaporan Dapodik & Dinas Pendidikan Kab. Maros.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrincipalVerify}
                  className="bg-amber-400 hover:bg-amber-300 text-indigo-950 px-4 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-950" />
                  <span>Sahkan Rekap Seluruh Kelas</span>
                </button>
              </div>
            </div>

            {/* Live Monitoring Grid across all 13 Rombel (Classes) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                    <School className="w-5 h-5 text-indigo-900" />
                    <span>Status Kehadiran Real-Time 13 Rombongan Belajar (Rombel)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Klik salah satu kelas di bawah untuk langsung membuka atau mengedit lembar absensi kelas tersebut.
                  </p>
                </div>

                <div className="text-xs text-slate-600 font-semibold bg-white px-3 py-1.5 rounded-sm border border-slate-200">
                  Rombel Terdata: <span className="text-indigo-900 font-bold">{realtimeSummary.submittedClassesCount}</span> / {realtimeSummary.totalClasses}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {realtimeSummary.classSummaries.map(({ classInfo, attendance }) => {
                  const teacherObj = TEACHERS_LIST.find(t => t.id === classInfo.teacherId);
                  const rate = attendance ? attendance.summary.rate : 0;
                  const isFullyPresent = rate === 100;
                  const hasAbsence = attendance && (attendance.summary.sakit > 0 || attendance.summary.izin > 0 || attendance.summary.alpa > 0);

                  return (
                    <div
                      key={classInfo.id}
                      onClick={() => {
                        setSelectedClassId(classInfo.id);
                        setInputViewStep('roster-sheet');
                        setActiveMode('input');
                      }}
                      className="bg-white rounded-sm border border-slate-200 hover:border-indigo-900 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        {/* Class Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {classInfo.room}
                            </span>
                            <h4 className="text-base font-extrabold text-indigo-950 group-hover:text-indigo-900 transition-colors">
                              {classInfo.name}
                            </h4>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-sm font-black px-2 py-0.5 rounded-sm ${
                              rate >= 95 ? 'bg-emerald-50 text-emerald-700' :
                              rate >= 85 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {rate}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              rate >= 95 ? 'bg-emerald-600' : rate >= 85 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>

                        {/* Wali Kelas Card */}
                        <div className="flex items-center gap-2.5 py-2 border-t border-slate-100">
                          {teacherObj && (
                            <img
                              src={getTeacherEffectivePhoto(teacherObj, customPhotos)}
                              alt={teacherObj.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wali Kelas:</span>
                            <span className="text-xs font-bold text-slate-800 truncate block">
                              {classInfo.teacherName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stat Breakdown Footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                          <span className="text-emerald-700">H: {attendance?.summary.hadir ?? 0}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-sky-700">S: {attendance?.summary.sakit ?? 0}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-amber-700">I: {attendance?.summary.izin ?? 0}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-rose-700">A: {attendance?.summary.alpa ?? 0}</span>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 group-hover:translate-x-1 transition-transform flex items-center">
                          Input <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alert Siswa Membutuhkan Perhatian Hari Ini (Sakit / Izin / Alpa) */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <h3 className="text-base font-bold text-indigo-950">
                      Pemantauan Khusus: Siswa Tidak Hadir Hari Ini ({absentStudentsToday.length} Siswa)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar siswa dengan status Sakit, Izin, atau Alpa di seluruh kelas. Guru dapat langsung mengirimkan pesan konfirmasi atau doa ke WhatsApp orang tua.
                  </p>
                </div>
              </div>

              {absentStudentsToday.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Luar Biasa! Kehadiran 100% Hari Ini
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Seluruh peserta didik UPTD SDN 5 Barandasi hadir mengikuti proses pembelajaran.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Kelas & Rombel</th>
                        <th className="py-3 px-4">Wali Kelas</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Keterangan / Alasan</th>
                        <th className="py-3 px-4 text-right">Tindakan Cepat (WA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {absentStudentsToday.map(({ student, classInfo, record }) => (
                        <tr key={`${classInfo.id}-${student.id}`} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-indigo-950">
                            <div>{student.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">NISN: {student.nisn}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            {classInfo.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {classInfo.teacherName}
                          </td>
                          <td className="py-3 px-4">
                            {renderStatusBadge(record.status)}
                          </td>
                          <td className="py-3 px-4 text-slate-700 italic max-w-xs truncate">
                            {record.note || 'Tidak ada catatan tambahan'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setWaModalStudent({
                                  studentName: student.name,
                                  parentName: student.parentName || 'Orang Tua Siswa',
                                  parentPhone: student.parentPhone || '081234567890',
                                  status: record.status,
                                  className: classInfo.name,
                                  note: record.note
                                });
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Hubungi Orang Tua</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: LEMBAR INPUT PRESENSI KELAS (GURU)                                */}
        {/* ========================================================================= */}
        {activeMode === 'input' && (
          <div className="space-y-6">
            
            {/* ===================================================================== */}
            {/* LANGKAH 1: PEMILIHAN ROMBEL / KELAS SEBELUM INPUT                     */}
            {/* ===================================================================== */}
            {inputViewStep === 'select-class' && (
              <div className="space-y-6">
                {/* Header & Step Instruction */}
                <div className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-indigo-900 text-amber-300 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                        1
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-xs border border-indigo-200">
                            Langkah 1 dari 2
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-slate-600">Presensi Terorganisir Per Rombel</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-indigo-950 uppercase tracking-tight mt-0.5">
                          Pilih Rombongan Belajar (Rombel) Terlebih Dahulu
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Silakan tentukan kelas sasaran untuk membuka lembar presensi dan menginput daftar murid yang rapi sesuai Dapodik UPTD SDN 5 Barandasi.
                        </p>
                      </div>
                    </div>

                    {/* Step indicator pills */}
                    <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
                      <span className="px-3 py-1.5 bg-indigo-900 text-white rounded-sm shadow-xs flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-indigo-950 text-[10px] font-black flex items-center justify-center">1</span>
                        <span>Pilih Rombel</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setInputViewStep('roster-sheet')}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-700 text-[10px] font-black flex items-center justify-center">2</span>
                        <span>Buka Lembar Siswa ({currentClassInfo.name})</span>
                      </button>
                    </div>
                  </div>

                  {/* Teacher's Own Assigned Class Banner */}
                  {(() => {
                    const myClass = SCHOOL_CLASSES.find(c => c.teacherId === activeTeacherId);
                    if (!myClass) return null;
                    const myClassAtt = getClassAttendance(selectedDate, myClass.id);
                    const myClassStudents = getClassStudents(myClass.id);

                    return (
                      <div className="p-4 rounded-sm bg-gradient-to-r from-amber-500/10 via-indigo-900/5 to-amber-500/15 border border-amber-300/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-12 h-12 rounded-sm bg-indigo-950 text-amber-300 flex flex-col items-center justify-center font-black shadow-xs shrink-0">
                            <span className="text-[10px] uppercase font-bold text-slate-300">Rombel</span>
                            <span className="text-base leading-none text-amber-300">{myClass.id}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-xs border border-amber-200">
                                Rombel Binaan Akun Guru Anda
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs font-semibold text-slate-600">Akses Cepat 1-Klik</span>
                            </div>
                            <h4 className="text-base font-extrabold text-indigo-950 mt-0.5">
                              {myClass.name} — {myClass.teacherName}
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {myClass.room} • <strong>{myClassStudents.length} Siswa Terdaftar</strong> • Kehadiran Hari Ini: <strong className="text-emerald-700">{myClassAtt.summary.rate}%</strong> (Hadir: {myClassAtt.summary.hadir}, Sakit: {myClassAtt.summary.sakit}, Izin: {myClassAtt.summary.izin}, Alpa: {myClassAtt.summary.alpa})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClassId(myClass.id);
                              setInputViewStep('roster-sheet');
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-extrabold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md border border-indigo-700"
                          >
                            <span>Buka Presensi {myClass.name}</span>
                            <ArrowRight className="w-4 h-4 text-amber-300" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Level & Search Filter Toolbar */}
                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Level selector tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                        Filter Rombel:
                      </span>
                      <button
                        type="button"
                        onClick={() => setClassLevelFilter('ALL')}
                        className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          classLevelFilter === 'ALL'
                            ? 'bg-indigo-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        Semua (13 Rombel)
                      </button>
                      {[1, 2, 3, 4, 5, 6].map(lvl => {
                        const count = SCHOOL_CLASSES.filter(c => c.level === lvl).length;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setClassLevelFilter(lvl)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              classLevelFilter === lvl
                                ? 'bg-indigo-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            Kelas {lvl} ({count})
                          </button>
                        );
                      })}
                    </div>

                    {/* Search in classes */}
                    <div className="relative w-full md:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={classSearchQuery}
                        onChange={(e) => setClassSearchQuery(e.target.value)}
                        placeholder="Cari rombel / wali kelas / ruang..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid of 13 Rombel Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredClassesForSelection.map((cls) => {
                    const att = getClassAttendance(selectedDate, cls.id);
                    const students = getClassStudents(cls.id);
                    const teacherObj = TEACHERS_LIST.find(t => t.id === cls.teacherId);
                    const isSelected = selectedClassId === cls.id;
                    const isUserClass = cls.teacherId === activeTeacherId;
                    const rate = att.summary.rate;

                    return (
                      <div
                        key={cls.id}
                        className={`bg-white rounded-sm border transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
                          isSelected 
                            ? 'border-indigo-900 ring-2 ring-indigo-900/20' 
                            : isUserClass 
                              ? 'border-amber-300 bg-amber-50/20 hover:border-indigo-900' 
                              : 'border-slate-200 hover:border-indigo-900'
                        }`}
                      >
                        <div>
                          {/* Card Top: Room & Badge */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                                {cls.room}
                              </span>
                              <h4 className="text-lg font-black text-indigo-950 flex items-center gap-1.5">
                                <span>{cls.name}</span>
                                {isUserClass && (
                                  <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1.5 py-0.2 rounded-xs">
                                    Kelas Anda
                                  </span>
                                )}
                              </h4>
                            </div>

                            <div className="text-right">
                              <span className={`text-xs font-black px-2 py-0.5 rounded-sm ${
                                rate >= 95 ? 'bg-emerald-100 text-emerald-800' :
                                rate >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {rate}% Hadir
                              </span>
                            </div>
                          </div>

                          {/* Wali Kelas Details */}
                          <div className="flex items-center gap-2.5 py-2.5 my-2 border-y border-slate-100">
                            {teacherObj && (
                              <img
                                src={getTeacherEffectivePhoto(teacherObj, customPhotos)}
                                alt={teacherObj.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="overflow-hidden">
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Wali Kelas:</span>
                              <span className="text-xs font-bold text-slate-800 truncate block">
                                {cls.teacherName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block truncate">
                                NIP: {cls.teacherNip}
                              </span>
                            </div>
                          </div>

                          {/* Student Count & Breakdown */}
                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div className="bg-slate-50 p-2 rounded-xs border border-slate-100">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Murid</span>
                              <span className="font-extrabold text-indigo-950">{students.length} Siswa</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xs border border-slate-100">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Hadir Hari Ini</span>
                              <span className="font-extrabold text-emerald-700">
                                {att.summary.hadir} / {students.length} Siswa
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-xs mb-3">
                            <span className="text-emerald-700 font-bold">H: {att.summary.hadir}</span>
                            <span className="text-sky-700">S: {att.summary.sakit}</span>
                            <span className="text-amber-700">I: {att.summary.izin}</span>
                            <span className="text-rose-700 font-bold">A: {att.summary.alpa}</span>
                          </div>
                        </div>

                        {/* Action Buttons for this class */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClassId(cls.id);
                              setInputViewStep('roster-sheet');
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Pilih & Buka Daftar Murid</span>
                            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                          </button>

                          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClassId(cls.id);
                                setIsAddStudentModalOpen(true);
                              }}
                              className="py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-xs border border-amber-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <UserPlus className="w-3 h-3 text-amber-700" />
                              <span>+ Murid Baru</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClassId(cls.id);
                                setIsPdfExportModalOpen(true);
                              }}
                              className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xs border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <Download className="w-3 h-3 text-slate-600" />
                              <span>Unduh PDF</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* LANGKAH 2: LEMBAR PRESENSI & DAFTAR MURID ROMBEL (roster-sheet)       */}
            {/* ===================================================================== */}
            {inputViewStep === 'roster-sheet' && (
              <div className="space-y-6">
                
                {/* Class Selector Bar with Back Button */}
                <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Back button to class selector */}
                      <button
                        type="button"
                        onClick={() => setInputViewStep('select-class')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-wider rounded-sm transition-colors cursor-pointer border border-slate-300 shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-indigo-900" />
                        <span>← Ganti Rombel / Pilih Kelas Lain</span>
                      </button>

                      <span className="text-slate-300 hidden sm:inline">|</span>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                          Lembar Presensi Harian Guru
                        </span>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <h3 className="text-xl font-extrabold text-indigo-950 flex items-center gap-2">
                            <span>{currentClassInfo.name}</span>
                            <span className="text-xs font-normal text-slate-500">
                              ({currentStudents.length} Siswa Terdaftar)
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Quick Switcher dropdown directly in sheet */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-600">Pindah Rombel Langsung:</span>
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm font-bold text-indigo-950 focus:outline-hidden cursor-pointer"
                      >
                        {SCHOOL_CLASSES.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} — {cls.teacherName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Class Meta & Quick Action Buttons */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                      Wali Kelas: <strong>{currentClassInfo.teacherName}</strong> (NIP: {currentClassInfo.teacherNip}) • Ruang: <strong>{currentClassInfo.room}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Tombol Tambah Murid Cepat */}
                      <button
                        type="button"
                        onClick={() => setIsAddStudentModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 text-xs font-extrabold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs border border-amber-500"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Tambah Murid</span>
                      </button>

                      {/* Tombol Ekspor PDF Cepat */}
                      <button
                        type="button"
                        onClick={() => setIsPdfExportModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs border border-indigo-700"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ekspor PDF Kelas</span>
                      </button>
                    </div>
                  </div>

                  {/* Class selector pills */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0">
                      <span>Rombel Cepat:</span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {SCHOOL_CLASSES.map((cls) => (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => setSelectedClassId(cls.id)}
                          className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            selectedClassId === cls.id
                              ? 'bg-indigo-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {cls.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Tools Bar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Mark all present */}
                      <button
                        type="button"
                        onClick={handleMarkAllPresent}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tandai Semua Hadir (1-Klik)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAddStudentModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer border border-amber-300"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                        <span>+ Murid Baru</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPdfExportModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer border border-slate-300"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-900" />
                        <span>Unduh Rekap PDF</span>
                      </button>

                      {/* Status filter buttons */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setStatusFilter('ALL')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            statusFilter === 'ALL' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Semua ({currentStudents.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter('H')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            statusFilter === 'H' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          H ({currentAttendance.summary.hadir})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter('S')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            statusFilter === 'S' ? 'bg-white text-sky-800 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          S ({currentAttendance.summary.sakit})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter('I')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            statusFilter === 'I' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          I ({currentAttendance.summary.izin})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter('A')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            statusFilter === 'A' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          A ({currentAttendance.summary.alpa})
                        </button>
                      </div>
                    </div>

                    {/* Search in student list */}
                    <div className="relative w-full md:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Cari nama siswa / NISN..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
                      />
                      {studentSearch && (
                        <button
                          onClick={() => setStudentSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

            {/* Attendance Roster Table */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">No</th>
                      <th className="py-3.5 px-4">Nama Siswa</th>
                      <th className="py-3.5 px-4 w-16 text-center">L/P</th>
                      <th className="py-3.5 px-4 w-64 text-center">Status Kehadiran</th>
                      <th className="py-3.5 px-4">Keterangan / Catatan Guru</th>
                      <th className="py-3.5 px-4 w-36 text-center">
                        <span className="inline-flex items-center justify-center gap-1 text-slate-700" title="Jam presensi otomatis terkunci oleh server WITA dan tidak dapat diedit bagi guru">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Jam Masuk*</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          Tidak ada siswa yang sesuai kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, idx) => {
                        const rec: StudentAttendanceRecord = currentAttendance.records[student.id] || {
                          studentId: student.id,
                          status: 'H',
                          checkInTime: '07:15 WITA'
                        };

                        return (
                          <tr 
                            key={student.id} 
                            className={`hover:bg-slate-50/80 transition-colors ${
                              rec.status === 'S' ? 'bg-sky-50/30' :
                              rec.status === 'I' ? 'bg-amber-50/30' :
                              rec.status === 'A' ? 'bg-rose-50/30' : ''
                            }`}
                          >
                            <td className="py-3 px-4 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-indigo-950 text-xs sm:text-sm">
                                {student.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                NISN: {student.nisn}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                student.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                              }`}>
                                {student.gender}
                              </span>
                            </td>

                            {/* 4 Status Toggle Buttons */}
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, 'H')}
                                  title="Hadir"
                                  className={`px-2.5 py-1 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'H'
                                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  H
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, 'S')}
                                  title="Sakit"
                                  className={`px-2.5 py-1 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'S'
                                      ? 'bg-sky-600 text-white shadow-xs scale-105'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  S
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, 'I')}
                                  title="Izin"
                                  className={`px-2.5 py-1 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'I'
                                      ? 'bg-amber-600 text-white shadow-xs scale-105'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  I
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, 'A')}
                                  title="Alpa / Tanpa Keterangan"
                                  className={`px-2.5 py-1 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                                    rec.status === 'A'
                                      ? 'bg-rose-600 text-white shadow-xs scale-105'
                                      : 'text-slate-600 hover:bg-white'
                                  }`}
                                >
                                  A
                                </button>
                              </div>
                            </td>

                            {/* Note / Remarks with common suggestion chips */}
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={rec.note || ''}
                                onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                placeholder="Keterangan sakit / alasan izin / catatan..."
                                className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-sm text-xs focus:outline-hidden focus:border-indigo-900"
                              />
                            </td>

                            {/* Check-in time (Terkunci Otomatis Tidak Bisa Diedit Guru) */}
                            <td className="py-3 px-4 text-center">
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

              {/* Class Summary Bar at Bottom of Table */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="font-bold text-slate-700">
                    Rekap {currentClassInfo.name}:
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    Hadir: {currentAttendance.summary.hadir}
                  </span>
                  <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-sm border border-sky-200">
                    Sakit: {currentAttendance.summary.sakit}
                  </span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                    Izin: {currentAttendance.summary.izin}
                  </span>
                  <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200">
                    Alpa: {currentAttendance.summary.alpa}
                  </span>
                  <span className="font-extrabold text-indigo-950 bg-indigo-50 px-2.5 py-0.5 rounded-sm border border-indigo-200">
                    Tingkat Kehadiran: {currentAttendance.summary.rate}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveClassAttendance(currentAttendance);
                      setToastMessage({
                        text: `Presensi ${currentClassInfo.name} berhasil disimpan dan disinkronkan ke Dashboard Real-Time!`,
                        type: 'success'
                      });
                      setTimeout(() => setToastMessage(null), 3500);
                    }}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Simpan & Publikasikan</span>
                  </button>
                </div>
              </div>

              {/* Strict Rule Notice: Jam Terkunci Otomatis Tidak Bisa Diedit Guru */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 italic flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>*Ketentuan SIMAK Kedinasan: Waktu presensi siswa dan guru terikat otomatis dengan jam server WITA dan tidak dapat diedit secara manual bagi guru guna menjamin keabsahan data.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    )}

        {/* ========================================================================= */}
        {/* MODE 3: MODUL PERINGATAN DINI & PENDAMPINGAN KEHADIRAN SISWA (< 80%)      */}
        {/* ========================================================================= */}
        {activeMode === 'warning' && (
          <div className="space-y-8">
            
            {/* Header Box of Warning Module */}
            <div className="bg-gradient-to-r from-rose-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 rounded-sm shadow-md border border-rose-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                      EARLY WARNING SYSTEM
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      Evaluasi Presensi Kumulatif Bulanan
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    PERINGATAN DINI KEHADIRAN SISWA (&lt; 80%)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    Sistem mendeteksi secara otomatis peserta didik yang memiliki persentase kehadiran di bawah 80% selama periode <strong>{monthlyWarnings[0]?.monthName || 'September 2026'}</strong>. Memfasilitasi penerbitan surat peringatan resmi (SP-1), komunikasi cepat WhatsApp ke orang tua, dan penjadwalan bimbingan konseling.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMode('dashboard')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors border border-white/20 cursor-pointer"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards for Warning Status */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-sm border-l-4 border-rose-600 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Total Siswa &lt; 80%</span>
                  <FileWarning className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-3xl font-black text-rose-700">
                  {monthlyWarnings.length}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Perlu intervensi akademik & BK</p>
              </div>

              <div className="bg-white p-5 rounded-sm border-l-4 border-rose-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Kategori Kritis (&lt; 70%)</span>
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                </div>
                <div className="text-3xl font-black text-rose-900">
                  {kritisCount}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Wajib SP-1 & Home Visit</p>
              </div>

              <div className="bg-white p-5 rounded-sm border-l-4 border-amber-500 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Kategori Waspada (70-79%)</span>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-700">
                  {waspadaCount}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Konsultasi wali murid via WA</p>
              </div>

              <div className="bg-white p-5 rounded-sm border-l-4 border-indigo-900 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Belum Ditindaklanjuti</span>
                  <Clock className="w-4 h-4 text-indigo-900" />
                </div>
                <div className="text-3xl font-black text-indigo-950">
                  {pendingActionCount}
                  <span className="text-xs text-slate-400 font-normal ml-1">siswa</span>
                </div>
                <p className="text-[11px] text-slate-500">Menunggu tindakan wali kelas</p>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Class scope buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Lingkup Kelas:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedWarningClassFilter('ALL')}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedWarningClassFilter === 'ALL'
                        ? 'bg-indigo-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Semua Kelas ({monthlyWarnings.length})
                  </button>

                  {/* Teacher's own class filter shortcut */}
                  {(() => {
                    const myClass = SCHOOL_CLASSES.find(c => c.teacherId === activeTeacherId);
                    if (!myClass) return null;
                    const countInMyClass = monthlyWarnings.filter(w => w.classId === myClass.id).length;
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedWarningClassFilter(myClass.id)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedWarningClassFilter === myClass.id
                            ? 'bg-rose-800 text-white shadow-xs'
                            : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        <span>Kelas Saya ({myClass.name})</span>
                        <span className="bg-rose-700 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                          {countInMyClass}
                        </span>
                      </button>
                    );
                  })()}
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={warningSearch}
                    onChange={(e) => setWarningSearch(e.target.value)}
                    placeholder="Cari siswa, NISN, wali murid..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
                  />
                  {warningSearch && (
                    <button
                      onClick={() => setWarningSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Secondary filters: Risk level & Action status */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-600">Tingkat Risiko:</span>
                    <select
                      value={selectedRiskFilter}
                      onChange={(e) => setSelectedRiskFilter(e.target.value as any)}
                      className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1 font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">Semua Risiko</option>
                      <option value="kritis">Kritis (&lt; 70%)</option>
                      <option value="waspada">Waspada (70% - 79.9%)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-600">Status Tindakan:</span>
                    <select
                      value={selectedActionFilter}
                      onChange={(e) => setSelectedActionFilter(e.target.value as any)}
                      className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1 font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="belum_tindak">Belum Ditindak</option>
                      <option value="wa_terkirim">WA Peringatan Terkirim</option>
                      <option value="jadwal_konseling">Terjadwal Konseling</option>
                      <option value="selesai_konseling">Selesai Dibina</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-slate-500 font-medium">
                    Menampilkan <strong className="text-indigo-950">{filteredWarnings.length}</strong> dari {monthlyWarnings.length} data peringatan
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPdfExportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unduh Rekap Bulanan PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of Warning Cards */}
            {filteredWarnings.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-200 rounded-sm shadow-xs space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                  Tidak Ada Siswa Terindikasi pada Filter Ini
                </h3>
                <p className="text-xs text-slate-500">
                  Seluruh siswa pada kriteria filter ini memenuhi ambang batas minimal kehadiran 80%.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredWarnings.map((warn) => {
                  return (
                    <div
                      key={warn.id}
                      className={`bg-white rounded-sm border transition-all p-5 sm:p-6 shadow-xs space-y-4 ${
                        warn.riskLevel === 'kritis' 
                          ? 'border-rose-300 hover:border-rose-500' 
                          : 'border-amber-300 hover:border-amber-500'
                      }`}
                    >
                      {/* Top Header Row of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-extrabold text-base sm:text-lg text-indigo-950">
                              {warn.studentName}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                              warn.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                            }`}>
                              {warn.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                              {warn.className}
                            </span>
                            {renderRiskBadge(warn.riskLevel)}
                            {renderActionStatusBadge(warn.actionStatus)}
                          </div>

                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>NISN: <strong className="font-mono text-slate-700">{warn.nisn}</strong></span>
                            <span>•</span>
                            <span>Wali Murid: <strong className="text-slate-700">{warn.parentName}</strong> ({warn.parentPhone})</span>
                            <span>•</span>
                            <span>Wali Kelas: <strong className="text-indigo-900">{warn.teacherName}</strong></span>
                          </div>
                        </div>

                        {/* Visual Gauge & Rate Counter */}
                        <div className="flex items-center gap-3 shrink-0 bg-slate-50 p-3 rounded-sm border border-slate-200">
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Tingkat Kehadiran:
                            </span>
                            <span className={`text-2xl font-black ${
                              warn.attendanceRate < 70 ? 'text-rose-700' : 'text-amber-600'
                            }`}>
                              {warn.attendanceRate}%
                            </span>
                          </div>

                          {/* Mini vertical indicator */}
                          <div className="w-2 h-10 bg-slate-200 rounded-full overflow-hidden flex flex-col justify-end">
                            <div 
                              className={`w-full rounded-full ${
                                warn.attendanceRate < 70 ? 'bg-rose-600' : 'bg-amber-500'
                              }`}
                              style={{ height: `${warn.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visual Progress Bar with 80% Threshold Mark */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-600">
                            Capaian Kehadiran vs Standar Minimal ({warn.monthName})
                          </span>
                          <span className="font-extrabold text-indigo-950">
                            {warn.hadir} dari {warn.totalEffectiveDays} Hari Belajar Efektif
                          </span>
                        </div>

                        <div className="relative w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          {/* 80% Benchmark Line */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10" 
                            style={{ left: '80%' }}
                            title="Ambang Batas Minimal 80%"
                          />
                          <div
                            className={`h-full transition-all duration-500 ${
                              warn.attendanceRate < 70 ? 'bg-rose-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${warn.attendanceRate}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>0%</span>
                          <span className="text-slate-700 font-bold">Ambang Batas Minimum Kelulusan: 80%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Stat Breakdown Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-sm text-xs">
                          <span className="text-[10px] text-emerald-700 font-bold uppercase block">Hadir</span>
                          <span className="text-base font-black text-emerald-900">{warn.hadir} Hari</span>
                        </div>
                        <div className="p-2 bg-sky-50 border border-sky-200 rounded-sm text-xs">
                          <span className="text-[10px] text-sky-700 font-bold uppercase block">Sakit</span>
                          <span className="text-base font-black text-sky-900">{warn.sakit} Hari</span>
                        </div>
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-sm text-xs">
                          <span className="text-[10px] text-amber-700 font-bold uppercase block">Izin</span>
                          <span className="text-base font-black text-amber-900">{warn.izin} Hari</span>
                        </div>
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded-sm text-xs">
                          <span className="text-[10px] text-rose-700 font-bold uppercase block">Alpa (Tanpa Keterangan)</span>
                          <span className="text-base font-black text-rose-900">{warn.alpa} Hari</span>
                        </div>
                      </div>

                      {/* Catatan Evaluasi Guru / Wali Kelas */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs flex items-start gap-2.5 text-slate-700">
                        <Info className="w-4 h-4 text-indigo-900 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-indigo-950 font-bold block mb-0.5">
                            Evaluasi & Catatan Wali Kelas:
                          </strong>
                          <span>{warn.notes}</span>
                          {warn.lastActionDate && (
                            <div className="mt-1 text-[11px] text-indigo-900 font-semibold bg-indigo-50/80 p-1.5 rounded-sm border border-indigo-100">
                              ℹ️ Riwayat Tindak Lanjut: {warn.lastActionDate} — {warn.lastActionNote}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. Kirim WA Peringatan Dini */}
                          <button
                            type="button"
                            onClick={() => setWaWarningModalStudent(warn)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Kirim WA Peringatan Dini</span>
                          </button>

                          {/* 2. Jadwalkan Konseling / Home Visit */}
                          <button
                            type="button"
                            onClick={() => {
                              setScheduleCounselingModal(warn);
                              setCounselingNote(`Pertemuan konseling wali murid ananda ${warn.studentName} terkait pemulihan presensi.`);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Jadwalkan Konseling</span>
                          </button>

                          {/* 3. Cetak Surat Peringatan Resmi (SP-1) */}
                          <button
                            type="button"
                            onClick={() => setPrintableLetterStudent(warn)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-300" />
                            <span>Cetak Surat SP Resmi</span>
                          </button>
                        </div>

                        {/* Quick toggle finish */}
                        {warn.actionStatus !== 'selesai_konseling' ? (
                          <button
                            type="button"
                            onClick={() => handleMarkFinished(warn.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-900 border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Tandai Selesai Dibina</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pembinaan Kehadiran Tuntas</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* WHATSAPP CONFIRMATION POPUP MODAL (PRESENSI HARIAN)                       */}
        {/* ========================================================================= */}
        {waModalStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-sm max-w-lg w-full border border-slate-300 shadow-2xl relative p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-indigo-950">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold">Kirim Konfirmasi WhatsApp ke Orang Tua</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setWaModalStudent(null)}
                  className="p-1 rounded-sm text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Siswa:</strong> {waModalStudent.studentName} ({waModalStudent.className})</p>
                <p><strong>Wali Murid:</strong> {waModalStudent.parentName} ({waModalStudent.parentPhone})</p>
                <p><strong>Status:</strong> {renderStatusBadge(waModalStudent.status)}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pratinjau Pesan WhatsApp Otomatis:
                </label>
                <textarea
                  readOnly
                  rows={8}
                  value={generateWaTextForParent(waModalStudent)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-xs leading-relaxed font-mono resize-none focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(generateWaTextForParent(waModalStudent));
                    setToastMessage({
                      text: 'Teks pesan WhatsApp berhasil disalin!',
                      type: 'success'
                    });
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
                >
                  Salin Teks Saja
                </button>

                <a
                  href={`https://wa.me/${waModalStudent.parentPhone.replace(/^0/, '62')}?text=${encodeURIComponent(generateWaTextForParent(waModalStudent))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Buka di WhatsApp Web / App</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: WHATSAPP NOTIFIKASI PERINGATAN DINI (< 80%)                      */}
        {/* ========================================================================= */}
        {waWarningModalStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-sm max-w-xl w-full border border-slate-300 shadow-2xl relative p-6 space-y-4 my-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-rose-950">
                  <BellRing className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-bold">Kirim Notifikasi WA Peringatan Dini (&lt; 80%)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setWaWarningModalStudent(null)}
                  className="p-1 rounded-sm text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student info strip */}
              <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-sm text-xs text-rose-950 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm">{waWarningModalStudent.studentName}</span>
                  <span className="font-black text-rose-700">{waWarningModalStudent.attendanceRate}%</span>
                </div>
                <div className="flex flex-wrap gap-x-3 text-slate-700">
                  <span>Kelas: <strong>{waWarningModalStudent.className}</strong></span>
                  <span>Wali Murid: <strong>{waWarningModalStudent.parentName}</strong> ({waWarningModalStudent.parentPhone})</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Format Pesan Resmi Sekolah untuk Orang Tua:
                </label>
                <textarea
                  readOnly
                  rows={10}
                  value={generateWarningWaMessage(waWarningModalStudent)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-xs leading-relaxed font-mono resize-none focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-400">
                  * Mengirim via WA akan otomatis memperbarui status siswa menjadi &ldquo;WA Terkirim&rdquo;.
                </span>

                <div className="flex items-center gap-2 self-end">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generateWarningWaMessage(waWarningModalStudent));
                      handleConfirmSendWarningWa(waWarningModalStudent);
                      setWaWarningModalStudent(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
                  >
                    Salin & Tandai
                  </button>

                  <a
                    href={`https://wa.me/${waWarningModalStudent.parentPhone.replace(/^0/, '62')}?text=${encodeURIComponent(generateWarningWaMessage(waWarningModalStudent))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      handleConfirmSendWarningWa(waWarningModalStudent);
                      setWaWarningModalStudent(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buka WhatsApp & Kirim</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: PENJADWALAN KONSELING & HOME VISIT                               */}
        {/* ========================================================================= */}
        {scheduleCounselingModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-sm max-w-lg w-full border border-slate-300 shadow-2xl relative p-6 space-y-4 my-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-purple-950">
                  <Calendar className="w-5 h-5 text-purple-700" />
                  <h3 className="text-base font-bold">Penjadwalan Konseling & Pendampingan Siswa</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleCounselingModal(null)}
                  className="p-1 rounded-sm text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-purple-50 rounded-sm text-xs text-purple-900 border border-purple-200">
                <p><strong>Nama Siswa:</strong> {scheduleCounselingModal.studentName} ({scheduleCounselingModal.className})</p>
                <p><strong>Wali Murid:</strong> {scheduleCounselingModal.parentName} ({scheduleCounselingModal.parentPhone})</p>
                <p><strong>Tingkat Kehadiran:</strong> <span className="font-bold text-rose-700">{scheduleCounselingModal.attendanceRate}%</span></p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Pertemuan:
                  </label>
                  <input
                    type="date"
                    value={counselingDate}
                    onChange={(e) => setCounselingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs focus:outline-hidden focus:border-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Waktu / Jam Pertemuan:
                  </label>
                  <input
                    type="text"
                    value={counselingTime}
                    onChange={(e) => setCounselingTime(e.target.value)}
                    placeholder="Contoh: 09:00 WITA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs focus:outline-hidden focus:border-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan / Agenda Pembahasan:
                </label>
                <textarea
                  rows={3}
                  value={counselingNote}
                  onChange={(e) => setCounselingNote(e.target.value)}
                  placeholder="Agenda pembinaan, kendala di rumah, atau kesepakatan komitmen..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs focus:outline-hidden focus:border-purple-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleCounselingModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmCounseling(scheduleCounselingModal.id)}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Jadwal Konseling
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: CETAK SURAT PERINGATAN RESMI (SP-1)                              */}
        {/* ========================================================================= */}
        {printableLetterStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-sm max-w-2xl w-full border border-slate-400 shadow-2xl relative p-6 sm:p-8 space-y-6 my-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
                <div className="flex items-center gap-2 text-indigo-950">
                  <Printer className="w-5 h-5 text-indigo-900" />
                  <h3 className="text-base font-bold">Pratinjau Surat Peringatan Dini Resmi (SP-1)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPrintableLetterStudent(null)}
                  className="p-1 rounded-sm text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Letter Body with Official Letterhead */}
              <div className="space-y-4 text-xs text-slate-800 font-serif leading-relaxed border p-6 rounded-xs border-slate-200 bg-white">
                {/* Official Kop Surat */}
                <div className="text-center border-b-2 border-black pb-3 space-y-0.5">
                  <h4 className="font-bold tracking-wider text-xs uppercase">PEMERINTAH KABUPATEN MAROS</h4>
                  <h4 className="font-bold tracking-wider text-xs uppercase">DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
                  <h3 className="font-black text-sm uppercase tracking-wide">UPTD SATUAN PENDIDIKAN FORMAL SDN 5 BARANDASI</h3>
                  <p className="text-[10px] text-slate-600 italic">
                    Alamat: Jl. Poros Maros - Pangkep Km. 3, Barandasi, Kec. Lau, Kab. Maros, Kode Pos 90514
                  </p>
                </div>

                {/* Letter Meta */}
                <div className="flex justify-between items-start pt-2">
                  <div>
                    <p>Nomor : 421.2/088/SDN.5-BRD/DISDIK/2026</p>
                    <p>Lampiran : 1 (Satu) Lembar Rekap Presensi</p>
                    <p>Perihal : <strong>Pemberitahuan & Peringatan Kehadiran Siswa (&lt;80%)</strong></p>
                  </div>
                  <div className="text-right">
                    <p>Maros, 24 September 2026</p>
                    <p>Kepada Yth.</p>
                    <p><strong>Bpk/Ibu Orang Tua / Wali Siswa</strong></p>
                    <p>di - Tempat</p>
                  </div>
                </div>

                <div className="pt-2">
                  <p>Dengan hormat,</p>
                  <p className="text-justify indent-6 mt-1">
                    Berdasarkan hasil evaluasi dan rekapitulasi presensi digital UPTD SDN 5 Barandasi selama satu bulan terakhir ({printableLetterStudent.monthName}), kami memberitahukan bahwa kehadiran putra/putri Bapak/Ibu tercatat sebagai berikut:
                  </p>
                </div>

                {/* Student Details Box */}
                <div className="bg-slate-50 border border-slate-300 p-3 rounded-xs font-sans text-xs space-y-1 my-2">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-semibold">Nama Siswa:</span>
                    <span className="col-span-2 font-bold text-indigo-950">{printableLetterStudent.studentName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-semibold">NISN / Kelas:</span>
                    <span className="col-span-2">{printableLetterStudent.nisn} / {printableLetterStudent.className}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-semibold">Hari Efektif Belajar:</span>
                    <span className="col-span-2">{printableLetterStudent.totalEffectiveDays} Hari</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-semibold">Rekap Ketidakhadiran:</span>
                    <span className="col-span-2">
                      Sakit: {printableLetterStudent.sakit} hari, Izin: {printableLetterStudent.izin} hari, Alpa: {printableLetterStudent.alpa} hari
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-semibold">Persentase Kehadiran:</span>
                    <span className="col-span-2 font-black text-rose-700">{printableLetterStudent.attendanceRate}% (Ambang batas minimal: 80%)</span>
                  </div>
                </div>

                <p className="text-justify indent-6">
                  Sehubungan dengan persentase kehadiran siswa yang berada di bawah 80%, pihak sekolah memohon kehadiran Bapak/Ibu untuk berkoordinasi langsung dengan pihak sekolah guna mencari solusi bersama demi kelancaran proses pembelajaran Ananda.
                </p>

                <p className="indent-6">
                  Demikian surat peringatan dini ini kami sampaikan, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.
                </p>

                {/* Signatures */}
                <div className="grid grid-cols-2 pt-6 text-center font-sans text-xs">
                  <div>
                    <p className="mb-14">Wali Kelas {printableLetterStudent.className},</p>
                    <p className="font-bold underline">{printableLetterStudent.teacherName}</p>
                    <p className="text-[10px] text-slate-500">Guru Kelas UPTD SDN 5 Barandasi</p>
                  </div>
                  <div>
                    <p className="mb-14">Mengetahui,<br />Kepala UPTD SDN 5 Barandasi,</p>
                    <p className="font-bold underline">Hadijah, S.Pd., M.Pd.</p>
                    <p className="text-[10px] text-slate-500">NIP. Terdaftar KSP UPTD SDN 5 Barandasi</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 print:hidden">
                <button
                  type="button"
                  onClick={() => setPrintableLetterStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Cetak Surat Resmi Ini</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: FORMULIR TAMBAH MURID BARU KE PRESENSI                         */}
        {/* ========================================================================= */}
        <AddStudentModal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          defaultClassId={selectedClassId}
          onStudentAdded={(studentName, className) => {
            setToastMessage({
              text: `Murid "${studentName}" berhasil ditambahkan ke daftar hadir ${className}!`,
              type: 'success'
            });
            setTimeout(() => setToastMessage(null), 5000);
          }}
        />

        {/* ========================================================================= */}
        {/* MODAL 5: EKSPOR LAPORAN PRESENSI PDF RESMI                              */}
        {/* ========================================================================= */}
        <AttendancePdfExportModal
          isOpen={isPdfExportModalOpen}
          onClose={() => setIsPdfExportModalOpen(false)}
          defaultClassId={selectedClassId}
          defaultDate={selectedDate}
        />

      </div>
    </section>
  );
};
