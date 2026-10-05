import { NewsItem, Teacher, Facility, Extracurricular, Achievement, AcademicCalendarItem, CeremonyLeader, GovPortal, RaporIndicator, DigitalLiteracyPortal } from '../types';

export const HERO_CAMPUS_IMAGE = '/src/assets/images/school_hero_campus_1785652390633.jpg';
export const PRINCIPAL_IMAGE = '/src/assets/images/principal_hadijah_official_1788957169722.jpg';

export const SPMB_PORTAL_URL = 'https://spmb2026.pusdatinmaros.id/dashboard';

// Tautan Resmi Kemendikdasmen & Kepegawaian BKN
export const RAPOR_PENDIDIKAN_URL = 'https://raporpendidikan.kemendikdasmen.go.id/';
export const MY_ASN_URL = 'https://asndigital.bkn.go.id/';
export const SIM_PKB_URL = 'https://gtk.belajar.kemendikdasmen.go.id/';
export const INFO_GTK_URL = 'https://info.gtk.kemendikdasmen.go.id/';
export const RUMAH_PENDIDIKAN_URL = 'https://rumah.pendidikan.go.id/';

// 5 Platform Literasi Digital & Sumber Bacaan Siswa
export const SIBI_BUKU_URL = 'https://buku.kemendikdasmen.go.id/';
export const PENJARING_URL = 'https://penerjemahan.kemendikdasmen.go.id/';
export const LETS_READ_URL = 'https://www.letsreadasia.org/';
export const LITERACY_CLOUD_URL = 'https://literacycloud.org/';
export const BACAPIBO_URL = 'https://bacapibo.com/explore';

export const DIGITAL_LITERACY_PORTALS: DigitalLiteracyPortal[] = [
  {
    id: 'sibi',
    name: 'SIBI - Sistem Informasi Perbukuan Indonesia',
    shortName: 'SIBI Buku',
    url: SIBI_BUKU_URL,
    provider: 'Kemendikdasmen RI',
    category: 'Buku Teks & Kurikulum',
    targetAudience: 'Siswa SD, Guru, & Orang Tua',
    description: 'Pusat unduhan resmi buku teks Kurikulum Merdeka, buku panduan guru, buku nonteks, audio book, dan buku bacaan bermutu gratis tanpa biaya.',
    features: ['Buku Teks Pelajaran SD', 'Buku Panduan Guru', 'Audio Book', 'Format PDF Legal & Gratis'],
    badge: 'Buku Resmi Sekolah',
    domain: 'buku.kemendikdasmen.go.id',
    colorScheme: 'indigo'
  },
  {
    id: 'penjaring',
    name: 'Penjaring - Penerjemahan Bahasa Kemendikdasmen',
    shortName: 'Penjaring Bahasa',
    url: PENJARING_URL,
    provider: 'Badan Pengembangan dan Pembinaan Bahasa Kemendikdasmen',
    category: 'Penerjemahan & Cerita Rakyat',
    targetAudience: 'Murid SD, Pendidik, & Komunitas Baca',
    description: 'Aplikasi resmi penerjemahan karya sastra anak dwibahasa, cerita rakyat nusantara dalam beragam bahasa daerah dan bahasa asing untuk penguatan literasi bahasa.',
    features: ['Cerita Rakyat Nusantara', 'Dwibahasa & Bahasa Daerah', 'Buku Cerita Bergambar', 'Koleksi Balai Bahasa'],
    badge: 'Pusat Bahasa Resmi',
    domain: 'penerjemahan.kemendikdasmen.go.id',
    colorScheme: 'amber'
  },
  {
    id: 'lets-read',
    name: "Let's Read - Perpustakaan Digital Anak Asia",
    shortName: "Let's Read",
    url: LETS_READ_URL,
    provider: 'The Asia Foundation',
    category: 'Buku Bergambar Anak',
    targetAudience: 'Anak Usia 6-12 Tahun & Keluarga',
    description: 'Ribuan buku cerita anak bergambar gratis dalam bahasa Indonesia dan bahasa daerah (Bugis, Makassar, Jawa, dll.) yang bisa dibaca online maupun diunduh offline.',
    features: ['Bahasa Daerah (Bugis & Makassar)', 'Audio Story & Read-Along', 'Unduh PDF Gratis', 'Level Membaca Berjenjang'],
    badge: 'Cerita Multi-Bahasa',
    domain: 'letsreadasia.org',
    colorScheme: 'emerald'
  },
  {
    id: 'literacy-cloud',
    name: 'Literacy Cloud - Ruang Baca Digital Berjenjang',
    shortName: 'Literacy Cloud',
    url: LITERACY_CLOUD_URL,
    provider: 'Room to Read',
    category: 'Perpustakaan Digital',
    targetAudience: 'Siswa SD Kelas 1-6 & Pendidik',
    description: 'Platform digital inovatif dari Room to Read yang memuat ratusan buku bacaan anak berjenjang, video membaca nyaring (read-aloud), dan panduan literasi bagi pendidik.',
    features: ['Buku Cerita Berjenjang', 'Video Membaca Nyaring', 'Panduan Guru & Orang Tua', 'Bebas Biaya & Tanpa Iklan'],
    badge: 'Koleksi Room to Read',
    domain: 'literacycloud.org',
    colorScheme: 'sky'
  },
  {
    id: 'bacapibo',
    name: 'BacaPibo - Perpustakaan Digital Anak Interaktif',
    shortName: 'BacaPibo',
    url: BACAPIBO_URL,
    provider: 'PiBo Indonesia',
    category: 'Cerita Interaktif',
    targetAudience: 'Anak Sekolah Dasar & Prasekolah',
    description: 'Eksplorasi cerita anak digital bergambar dengan ilustrasi memikat karya ilustrator dan penulis Indonesia, mendukung kebiasaan gemar membaca sejak dini.',
    features: ['Eksplorasi Cerita Menarik', 'Ilustrasi Visual Memikat', 'Kategori Beragam Topik', 'Aktivitas Membaca Menyenangkan'],
    badge: 'Buku Ramah Anak',
    domain: 'bacapibo.com/explore',
    colorScheme: 'rose'
  }
];

