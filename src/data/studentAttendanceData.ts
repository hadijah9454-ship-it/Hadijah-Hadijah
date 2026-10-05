import { Student, SchoolClassInfo, DailyClassAttendance, AttendanceStatus } from '../types';

export const SCHOOL_CLASSES: SchoolClassInfo[] = [
  {
    id: '1A',
    name: 'Kelas 1A',
    level: 1,
    rombel: 'A',
    room: 'Ruang Kelas 1A (Gedung Utama Lt. 1)',
    teacherId: 't2',
    teacherName: 'Hastuti, S.Pd., Gr.',
    teacherNip: '19801018 202521 2 014',
    totalStudents: 28
  },
  {
    id: '1B',
    name: 'Kelas 1B',
    level: 1,
    rombel: 'B',
    room: 'Ruang Kelas 1B (Gedung Utama Lt. 1)',
    teacherId: 't3',
    teacherName: 'Hj. Rahmawati. S, S.Pd., M.Pd.',
    teacherNip: '19720428 200005 2 001',
    totalStudents: 28
  },
  {
    id: '1C',
    name: 'Kelas 1C',
    level: 1,
    rombel: 'C',
    room: 'Ruang Kelas 1C (Gedung Timur)',
    teacherId: 't10',
    teacherName: 'Rasmi, S.Pd.',
    teacherNip: '19820922 201501 2 001',
    totalStudents: 27
  },
  {
    id: '2A',
    name: 'Kelas 2A',
    level: 2,
    rombel: 'A',
    room: 'Ruang Kelas 2A (Gedung Utama Lt. 1)',
    teacherId: 't5',
    teacherName: 'Nurlela, S.Pd.',
    teacherNip: '19740305 202521 2 030',
    totalStudents: 26
  },
  {
    id: '2B',
    name: 'Kelas 2B',
    level: 2,
    rombel: 'B',
    room: 'Ruang Kelas 2B (Gedung Utama Lt. 1)',
    teacherId: 't6',
    teacherName: 'Rosmiati, S.Pd.',
    teacherNip: '19720506 200502 2 003',
    totalStudents: 26
  },
  {
    id: '3A',
    name: 'Kelas 3A',
    level: 3,
    rombel: 'A',
    room: 'Ruang Kelas 3A (Gedung Utama Lt. 2)',
    teacherId: 't7',
    teacherName: 'Dewi Novita, S.Pd. SD., Gr.',
    teacherNip: '19841101 202221 2 033',
    totalStudents: 27
  },
  {
    id: '3B',
    name: 'Kelas 3B',
    level: 3,
    rombel: 'B',
    room: 'Ruang Kelas 3B (Gedung Utama Lt. 2)',
    teacherId: 't8',
    teacherName: 'Rezky Auliah, S.Pd.',
    teacherNip: '19950222 202521 2 150',
    totalStudents: 27
  },
  {
    id: '4A',
    name: 'Kelas 4A',
    level: 4,
    rombel: 'A',
    room: 'Ruang Kelas 4A (Gedung Barat Lt. 1)',
    teacherId: 't9',
    teacherName: 'Agustina, S.Pd.I.',
    teacherNip: '19711205 201501 2 001',
    totalStudents: 29
  },
  {
    id: '4B',
    name: 'Kelas 4B',
    level: 4,
    rombel: 'B',
    room: 'Ruang Kelas 4B (Gedung Barat Lt. 1)',
    teacherId: 't4',
    teacherName: 'Badaruddin, S.Pd., M.Pd.',
    teacherNip: '19830905 201001 1 031',
    totalStudents: 28
  },
  {
    id: '5A',
    name: 'Kelas 5A',
    level: 5,
    rombel: 'A',
    room: 'Ruang Kelas 5A (Gedung Barat Lt. 2)',
    teacherId: 't11',
    teacherName: 'Nelly Arif, S.Pd. SD',
    teacherNip: '19711205 201501 2 001',
    totalStudents: 30
  },
  {
    id: '5B',
    name: 'Kelas 5B',
    level: 5,
    rombel: 'B',
    room: 'Ruang Kelas 5B (Gedung Barat Lt. 2)',
    teacherId: 't12',
    teacherName: 'Nurhasanah, S.Pd. Gr., M.Pd.',
    teacherNip: '19800523 201501 2 001',
    totalStudents: 29
  },
  {
    id: '6A',
    name: 'Kelas 6A',
    level: 6,
    rombel: 'A',
    room: 'Ruang Kelas 6A (Gedung Utara Lt. 2)',
    teacherId: 't13',
    teacherName: 'Mantasia, S.Pd.',
    teacherNip: '19830710 201001 2 030',
    totalStudents: 31
  },
  {
    id: '6B',
    name: 'Kelas 6B',
    level: 6,
    rombel: 'B',
    room: 'Ruang Kelas 6B (Gedung Utara Lt. 2)',
    teacherId: 't14',
    teacherName: 'Nurliati, S.Pd., M.Pd.',
    teacherNip: '19801210 201501 2 001',
    totalStudents: 30
  }
];

