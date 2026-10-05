import { TeacherAttendanceRecord, TeacherAttendanceStatus, getTeacherAttendanceForDate } from './teacherAttendanceStore';

export interface SupervisedSchool {
  id: string;
  name: string;
  npsn: string;
  address: string;
  principalName: string;
  principalNip: string;
  principalPhone: string;
  totalTeachers: number;
  hadirTepatWaktu: number;
  terlambat: number;
  izinDinas: number;
  sakit: number;
  cuti: number;
  belumAbsen: number;
  disciplineRate: number; // percentage
  status: 'SANGAT_BAIK' | 'BAIK' | 'PERLU_PEMBINAAN';
  isVerifiedBySupervisor: boolean;
  verifiedAt?: string;
  notes?: string;
}

export interface UncheckedTeacherAlert {
  id: string;
  schoolId: string;
  schoolName: string;
  principalName: string;
  principalPhone: string;
  teacherName: string;
  teacherNip: string;
  role: string;
  phone: string;
  expectedCheckInTime: string; // e.g. "07:00 WITA"
  cutoffTime: string; // e.g. "07:30 WITA"
  status: 'BELUM_PRESENSI' | 'TERLAMBAT_KRITIS';
  minutesOverdue: number;
  lastActionStatus?: 'BELUM_DITEGUR' | 'WA_TERKIRIM' | 'KS_DIHUBUNGI' | 'SELESAI';
  actionNote?: string;
}

export interface SupervisorProfile {
  name: string;
  nip: string;
  rank: string; // e.g. "Pembina Tk. I, IV/b"
  role: string;
  workUnit: string;
  district: string;
  regency: string;
  phone: string;
  photoUrl?: string;
}

export const SUPERVISOR_PROFILE: SupervisorProfile = {
  name: 'Hj. Mirna, S.Pd., M.Pd.',
  nip: '19740612 199903 2 003',
  rank: 'Pembina Tk. I, IV/b',
  role: 'Pengawas Sekolah Ahli Madya / Pengawas Bina Jenjang SD',
  workUnit: 'Dinas Pendidikan dan Kebudayaan Kabupaten Maros',
  district: 'Kecamatan Lau',
  regency: 'Kabupaten Maros',
  phone: '081242558899',
};

export const SUPERVISOR_STORAGE_KEY = 'sdn5_supervisor_schools_data_v1';
export const SUPERVISOR_CUTOFF_KEY = 'sdn5_supervisor_cutoff_time_v1';
export const SUPERVISOR_UPDATED_EVENT = 'sdn5_supervisor_updated_event';