export const OFFICIAL_GOV_PORTALS: GovPortal[] = [
  {
    id: 'rapor-pendidikan',
    name: 'Rapor Pendidikan Indonesia',
    shortName: 'Rapor Pendidikan',
    url: RAPOR_PENDIDIKAN_URL,
    category: 'Evaluasi & Rapor',
    targetUser: 'Umum & Orang Tua',
    description: 'Portal resmi laporan kualitas mutu layanan satuan pendidikan berbasis Asesmen Nasional (AN) untuk Identifikasi, Refleksi, dan Benahi mutu pembelajaran.',
    badge: 'Evaluasi Mutu AN',
    iconName: 'BarChart3',
    officialDomain: 'raporpendidikan.kemendikdasmen.go.id'
  },
  {
    id: 'my-asn',
    name: 'My ASN (BKN Digital)',
    shortName: 'My ASN',
    url: MY_ASN_URL,
    category: 'Kepegawaian ASN',
    targetUser: 'ASN / PNS / PPPK',
    description: 'Layanan kepegawaian mandiri aparatur sipil negara dari Badan Kepegawaian Negara (BKN) untuk profil, kenaikan pangkat, riwayat kinerja, dan presensi ASN.',
    badge: 'Portal ASN BKN',
    iconName: 'UserCheck',
    officialDomain: 'asndigital.bkn.go.id'
  },
  {
    id: 'sim-pkb',
    name: 'SIM PKB - GTK Belajar Kemendikdasmen',
    shortName: 'SIM PKB',
    url: SIM_PKB_URL,
    category: 'Pengembangan GTK',
    targetUser: 'Guru & Tendik',
    description: 'Sistem Informasi Manajemen Pengembangan Keprofesian Berkelanjutan untuk PPG, Guru Penggerak, Komunitas Belajar (Kombel), dan Diklat GTK.',
    badge: 'Diklat & Karir Guru',
    iconName: 'GraduationCap',
    officialDomain: 'gtk.belajar.kemendikdasmen.go.id'
  },
  {
    id: 'info-gtk',
    name: 'INFO GTK Kemendikdasmen',
    shortName: 'INFO GTK',
    url: INFO_GTK_URL,
    category: 'Validasi Data',
    targetUser: 'Guru & Tendik',
    description: 'Layanan verifikasi dan validasi data Dapodik pendidik dan tenaga kependidikan untuk penerbitan SKTP dan penyaluran Tunjangan Profesi Guru (TPG).',
    badge: 'Validasi Tunjangan TPG',
    iconName: 'FileCheck2',
    officialDomain: 'info.gtk.kemendikdasmen.go.id'
  },
  {
    id: 'rumah-pendidikan',
    name: 'Rumah Pendidikan Kemendikdasmen',
    shortName: 'Rumah Pendidikan',
    url: RUMAH_PENDIDIKAN_URL,
    category: 'Portal Terpadu',
    targetUser: 'Umum & Orang Tua',
    description: 'Portal ekosistem terpadu Kementerian Pendidikan Dasar dan Menengah yang merangkum seluruh layanan edukasi, regulasi, dan inovasi pendidikan nasional.',
    badge: 'Gerbang Terpadu',
    iconName: 'Home',
    officialDomain: 'rumah.pendidikan.go.id'
  }
];

export const RAPOR_PENDIDIKAN_2025_INFO = {
  year: '2025',
  schoolName: 'UPTD SDN 5 Barandasi',
  district: 'Kecamatan Lau, Kabupaten Maros',
  npsn: '40300262',
  subtitle: 'Laporan Kualitas Layanan Satuan Pendidikan Kemendikdasmen Berdasarkan Asesmen Nasional',
  narrative: 'Seperti murid yang memiliki rapor hasil belajar dari sekolah, kini setiap sekolah juga mempunyai rapor kualitas layanan dari Kemendikdasmen yang bernama Rapor Pendidikan. Penilaian Rapor Pendidikan berasal dari hasil Asesmen Nasional (AN) dan berbagai sumber data nasional lainnya yang diikuti oleh perwakilan murid, guru, serta kepala sekolah dari PAUD, SD, SMP, dan jenjang SMA/sederajat.',
  ctaTitle: 'Yuk, lihat hasil Rapor Pendidikan sekolah anak Anda!',
  ctaDiscussion: 'Bagaimana pendapat Anda tentang hasil ini? Ayo, ajak wali kelas atau sesama orang tua/wali untuk bertukar solusi!',
  portalUrl: RAPOR_PENDIDIKAN_URL,
  indicators: [
    {
      id: 'literasi',
      title: 'Kemampuan Literasi Murid',
      status: 'Kurang' as const,
      trendText: 'Nilai turun dari tahun 2024',
      description: 'Contoh kemampuan literasi: membaca dan memahami teks nonfiksi (surat, artikel) dan teks fiksi (dongeng, novel).'
    },
    {
      id: 'karakter',
      title: 'Karakter Murid',
      status: 'Sedang' as const,
      trendText: 'Nilai turun dari tahun 2024',
      tag: 'PENINGKATAN PALING TINGGI',
      description: 'Contoh karakter: beriman, berakhlak, bergotong royong, kreatif, kritis, menghargai keberagaman, dan mandiri.'
    },
    {
      id: 'keamanan',
      title: 'Kondisi Keamanan Sekolah',
      status: 'Sedang' as const,
      trendText: 'Nilai turun dari tahun 2024',
      description: 'Contoh keamanan di sekolah: tidak ada perundungan, hukuman fisik, kekerasan seksual, dan zat berbahaya.'
    },
    {
      id: 'kebinekaan',
      title: 'Kondisi Kebinekaan Sekolah',
      status: 'Sedang' as const,
      trendText: 'Nilai turun dari tahun 2024',
      description: 'Contoh kebinekaan di sekolah: toleransi terhadap beragam agama dan budaya, serta adanya kesetaraan antar siswa.'
    },
    {
      id: 'numerasi',
      title: 'Kemampuan Numerasi Murid',
      status: 'Kurang' as const,
      trendText: 'Nilai turun dari tahun 2024',
      tag: 'PALING PERLU DITINGKATKAN',
      description: 'Contoh kemampuan numerasi: memahami dan menggunakan konsep bilangan, aljabar, geometri, dan data.',
      inspiration: 'Sebagai orang tua/wali, kita dapat mengajak anak menggunakan berbagai prinsip matematika untuk menyelesaikan masalah sehari-hari.'
    },
    {
      id: 'pembelajaran',
      title: 'Kualitas Pembelajaran',
      status: 'Sedang' as const,
      trendText: 'Nilai turun dari tahun 2024',
      tag: 'CAPAIAN TERBAIK',
      description: 'Contoh dari kualitas pembelajaran: suasana kelas yang teratur, serta perhatian dan dukungan dari pendidik.'
    }
  ]
};