// Helper to generate realistic student list for a class
export const CLASS_STUDENTS_ROSTER: Record<string, Student[]> = {
  '1A': [
    { id: 'std-1a-01', nisn: '018291001', name: 'Andi Muh. Al-Fatih', gender: 'L', classId: '1A', parentName: 'Bapak Andi Burhan', parentPhone: '081242338101' },
    { id: 'std-1a-02', nisn: '018291002', name: 'Aisyah Putri Humairah', gender: 'P', classId: '1A', parentName: 'Ibu Nurhayati', parentPhone: '085299441202' },
    { id: 'std-1a-03', nisn: '018291003', name: 'Ahmad Faiz Ramadhan', gender: 'L', classId: '1A', parentName: 'Bapak Ramli', parentPhone: '081341552303' },
    { id: 'std-1a-04', nisn: '018291004', name: 'Bilqis Aqila Zahra', gender: 'P', classId: '1A', parentName: 'Ibu Ratna Dewi', parentPhone: '082188663404' },
    { id: 'std-1a-05', nisn: '018291005', name: 'Dhafir Rasyid Pratama', gender: 'L', classId: '1A', parentName: 'Bapak Syamsuddin', parentPhone: '085342774505' },
    { id: 'std-1a-06', nisn: '018291006', name: 'Fatimah Az-Zahra', gender: 'P', classId: '1A', parentName: 'Ibu Maryam', parentPhone: '081299885606' },
    { id: 'std-1a-07', nisn: '018291007', name: 'Habibi Al-Ghazali', gender: 'L', classId: '1A', parentName: 'Bapak Mansyur', parentPhone: '085244116707' },
    { id: 'std-1a-08', nisn: '018291008', name: 'Inara Syakila Putri', gender: 'P', classId: '1A', parentName: 'Ibu Hasnah', parentPhone: '081355227808' },
    { id: 'std-1a-09', nisn: '018291009', name: 'Muh. Rayyan Danendra', gender: 'L', classId: '1A', parentName: 'Bapak Rahmat', parentPhone: '082166338909' },
    { id: 'std-1a-10', nisn: '018291010', name: 'Naura Khalisa Azzahra', gender: 'P', classId: '1A', parentName: 'Ibu Halimah', parentPhone: '085377449010' },
    { id: 'std-1a-11', nisn: '018291011', name: 'Radhitya Arya Wijaya', gender: 'L', classId: '1A', parentName: 'Bapak Wijaya', parentPhone: '081288550111' },
    { id: 'std-1a-12', nisn: '018291012', name: 'Safira Salsabila', gender: 'P', classId: '1A', parentName: 'Ibu Aminah', parentPhone: '085299661212' },
    { id: 'std-1a-13', nisn: '018291013', name: 'Umar Khalid Basri', gender: 'L', classId: '1A', parentName: 'Bapak H. Basri', parentPhone: '081311772313' },
    { id: 'std-1a-14', nisn: '018291014', name: 'Zahra Ainun Nisa', gender: 'P', classId: '1A', parentName: 'Ibu Salmah', parentPhone: '082122883414' },
    { id: 'std-1a-15', nisn: '018291015', name: 'Muhammad Atharizz Calief', gender: 'L', classId: '1A', parentName: 'Bapak Daeng Bella', parentPhone: '085333994515' },
    { id: 'std-1a-16', nisn: '018291016', name: 'Nur Syifa Kamila', gender: 'P', classId: '1A', parentName: 'Ibu Rosdiana', parentPhone: '081244005616' },
    { id: 'std-1a-17', nisn: '018291017', name: 'Alif Kurniawan Putra', gender: 'L', classId: '1A', parentName: 'Bapak Herman', parentPhone: '085255116717' },
    { id: 'std-1a-18', nisn: '018291018', name: 'Khadijah Nurul Izzah', gender: 'P', classId: '1A', parentName: 'Ibu Nursiah', parentPhone: '081366227818' },
    { id: 'std-1a-19', nisn: '018291019', name: 'Zidane Al-Farabi', gender: 'L', classId: '1A', parentName: 'Bapak Ilham', parentPhone: '082177338919' },
    { id: 'std-1a-20', nisn: '018291020', name: 'Siti Sarah Mardhiyah', gender: 'P', classId: '1A', parentName: 'Ibu Fitriani', parentPhone: '085388449020' },
  ],
  '1B': [
    { id: 'std-1b-01', nisn: '018292001', name: 'Andi Mappatunru', gender: 'L', classId: '1B', parentName: 'Bapak A. Sanusi', parentPhone: '081234001001' },
    { id: 'std-1b-02', nisn: '018292002', name: 'Aqila Dania Putri', gender: 'P', classId: '1B', parentName: 'Ibu Muliati', parentPhone: '085234001002' },
    { id: 'std-1b-03', nisn: '018292003', name: 'Bagas Aditya Pratama', gender: 'L', classId: '1B', parentName: 'Bapak Gunawan', parentPhone: '081334001003' },
    { id: 'std-1b-04', nisn: '018292004', name: 'Cahaya Nur Ramadhani', gender: 'P', classId: '1B', parentName: 'Ibu Sukma', parentPhone: '082134001004' },
    { id: 'std-1b-05', nisn: '018292005', name: 'Fikram Al-Habsyi', gender: 'L', classId: '1B', parentName: 'Bapak Jalil', parentPhone: '085334001005' },
    { id: 'std-1b-06', nisn: '018292006', name: 'Gita Permata Sari', gender: 'P', classId: '1B', parentName: 'Ibu Ernawati', parentPhone: '081234001006' },
    { id: 'std-1b-07', nisn: '018292007', name: 'Ibnu Sina Al-Barandasi', gender: 'L', classId: '1B', parentName: 'Bapak Ridwan', parentPhone: '085234001007' },
    { id: 'std-1b-08', nisn: '018292008', name: 'Jihan Talita Azmi', gender: 'P', classId: '1B', parentName: 'Ibu Kamariah', parentPhone: '081334001008' },
    { id: 'std-1b-09', nisn: '018292009', name: 'Kaisar Rayhan Malik', gender: 'L', classId: '1B', parentName: 'Bapak Syahrul', parentPhone: '082134001009' },
    { id: 'std-1b-10', nisn: '018292010', name: 'Laila Husna', gender: 'P', classId: '1B', parentName: 'Ibu Nurbaya', parentPhone: '085334001010' },
  ],
  '2A': [
    { id: 'std-2a-01', nisn: '017293001', name: 'Andi Muh. Fathan', gender: 'L', classId: '2A', parentName: 'Bapak A. Tenri', parentPhone: '081234002001' },
    { id: 'std-2a-02', nisn: '017293002', name: 'Annisa Tri Hapsari', gender: 'P', classId: '2A', parentName: 'Ibu Rohani', parentPhone: '085234002002' },
    { id: 'std-2a-03', nisn: '017293003', name: 'Bintang Ramadhan', gender: 'L', classId: '2A', parentName: 'Bapak Bachtiar', parentPhone: '081334002003' },
    { id: 'std-2a-04', nisn: '017293004', name: 'Dea Ananda Putri', gender: 'P', classId: '2A', parentName: 'Ibu Rustina', parentPhone: '082134002004' },
    { id: 'std-2a-05', nisn: '017293005', name: 'Farel Prayoga', gender: 'L', classId: '2A', parentName: 'Bapak Baso', parentPhone: '085334002005' },
    { id: 'std-2a-06', nisn: '017293006', name: 'Ghefira Nurul Ilmi', gender: 'P', classId: '2A', parentName: 'Ibu Rahmi', parentPhone: '081234002006' },
  ],
  '3A': [
    { id: 'std-3a-01', nisn: '016294001', name: 'Andi Muh. Fathir', gender: 'L', classId: '3A', parentName: 'Bapak Andi Rustam', parentPhone: '081234003001' },
    { id: 'std-3a-02', nisn: '016294002', name: 'Alyssa Soebandono', gender: 'P', classId: '3A', parentName: 'Ibu Wardah', parentPhone: '085234003002' },
    { id: 'std-3a-03', nisn: '016294003', name: 'Dafi Al-Qadri', gender: 'L', classId: '3A', parentName: 'Bapak Qadri', parentPhone: '081334003003' },
    { id: 'std-3a-04', nisn: '016294004', name: 'Elsa Putri Salju', gender: 'P', classId: '3A', parentName: 'Ibu Sulastri', parentPhone: '082134003004' },
    { id: 'std-3a-05', nisn: '016294005', name: 'Gibran Rakabuming', gender: 'L', classId: '3A', parentName: 'Bapak Joko', parentPhone: '085334003005' },
  ],
  '4A': [
    { id: 'std-4a-01', nisn: '015295001', name: 'Afwan Maulana', gender: 'L', classId: '4A', parentName: 'Bapak Maulana', parentPhone: '081234004001' },
    { id: 'std-4a-02', nisn: '015295002', name: 'Bella Cantika', gender: 'P', classId: '4A', parentName: 'Ibu Bella', parentPhone: '085234004002' },
    { id: 'std-4a-03', nisn: '015295003', name: 'Dimas Anggara', gender: 'L', classId: '4A', parentName: 'Bapak Anggoro', parentPhone: '081334004003' },
    { id: 'std-4a-04', nisn: '015295004', name: 'Fitri Handayani', gender: 'P', classId: '4A', parentName: 'Ibu Handayani', parentPhone: '082134004004' },
  ],
  '5A': [
    { id: 'std-5a-01', nisn: '014296001', name: 'Azka Zikri Maulana', gender: 'L', classId: '5A', parentName: 'Bapak Zikri', parentPhone: '081234005001' },
    { id: 'std-5a-02', nisn: '014296002', name: 'Chelsea Olivia', gender: 'P', classId: '5A', parentName: 'Ibu Olivia', parentPhone: '085234005002' },
    { id: 'std-5a-03', nisn: '014296003', name: 'Danish Arsyad', gender: 'L', classId: '5A', parentName: 'Bapak Arsyad', parentPhone: '081334005003' },
    { id: 'std-5a-04', nisn: '014296004', name: 'Eka Nur Wahyuni', gender: 'P', classId: '5A', parentName: 'Ibu Wahyuni', parentPhone: '082134005004' },
    { id: 'std-5a-05', nisn: '014296005', name: 'Fatih Seif Al-Banna', gender: 'L', classId: '5A', parentName: 'Bapak Al-Banna', parentPhone: '085334005005' },
  ],
  '6A': [
    { id: 'std-6a-01', nisn: '013297001', name: 'Aditya Pratama Putra', gender: 'L', classId: '6A', parentName: 'Bapak Surya', parentPhone: '081234006001' },
    { id: 'std-6a-02', nisn: '013297002', name: 'Bunga Citra Lestari', gender: 'P', classId: '6A', parentName: 'Ibu Lestari', parentPhone: '085234006002' },
    { id: 'std-6a-03', nisn: '013297003', name: 'Chandra Wijaya', gender: 'L', classId: '6A', parentName: 'Bapak Wijaya', parentPhone: '081334006003' },
    { id: 'std-6a-04', nisn: '013297004', name: 'Dewi Sandra Putri', gender: 'P', classId: '6A', parentName: 'Ibu Sandra', parentPhone: '082134006004' },
  ]
};

