import { StudentMonthlyWarning, AttendanceActionStatus } from '../types';

export const WARNINGS_STORAGE_KEY = 'sdn5_monthly_attendance_warnings_v1';
export const WARNINGS_UPDATED_EVENT = 'sdn5_attendance_warnings_updated';

export const DEFAULT_MONTHLY_WARNINGS: StudentMonthlyWarning[] = [
  {
    id: 'warn-1a-01',
    studentId: 'std-1a-11',
    studentName: 'Radhitya Arya Wijaya',
    nisn: '018291011',
    gender: 'L',
    classId: '1A',
    className: 'Kelas 1A',
    teacherId: 't2',
    teacherName: 'Hastuti, S.Pd., Gr.',
    parentName: 'Bapak Wijaya',
    parentPhone: '081288550111',
    monthName: 'September 2026',
    totalEffectiveDays: 20,
    hadir: 15,
    sakit: 3,
    izin: 1,
    alpa: 1,
    attendanceRate: 75.0,
    riskLevel: 'waspada',
    actionStatus: 'belum_tindak',
    notes: 'Sering sakit demam dan batuk di awal minggu. Memerlukan konfirmasi surat keterangan dokter dan pendampingan orang tua di rumah.'
  },
  {
    id: 'warn-1b-01',
    studentId: 'std-1b-03',
    studentName: 'Bagas Aditya Pratama',
    nisn: '018292003',
    gender: 'L',
    classId: '1B',
    className: 'Kelas 1B',
    teacherId: 't3',
    teacherName: 'Hj. Rahmawati. S, S.Pd., M.Pd.',
    parentName: 'Bapak Gunawan',
    parentPhone: '081334001003',
    monthName: 'September 2026',
    totalEffectiveDays: 20,
    hadir: 13,
    sakit: 2,
    izin: 1,
    alpa: 4,
    attendanceRate: 65.0,
    riskLevel: 'kritis',
    actionStatus: 'wa_terkirim',
    notes: 'Terdapat 4 hari tanpa keterangan (alpa). Wali murid telah dihubungi via WA resmi sekolah untuk penjadwalan temu koordinasi.',
    lastActionDate: '23 September 2026, 10:15 WITA',
    lastActionNote: 'Pesan peringatan dini resmi terkirim ke WhatsApp Bapak Gunawan.'
  },
  {
    id: 'warn-2a-01',
    studentId: 'std-2a-05',
    studentName: 'Farel Prayoga',
    nisn: '017293005',
    gender: 'L',
    classId: '2A',
    className: 'Kelas 2A',
    teacherId: 't5',
    teacherName: 'Nurlela, S.Pd.',
    parentName: 'Bapak Baso',
    parentPhone: '085334002005',
    monthName: 'September 2026',
    totalEffectiveDays: 20,
    hadir: 14,
    sakit: 2,
    izin: 4,
    alpa: 0,
    attendanceRate: 70.0,
    riskLevel: 'waspada',
    actionStatus: 'belum_tindak',
    notes: 'Sering izin mengikuti urusan keluarga ke luar daerah. Dikhawatirkan tertinggal capaian kompetensi dasar membaca dan berhitung.'
  },
  {
    id: 'warn-3a-01',
    studentId: 'std-3a-03',
    studentName: 'Dafi Al-Qadri',
    nisn: '016294003',
    gender: 'L',
    classId: '3A',
    className: 'Kelas 3A',
    teacherId: 't7',
    teacherName: 'Dewi Novita, S.Pd. SD., Gr.',
    parentName: 'Bapak Qadri',
    parentPhone: '081334003003',
    monthName: 'September 2026',
    totalEffectiveDays: 20,
    hadir: 12,
    sakit: 3,
    izin: 0,
    alpa: 5,
    attendanceRate: 60.0,
    riskLevel: 'kritis',
    actionStatus: 'jadwal_konseling',
    notes: 'Kehadiran di bawah 65% masuk kategori kritis. Terjadwal sesi bimbingan konseling dan temu orang tua pada Jumat, 25 September 2026.',
    lastActionDate: '22 September 2026, 14:00 WITA',
    lastActionNote: 'Undangan konseling tatap muka telah disepakati bersama wali murid.'
  },
  {
    id: 'warn-4b-01',
    studentId: 'std-4a-03',
    studentName: 'Dimas Anggara',
    nisn: '015295003',
    gender: 'L',
    classId: '4B',
    className: 'Kelas 4B',
    teacherId: 't4',
    teacherName: 'Badaruddin, S.Pd., M.Pd.',
    parentName: 'Bapak Anggoro',
    parentPhone: '081334004003',
    monthName: 'September 2026',
    totalEffectiveDays: 20,
    hadir: 15,
    sakit: 2,
    izin: 3,
    alpa: 0,
    attendanceRate: 75.0,
    riskLevel: 'waspada',
    actionStatus: 'belum_tindak',
    notes: 'Sering izin di hari Jumat. Wali kelas perlu memberikan modul tugas terstruktur agar tidak kehilangan materi ajar tematik.'
  },
  {
    id: 'warn-5a-01',
    studentId: 'std-5a-03',
    studentName: 'Danish Arsyad',
    nisn: '014296003',
    gender: 'L',
    classId: '5A',
    className: 'Kelas 5A',
    teacherId: 't11',
    teacherName: 'Nelly Arif, S.Pd. SD',
    parentName: 'Bapak Arsyad',
    parentPhone: '081334005003',
    monthName: 'September 2026',
    totalEffectiveDays: 20,
    hadir: 14,
    sakit: 2,
    izin: 1,
    alpa: 3,
    attendanceRate: 70.0,
    riskLevel: 'waspada',
    actionStatus: 'belum_tindak',
    notes: 'Siswa kelas V perlu kehadiran konsisten menjelang gladi bersih ANBK. Diperlukan penegasan komitmen belajar bersama orang tua.'
  }
];