export const SCHOOL_VISION = "Terwujudnya Generasi Pembelajar yang Berintegritas Tinggi, Bernalar Kritis, Berkarakter Ekologis Berdasarkan 8 Dimensi Profil Lulusan, serta Sehat dan Tangguh Menghadapi Tantangan Sosial dalam Ekosistem Belajar yang Aman, Nyaman, dan Inklusif.";

export const SCHOOL_MISSIONS = [
  "Menyelenggarakan proses pembelajaran berkualitas berbasis pendekatan Deep Learning guna memulihkan kemampuan fondasi literasi dan numerasi murid secara adaptif.",
  "Membentuk iklim sekolah yang inklusif, toleran, adil gender, serta bebas dari perundungan, kekerasan fisik, dan kekerasan seksual melalui Budaya Sekolah Aman dan Nyaman (BSAN) sesuai Permendikdasmen Nomor 6 Tahun 2026.",
  "Membangun resiliensi peserta didik terhadap ancaman penyalahgunaan zat adiktif melalui penanaman nilai Integrasi Kurikulum Anti Narkoba (IKAN).",
  "Membangun budaya kejujuran dan kedisiplinan demi mendongkrak Indeks Perilaku Anti Korupsi (IPAK) melalui pembiasaan harian.",
  "Membina kepedulian lingkungan hidup melalui Gerakan Adiwiyata untuk membentuk karakter ekologis yang berkelanjutan.",
  "Menyelenggarakan pembiasaan hidup bersih, sehat, berakhlak mulia, dan tangguh secara konsisten melalui Gerakan Sekolah Sehat (GSS), pembiasaan 7 Kebiasaan Anak Indonesia Hebat (7 KAIH), dan program pemenuhan gizi seimbang peserta didik (MBG).",
  "Meningkatkan kapasitas dan komitmen kebangsaan pendidik melalui optimalisasi Komunitas Belajar (Kombel) sebagai wadah inovasi dan refleksi mengajar."
];

export const SCHOOL_STATS = [
  { label: 'Siswa Aktif', value: '280+', icon: 'Users' },
  { label: 'Guru & Tenaga Kependidikan', value: '20', icon: 'GraduationCap' },
  { label: 'Akreditasi Sekolah', value: 'B (Baik)', icon: 'Award' },
  { label: 'Kelulusan SD ke SMP', value: '100%', icon: 'TrendingUp' },
];

export const PRINCIPAL_INFO = {
  name: 'Hadijah, S.Pd., M.Pd.',
  nip: 'Terdaftar KSP UPTD SDN 5 Barandasi',
  title: 'Kepala UPTD SDN 5 Barandasi',
  greeting: 'Selamat datang di Website Resmi UPTD SDN 5 Barandasi, Kecamatan Lau, Kabupaten Maros. Kami berkomitmen menyelenggarakan pendidikan dasar yang ramah anak, berakhlak mulia, cerdas, berkarakter Profil Pelajar Pancasila, serta melestarikan kearifan lokal. Pendaftaran murid baru dilaksanakan terintegrasi melalui SPMB (Sistem Penerimaan Murid Baru) 2026 Pusdatin Maros.',
  quote: '"Pendidikan dasar adalah pondasi utama pembentukan karakter, akhlak mulia, dan kecerdasan anak bangsa."',
  highlights: [
    'Implementasi Kurikulum Merdeka (KSP Terakreditasi B)',
    'Program Pembiasaan Literasi & Numerasi Dini',
    'Pembinaan Karakter & Profil Pelajar Pancasila',
    'Lingkungan Sekolah Asri, Bersih, & Ramah Anak'
  ]
};