export const INITIAL_SUPERVISED_SCHOOLS: SupervisedSchool[] = [
  {
    id: 'sch-sdn5-barandasi',
    name: 'UPTD SDN 5 Barandasi',
    npsn: '40300262',
    address: 'Jl. Poros Maros - Pangkep Km. 3, Barandasi, Kec. Lau',
    principalName: 'Hadijah, S.Pd., M.Pd.',
    principalNip: '19710504 199307 2 001',
    principalPhone: '081242330055',
    totalTeachers: 22,
    hadirTepatWaktu: 20,
    terlambat: 1,
    izinDinas: 1,
    sakit: 0,
    cuti: 0,
    belumAbsen: 0,
    disciplineRate: 95.5,
    status: 'SANGAT_BAIK',
    isVerifiedBySupervisor: true,
    verifiedAt: '07:20 WITA',
    notes: 'Presensi GTK sangat tertib, seluruh rombel telah terisi KBM tepat waktu.'
  },
  {
    id: 'sch-sdn21-bontoa',
    name: 'UPTD SDN 21 Bontoa',
    npsn: '40300288',
    address: 'Jl. Poros Bontoa No. 12, Kel. Bontoa, Kec. Lau',
    principalName: 'Drs. H. Syamsuddin, M.M.',
    principalNip: '19680315 199412 1 002',
    principalPhone: '081342551021',
    totalTeachers: 18,
    hadirTepatWaktu: 15,
    terlambat: 1,
    izinDinas: 1,
    sakit: 0,
    cuti: 0,
    belumAbsen: 1,
    disciplineRate: 88.9,
    status: 'BAIK',
    isVerifiedBySupervisor: false,
    notes: 'Terdapat 1 guru PJOK belum melakukan presensi hingga batas waktu 07:30 WITA.'
  },
  {
    id: 'sch-sdn103-barandasi',
    name: 'UPTD SDN 103 Inpres Barandasi',
    npsn: '40300301',
    address: 'Kompleks Pasar Barandasi, Kel. Maccini Baji, Kec. Lau',
    principalName: 'Hj. St. Maryam, S.Pd., M.Pd.',
    principalNip: '19700820 199602 2 002',
    principalPhone: '085242661103',
    totalTeachers: 19,
    hadirTepatWaktu: 17,
    terlambat: 0,
    izinDinas: 1,
    sakit: 0,
    cuti: 0,
    belumAbsen: 1,
    disciplineRate: 89.5,
    status: 'BAIK',
    isVerifiedBySupervisor: false,
    notes: '1 guru kelas rendah konfirmasi dalam perjalanan karena kendala teknis kendaraan.'
  },
  {
    id: 'sch-sdn77-marosbaru',
    name: 'UPTD SDN 77 Inpres Maros Baru',
    npsn: '40300315',
    address: 'Jl. Poros Maccini Baji No. 45, Kec. Lau',
    principalName: 'Basri, S.Pd.',
    principalNip: '19730410 199802 1 004',
    principalPhone: '081342770077',
    totalTeachers: 16,
    hadirTepatWaktu: 13,
    terlambat: 1,
    izinDinas: 0,
    sakit: 0,
    cuti: 0,
    belumAbsen: 2,
    disciplineRate: 81.3,
    status: 'PERLU_PEMBINAAN',
    isVerifiedBySupervisor: false,
    notes: 'Perlu atensi pengawas. 2 staf belum absensi dan belum ada laporan izin ke Kepala Sekolah.'
  },
  {
    id: 'sch-sdn125-karampuang',
    name: 'UPTD SDN 125 Inpres Karampuang',
    npsn: '40300329',
    address: 'Dusun Karampuang, Desa Minasa Baji, Kec. Lau',
    principalName: 'Rosdiana, S.Pd., M.Pd.',
    principalNip: '19751102 200012 2 001',
    principalPhone: '085342880125',
    totalTeachers: 17,
    hadirTepatWaktu: 16,
    terlambat: 0,
    izinDinas: 1,
    sakit: 0,
    cuti: 0,
    belumAbsen: 0,
    disciplineRate: 94.1,
    status: 'SANGAT_BAIK',
    isVerifiedBySupervisor: true,
    verifiedAt: '07:25 WITA',
    notes: 'Disiplin kehadiran tinggi, 1 guru izin dinas Bimtek Kurikulum Merdeka Kabupaten.'
  },
  {
    id: 'sch-sdn142-lempangan',
    name: 'UPTD SDN 142 Inpres Lempangan',
    npsn: '40300342',
    address: 'Dusun Lempangan, Desa Soreang, Kec. Lau',
    principalName: 'Muh. Yunus, S.Pd.',
    principalNip: '19720918 199703 1 003',
    principalPhone: '081242990142',
    totalTeachers: 15,
    hadirTepatWaktu: 12,
    terlambat: 1,
    izinDinas: 1,
    sakit: 0,
    cuti: 0,
    belumAbsen: 1,
    disciplineRate: 80.0,
    status: 'PERLU_PEMBINAAN',
    isVerifiedBySupervisor: false,
    notes: 'Tingkat kehadiran 80.0% mendekati batas minimal. Memerlukan supervisi klinis pengawas.'
  }
];

export const INITIAL_UNCHECKED_TEACHERS: UncheckedTeacherAlert[] = [
  {
    id: 'alert-gtk-01',
    schoolId: 'sch-sdn21-bontoa',
    schoolName: 'UPTD SDN 21 Bontoa',
    principalName: 'Drs. H. Syamsuddin, M.M.',
    principalPhone: '081342551021',
    teacherName: 'Amiruddin, S.Pd.',
    teacherNip: '19840212 201101 1 015',
    role: 'Guru Mapel PJOK',
    phone: '081245678901',
    expectedCheckInTime: '07:00 WITA',
    cutoffTime: '07:30 WITA',
    status: 'BELUM_PRESENSI',
    minutesOverdue: 35,
    lastActionStatus: 'BELUM_DITEGUR',
    actionNote: 'Belum ada keterangan masuk ke aplikasi SIMAK hingga batas toleransi pengawas.'
  },
  {
    id: 'alert-gtk-02',
    schoolId: 'sch-sdn103-barandasi',
    schoolName: 'UPTD SDN 103 Inpres Barandasi',
    principalName: 'Hj. St. Maryam, S.Pd., M.Pd.',
    principalPhone: '085242661103',
    teacherName: 'Wahyuni, S.Pd.',
    teacherNip: '19890524 201402 2 003',
    role: 'Guru Kelas 3',
    phone: '085298765432',
    expectedCheckInTime: '07:00 WITA',
    cutoffTime: '07:30 WITA',
    status: 'BELUM_PRESENSI',
    minutesOverdue: 28,
    lastActionStatus: 'BELUM_DITEGUR',
    actionNote: 'Pemberitahuan awal belum direspons, jadwal mengajar jam ke-1 pukul 07:30 WITA.'
  },
  {
    id: 'alert-gtk-03',
    schoolId: 'sch-sdn77-marosbaru',
    schoolName: 'UPTD SDN 77 Inpres Maros Baru',
    principalName: 'Basri, S.Pd.',
    principalPhone: '081342770077',
    teacherName: 'Syarifuddin, S.Pd.',
    teacherNip: '19810817 200801 1 012',
    role: 'Guru Kelas 4',
    phone: '081377889900',
    expectedCheckInTime: '07:00 WITA',
    cutoffTime: '07:30 WITA',
    status: 'BELUM_PRESENSI',
    minutesOverdue: 42,
    lastActionStatus: 'BELUM_DITEGUR',
    actionNote: 'Tidak ada surat tugas luar dan belum melakukan check-in via SIMAK mobile/web.'
  },
  {
    id: 'alert-gtk-04',
    schoolId: 'sch-sdn77-marosbaru',
    schoolName: 'UPTD SDN 77 Inpres Maros Baru',
    principalName: 'Basri, S.Pd.',
    principalPhone: '081342770077',
    teacherName: 'Nurjannah, A.Ma.',
    teacherNip: '19860419 201001 2 021',
    role: 'Tenaga Administrasi Sekolah',
    phone: '085366778811',
    expectedCheckInTime: '07:00 WITA',
    cutoffTime: '07:30 WITA',
    status: 'BELUM_PRESENSI',
    minutesOverdue: 38,
    lastActionStatus: 'BELUM_DITEGUR',
    actionNote: 'Layanan administrasi dan buku induk sekolah belum dibuka petugas.'
  },
  {
    id: 'alert-gtk-05',
    schoolId: 'sch-sdn142-lempangan',
    schoolName: 'UPTD SDN 142 Inpres Lempangan',
    principalName: 'Muh. Yunus, S.Pd.',
    principalPhone: '081242990142',
    teacherName: 'Ilham Syam, S.Pd.I.',
    teacherNip: '19920110 201903 1 005',
    role: 'Guru Mapel PAIBP',
    phone: '081299887766',
    expectedCheckInTime: '07:00 WITA',
    cutoffTime: '07:30 WITA',
    status: 'BELUM_PRESENSI',
    minutesOverdue: 45,
    lastActionStatus: 'BELUM_DITEGUR',
    actionNote: 'Mata pelajaran agama terjadwal di Kelas 5 jam pertama, siswa menunggu guru di kelas.'
  }
];

