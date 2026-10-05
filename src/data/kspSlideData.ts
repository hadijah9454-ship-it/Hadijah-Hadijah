import { KspSlide } from '../types';
import { SCHOOL_VISION, SCHOOL_MISSIONS } from './schoolData';

export const KSP_SLIDES: KspSlide[] = [
  {
    id: 1,
    slideNumber: '01/12',
    category: 'Identitas Resmi Dokumen',
    title: 'KURIKULUM OPERASIONAL SATUAN PENDIDIKAN (KSP)',
    subtitle: 'Tahun Ajaran 2026/2027 • Kurikulum Merdeka Terakreditasi B',
    badge: 'DOKUMEN RESMI KSP',
    iconName: 'BookOpen',
    lead: 'Pedoman penyelenggaraan pembelajaran berpusat pada murid di UPTD SDN 5 Barandasi, Kecamatan Lau, Kabupaten Maros, Provinsi Sulawesi Selatan.',
    keyPoints: [
      {
        title: 'Satuan Pendidikan',
        desc: 'UPTD SDN 5 Barandasi (NPSN Terdaftar Resmi, Kecamatan Lau, Kabupaten Maros).',
        tag: 'Sekolah Dasar'
      },
      {
        title: 'Penanggung Jawab',
        desc: 'Hadijah, S.Pd., M.Pd. (Kepala Satuan Pendidikan UPTD SDN 5 Barandasi).',
        tag: 'Pimpinan'
      },
      {
        title: 'Landasan Kebijakan',
        desc: 'Kurikulum Merdeka BSKAP Kemendikbudristek & Permendikdasmen No. 6 Tahun 2026 tentang Budaya Sekolah Aman dan Nyaman.',
        tag: 'Regulasi'
      },
      {
        title: 'Tahun Pemberlakuan',
        desc: 'Tahun Ajaran 2026/2027 dengan pembaruan berkelanjutan berbasis data rapor pendidikan.',
        tag: 'T.A. 2026/2027'
      }
    ],
    metrics: [
      { label: 'Status Akreditasi', value: 'Akreditasi B', desc: 'BAN-S/M Terverifikasi' },
      { label: 'Jenjang Layanan', value: 'Fase A, B, & C', desc: 'Kelas 1 sampai 6 SD' },
      { label: 'Jumlah Pendidik', value: '20 GTK', desc: 'Guru Kelas, Mapel & Tendik' },
      { label: 'Peserta Didik', value: '280+ Murid', desc: 'Kec. Lau, Kab. Maros' }
    ],
    quoteOrHighlight: '"Kurikulum Operasional bukan sekadar dokumen administratif, melainkan cetak biru hidup yang mengarahkan setiap denyut pembelajaran demi memerdekakan potensi anak bangsa."',
    speakerNotes: 'Slide ini membuka presentasi KSP secara resmi di hadapan Pengawas Pembina, Komite Sekolah, Pendidik, serta Pemangku Kepentingan Pendidikan Kabupaten Maros.'
  },
  {
    id: 2,
    slideNumber: '02/12',
    category: 'Analisis Konteks',
    title: 'KARAKTERISTIK SATUAN PENDIDIKAN & LINGKUNGAN',
    subtitle: 'Kekayaan Sosio-Kultural Maros & Ekosistem Komunitas Barandasi',
    badge: 'KONTEKS LOKAL',
    iconName: 'Building2',
    lead: 'UPTD SDN 5 Barandasi berlokasi strategis di Kelurahan Maccini Baji, Kecamatan Lau, Kabupaten Maros, dengan perpaduan nilai kearifan lokal dan keterbukaan inovasi.',
    keyPoints: [
      {
        title: 'Konteks Sosial Budaya',
        desc: 'Masyarakat kental dengan falsafah Bugis-Makassar: Sipakatau (saling memanusiakan), Sipakalebbi (saling menghargai), dan Sipakainge (saling mengingatkan) dengan prinsip teguh Siri\' na Pacce.',
        tag: 'Kearifan Lokal',
        highlight: true
      },
      {
        title: 'Potensi Ekologis & Geografis',
        desc: 'Wilayah transisi agraris dan pesisir khas Lau, Maros; sangat strategis sebagai laboratorium alam pembelajaran ekologis dan Gerakan Sekolah Adiwiyata.',
        tag: 'Lingkungan'
      },
      {
        title: 'Karakteristik Murid',
        desc: '280+ peserta didik dengan rentang kesiapan beragam; memerlukan pendekatan pembelajaran terdiferensiasi serta pemulihan fondasi literasi-numerasi adaptif.',
        tag: 'Inklusif'
      },
      {
        title: 'Kemitraan Masyarakat',
        desc: 'Dukungan kuat Komite Sekolah, orang tua wali, Dinas Pendidikan Kabupaten Maros, serta Pusdatin Maros untuk SPMB dan digitalisasi sekolah.',
        tag: 'Sinergi'
      }
    ],
    quoteOrHighlight: '"Kearifan lokal Bugis-Makassar di Barandasi menjadi jangkar moral dan inspirasi kontekstual seluruh aktivitas belajar peserta didik."',
    speakerNotes: 'Menegaskan bahwa kurikulum dirancang secara kontekstual, bertolak dari realitas sosio-kultural dan kondisi riil anak di Kecamatan Lau.'
  },
  {
    id: 3,
    slideNumber: '03/12',
    category: 'Visi Satuan Pendidikan',
    title: 'VISI SATUAN PENDIDIKAN UPTD SDN 5 BARANDASI',
    subtitle: 'Kompas Moral dan Arah Masa Depan Pendidikan Sekolah Dasar',
    badge: 'VISI UTAMA',
    iconName: 'Target',
    lead: 'Visi resmi yang diputuskan bersama seluruh dewan guru, kepala sekolah, komite, dan perwakilan masyarakat untuk masa depan peserta didik.',
    quoteOrHighlight: `"${SCHOOL_VISION}"`,
    keyPoints: [
      {
        title: 'Pilar 1: Integritas Tinggi & Bernalar Kritis',
        desc: 'Mencetak generasi yang jujur, disiplin, berakhlak mulia, serta mampu menganalisis informasi dan memecahkan masalah kehidupan secara bijak.',
        tag: 'Moral & Nalar'
      },
      {
        title: 'Pilar 2: Karakter Ekologis & 8 Dimensi Lulusan',
        desc: 'Menumbuhkan kesadaran pelestarian lingkungan hidup (Adiwiyata) selaras dengan 8 Dimensi Profil Lulusan berjiwa Pancasila.',
        tag: 'Ekologis'
      },
      {
        title: 'Pilar 3: Sehat & Tangguh Tantangan Sosial',
        desc: 'Resilien terhadap ancaman narkoba (IKAN), terbiasa hidup sehat (GSS & 7 KAIH), dan siap menghadapi dinamika zaman.',
        tag: 'Resiliensi'
      },
      {
        title: 'Pilar 4: Ekosistem Aman, Nyaman, & Inklusif',
        desc: 'Mewujudkan Budaya Sekolah Aman dan Nyaman (BSAN) sesuai Permendikdasmen No. 6 Tahun 2026, bebas perundungan dan diskriminasi.',
        tag: 'BSAN 2026',
        highlight: true
      }
    ],
    speakerNotes: 'Visi ini menjadi landasan ontologis dan filosofis seluruh program kerja, silabus, asesmen, dan budaya harian di SDN 5 Barandasi.'
  },
  {
    id: 4,
    slideNumber: '04/12',
    category: 'Misi Satuan Pendidikan',
    title: '7 MISI STRATEGIS SATUAN PENDIDIKAN',
    subtitle: 'Langkah Operasional Mewujudkan Visi Sekolah Masa Depan',
    badge: '7 MISI OPERASIONAL',
    iconName: 'Compass',
    lead: 'Tujuh komitmen terukur yang dijalankan oleh seluruh pendidik dan tenaga kependidikan UPTD SDN 5 Barandasi:',
    keyPoints: SCHOOL_MISSIONS.map((m, idx) => ({
      title: `Misi ${idx + 1}`,
      desc: m,
      tag: idx === 0 ? 'Deep Learning' : idx === 1 ? 'BSAN 2026' : idx === 2 ? 'IKAN Anti Narkoba' : idx === 3 ? 'IPAK Anti Korupsi' : idx === 4 ? 'Adiwiyata' : idx === 5 ? 'GSS & MBG' : 'Kombel Guru',
      highlight: idx === 0 || idx === 1
    })),
    quoteOrHighlight: '"Setiap misi merupakan aksi nyata yang diturunkan ke dalam indikator kinerja guru, modul ajar, dan pembiasaan siswa setiap hari."',
    speakerNotes: '7 Misi ini menggabungkan tuntutan akademik mutakhir (Deep Learning) dengan pembentukan karakter karakter protektif (BSAN, IKAN, IPAK, Adiwiyata, GSS).'
  },
  {
    id: 5,
    slideNumber: '05/12',
    category: 'Profil Lulusan',
    title: '8 DIMENSI PROFIL LULUSAN SDN 5 BARANDASI',
    subtitle: 'Standar Kompetensi Lulusan Menuju Profil Pelajar Pancasila',
    badge: '8 DIMENSI LULUSAN',
    iconName: 'Award',
    lead: 'Murid yang menuntaskan pendidikan di UPTD SDN 5 Barandasi dibekali 8 dimensi kecakapan holistik:',
    keyPoints: [
      {
        title: '1. Beriman & Berakhlak Mulia',
        desc: 'Ketaatan beribadah, kesantunan bertutur kata, dan empati sosial sesama warga sekolah.',
        tag: 'Spiritual'
      },
      {
        title: '2. Integritas Tinggi (IPAK)',
        desc: 'Menjunjung kejujuran, disiplin, berani berkata benar, dan menolak perilaku koruptif sejak dini.',
        tag: 'Integritas'
      },
      {
        title: '3. Bernalar Kritis & Adaptif',
        desc: 'Mampu menalar konsep literasi dan numerasi dalam konteks permasalahan kehidupan nyata.',
        tag: 'Kognitif'
      },
      {
        title: '4. Berkarakter Ekologis (Adiwiyata)',
        desc: 'Cinta lingkungan, aktif mengelola sampah, hemat air dan energi, serta menjaga keasrian sekolah.',
        tag: 'Lingkungan'
      },
      {
        title: '5. Kreatif & Inovatif',
        desc: 'Mampu menghasilkan karya orisinil melalui projek P5, seni rupa, dan prakarya kearifan lokal.',
        tag: 'Karya'
      },
      {
        title: '6. Berkebinekaan & Cinta Budaya',
        desc: 'Menghargai keberagaman suku dan agama serta melestarikan budaya Bugis-Makassar di Maros.',
        tag: 'Kebudayaan'
      },
      {
        title: '7. Kolaboratif & Gotong Royong',
        desc: 'Terbiasa bekerja sama dalam kelompok, saling peduli, dan memiliki jiwa kerelawanan tinggi.',
        tag: 'Sosial'
      },
      {
        title: '8. Sehat & Tangguh (Resilien)',
        desc: 'Kebugaran fisik prima, pemahaman gizi (MBG), serta tangkal zat adiktif dan narkoba (IKAN).',
        tag: 'Kesehatan'
      }
    ],
    speakerNotes: 'Dimensi ini diukur melalui penilaian autentik, rapor P5, dan asesmen perkembangan kepribadian peserta didik setiap semester.'
  },
  {
    id: 6,
    slideNumber: '06/12',
    category: 'Struktur Kurikulum',
    title: 'PENGORGANISASIAN PEMBELAJARAN INTRAKURIKULER',
    subtitle: 'Alokasi Jam Belajar & Struktur Tiga Fase Pendidikan Dasar',
    badge: 'FASE A, B, & C',
    iconName: 'Layers',
    lead: 'Pembelajaran intrakurikuler dirancang fleksibel dengan alokasi waktu tahunan berbasis capaian pembelajaran Kurikulum Merdeka:',
    tableData: {
      headers: ['Fase & Kelas', 'Fokus Utama Pembelajaran', 'Mata Pelajaran Kunci', 'Karakteristik Khusus'],
      rows: [
        ['Fase A (Kelas 1 & 2)', 'Fondasi Calistung & Transisi PAUD-SD yang menyenangkan', 'Pend. Agama, Pend. Pancasila, B. Indonesia, Matematika, Seni Budaya', 'Pendekatan bermain bermakna, tanpa tes calistung menegangkan'],
        ['Fase B (Kelas 3 & 4)', 'Penguatan literasi lanjut, numerasi konkret, eksplorasi alam', 'IPAS (IPA-IPS Terpadu), Matematika Terapan, Bahasa Daerah Maros, PJOK', 'Pembelajaran berbasis penyelidikan dan kerja kelompok aktif'],
        ['Fase C (Kelas 5 & 6)', 'Penalaran kritis, persiapan ANBK, kesiapan transisi SMP', 'IPAS Lanjut, Matematika Analitis, Literasi Digital Dasar, Pend. Pancasila', 'Projek mandiri, pembiasaan ANBK di Lab Komputer, pemecahan masalah']
      ]
    },
    keyPoints: [
      {
        title: 'Beban Belajar Fleksibel',
        desc: 'Alokasi total berkisar 1.080 - 1.296 JP/tahun, dibagi proporsional antara intrakurikuler (70-80%) dan projek P5 (20-30%).',
        tag: 'Alokasi JP'
      },
      {
        title: 'Muatan Lokal Wajib',
        desc: 'Bahasa Daerah (Bugis-Makassar), pengenalan aksara Lontara\', dan seni tari tradisional Butta Salewangang Maros.',
        tag: 'Mulok Maros'
      }
    ],
    speakerNotes: 'Struktur jam belajar memungkinkan guru mengatur ritme pengajaran tanpa terburu-buru, memastikan setiap anak mencapai fase tuntas.'
  },
  {
    id: 7,
    slideNumber: '07/12',
    category: 'Kokurikuler P5',
    title: 'PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)',
    subtitle: 'Pembelajaran Kontekstual Berbasis Masalah & Kearifan Lokal Maros',
    badge: 'P5 MERDEKA',
    iconName: 'Sparkles',
    lead: 'P5 dilaksanakan dengan sistem blok tematik terintegrasi, memberikan pengalaman nyata kepada murid di luar ruang kelas konvensional.',
    keyPoints: [
      {
        title: 'Tema 1: Gaya Hidup Berkelanjutan',
        desc: 'Projek "Kelola Sampah Plastik Menjadi Karya Adiwiyata Barandasi". Murid belajar memilah sampah, membuat ecobrick, dan komposting mandiri.',
        tag: 'Adiwiyata Mandiri',
        highlight: true
      },
      {
        title: 'Tema 2: Kearifan Lokal',
        desc: 'Projek "Lestarikan Permainan Tradisional & Kuliner Sehat Khas Maros". Menggali kembali budaya lokal Bugis-Makassar agar tidak tergerus gawai digital.',
        tag: 'Budaya Lokal'
      },
      {
        title: 'Tema 3: Bangunlah Jiwa dan Raganya',
        desc: 'Projek "Sekolahku Ramah Anak, Sahabatku Saudaraku (BSAN)". Kampanye pencegahan perundungan dan deklarasi kelas anti-bullying.',
        tag: 'BSAN Anti-Bullying'
      },
      {
        title: 'Gelar Karya Akhir Semester',
        desc: 'Pameran terbuka mengundang orang tua murid, komite, dan mitra sekolah untuk mengapresiasi portofolio dan kreasi siswa.',
        tag: 'Pentas Karya'
      }
    ],
    quoteOrHighlight: '"Melalui P5, murid tidak hanya menghafal nilai Pancasila, melainkan mempraktikkannya langsung dalam memecahkan masalah di sekitar sekolah."',
    speakerNotes: 'Menampilkan tema P5 yang langsung bersinergi dengan Gerakan Adiwiyata dan Budaya Sekolah Aman dan Nyaman (BSAN).'
  },
  {
    id: 8,
    slideNumber: '08/12',
    category: 'Inovasi Pedagogi',
    title: 'PENDEKATAN PEMBELAJARAN DEEP LEARNING',
    subtitle: 'Pemulihan Literasi & Numerasi Adaptif Melalui Pembelajaran Mendalam',
    badge: 'DEEP LEARNING',
    iconName: 'Atom',
    lead: 'UPTD SDN 5 Barandasi memelopori pendekatan Deep Learning untuk mengembalikan esensi belajar anak secara mendalam dan berdaya guna.',
    keyPoints: [
      {
        title: 'Mindful Learning (Belajar Sadar Penuh)',
        desc: 'Anak diajak hadir seutuhnya secara mental dan emosional, membangun kesadaran rasa ingin tahu alami tanpa rasa takut dihakimi.',
        tag: 'Mindful'
      },
      {
        title: 'Meaningful Learning (Belajar Bermakna)',
        desc: 'Materi pelajaran dihubungkan secara nyata dengan pengalaman sehari-hari anak di rumah, sawah, pasar, dan pesisir Lau Maros.',
        tag: 'Meaningful',
        highlight: true
      },
      {
        title: 'Joyful Learning (Belajar Menyenangkan)',
        desc: 'Suasana kelas hidup dengan simulasi, cerita, gamifikasi pendidikan, dan apresiasi positif yang membakar antusiasme murid.',
        tag: 'Joyful'
      },
      {
        title: 'Diferensiasi Pembelajaran',
        desc: 'Guru melakukan asesmen diagnostik di awal tema untuk menyesuaikan konten, proses, dan produk belajar sesuai fase kesiapan anak.',
        tag: 'Diferensiasi'
      }
    ],
    metrics: [
      { label: 'Pojok Baca Kelas', value: '100% Kelas', desc: 'Fasilitas membaca aktif' },
      { label: '15 Menit Membaca', value: 'Rutin Harian', desc: 'Gerakan Literasi Sekolah' },
      { label: 'Klinik Numerasi', value: 'Tiap Rabu', desc: 'Bimbingan adaptif anak' },
      { label: 'Asesmen Awal', value: 'Tiap Awal Bab', desc: 'Memetakan profil murid' }
    ],
    speakerNotes: 'Deep Learning menjawab tantangan hilangnya kemampuan dasar akibat era digital, mengalihkan fokus dari sekadar mengejar ketuntasan materi ke pemahaman konsep hakiki.'
  },
  {
    id: 9,
    slideNumber: '09/12',
    category: 'Kurikulum Khusus',
    title: 'KURIKULUM TERINTEGRASI: BSAN, IKAN, IPAK, & ADIWIYATA',
    subtitle: 'Respons Kebijakan Permendikdasmen No. 6 Tahun 2026 & Karakter Bangsa',
    badge: 'INTEGRASI KEBIJAKAN',
    iconName: 'ShieldCheck',
    lead: 'Kurikulum Operasional mengintegrasikan 4 instrumen pembentukan karakter unggul secara organik ke dalam semua mata pelajaran:',
    keyPoints: [
      {
        title: 'BSAN (Permendikdasmen No. 6/2026)',
        desc: 'Budaya Sekolah Aman dan Nyaman. Pembentukan Satgas TPPK, kanal aduan ramah anak, dan toleransi tanpa perundungan serta kekerasan.',
        tag: 'Aman & Nyaman',
        highlight: true
      },
      {
        title: 'IKAN (Integrasi Kurikulum Anti Narkoba)',
        desc: 'Membangun benteng pertahanan dini terhadap bahaya narkoba, rokok, dan zat adiktif melalui modul terpadu PJOK & IPA.',
        tag: 'Anti Narkoba'
      },
      {
        title: 'IPAK (Indeks Perilaku Anti Korupsi)',
        desc: 'Pembiasaan 9 nilai integritas (Jujur, Peduli, Mandiri, Disiplin, Tanggung Jawab, Kerja Keras, Sederhana, Berani, Adil) lewat Kantin Kejujuran.',
        tag: 'Anti Korupsi'
      },
      {
        title: 'Gerakan Sekolah Adiwiyata',
        desc: 'Pendidikan lingkungan hidup: Bank Sampah Sekolah Barandasi, hemat energi, pengurangan botol plastik, dan pemeliharaan taman sekolah.',
        tag: 'Adiwiyata'
      }
    ],
    quoteOrHighlight: '"Integrasi kurikulum ini membekali anak dengan kekebalan moral dan mental dalam menghadapi godaan sosial zaman modern."',
    speakerNotes: 'Slide ini sangat penting untuk akreditasi dan supervisi dinas, membuktikan kepatuhan sekolah terhadap regulasi terbaru Permendikdasmen No. 6/2026.'
  },
  {
    id: 10,
    slideNumber: '10/12',
    category: 'Budaya & Pembiasaan',
    title: 'PEMBIASAAN GSS, 7 KAIH, PROGRAM MBG & UPACARA BENDERA',
    subtitle: 'Rutinitas Pembentukan Jiwa Sehat, Raga Kuat, dan Disiplin Nasional',
    badge: 'PEMBIASAAN HARIAN',
    iconName: 'Heart',
    lead: 'Karakter anak dibentuk melalui pembiasaan teratur dari awal bel pagi hingga kepulangan sekolah:',
    keyPoints: [
      {
        title: 'Gerakan Sekolah Sehat (GSS)',
        desc: 'Penerapan 5 Sehat: Sehat Bergizi, Sehat Fisik (senam pagi Jumat), Sehat Imunisasi (BIAS), Sehat Jiwa, dan Sehat Lingkungan Sanitasi.',
        tag: 'GSS'
      },
      {
        title: '7 Kebiasaan Anak Indonesia Hebat (7 KAIH)',
        desc: 'Bangun pagi, taat ibadah, olahraga rutin, makan bergizi seimbang, gemar membaca buku, aktif bermasyarakat, dan tidur cukup waktu.',
        tag: '7 KAIH'
      },
      {
        title: 'Program Makan Bergizi (MBG)',
        desc: 'Pendampingan konsumsi pangan sehat, pantauan gizi harian murid, edukasi cuci tangan pakai sabun, serta pencegahan anemia anak.',
        tag: 'MBG Seimbang'
      },
      {
        title: 'Upacara Bendera Hari Senin',
        desc: 'Rotasi terjadwal 18 Pembina Upacara (Kepala Sekolah, Guru Kelas 1A-6B, Guru Mapel PJOK & PAIBP) melatih jiwa patriotisme dan kepemimpinan.',
        tag: '18 Pembina Upacara',
        highlight: true
      }
    ],
    quoteOrHighlight: '"Pendidikan karakter yang efektif tidak terjadi di atas kertas ujian, melainkan lahir dari pembiasaan kecil yang konsisten setiap hari."',
    speakerNotes: 'Menyoroti pelaksanaan 18 pembina upacara khusus guru & guru mapel yang sudah tersusun rapi dalam dokumen KSP sekolah.'
  },
  {
    id: 11,
    slideNumber: '11/12',
    category: 'Pengembangan GTK',
    title: 'KOMUNITAS BELAJAR (KOMBEL) & PENGEMBANGAN GURU',
    subtitle: 'Wadah Inovasi, Kolaborasi, dan Refleksi Berkala Pendidik Profesional',
    badge: 'KOMBEL GURU',
    iconName: 'Users',
    lead: 'Kombel UPTD SDN 5 Barandasi menjadi ruang tumbuh 20 guru dan tendik untuk saling menguatkan kualitas pembelajaran murid.',
    keyPoints: [
      {
        title: 'Pertemuan Rutin Mingguan',
        desc: 'Setiap pekan guru kelas dan guru mapel berkumpul menelaah modul ajar, asesmen formatif, serta mendiskusikan murid yang butuh intervensi khusus.',
        tag: 'Kombel Rutin',
        highlight: true
      },
      {
        title: 'Siklus Inkuiri Kolaboratif',
        desc: 'Menerapkan siklus 4 langkah: Rencanakan (Plan) Pembelajaran -> Laksanakan (Do) & Observasi Sejawat -> Evaluasi Asesmen (Check) -> Refleksi Bersama (Act).',
        tag: 'Siklus Inkuiri'
      },
      {
        title: 'Pemanfaatan Platform Merdeka Mengajar (PMM)',
        desc: 'Menuntaskan pelatihan mandiri, mengunggah bukti karya, webinar berbagi praktik baik, serta integrasi pengelolaan kinerja guru.',
        tag: 'PMM Digital'
      },
      {
        title: 'Kolaborasi Guru Kelas & Guru Mapel',
        desc: 'Harmonisasi materi antara guru kelas dengan guru mapel PJOK dan Pendidikan Agama Islam demi capaian utuh Profil Pelajar Pancasila.',
        tag: 'Sinergi Guru'
      }
    ],
    metrics: [
      { label: 'Jumlah Pendidik', value: '20 GTK', desc: 'Aktif dalam Kombel' },
      { label: 'Jadwal Kombel', value: 'Tiap Sabtu', desc: 'Refleksi pasca mengajar' },
      { label: 'Modul Ajar Berbagi', value: '100% Mandiri', desc: 'Karya kolektif guru' },
      { label: 'Rapor Pendidikan', value: 'Zona Hijau', desc: 'Peningkatan mutu capaian' }
    ],
    speakerNotes: 'Menunjukkan bahwa KSP SDN 5 Barandasi didukung oleh tenaga pendidik yang terus belajar, reflektif, dan berorientasi pada kemajuan anak didik.'
  },
  {
    id: 12,
    slideNumber: '12/12',
    category: 'Asesmen & Pengesahan',
    title: 'EVALUASI, PENDAMPINGAN, & PENGESAHAN DOKUMEN KSP',
    subtitle: 'Siklus Evaluasi Berkelanjutan Menjamin Mutu Pendidikan Berkelanjutan',
    badge: 'PENGESAHAN KSP',
    iconName: 'CheckCircle2',
    lead: 'Dokumen KSP UPTD SDN 5 Barandasi dievaluasi secara berkala dengan melibatkan seluruh pemangku kepentingan.',
    keyPoints: [
      {
        title: 'Sistem Asesmen Berimbang',
        desc: 'Memadukan Asesmen Awal (Diagnostik), Asesmen Formatif (selama proses untuk perbaikan), Asesmen Sumatif (capaian akhir), dan ANBK (Asesmen Nasional Kelas 5).',
        tag: 'Asesmen Komprehensif'
      },
      {
        title: 'Evaluasi KSP 6 Bulanan & Tahunan',
        desc: 'Refleksi berkala berbasis data Rapor Pendidikan, umpan balik komite sekolah, dan hasil observasi kelas untuk menyempurnakan kurikulum tahun berikutnya.',
        tag: 'Evaluasi Mutu'
      },
      {
        title: 'Sinergi Lintas Sektor',
        desc: 'Didampingi oleh Pengawas Pembina Disdikbud Maros, Puskesmas Lau untuk program UKS/GSS, Polsek/Koramil untuk ketertiban, dan Pusdatin Maros.',
        tag: 'Mitra Strategis'
      },
      {
        title: 'Penetapan & Pengesahan Resmi KSP',
        desc: 'Disusun oleh Tim Pengembang Kurikulum (TPK), disetujui Komite Sekolah, ditetapkan Kepala Satuan Pendidikan Hadijah, S.Pd., M.Pd., dan disahkan oleh Dinas Pendidikan dan Kebudayaan Kabupaten Maros.',
        tag: 'Legalitas Resmi',
        highlight: true
      }
    ],
    quoteOrHighlight: '"Dengan memohon ridho Allah SWT, Kurikulum Operasional Satuan Pendidikan (KSP) UPTD SDN 5 Barandasi disahkan dan diberlakukan secara resmi untuk mewujudkan generasi emas bangsa."',
    speakerNotes: 'Slide penutup presentasi KSP yang merangkum siklus evaluasi mutu berkelanjutan serta legalitas pengesahan resmi oleh Kepala Satuan Pendidikan dan Dinas Pendidikan dan Kebudayaan Kabupaten Maros.'
  }
];