export const NEWS_LIST: NewsItem[] = [
  {
    id: 'n1',
    title: 'Pendaftaran SPMB 2026 UPTD SDN 5 Barandasi Resmi Melalui Portal Pusdatin Maros',
    category: 'ppdb',
    date: '01 Agustus 2026',
    author: 'Panitia SPMB Barandasi',
    summary: 'Pendaftaran Penerimaan Murid Baru kini beralih dari PPDB menjadi SPMB 2026 secara online melalui portal resmi Pusdatin Maros.',
    content: `Kabupaten Maros — UPTD SDN 5 Barandasi mengumumkan bahwa Pendaftaran Peserta Didik Baru untuk Tahun Ajaran 2026/2027 tidak lagi menggunakan istilah PPDB melainkan SPMB (Sistem Penerimaan Murid Baru).

Pendaftaran dilaksanakan secara terpusat melalui portal resmi Pusdatin Kabupaten Maros pada tautan:
https://spmb2026.pusdatinmaros.id/dashboard

Orang tua / wali calon peserta didik dapat menyiapkan dokumen persyaratan seperti:
1. Akta Kelahiran Calon Siswa
2. Kartu Keluarga (KK)
3. Pasfoto Calon Siswa
4. Surat Keterangan Usia / Ijazah TK/PAUD (jika ada)

Panitia SPMB UPTD SDN 5 Barandasi juga menyediakan layanan pendampingan pendaftaran langsung bagi orang tua yang membutuhkan panduan teknis di sekretariat sekolah.`,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    readTime: '3 menit',
    tags: ['SPMB 2026', 'Pusdatin Maros', 'Pendaftaran SD', 'Info Sekolah'],
    isImportant: true,
    sourceName: 'Pusdatin Dinas Pendidikan Kab. Maros',
    sourceUrl: 'https://spmb2026.pusdatinmaros.id',
    initialLikes: 38
  },
  {
    id: 'n2',
    title: 'Pembaruan Dokumen Kurikulum Operasional Satuan Pendidikan (KSP) UPTD SDN 5 Barandasi',
    category: 'berita',
    date: '28 Juli 2026',
    author: 'Tim Pengembang Kurikulum',
    summary: 'Kurikulum Satuan Pendidikan (KSP) UPTD SDN 5 Barandasi disajikan secara interaktif melalui Slide Presentasi Resmi di website sekolah.',
    content: `UPTD SDN 5 Barandasi secara resmi menetapkan Kurikulum Satuan Pendidikan (KSP) terbaru berbasis Kurikulum Merdeka. Seluruh muatan KSP mulai dari Visi, 7 Misi Strategis, 8 Dimensi Profil Lulusan, Pendekatan Deep Learning, hingga Pengorganisasian Pembelajaran disajikan secara komprehensif melalui Slide Presentasi KSP di website resmi sekolah.

Kurikulum ini mengedepankan lingkungan belajar yang ramah anak, berkeadaban, dan menyiapkan siswa menghadapi tantangan abad ke-21 dengan karakter Profil Pelajar Pancasila.`,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    readTime: '4 menit',
    tags: ['KSP', 'Kurikulum Merdeka', 'Pendidikan SD', 'Transparansi'],
    isImportant: true,
    sourceName: 'Tim Pengembang Kurikulum SDN 5 Barandasi',
    initialLikes: 29
  },
  {
    id: 'n3',
    title: 'Prestasi Juara 1 Lomba Seni Tari Tradisional Bugis-Makassar Tingkat Kabupaten Maros',
    category: 'prestasi',
    date: '15 Juli 2026',
    author: 'Pembina Seni & Budaya',
    summary: 'Tim Tari UPTD SDN 5 Barandasi meraih piala bergilir dalam Pesta Seni Budaya Pelajar SD se-Kabupaten Maros.',
    content: `Kontingen seni tari UPTD SDN 5 Barandasi berhasil menyabet Juara 1 pada Lomba Tari Tradisional Kreasi Daerah Bugis-Makassar tingkat Sekolah Dasar se-Kabupaten Maros.

Penampilan memukau dari siswa kelas IV dan V memikat para dewan juri dengan keselarasan gerak, penghayatan musik tabuh tradisional, serta busana adat Baju Bodo yang anggun.

Kepala Sekolah menyampaikan apresiasi mendalam kepada para guru pembina tari dan orang tua yang setia mendampingi proses latihan dari awal hingga meraih juara.`,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    readTime: '3 menit',
    tags: ['Prestasi', 'Seni Budaya', 'Maros', 'Tari Tradisional'],
    isImportant: false,
    sourceName: 'Panitia Pesta Seni Budaya Maros',
    initialLikes: 45
  },
  {
    id: 'n4',
    title: 'Pelaksanaan ANBK (Asesmen Nasional Berbasis Komputer) Kelas V UPTD SDN 5 Barandasi',
    category: 'pengumuman',
    date: '10 Juli 2026',
    author: 'Operator & Proktor ANBK',
    summary: 'Pengumuman jadwal gladi bersih dan pelaksanaan ANBK untuk siswa kelas V sekolah dasar tahun ajaran berjalan.',
    content: `Diumumkan kepada seluruh orang tua siswa kelas V bahwa Simulasi dan Gladi Bersih ANBK akan dilaksanakan di Laboratorium Komputer UPTD SDN 5 Barandasi.

Pelaksanaan asesmen meliputi:
1. Asesmen Literasi Membaca
2. Asesmen Numerasi
3. Survei Karakter & Survei Lingkungan Belajar

Pihak sekolah telah memastikan kesiapan perangkat komputer, jaringan internet berkecepatan tinggi, dan pendampingan proktor berpengalaman agar siswa dapat mengikuti asesmen dengan tenang dan optimal.`,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    readTime: '2 menit',
    tags: ['ANBK', 'Akademik', 'Asesmen SD', 'Laboratorium Komputer'],
    isImportant: true,
    sourceName: 'Pusat Asesmen Pendidikan Kemendikdasmen',
    initialLikes: 23
  },
  {
    id: 'n5',
    title: 'Regulasi Kemendikdasmen 2026: Penerapan Pendekatan Deep Learning & Penguatan Karakter di SD',
    category: 'pengumuman',
    date: '18 Agustus 2026',
    author: 'Humas & Pengembang Mutu',
    summary: 'Kementerian Pendidikan Dasar dan Menengah merilis regulasi terbaru pedoman pembelajaran mendalam (Deep Learning) berpusat pada murid.',
    content: `Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen) RI menegaskan komitmen percepatan mutu pembelajaran sekolah dasar melalui implementasi pendekatan 'Deep Learning' yang mengintegrasikan 3 dimensi: Mindful Learning, Meaningful Learning, dan Joyful Learning.

Pedoman regulasi ini menitikberatkan pada:
• Pembelajaran Kontekstual: Mengaitkan setiap konsep teori dengan fenomena nyata dan kearifan lokal anak di sekitar sekolah.
• Iklim Inklusif & Nir-Kekerasan: Penegakan tata tertib ramah anak guna mencegah segala bentuk perundungan fisik maupun verbal.
• Evaluasi Formatif Otentik: Penilaian yang menghargai proses perkembangan daya nalar dan kreasi, bukan semata skor angka akhir.

UPTD SDN 5 Barandasi berkomitmen menyelaraskan program kelas dengan regulasi ini agar seluruh siswa bertumbuh cerdas, berkarakter, dan bahagia.`,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    readTime: '4 menit',
    tags: ['Regulasi Pendidikan', 'Kemendikdasmen', 'Deep Learning', 'Kurikulum'],
    isImportant: true,
    sourceName: 'Kemendikdasmen RI (kemdikbud.go.id)',
    sourceUrl: 'https://kemdikbud.go.id',
    initialLikes: 42
  },
  {
    id: 'n6',
    title: 'Menyalakan Api Semangat Belajar Anak: Teladan Ki Hadjar Dewantara dan Sinergi Guru-Orang Tua',
    category: 'berita',
    date: '12 Agustus 2026',
    author: 'Tim Bimbingan & Konseling Karakter',
    summary: 'Kemitraan hangat antara keluarga dan sekolah menjadi fondasi terkuat menumbuhkan resiliensi serta kegemaran belajar anak.',
    content: `Bapak Pendidikan Nasional, Ki Hadjar Dewantara, mewariskan ajaran luhur: "Ing Ngarso Sung Tulodo, Ing Madyo Mangun Karso, Tut Wuri Handayani" — Di depan memberi teladan, di tengah membangun kehendak, di belakang memberi dorongan semangat.

Di era teknologi saat ini, semangat belajar anak mekar subur bukan karena paksaan, melainkan ketika:
1. Anak merasa didengarkan dan dihargai setiap proses belajarnya.
2. Kesalahan dalam mengerjakan tugas dipandang sebagai batu loncatan untuk memahami hal baru.
3. Orang tua dan guru berkolaborasi secara positif melalui komunikasi berkala yang ramah dan saling menguatkan.

Mari bersama-sama kita jadikan rumah dan sekolah sebagai surga belajar yang menyenangkan bagi putra-putri kita tercinta di UPTD SDN 5 Barandasi.`,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    readTime: '3 menit',
    tags: ['Motivasi Belajar', 'Karakter Anak', 'Ki Hadjar Dewantara', 'Parenting'],
    isImportant: false,
    sourceName: 'Pusat Penguatan Karakter (Puspeka) Kemendikdasmen',
    sourceUrl: 'https://cerdasberkarakter.kemdikbud.go.id',
    initialLikes: 56
  }
];