export function getSupervisedSchools(): SupervisedSchool[] {
  if (typeof window === 'undefined') return INITIAL_SUPERVISED_SCHOOLS;
  try {
    const raw = localStorage.getItem(SUPERVISOR_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SUPERVISOR_STORAGE_KEY, JSON.stringify(INITIAL_SUPERVISED_SCHOOLS));
      return INITIAL_SUPERVISED_SCHOOLS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_SUPERVISED_SCHOOLS;
  }
}

export function saveSupervisedSchools(schools: SupervisedSchool[]): void {
  try {
    localStorage.setItem(SUPERVISOR_STORAGE_KEY, JSON.stringify(schools));
    window.dispatchEvent(new Event(SUPERVISOR_UPDATED_EVENT));
  } catch (err) {
    console.warn('Failed to save supervisor schools', err);
  }
}

export function getSupervisorCutoffTime(): string {
  if (typeof window === 'undefined') return '07:30';
  return localStorage.getItem(SUPERVISOR_CUTOFF_KEY) || '07:30';
}

export function setSupervisorCutoffTime(timeStr: string): void {
  try {
    localStorage.setItem(SUPERVISOR_CUTOFF_KEY, timeStr);
    window.dispatchEvent(new Event(SUPERVISOR_UPDATED_EVENT));
  } catch (err) {
    console.warn('Failed to set cutoff time', err);
  }
}

export function verifySchoolBySupervisor(schoolId: string): void {
  const schools = getSupervisedSchools();
  const updated = schools.map(s => {
    if (s.id === schoolId) {
      return {
        ...s,
        isVerifiedBySupervisor: true,
        verifiedAt: new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Makassar'
        }).format(new Date()) + ' WITA'
      };
    }
    return s;
  });
  saveSupervisedSchools(updated);
}

export function verifyAllSchoolsBySupervisor(): void {
  const schools = getSupervisedSchools();
  const nowStr = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Makassar'
  }).format(new Date()) + ' WITA';

  const updated = schools.map(s => ({
    ...s,
    isVerifiedBySupervisor: true,
    verifiedAt: nowStr
  }));
  saveSupervisedSchools(updated);
}

export function getSupervisorSummary() {
  const schools = getSupervisedSchools();
  const totalSchools = schools.length;
  const totalTeachers = schools.reduce((acc, s) => acc + s.totalTeachers, 0);
  const totalHadir = schools.reduce((acc, s) => acc + s.hadirTepatWaktu, 0);
  const totalTerlambat = schools.reduce((acc, s) => acc + s.terlambat, 0);
  const totalIzin = schools.reduce((acc, s) => acc + s.izinDinas, 0);
  const totalSakit = schools.reduce((acc, s) => acc + s.sakit + s.cuti, 0);
  const totalBelumAbsen = schools.reduce((acc, s) => acc + s.belumAbsen, 0);
  
  const overallRate = totalTeachers > 0 
    ? Math.round(((totalHadir + totalIzin) / totalTeachers) * 1000) / 10 
    : 0;

  const verifiedCount = schools.filter(s => s.isVerifiedBySupervisor).length;

  return {
    totalSchools,
    totalTeachers,
    totalHadir,
    totalTerlambat,
    totalIzin,
    totalSakit,
    totalBelumAbsen,
    overallRate,
    verifiedCount,
    allVerified: verifiedCount === totalSchools
  };
}
