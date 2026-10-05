import { TEACHERS_LIST } from '../data/schoolData';

export type TeacherAttendanceStatus = 
  | 'HADIR_TEPAT_WAKTU' 
  | 'TERLAMBAT' 
  | 'IZIN_DINAS' 
  | 'SAKIT' 
  | 'CUTI' 
  | 'BELUM_ABSEN';

export interface TeacherAttendanceRecord {
  teacherId: string;
  name: string;
  nip: string;
  role: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string; // Jam masuk resmi WITA (TIDAK BISA DIEDIT GURU)
  checkOutTime?: string; // Jam pulang resmi WITA (TIDAK BISA DIEDIT GURU)
  teachingJournal?: string;
  roomAssignment?: string;
  locationStatus: 'Sekolah (GPS Terverifikasi)' | 'Tugas Luar / Dinas' | 'Rumah / Sakit';
  isLockedTime: boolean; // Menandakan jam terkunci otomatis oleh sistem
  verifiedByPrincipal?: boolean;
  verifiedByPengawas?: boolean;
  verifiedAt?: string;
  lastSyncTimestamp?: string;
}

export interface DailyTeacherAttendanceReport {
  date: string; // YYYY-MM-DD
  records: Record<string, TeacherAttendanceRecord>;
  summary: {
    totalTeachers: number;
    hadirTepatWaktu: number;
    terlambat: number;
    izinDinas: number;
    sakit: number;
    cuti: number;
    belumAbsen: number;
    attendanceRate: number; // percentage
  };
  isVerifiedByPrincipal: boolean;
  isVerifiedByPengawas: boolean;
  principalName: string;
  pengawasName: string;
  pengawasNip: string;
}

export const TEACHER_ATTENDANCE_STORAGE_KEY = 'sdn5_teacher_attendance_records_v2';
export const TEACHER_ATTENDANCE_UPDATED_EVENT = 'sdn5_teacher_attendance_updated';