export const TEACHERS_LIST: Teacher[] = [
  {
    id: 't1',
    name: 'Hadijah, S.Pd., M.Pd.',
    nip: 'NIP Terdaftar KSP UPTD SDN 5 Barandasi',
    subject: 'Kepala Sekolah',
    category: 'MIPA',
    education: 'S2-MPI (Magister Manajemen Pendidikan)',
    experience: 'Kepala UPTD SDN 5 Barandasi',
    photo: '/src/assets/images/principal_hadijah_official_1788957169722.jpg',
    email: 'hadijah@sdn5barandasi.sch.id',
    quote: 'Mendidik anak dengan keikhlasan hati, menanamkan karakter mulia dan keteladanan.',
    status: 'PNS',
    qualification: 'S2-MPI'
  },
  {
    id: 't2',
    name: 'Hastuti, S.Pd., Gr.',
    nip: '19801018 202521 2 014',
    subject: 'Guru Kelas 1A',
    category: 'MIPA',
    education: 'S1 PGSD - Guru Professional (Gr.)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    email: 'hastuti@sdn5barandasi.sch.id',
    quote: 'Pembelajaran ramah anak menumbuhkan keaktifan dan keberanian peserta didik.',
    status: 'PPPK',
    qualification: 'S1'
  },
  {
    id: 't3',
    name: 'Hj. Rahmawati. S, S.Pd., M.Pd.',
    nip: '19720428 200005 2 001',
    subject: 'Guru Kelas 1B',
    category: 'MIPA',
    education: 'S2 Magister Pendidikan',
    experience: 'Tenaga Pendidik Senior UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1580894732413-a7042b4696fe?auto=format&fit=crop&q=80&w=600',
    email: 'rahmawati@sdn5barandasi.sch.id',
    quote: 'Membimbing generasi muda dengan kedisiplinan dan ilmu yang bermanfaat.',
    status: 'PNS',
    qualification: 'S2'
  },
  {
    id: 't10',
    name: 'Rasmi, S.Pd.',
    nip: '19820922 201501 2 001',
    subject: 'Guru Kelas 1C',
    category: 'Bahasa',
    education: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
    email: 'rasmi@sdn5barandasi.sch.id',
    quote: 'Belajar dengan gembira membuat materi pelajaran mudah dipahami.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't5',
    name: 'Nurlela, S.Pd.',
    nip: '19740305 202521 2 030',
    subject: 'Guru Kelas 2A',
    category: 'MIPA',
    education: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
    email: 'nurlela@sdn5barandasi.sch.id',
    quote: 'Mengayomi setiap anak dengan kasih sayang dan kesabaran.',
    status: 'PW Tendik',
    qualification: 'S1'
  },
  {
    id: 't6',
    name: 'Rosmiati, S.Pd.',
    nip: '19720506 200502 2 003',
    subject: 'Guru Kelas 2B',
    category: 'MIPA',
    education: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
    email: 'rosmiati@sdn5barandasi.sch.id',
    quote: 'Keteladanan adalah metode pembelajaran terbaik bagi anak-anak.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't7',
    name: 'Dewi Novita, S.Pd. SD., Gr.',
    nip: '19841101 202221 2 033',
    subject: 'Guru Kelas 3A',
    category: 'MIPA',
    education: 'S1 PGSD - Guru Professional (Gr.)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    email: 'dewinovita@sdn5barandasi.sch.id',
    quote: 'Semangat mengabdi menghadirkan suasana kelas yang ceria dan inovatif.',
    status: 'PPPK',
    qualification: 'S1'
  },
  {
    id: 't8',
    name: 'Rezky Auliah, S.Pd.',
    nip: '19950222 202521 2 150',
    subject: 'Guru Kelas 3B',
    category: 'Bahasa',
    education: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1580894732413-a7042b4696fe?auto=format&fit=crop&q=80&w=600',
    email: 'rezkyauliah@sdn5barandasi.sch.id',
    quote: 'Mendampingi setiap langkah tumbuh kembang kemampuan dasar siswa.',
    status: 'Honor',
    qualification: 'S1'
  },
  {
    id: 't9',
    name: 'Agustina, S.Pd.I.',
    nip: '19711205 201501 2 001',
    subject: 'Guru Kelas 4A',
    category: 'Seni & Bimbingan',
    education: 'S1 Pendidikan Agama Islam / PGSD',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    email: 'agustina@sdn5barandasi.sch.id',
    quote: 'Menanamkan nilai-nilai keagamaan dan budi pekerti luhur sejak dini.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't4',
    name: 'Badaruddin, S.Pd., M.Pd.',
    nip: '19830905 201001 1 031',
    subject: 'Guru Kelas 4B',
    category: 'MIPA',
    education: 'S2 Magister Pendidikan',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    email: 'badaruddin@sdn5barandasi.sch.id',
    quote: 'Menumbuhkan potensi nalar kritis dan kreativitas peserta didik.',
    status: 'PNS',
    qualification: 'S2'
  },
  {
    id: 't11',
    name: 'Nelly Arif, S.Pd. SD',
    nip: '19711205 201501 2 001',
    subject: 'Guru Kelas 5A',
    category: 'IPS',
    education: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
    email: 'nellyarif@sdn5barandasi.sch.id',
    quote: 'Mengajar adalah seni menumbuhkan rasa ingin tahu dalam diri anak.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't12',
    name: 'Nurhasanah, S.Pd. Gr., M.Pd.',
    nip: '19800523 201501 2 001',
    subject: 'Guru Kelas 5B',
    category: 'MIPA',
    education: 'S2 Magister Pendidikan - Guru Professional (Gr.)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1580894732413-a7042b4696fe?auto=format&fit=crop&q=80&w=600',
    email: 'nurhasanah@sdn5barandasi.sch.id',
    quote: 'Inovasi pembelajaran berbasis Kurikulum Merdeka mewujudkan anak bernalar tinggi.',
    status: 'Honor',
    qualification: 'S2'
  },
  {
    id: 't13',
    name: 'Mantasia, S.Pd.',
    nip: '19830710 201001 2 030',
    subject: 'Guru Kelas 6A',
    category: 'MIPA',
    education: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
    email: 'mantasia@sdn5barandasi.sch.id',
    quote: 'Kesabaran dan keikhlasan adalah kunci sukses mendidik murid sekolah dasar.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't14',
    name: 'Nurliati, S.Pd., M.Pd.',
    nip: '19801210 201501 2 001',
    subject: 'Guru Kelas 6B',
    category: 'MIPA',
    education: 'S2-MPI (Magister Manajemen Pendidikan)',
    experience: 'Tenaga Pendidik UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1580894732413-a7042b4696fe?auto=format&fit=crop&q=80&w=600',
    email: 'nurliati@sdn5barandasi.sch.id',
    quote: 'Setiap anak memiliki keunikan dan potensi unggul yang siap berkembang.',
    status: 'PNS',
    qualification: 'S2-MPI'
  },
  {
    id: 't15',
    name: 'Nawir, S.Pd.',
    nip: '19791103 201501 2 001',
    subject: 'Guru PJOK',
    category: 'Seni & Bimbingan',
    education: 'S1 Pendidikan Jasmani Kesehatan & Rekreasi',
    experience: 'Tenaga Pendidik Olahraga UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    email: 'nawir@sdn5barandasi.sch.id',
    quote: 'Tubuh yang sehat mendukung semangat belajar dan sportivitas anak.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't16',
    name: 'Mustaid, S.Pd.',
    nip: '19680227 199108 1 001',
    subject: 'Guru PJOK',
    category: 'MIPA',
    education: 'S1 Pendidikan Guru Sekolah Dasar / Olahraga',
    experience: 'Tenaga Pendidik Senior UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    email: 'mustaid@sdn5barandasi.sch.id',
    quote: 'Mengabdi dengan ketulusan melahirkan penerus bangsa yang berakhlak.',
    status: 'PNS',
    qualification: 'S1'
  },
  {
    id: 't17',
    name: 'Muliana, S.Pd., M.Pd.',
    nip: '19690401 200701 1 031',
    subject: 'Guru PAIBP',
    category: 'MIPA',
    education: 'S2 Magister Pendidikan',
    experience: 'Tenaga Pendidik Senior UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    email: 'muliana@sdn5barandasi.sch.id',
    quote: 'Membina kemandirian dan rasa cinta membaca serta nilai keagamaan sejak dini.',
    status: 'Honor',
    qualification: 'S2'
  },
  {
    id: 't18',
    name: 'Nursaida, S.Pd.I.',
    nip: '19920111 202421 2 017',
    subject: 'Guru PAIBP (Guru PAI)',
    category: 'Seni & Bimbingan',
    education: 'S1 Pendidikan Agama Islam',
    experience: 'Tenaga Pendidik Keagamaan UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    email: 'nursaida@sdn5barandasi.sch.id',
    quote: 'Membangun karakter Islami, ketakwaan, dan kepedulian sesama.',
    status: 'PPPK',
    qualification: 'S1'
  },
  {
    id: 't19',
    name: 'Safaruddin',
    nip: '-',
    subject: 'Tenaga Kebersihan',
    category: 'Seni & Bimbingan',
    education: 'SMA / Penunjang Lingkungan Sekolah',
    experience: 'Tenaga Kebersihan & Pemeliharaan Sarana UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    email: 'safaruddin@sdn5barandasi.sch.id',
    quote: 'Menjaga kebersihan, keasrian, dan kenyamanan lingkungan belajar anak-anak setiap hari.',
    status: 'Honor',
    qualification: 'Penunjang'
  },
  {
    id: 't20',
    name: 'Arman',
    nip: '-',
    subject: 'Pengelola Umum Operasional',
    category: 'Seni & Bimbingan',
    education: 'SMA / Petugas Operasional & Keamanan Sekolah',
    experience: 'PW Pengelola Umum Operasional UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    email: 'arman@sdn5barandasi.sch.id',
    quote: 'Menjaga keamanan, keselamatan, dan kelancaran operasional seluruh warga UPTD SDN 5 Barandasi.',
    status: 'PW Pengelola Umum Operasional',
    qualification: 'Penunjang'
  },
  {
    id: 't21',
    name: 'Sularti',
    nip: '-',
    subject: 'Pengelola Umum Operasional',
    category: 'Seni & Bimbingan',
    education: 'SMA / Penunjang Operasional Sekolah',
    experience: 'PW Pengelola Umum Operasional UPTD SDN 5 Barandasi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    email: 'sularti@sdn5barandasi.sch.id',
    quote: 'Mendukung kelancaran operasional dan pelayanan di UPTD SDN 5 Barandasi.',
    status: 'PW Pengelola Umum Operasional',
    qualification: 'Penunjang'
  }
];