export function getAllMonthlyWarnings(): StudentMonthlyWarning[] {
  if (typeof window === 'undefined') {
    return DEFAULT_MONTHLY_WARNINGS;
  }
  try {
    const raw = localStorage.getItem(WARNINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WARNINGS_STORAGE_KEY, JSON.stringify(DEFAULT_MONTHLY_WARNINGS));
      return DEFAULT_MONTHLY_WARNINGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MONTHLY_WARNINGS;
  }
}

export function updateWarningAction(
  warningId: string, 
  status: AttendanceActionStatus, 
  note?: string
): void {
  const current = getAllMonthlyWarnings();
  const now = new Date();
  const timestamp = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + `, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

  const updated = current.map(item => {
    if (item.id === warningId) {
      return {
        ...item,
        actionStatus: status,
        lastActionDate: timestamp,
        lastActionNote: note || (
          status === 'wa_terkirim' ? 'Pesan peringatan dini otomatis berhasil dikirim ke WhatsApp Orang Tua.' :
          status === 'jadwal_konseling' ? 'Sesi bimbingan konseling dan pemanggilan orang tua dijadwalkan.' :
          status === 'selesai_konseling' ? 'Konseling dan pembinaan komitmen kehadiran telah selesai dilaksanakan.' :
          item.lastActionNote
        )
      };
    }
    return item;
  });

  try {
    localStorage.setItem(WARNINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(WARNINGS_UPDATED_EVENT, { detail: { warningId, status } }));
  } catch (err) {
    console.warn('Failed to save warning update', err);
  }
}

export function resetWarningsToDefault(): void {
  try {
    localStorage.setItem(WARNINGS_STORAGE_KEY, JSON.stringify(DEFAULT_MONTHLY_WARNINGS));
    window.dispatchEvent(new CustomEvent(WARNINGS_UPDATED_EVENT, { detail: { reset: true } }));
  } catch (err) {
    console.warn('Failed to reset warnings', err);
  }
}