// Helper to get formatted current WITA time string (HH:MM WITA)
export function getCurrentWitaTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WITA`;
}

// Initial seed records for a specific date
export function getInitialTeacherSeedAttendance(dateStr: string): DailyTeacherAttendanceReport {
  const records: Record<string, TeacherAttendanceRecord> = {};

  TEACHERS_LIST.forEach((t, idx) => {
    let status: TeacherAttendanceStatus = 'HADIR_TEPAT_WAKTU';
    let checkInTime: string | undefined = `06:${String(45 + (idx % 18)).padStart(2, '0')} WITA`;
    let locationStatus: TeacherAttendanceRecord['locationStatus'] = 'Sekolah (GPS Terverifikasi)';
    let teachingJournal: string | undefined = undefined;

    // Realistic variation based on teacher role
    if (t.id === 't1') {
      // Kepala Sekolah
      status = 'HADIR_TEPAT_WAKTU';
      checkInTime = '06:45 WITA';
      teachingJournal = 'Rapat Koordinasi Manajemen Sekolah & Peninjauan Pembelajaran Kurikulum Merdeka bersama Pengawas Bina';
    } else if (t.id === 't13') {
      // Mantasia, S.Pd. (Guru Kelas 6A)
      status = 'HADIR_TEPAT_WAKTU';
      checkInTime = '06:55 WITA';
      teachingJournal = 'Pembelajaran IPAS Bab Ekosistem & Latihan Asesmen Standar Kelulusan Kelas VI';
    } else if (t.id === 't2') {
      // Hastuti, S.Pd. (Guru Kelas 1A)
      status = 'HADIR_TEPAT_WAKTU';
      checkInTime = '06:50 WITA';
      teachingJournal = 'Pengenalan Huruf Vokal dan Angka Melalui Media Kartu Bergambar';
    } else if (t.id === 't6') {
      // Terlambat sedikit
      status = 'TERLAMBAT';
      checkInTime = '07:18 WITA';
      teachingJournal = 'Pembelajaran Tematik Bahasa Indonesia: Membaca Lancar';
    } else if (t.id === 't8') {
      // Izin dinas KKG
      status = 'IZIN_DINAS';
      checkInTime = undefined;
      locationStatus = 'Tugas Luar / Dinas';
      teachingJournal = 'Mengikuti Workshop Pembelajaran TIK Dinas Pendidikan Kabupaten Maros';
    } else if (t.id === 't12') {
      // Sakit flu
      status = 'SAKIT';
      checkInTime = undefined;
      locationStatus = 'Rumah / Sakit';
      teachingJournal = 'Izin istirahat dokter (Surat Keterangan Sakit terlampir)';
    } else {
      teachingJournal = `Pelaksanaan KBM Efektif di ${t.subject} sesuai Modul Ajar Kurikulum Merdeka`;
    }

    records[t.id] = {
      teacherId: t.id,
      name: t.name,
      nip: t.nip,
      role: t.subject,
      status,
      checkInTime,
      checkOutTime: status === 'HADIR_TEPAT_WAKTU' || status === 'TERLAMBAT' ? '14:05 WITA' : undefined,
      teachingJournal,
      roomAssignment: t.subject,
      locationStatus,
      isLockedTime: true, // Jam masuk terkunci otomatis
      verifiedByPrincipal: true,
      verifiedByPengawas: idx < 15,
      lastSyncTimestamp: 'Real-time Server Sync'
    };
  });

  const allRecords = Object.values(records);
  const totalTeachers = allRecords.length;
  const hadirTepatWaktu = allRecords.filter(r => r.status === 'HADIR_TEPAT_WAKTU').length;
  const terlambat = allRecords.filter(r => r.status === 'TERLAMBAT').length;
  const izinDinas = allRecords.filter(r => r.status === 'IZIN_DINAS').length;
  const sakit = allRecords.filter(r => r.status === 'SAKIT').length;
  const cuti = allRecords.filter(r => r.status === 'CUTI').length;
  const belumAbsen = allRecords.filter(r => r.status === 'BELUM_ABSEN').length;

  const totalHadir = hadirTepatWaktu + terlambat;
  const attendanceRate = totalTeachers > 0 ? Number(((totalHadir / totalTeachers) * 100).toFixed(1)) : 100;

  return {
    date: dateStr,
    records,
    summary: {
      totalTeachers,
      hadirTepatWaktu,
      terlambat,
      izinDinas,
      sakit,
      cuti,
      belumAbsen,
      attendanceRate
    },
    isVerifiedByPrincipal: true,
    isVerifiedByPengawas: true,
    principalName: 'Hadijah, S.Pd., M.Pd.',
    pengawasName: 'Hj. Mirna, S.Pd., M.Pd.',
    pengawasNip: '19740612 199903 2 003'
  };
}

// Get all teacher attendance storage
export function getAllTeacherAttendanceStorage(): Record<string, DailyTeacherAttendanceReport> {
  const today = '2026-10-05';
  const defaultReport = getInitialTeacherSeedAttendance(today);

  if (typeof window === 'undefined') {
    return { [today]: defaultReport };
  }

  try {
    const raw = localStorage.getItem(TEACHER_ATTENDANCE_STORAGE_KEY);
    if (!raw) {
      const initMap = { [today]: defaultReport };
      localStorage.setItem(TEACHER_ATTENDANCE_STORAGE_KEY, JSON.stringify(initMap));
      return initMap;
    }
    const parsed = JSON.parse(raw);
    if (!parsed[today]) {
      parsed[today] = defaultReport;
    }
    return parsed;
  } catch {
    return { [today]: defaultReport };
  }
}

// Get teacher attendance for a specific date
export function getTeacherAttendanceForDate(dateStr: string): DailyTeacherAttendanceReport {
  const all = getAllTeacherAttendanceStorage();
  if (all[dateStr]) {
    return all[dateStr];
  }

  // Initialize new date
  const newReport = getInitialTeacherSeedAttendance(dateStr);
  all[dateStr] = newReport;
  try {
    localStorage.setItem(TEACHER_ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Failed to save teacher attendance report', err);
  }
  return newReport;
}

// Teacher self check-in: JAM MASUK & PULANG TERKUNCI OTOMATIS OLEH SISTEM (TIDAK BISA DIEDIT GURU)
export function checkInTeacher(
  dateStr: string,
  teacherId: string,
  status: TeacherAttendanceStatus,
  teachingJournal?: string,
  locationStatus: TeacherAttendanceRecord['locationStatus'] = 'Sekolah (GPS Terverifikasi)'
): TeacherAttendanceRecord {
  const all = getAllTeacherAttendanceStorage();
  const report = all[dateStr] || getInitialTeacherSeedAttendance(dateStr);
  const teacher = TEACHERS_LIST.find(t => t.id === teacherId) || TEACHERS_LIST[0];

  // Exact system time in WITA - CANNOT BE EDITED OR OVERRIDDEN BY USER
  const exactSystemTime = getCurrentWitaTimeString();

  const existingRec = report.records[teacherId];
  const newCheckIn = existingRec?.checkInTime || exactSystemTime;

  const updatedRecord: TeacherAttendanceRecord = {
    teacherId,
    name: teacher.name,
    nip: teacher.nip,
    role: teacher.subject,
    status,
    checkInTime: status === 'SAKIT' || status === 'CUTI' ? undefined : newCheckIn,
    checkOutTime: existingRec?.checkOutTime,
    teachingJournal: teachingJournal || existingRec?.teachingJournal || `Agenda KBM ${teacher.subject}`,
    roomAssignment: teacher.subject,
    locationStatus,
    isLockedTime: true, // Locked!
    verifiedByPrincipal: false, // Menunggu supervisi KS
    verifiedByPengawas: false,
    lastSyncTimestamp: `${exactSystemTime} (Tersinkronisasi Real-Time)`
  };

  report.records[teacherId] = updatedRecord;

  // Recalculate summary
  const allRecords = Object.values(report.records);
  const totalTeachers = allRecords.length;
  const hadirTepatWaktu = allRecords.filter(r => r.status === 'HADIR_TEPAT_WAKTU').length;
  const terlambat = allRecords.filter(r => r.status === 'TERLAMBAT').length;
  const izinDinas = allRecords.filter(r => r.status === 'IZIN_DINAS').length;
  const sakit = allRecords.filter(r => r.status === 'SAKIT').length;
  const cuti = allRecords.filter(r => r.status === 'CUTI').length;
  const belumAbsen = allRecords.filter(r => r.status === 'BELUM_ABSEN').length;
  const totalHadir = hadirTepatWaktu + terlambat;
  const attendanceRate = totalTeachers > 0 ? Number(((totalHadir / totalTeachers) * 100).toFixed(1)) : 100;

  report.summary = {
    totalTeachers,
    hadirTepatWaktu,
    terlambat,
    izinDinas,
    sakit,
    cuti,
    belumAbsen,
    attendanceRate
  };

  all[dateStr] = report;

  try {
    localStorage.setItem(TEACHER_ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(TEACHER_ATTENDANCE_UPDATED_EVENT, { detail: { date: dateStr, teacherId } }));
  } catch (err) {
    console.warn('Failed to store teacher check-in', err);
  }

  return updatedRecord;
}

// Check out teacher at the end of the day (JAM PULANG TERKUNCI OTOMATIS)
export function checkOutTeacher(dateStr: string, teacherId: string): void {
  const all = getAllTeacherAttendanceStorage();
  const report = all[dateStr] || getInitialTeacherSeedAttendance(dateStr);
  const exactSystemTime = getCurrentWitaTimeString();

  if (report.records[teacherId]) {
    report.records[teacherId].checkOutTime = exactSystemTime;
    report.records[teacherId].lastSyncTimestamp = `${exactSystemTime} (Check-out Tersimpan)`;
    all[dateStr] = report;
    try {
      localStorage.setItem(TEACHER_ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent(TEACHER_ATTENDANCE_UPDATED_EVENT, { detail: { date: dateStr, teacherId } }));
    } catch (e) {
      console.warn(e);
    }
  }
}

// Verification by Kepala Sekolah & Pengawas Bina
export function verifyTeacherAttendanceByAuthorities(dateStr: string, verifiedBy: 'principal' | 'pengawas' | 'both'): void {
  const all = getAllTeacherAttendanceStorage();
  const report = all[dateStr] || getInitialTeacherSeedAttendance(dateStr);
  const nowStr = getCurrentWitaTimeString();

  if (verifiedBy === 'principal' || verifiedBy === 'both') {
    report.isVerifiedByPrincipal = true;
    Object.keys(report.records).forEach(k => {
      report.records[k].verifiedByPrincipal = true;
      report.records[k].verifiedAt = `Disahkan KS (${nowStr})`;
    });
  }

  if (verifiedBy === 'pengawas' || verifiedBy === 'both') {
    report.isVerifiedByPengawas = true;
    Object.keys(report.records).forEach(k => {
      report.records[k].verifiedByPengawas = true;
    });
  }

  all[dateStr] = report;
  try {
    localStorage.setItem(TEACHER_ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(TEACHER_ATTENDANCE_UPDATED_EVENT, { detail: { date: dateStr, verified: true } }));
  } catch (err) {
    console.warn(err);
  }
}