export const FACILITIES_LIST: Facility[] = [
  {
    id: 'f1',
    name: 'Ruang Kelas Nyaman & Interaktif (Kurikulum Merdeka)',
    category: 'Fasilitas Belajar',
    description: 'Ruang kelas bersih, berangin sejuk, dilengkapi proyektor, papan tulis ganda, serta susunan meja dinamis untuk kerja kelompok.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    features: ['Sudut Baca Kelas (Literasi)', 'Proyektor Pembelajaran Digital', 'Pencahayaan & Sirkulasi Udara Baik', 'Meja Kursi Ergonomis']
  },
  {
    id: 'f2',
    name: 'Perpustakaan & Pojok Baca SD',
    category: 'Fasilitas Literasi',
    description: 'Koleksi buku cerita anak, buku pelajaran Kurikulum Merdeka, sains populer, serta komik edukasi yang diminati siswa.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    features: ['1.200+ Judul Buku Anak', 'Area Karpet Lesehan Membaca', 'Sistem Peminjaman Rapi', 'Program Jam Wajib Baca']
  },
  {
    id: 'f3',
    name: 'Laboratorium Komputer & Media Pembelajaran',
    category: 'Fasilitas Teknologi',
    description: 'Fasilitas komputer dasar untuk pengenalan IT sejak dini dan pelaksanaan ANBK (Asesmen Nasional Berbasis Komputer).',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    features: ['20 Unit Komputer Siswa', 'Koneksi Internet Stabil', 'AC & Headset Pembelajaran', 'Pendampingan Pengenalan IT SD']
  },
  {
    id: 'f4',
    name: 'Lapangan Olahraga & Arena Bermain Ramah Anak',
    category: 'Fasilitas Olahraga',
    description: 'Lapangan serbaguna untuk upacara bendera, senam bersama, bulu tangkis, futsal, serta permainan tradisional anak.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    features: ['Lapangan Futsal & Voli SD', 'Saran Senam & Upacara', 'Peralatan Olahraga Lengkap', 'Pohon Rindang Bunga Parkir']
  },
  {
    id: 'f5',
    name: 'Musholla Sekolah & Tempat Wudhu',
    category: 'Fasilitas Keagamaan',
    description: 'Sarana ibadah bersih bagi siswa dan guru untuk pelaksanaan Sholat Dzuhur berjamaah dan latihan Al-Qur\'an/Juz Amma.',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
    features: ['Kapasitas 100 Siswa', 'Tempat Wudhu Laki & Perempuan Terpisah', 'Perlengkapan Sholat Bersih', 'Sound System Bening']
  },
  {
    id: 'f6',
    name: 'Kantin Sehat & Pos UKS Dokter Kecil',
    category: 'Fasilitas Kesehatan',
    description: 'Kantin sekolah higienis tanpa bahan pengawet berbahaya serta ruang UKS untuk penanganan kesehatan pertama siswa.',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800',
    features: ['Makanan Bergizi Terawasi', 'Kasur UKS & Obat P3K Lengkap', 'Program Kader Dokter Kecil', 'Tempat Cuci Tangan Air Mengalir']
  }
];

