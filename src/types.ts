export interface NewsComment {
  id: string;
  newsId: string;
  authorName: string;
  role: 'Orang Tua Siswa' | 'Guru / Tenaga Pendidik' | 'Siswa' | 'Alumni' | 'Masyarakat Umum';
  content: string;
  createdAt: string;
  likes: number;
}

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  parentName?: string;
  parentPhone?: string;
}

export interface StudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  checkInTime?: string;
}

export interface DailyClassAttendance {
  id: string; // e.g. "2026-09-24-1A"
  date: string; // "YYYY-MM-DD"
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  teacherNip: string;
  records: Record<string, StudentAttendanceRecord>;
  summary: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    rate: number;
  };
  submittedAt: string;
  isVerifiedByPrincipal?: boolean;
  verifiedAt?: string;
}

export interface SchoolClassInfo {
  id: string;
  name: string;
  level: number;
  rombel: string;
  room: string;
  teacherId: string;
  teacherName: string;
  teacherNip: string;
  totalStudents: number;
}

export type AttendanceRiskLevel = 'kritis' | 'waspada' | 'aman';
export type AttendanceActionStatus = 'belum_tindak' | 'wa_terkirim' | 'jadwal_konseling' | 'selesai_konseling';

export interface StudentMonthlyWarning {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  gender: 'L' | 'P';
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  parentName: string;
  parentPhone: string;
  monthName: string;
  totalEffectiveDays: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  attendanceRate: number; // e.g. 72.5
  riskLevel: AttendanceRiskLevel; // <70% = kritis, 70-79.9% = waspada
  actionStatus: AttendanceActionStatus;
  notes: string;
  lastActionDate?: string;
  lastActionNote?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'berita' | 'pengumuman' | 'prestasi' | 'ppdb';
  date: string;
  author: string;
  summary: string;
  content: string;
  image: string;
  readTime: string;
  tags: string[];
  isImportant?: boolean;
  sourceName?: string;
  sourceUrl?: string;
  initialLikes?: number;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  subject: string;
  category: 'MIPA' | 'IPS' | 'Bahasa' | 'Seni & Bimbingan';
  education: string;
  experience: string;
  photo: string;
  email: string;
  quote: string;
  status?: string;
  qualification?: string;
}

export interface CeremonyLeader {
  no: number;
  name: string;
  nip: string;
  role: string;
  category: 'Kepala Sekolah' | 'Guru Kelas' | 'Guru Mapel';
  status: string;
  schedulePeriod?: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

export interface Extracurricular {
  id: string;
  name: string;
  category: 'Olahraga' | 'Seni & Budaya' | 'Sains & Teknologi' | 'Kepemimpinan';
  schedule: string;
  coach: string;
  description: string;
  image: string;
  membersCount: number;
  achievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  competition: string;
  level: 'Kabupaten' | 'Kota' | 'Provinsi' | 'Nasional' | 'Internasional';
  year: string;
  studentName: string;
  medal: 'Emas' | 'Perak' | 'Perunggu' | 'Juara 1' | 'Juara 2' | 'Juara 3';
  image: string;
}

export interface AcademicCalendarItem {
  date: string;
  title: string;
  category: 'Ujian' | 'Libur' | 'Kegiatan' | 'PPDB';
  description: string;
}

export interface PpdbApplicant {
  fullName: string;
  nisn: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  originSchool: string;
  majorChoice: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  averageScore: number;
  status: 'Diterima' | 'Diproses' | 'Belum Verifikasi';
  registrationCode: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface KspSlide {
  id: number;
  slideNumber: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  lead: string;
  keyPoints: Array<{
    title: string;
    desc: string;
    tag?: string;
    highlight?: boolean;
    bullets?: string[];
  }>;
  quoteOrHighlight?: string;
  metrics?: Array<{
    label: string;
    value: string;
    desc?: string;
  }>;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  speakerNotes?: string;
}

export interface GovPortal {
  id: string;
  name: string;
  shortName: string;
  url: string;
  category: 'Evaluasi & Rapor' | 'Kepegawaian ASN' | 'Sumber Belajar' | 'Pengembangan GTK' | 'Validasi Data' | 'Portal Terpadu';
  targetUser: 'Guru & Tendik' | 'Umum & Orang Tua' | 'ASN / PNS / PPPK';
  description: string;
  badge?: string;
  iconName: string;
  officialDomain: string;
}

export interface RaporIndicator {
  id: string;
  title: string;
  status: 'Baik' | 'Sedang' | 'Kurang';
  trendText: string;
  tag?: string;
  description: string;
  inspiration?: string;
}

export interface DigitalLiteracyPortal {
  id: string;
  name: string;
  shortName: string;
  url: string;
  provider: string;
  category: string;
  targetAudience: string;
  description: string;
  features: string[];
  badge: string;
  domain: string;
  colorScheme: 'indigo' | 'amber' | 'emerald' | 'rose' | 'sky';
}

export interface MonthlyStudentReport {
  studentId: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  totalEffectiveDays: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  attendanceRate: number;
  statusKeterangan: 'Sangat Baik' | 'Baik' | 'Cukup / Waspada' | 'Kritis (<70%)';
  parentName?: string;
  parentPhone?: string;
}

export interface MonthlyClassReport {
  classInfo: SchoolClassInfo;
  monthName: string;
  year: number;
  totalEffectiveDays: number;
  studentsReport: MonthlyStudentReport[];
  totalStudents: number;
  averageRate: number;
  totalHadir: number;
  totalSakit: number;
  totalIzin: number;
  totalAlpa: number;
  warningCount: number;
}