// Fill any other classes with generated representative students
SCHOOL_CLASSES.forEach((cls) => {
  if (!CLASS_STUDENTS_ROSTER[cls.id]) {
    const list: Student[] = [];
    const sampleBoys = ['Muh. Rizky', 'Andi Haidar', 'Fikri Haikal', 'Bagas Saputra', 'Daffa Wardana', 'Ilham Ramadhan', 'Farhan Maulana', 'Zulfa Anugrah'];
    const sampleGirls = ['Nurul Hikmah', 'Siti Fatimah', 'Nabila Syakirah', 'Zahra Amalia', 'Putri Ayu', 'Riska Oktaviani', 'Alya Nazhira', 'Husnul Khatimah'];
    
    for (let i = 1; i <= 14; i++) {
      const isBoy = i % 2 !== 0;
      const name = isBoy ? `${sampleBoys[(i - 1) % sampleBoys.length]} ${cls.name}` : `${sampleGirls[(i - 1) % sampleGirls.length]} ${cls.name}`;
      list.push({
        id: `std-${cls.id.toLowerCase()}-${String(i).padStart(2, '0')}`,
        nisn: `01${8 - cls.level}29${cls.id.charCodeAt(0)}${String(i).padStart(2, '0')}`,
        name,
        gender: isBoy ? 'L' : 'P',
        classId: cls.id,
        parentName: isBoy ? `Bapak Wali ${name}` : `Ibu Wali ${name}`,
        parentPhone: `081299${cls.level}${String(i).padStart(2, '0')}`
      });
    }
    CLASS_STUDENTS_ROSTER[cls.id] = list;
  }
});