export const EXTRACURRICULARS_LIST: Extracurricular[] = [
  {
    id: 'e1',
    name: 'Pramuka Siaga & Penggalang SD',
    category: 'Kepemimpinan',
    schedule: 'Jumat, 14:00 WITA',
    coach: 'Muhammad Syarif, S.Pd.SD.',
    description: 'Membentuk kedisiplinan, kemandirian, kepemimpinan, dan cinta alam sesuai Dasa Darma Pramuka.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
    membersCount: 150,
    achievements: ['Juara PBB Pramuka SD se-Kec. Lau', 'Gudep Teraktif Maros']
  },
  {
    id: 'e2',
    name: 'Sanggar Seni Tari Bugis-Makassar',
    category: 'Seni & Budaya',
    schedule: 'Sabtu, 09:00 WITA',
    coach: 'Andi Asriani, S.Pd.',
    description: 'Melestarikan seni tari daerah seperti Tari Padduppa, Tari Kipas, dan kreasi anak Nusantara.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    membersCount: 35,
    achievements: ['Juara 1 Lomba Tari SD Kab. Maros 2026']
  },
  {
    id: 'e3',
    name: 'Kader Dokter Kecil & UKS SD',
    category: 'Kepemimpinan',
    schedule: 'Rabu, 14:30 WITA',
    coach: 'Kamaruddin, S.Pd.',
    description: 'Melatih kesadaran hidup sehat, pertolongan pertama pada kecelakaan (P3K), dan kebersihan lingkungan.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    membersCount: 28,
    achievements: ['Apresiasi Sekolah Sehat Kab. Maros']
  },
  {
    id: 'e4',
    name: 'Klub Olahraga Bulu Tangkis & Futsal SD',
    category: 'Olahraga',
    schedule: 'Selasa & Kamis, 15:30 WITA',
    coach: 'Kamaruddin, S.Pd.',
    description: 'Pembinaan bakat olahraga anak sejak dini dalam bidang bulu tangkis, futsal, dan atletik cilik.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    membersCount: 40,
    achievements: ['Juara 2 Futsal O2SN SD 2025']
  },
  {
    id: 'e5',
    name: 'Grup Seni Rebana & Marawis Islami',
    category: 'Seni & Budaya',
    schedule: 'Kamis, 14:00 WITA',
    coach: 'Nurhayati, S.Pd.I.',
    description: 'Mengembangkan bakat musik Islami, shalawat, dan seni tabuh rebana anak-anak.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    membersCount: 25,
    achievements: ['Pengisi Acara Maulid & MTQ Kecamatan']
  }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'a1',
    title: 'Juara 1 Lomba Seni Tari Tradisional SD',
    competition: 'Pesta Seni Pelajar Kab. Maros 2026',
    level: 'Kabupaten',
    year: '2026',
    studentName: 'Tim Tari UPTD SDN 5 Barandasi',
    medal: 'Juara 1',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'a2',
    title: 'Medali Emas Olimpiade Sains SD (IPA) Tingkat Kabupaten',
    competition: 'OSN SD Kab. Maros 2025',
    level: 'Kabupaten',
    year: '2025',
    studentName: 'Ahmad Nur Fauzan (Kelas V)',
    medal: 'Emas',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'a3',
    title: 'Juara 2 Lomba Tahfidz Al-Qur\'an Juz 30 SD',
    competition: 'Festival Anak Sholeh Maros 2025',
    level: 'Kabupaten',
    year: '2025',
    studentName: 'Siti Humairah (Kelas IV)',
    medal: 'Juara 2',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600'
  }
];

export const CALENDAR_ITEMS: AcademicCalendarItem[] = [
  { date: '10 Juli - 15 Agustus 2026', title: 'Pendaftaran SPMB 2026 Online Pusdatin Maros', category: 'PPDB', description: 'Pelayanan verifikasi & pendaftaran via link spmb2026.pusdatinmaros.id/dashboard' },
  { date: '18 Juli 2026', title: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Siswa Baru Class 1', category: 'Kegiatan', description: 'Pengenalan guru, kelas, serta lingkungan UPTD SDN 5 Barandasi.' },
  { date: '17 Agustus 2026', title: 'Upacara Bendera HUT Kemerdekaan RI ke-81', category: 'Kegiatan', description: 'Upacara bersama dan lomba permainan tradisional antar kelas.' },
  { date: '25-28 Agustus 2026', title: 'Gladi Bersih ANBK Kelas V', category: 'Ujian', description: 'Simulasi asesmen nasional berbasis komputer di lab sekolah.' },
  { date: '10 Oktober 2026', title: 'Gelar Karya Projek P5 Kurikulum Merdeka', category: 'Kegiatan', description: 'Pameran kreasi sampah daur ulang & makanan tradisional anak.' }
];

export const SCHOOL_MAJORS = [
  {
    code: 'FASE-A',
    title: 'Fase A (Kelas 1 & 2 SD)',
    description: 'Tahap penguatan pondasi Calistung (Membaca, Menulis, Berhitung), transisi PAUD-SD yang menyenangkan, serta pembentukan akhlak mulia.',
    subjects: ['Pendidikan Pancasila', 'Bahasa Indonesia', 'Matematika Dasar', 'Pendidikan Agama & Budi Pekerti', 'Seni & Budaya Lokal'],
    icon: 'BookOpen',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    code: 'FASE-B',
    title: 'Fase B (Kelas 3 & 4 SD)',
    description: 'Pengembangan kemampuan pemahaman literasi, numerasi tingkat lanjut, IPAS (Ilmu Pengetahuan Alam & Sosial), dan kerja kelompok.',
    subjects: ['IPAS Dasar', 'Matematika & Pemecahan Masalah', 'Bahasa Indonesia', 'PJOK & Kesehatan', 'Bahasa Daerah (Bugis-Makassar)'],
    icon: 'Globe',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    code: 'FASE-C',
    title: 'Fase C (Kelas 5 & 6 SD)',
    description: 'Penguatan persiapan ANBK, bernalar kritis, proyek P5 Pancasila, pemanfaatan media komputer, serta persiapan transisi ke SMP.',
    subjects: ['IPAS Lanjutan', 'Matematika Analitis', 'Pengenalan Komputer & ANBK', 'Pendidikan Pancasila', 'Projek P5 Profil Pelajar Pancasila'],
    icon: 'Atom',
    color: 'from-amber-500 to-orange-600'
  }
];

export const PEMBINA_UPACARA_LIST: CeremonyLeader[] = [
  {
    no: 1,
    name: 'Hadijah, S.Pd., M.Pd.',
    nip: 'NIP Terdaftar KSP UPTD SDN 5 Barandasi',
    role: 'Kepala Sekolah (Pembina Utama)',
    category: 'Kepala Sekolah',
    status: 'PNS',
    schedulePeriod: 'Upacara Pembuka & Hari Besar Nasional'
  },
  {
    no: 2,
    name: 'Hastuti, S.Pd., Gr.',
    nip: '19801018 202521 2 014',
    role: 'Guru Kelas 1A',
    category: 'Guru Kelas',
    status: 'PPPK',
    schedulePeriod: 'Minggu Ke-1'
  },
  {
    no: 3,
    name: 'Hj. Rahmawati. S, S.Pd., M.Pd.',
    nip: '19720428 200005 2 001',
    role: 'Guru Kelas 1B',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-2'
  },
  {
    no: 4,
    name: 'Rasmi, S.Pd.',
    nip: '19820922 201501 2 001',
    role: 'Guru Kelas 1C',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-3'
  },
  {
    no: 5,
    name: 'Nurlela, S.Pd.',
    nip: '19740305 202521 2 030',
    role: 'Guru Kelas 2A',
    category: 'Guru Kelas',
    status: 'PW Tendik',
    schedulePeriod: 'Minggu Ke-4'
  },
  {
    no: 6,
    name: 'Rosmiati, S.Pd.',
    nip: '19720506 200502 2 003',
    role: 'Guru Kelas 2B',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-5'
  },
  {
    no: 7,
    name: 'Dewi Novita, S.Pd. SD., Gr.',
    nip: '19841101 202221 2 033',
    role: 'Guru Kelas 3A',
    category: 'Guru Kelas',
    status: 'PPPK',
    schedulePeriod: 'Minggu Ke-6'
  },
  {
    no: 8,
    name: 'Rezky Auliah, S.Pd.',
    nip: '19950222 202521 2 150',
    role: 'Guru Kelas 3B',
    category: 'Guru Kelas',
    status: 'Honor',
    schedulePeriod: 'Minggu Ke-7'
  },
  {
    no: 9,
    name: 'Agustina, S.Pd.I.',
    nip: '19711205 201501 2 001',
    role: 'Guru Kelas 4A',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-8'
  },
  {
    no: 10,
    name: 'Badaruddin, S.Pd., M.Pd.',
    nip: '19830905 201001 1 031',
    role: 'Guru Kelas 4B',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-9'
  },
  {
    no: 11,
    name: 'Nelly Arif, S.Pd. SD',
    nip: '19711205 201501 2 001',
    role: 'Guru Kelas 5A',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-10'
  },
  {
    no: 12,
    name: 'Nurhasanah, S.Pd. Gr., M.Pd.',
    nip: '19800523 201501 2 001',
    role: 'Guru Kelas 5B',
    category: 'Guru Kelas',
    status: 'Honor',
    schedulePeriod: 'Minggu Ke-11'
  },
  {
    no: 13,
    name: 'Mantasia, S.Pd.',
    nip: '19830710 201001 2 030',
    role: 'Guru Kelas 6A',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-12'
  },
  {
    no: 14,
    name: 'Nurliati, S.Pd., M.Pd.',
    nip: '19801210 201501 2 001',
    role: 'Guru Kelas 6B',
    category: 'Guru Kelas',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-13'
  },
  {
    no: 15,
    name: 'Nawir, S.Pd.',
    nip: '19791103 201501 2 001',
    role: 'Guru Mapel PJOK',
    category: 'Guru Mapel',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-14'
  },
  {
    no: 16,
    name: 'Mustaid, S.Pd.',
    nip: '19680227 199108 1 001',
    role: 'Guru Mapel PJOK',
    category: 'Guru Mapel',
    status: 'PNS',
    schedulePeriod: 'Minggu Ke-15'
  },
  {
    no: 17,
    name: 'Muliana, S.Pd., M.Pd.',
    nip: '19690401 200701 1 031',
    role: 'Guru Mapel PAIBP',
    category: 'Guru Mapel',
    status: 'Honor',
    schedulePeriod: 'Minggu Ke-16'
  },
  {
    no: 18,
    name: 'Nursaida, S.Pd.I.',
    nip: '19920111 202421 2 017',
    role: 'Guru Mapel PAIBP',
    category: 'Guru Mapel',
    status: 'PPPK',
    schedulePeriod: 'Minggu Ke-17'
  }
];