// Seed Attendance Records for Today (2026-09-24)
export function getInitialSeedAttendance(dateStr: string): Record<string, DailyClassAttendance> {
  const result: Record<string, DailyClassAttendance> = {};

  SCHOOL_CLASSES.forEach((cls, idx) => {
    const students = CLASS_STUDENTS_ROSTER[cls.id] || [];
    const records: Record<string, { studentId: string; status: AttendanceStatus; note?: string; checkInTime?: string }> = {};

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    students.forEach((student, sIdx) => {
      let status: AttendanceStatus = 'H';
      let note: string | undefined = undefined;

      // Realistic variation for classes
      if (idx === 0 && sIdx === 3) {
        status = 'S';
        note = 'Sakit demam panas sejak malam, istirahat dokter.';
        sakit++;
      } else if (idx === 0 && sIdx === 7) {
        status = 'I';
        note = 'Izin ada keperluan keluarga penting di Kota Maros.';
        izin++;
      } else if (idx === 1 && sIdx === 2) {
        status = 'S';
        note = 'Sakit flu dan batuk.';
        sakit++;
      } else if (idx === 2 && sIdx === 4) {
        status = 'A';
        note = 'Belum ada konfirmasi dari orang tua.';
        alpa++;
      } else if (idx === 3 && sIdx === 1) {
        status = 'I';
        note = 'Izin menghadiri pernikahan kerabat keluarga.';
        izin++;
      } else {
        hadir++;
      }

      records[student.id] = {
        studentId: student.id,
        status,
        note,
        checkInTime: status === 'H' ? `07:${String(15 + (sIdx % 25)).padStart(2, '0')} WITA` : undefined
      };
    });

    const total = students.length;
    const rate = total > 0 ? Number(((hadir / total) * 100).toFixed(1)) : 100;

    result[`${dateStr}-${cls.id}`] = {
      id: `${dateStr}-${cls.id}`,
      date: dateStr,
      classId: cls.id,
      className: cls.name,
      teacherId: cls.teacherId,
      teacherName: cls.teacherName,
      teacherNip: cls.teacherNip,
      records,
      summary: {
        total,
        hadir,
        sakit,
        izin,
        alpa,
        rate
      },
      submittedAt: `07:45 WITA`,
      isVerifiedByPrincipal: idx < 8,
      verifiedAt: idx < 8 ? `08:00 WITA` : undefined
    };
  });

  return result;
}
