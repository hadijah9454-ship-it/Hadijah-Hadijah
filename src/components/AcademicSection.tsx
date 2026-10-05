import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Clock, Atom, Globe, Award, Sparkles, 
  Search, CheckCircle2, ChevronRight, FileText, Download, Flag, ShieldCheck, UserCheck,
  Target, Compass, ExternalLink, Maximize2
} from 'lucide-react';
import { SCHOOL_MAJORS, CALENDAR_ITEMS, PEMBINA_UPACARA_LIST, SCHOOL_VISION, SCHOOL_MISSIONS } from '../data/schoolData';
import { KspSlidePresentation } from './KspSlidePresentation';

export const AcademicSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [selectedClass, setSelectedClass] = useState<'Kelas 1A (Fase A)' | 'Kelas 4A (Fase B)' | 'Kelas 6A (Fase C)'>('Kelas 1A (Fase A)');
  const [pembinaCategory, setPembinaCategory] = useState<string>('Semua');
  const [pembinaSearch, setPembinaSearch] = useState<string>('');

  const filteredPembina = PEMBINA_UPACARA_LIST.filter((p) => {
    const matchesCategory = pembinaCategory === 'Semua' || p.category === pembinaCategory;
    const matchesSearch = p.name.toLowerCase().includes(pembinaSearch.toLowerCase()) ||
                          p.role.toLowerCase().includes(pembinaSearch.toLowerCase()) ||
                          p.nip.toLowerCase().includes(pembinaSearch.toLowerCase()) ||
                          p.status.toLowerCase().includes(pembinaSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PNS':
        return 'bg-emerald-900 text-emerald-100 border-emerald-700';
      case 'PPPK':
        return 'bg-blue-900 text-blue-100 border-blue-700';
      case 'PW Tendik':
        return 'bg-purple-900 text-purple-100 border-purple-700';
      default:
        return 'bg-amber-900 text-amber-200 border-amber-700';
    }
  };

  // Elementary School Schedule Database for UPTD SDN 5 Barandasi
  const scheduleData = {
    'Kelas 1A (Fase A)': {
      Senin: [
        { time: '07:15 - 08:00', subject: 'Upacara Bendera Senin', teacher: 'Pembina Upacara (Bergilir)', room: 'Lapangan Sekolah' },
        { time: '08:00 - 08:35', subject: 'Pendidikan Pancasila (Adab & Karakter)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
        { time: '08:35 - 09:45', subject: 'Bahasa Indonesia (Pondasi Calistung Bermakna)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
        { time: '10:00 - 11:10', subject: 'Matematika Dasar (Mengenal Angka & Bentuk)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
      ],
      Selasa: [
        { time: '07:30 - 08:40', subject: 'Pendidikan Agama Islam & Budi Pekerti', teacher: 'Muliana, S.Pd., M.Pd.', room: 'Ruang Kelas 1A / Musholla' },
        { time: '08:40 - 09:50', subject: 'Bahasa Indonesia (Membaca Nyaring & Pojok Buku)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Pojok Baca 1A' },
        { time: '10:05 - 11:15', subject: 'Seni Rupa & Prakarya Kearifan Lokal', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
      ],
      Rabu: [
        { time: '07:30 - 08:40', subject: 'Matematika (Numerasi Kontekstual & Bermain)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
        { time: '08:40 - 09:50', subject: 'Pendidikan Pancasila (Kerukunan & Toleransi)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
        { time: '10:05 - 11:15', subject: 'Projek P5 (Gaya Hidup Berkelanjutan - Sampah Plastik)', teacher: 'Tim Fasilitator P5', room: 'Taman Adiwiyata' },
      ],
      Kamis: [
        { time: '07:15 - 08:35', subject: 'PJOK (Kebugaran Gerak Dasar & GSS)', teacher: 'Nawir, S.Pd.', room: 'Lapangan Olahraga' },
        { time: '08:35 - 09:45', subject: 'Bahasa Daerah Bugis-Makassar (Kata Sapaan Santun)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
        { time: '10:00 - 11:10', subject: 'Edukasi Budaya Sekolah Aman & Nyaman (BSAN)', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
      ],
      Jumat: [
        { time: '07:15 - 08:00', subject: 'Senam Pagi Anak Indonesia Hebat & GSS', teacher: 'Guru Olahraga & Wali Kelas', room: 'Lapangan Utama' },
        { time: '08:00 - 08:45', subject: 'Program Makan Bergizi (MBG) Bersama & Cuci Tangan', teacher: 'Hastuti, S.Pd., Gr.', room: 'Ruang Kelas 1A' },
        { time: '09:00 - 10:10', subject: 'Jumat Ibadah / Pembinaan Akhlak Mulia', teacher: 'Muliana, S.Pd., M.Pd.', room: 'Musholla Sekolah' },
      ]
    },
    'Kelas 4A (Fase B)': {
      Senin: [
        { time: '07:15 - 08:00', subject: 'Upacara Bendera Senin', teacher: 'Pembina Upacara (Bergilir)', room: 'Lapangan Utama' },
        { time: '08:00 - 09:10', subject: 'IPAS (Bagian Tubuh Tumbuhan & Ekosistem Maros)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
        { time: '09:30 - 10:40', subject: 'Bahasa Indonesia (Teks Informasi & Wawancara)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
        { time: '10:40 - 11:50', subject: 'Matematika (Pecahan & Pengukuran Luas)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
      ],
      Selasa: [
        { time: '07:30 - 08:40', subject: 'Pendidikan Agama Islam & Budi Pekerti', teacher: 'Nursaida, S.Pd.I.', room: 'Ruang Kelas 4A' },
        { time: '08:40 - 09:50', subject: 'IPAS (Wujud Zat & Perubahannya)', teacher: 'Agustina, S.Pd.I.', room: 'Laboratorium Mini' },
        { time: '10:10 - 11:20', subject: 'Pendidikan Pancasila (Nilai Integritas & IPAK)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
        { time: '11:20 - 12:30', subject: 'Bahasa Daerah (Aksara Lontara\' & Ungkapan Maros)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
      ],
      Rabu: [
        { time: '07:30 - 08:40', subject: 'Matematika (Statistik Sederhana & Diagram)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
        { time: '08:40 - 09:50', subject: 'Bahasa Indonesia (Menulis Narasi Lingkungan Hidup)', teacher: 'Agustina, S.Pd.I.', room: 'Ruang Kelas 4A' },
        { time: '10:10 - 12:00', subject: 'Projek P5 (Kearifan Lokal - Permainan Tradisional)', teacher: 'Tim P5 Barandasi', room: 'Aula & Lapangan' },
      ],
      Kamis: [
        { time: '07:15 - 08:40', subject: 'PJOK (Atletik Dasar & Perilaku Sehat IKAN)', teacher: 'Mustaid, S.Pd.', room: 'Lapangan Olahraga' },
        { time: '09:00 - 10:10', subject: 'Seni Musik & Tari Daerah Bugis-Makassar', teacher: 'Agustina, S.Pd.I.', room: 'Sanggar Seni' },
        { time: '10:10 - 11:20', subject: 'Pendidikan Lingkungan Hidup (Adiwiyata & Kompos)', teacher: 'Agustina, S.Pd.I.', room: 'Kebun Sekolah' },
      ],
      Jumat: [
        { time: '07:15 - 08:00', subject: 'Senam GSS & 7 Kebiasaan Anak Indonesia Hebat', teacher: 'Mustaid, S.Pd.', room: 'Lapangan Utama' },
        { time: '08:00 - 08:45', subject: 'Sarapan Sehat Program MBG & Edukasi Gizi', teacher: 'Wali Kelas & UKS', room: 'Ruang Kelas 4A' },
        { time: '09:00 - 10:15', subject: 'Tadarrus Al-Qur\'an & Kajian Karakter Islami', teacher: 'Nursaida, S.Pd.I.', room: 'Musholla Babussalam' },
        { time: '10:15 - 11:15', subject: 'Kepramukaan Penggalang Siaga', teacher: 'Pembina Pramuka', room: 'Area Terbuka' },
      ]
    },
    'Kelas 6A (Fase C)': {
      Senin: [
        { time: '07:15 - 08:00', subject: 'Upacara Bendera Senin', teacher: 'Pembina Upacara (Bergilir)', room: 'Lapangan Utama' },
        { time: '08:00 - 09:15', subject: 'IPAS (Tata Surya & Eksplorasi Luar Angkasa)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '09:35 - 10:50', subject: 'Bahasa Indonesia (Teks Eksplanasi Ilmiah)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '10:50 - 12:05', subject: 'Matematika (Bangun Ruang & Analisis Data)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
      ],
      Selasa: [
        { time: '07:30 - 08:45', subject: 'Pendidikan Agama Islam & Budi Pekerti', teacher: 'Muliana, S.Pd., M.Pd.', room: 'Ruang Kelas 6A' },
        { time: '08:45 - 10:00', subject: 'Pendidikan Pancasila (Persatuan & Bela Negara)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '10:20 - 11:35', subject: 'Literasi Digital & Latihan Asesmen ANBK', teacher: 'Mantasia, S.Pd.', room: 'Lab Komputer ANBK' },
        { time: '11:35 - 12:45', subject: 'Bahasa Daerah Bugis-Makassar (Sastra & Pidato)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
      ],
      Rabu: [
        { time: '07:30 - 08:45', subject: 'Matematika (Pemecahan Masalah Logika Kritis)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '08:45 - 10:00', subject: 'IPAS (Kelestarian Lingkungan & Konservasi Maros)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '10:20 - 12:00', subject: 'Projek P5 (Bangun Jiwa Raga - Kampanye BSAN)', teacher: 'Tim Fasilitator P5', room: 'Aula Pertemuan' },
      ],
      Kamis: [
        { time: '07:15 - 08:40', subject: 'PJOK (Senam Ketangkasan & Edukasi Anti Narkoba IKAN)', teacher: 'Nawir, S.Pd.', room: 'Lapangan Olahraga' },
        { time: '09:00 - 10:15', subject: 'Bahasa Inggris Dasar (Percakapan & Vocabulary)', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '10:15 - 11:30', subject: 'Seni Budaya & Prakarya Produk Daur Ulang', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
      ],
      Jumat: [
        { time: '07:15 - 08:00', subject: 'Senam Kebugaran Jasmani GSS & Jalan Sehat', teacher: 'Nawir, S.Pd.', room: 'Lapangan Utama' },
        { time: '08:00 - 08:45', subject: 'Sarapan Sehat MBG & Refleksi 7 Kebiasaan Hebat', teacher: 'Mantasia, S.Pd.', room: 'Ruang Kelas 6A' },
        { time: '09:00 - 10:15', subject: 'Kultum & Bimbingan Mental Transisi SMP', teacher: 'Muliana, S.Pd., M.Pd.', room: 'Musholla Sekolah' },
        { time: '10:15 - 11:30', subject: 'Ekstrakurikuler Wajib Pramuka Penggalang', teacher: 'Pembina Pramuka', room: 'Halaman Sekolah' },
      ]
    }
  };

  const currentSchedule = scheduleData[selectedClass]?.[selectedDay] || [];

  return (
    <section id="akademik" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-[1px] w-8 bg-indigo-900" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
              KURIKULUM OPERASIONAL & AKADEMIK
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-indigo-950 tracking-tight">
            DOKUMEN KSP & <span className="font-bold italic text-indigo-900">KURIKULUM OPERASIONAL</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Kurikulum Operasional Satuan Pendidikan (KSP) UPTD SDN 5 Barandasi Tahun Ajaran 2026/2027 berbasis Kurikulum Merdeka yang adaptif, berintegritas tinggi, dan berkarakter ekologis.
          </p>
        </div>

        {/* Featured Professional KSP Slide Deck */}
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-indigo-950 text-amber-300 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                  SLIDE PRESENTASI RESMI
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  12 Slide Komprehensif
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-950 tracking-tight uppercase">
                SLIDE DOKUMEN KSP UPTD SDN 5 BARANDASI
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
                Cetak biru kurikulum mencakup Visi, 7 Misi Strategis, 8 Dimensi Lulusan, Pendekatan Deep Learning, Kurikulum Khusus (BSAN, IKAN, IPAK, Adiwiyata), Gerakan Sekolah Sehat (GSS & MBG), serta Kombel Guru.
              </p>
            </div>
          </div>

          {/* Interactive Slide Player */}
          <KspSlidePresentation />

        </div>

        {/* Program Keahlian / Jurusan */}
        <div className="grid md:grid-cols-3 gap-6">
          {SCHOOL_MAJORS.map((major) => (
            <div 
              key={major.code}
              className="bg-white rounded-sm p-6 border border-slate-200 hover:border-indigo-900 transition-all flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-900 text-amber-400 rounded-sm flex items-center justify-center font-bold text-sm">
                  {major.code}
                </div>
                <h3 className="text-lg font-bold uppercase text-indigo-950">{major.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{major.description}</p>
                
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Mata Pelajaran Unggulan:
                  </span>
                  <div className="space-y-1.5">
                    {major.subjects.map((subj, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-sm border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-900 shrink-0" />
                        <span>{subj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Schedule & Academic Calendar Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Schedule Lookup */}
          <div className="lg:col-span-7 bg-slate-50 rounded-sm p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-900" />
                  <span>Jadwal Pelajaran Siswa</span>
                </h3>
                <p className="text-xs text-slate-500">Pilih kelas dan hari untuk melihat jadwal kegiatan KBM.</p>
              </div>

              {/* Class Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-slate-200 overflow-x-auto">
                {(['Kelas 1A (Fase A)', 'Kelas 4A (Fase B)', 'Kelas 6A (Fase C)'] as const).map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      selectedClass === cls
                        ? 'bg-indigo-900 text-white'
                        : 'text-slate-600 hover:text-indigo-900'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    selectedDay === day
                      ? 'bg-indigo-900 text-amber-300 font-bold'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule List */}
            <div className="space-y-2.5">
              {currentSchedule.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">Jadwal tidak ditemukan.</p>
              ) : (
                currentSchedule.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white rounded-sm border border-slate-200 hover:border-indigo-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-indigo-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-indigo-950">{item.subject}</h4>
                        <p className="text-[11px] text-slate-500">{item.teacher}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs gap-1 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                      <span className="font-bold text-indigo-900 text-xs">{item.time}</span>
                      <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Ruang: {item.room}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Academic Calendar Sidebar */}
          <div className="lg:col-span-5 bg-indigo-950 text-white rounded-sm p-6 sm:p-8 border border-indigo-900 space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  AGENDA SEMESTER
                </span>
              </div>
              <h3 className="text-xl font-bold uppercase text-white tracking-tight">Kalender Akademik 2026/2027</h3>
            </div>

            <div className="space-y-3">
              {CALENDAR_ITEMS.map((item, idx) => (
                <div key={idx} className="bg-indigo-900/80 border border-indigo-800 rounded-sm p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">{item.date}</span>
                    <span className="text-[10px] font-bold uppercase bg-indigo-950 text-slate-300 px-2 py-0.5 rounded-sm border border-indigo-800">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button 
                onClick={() => alert('File Kalender Akademik PDF 2026/2027 siap diunduh!')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-sm text-xs uppercase tracking-widest border border-indigo-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>UNDUH KALENDER (PDF)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Daftar Pembina Upacara Bendera Section */}
        <div className="bg-slate-50 rounded-sm p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Flag className="w-4 h-4 text-indigo-900" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-900">
                  JADWAL RESMI UPACARA BENDERA HARI SENIN
                </span>
              </div>
              <h3 className="text-2xl font-light text-indigo-950 tracking-tight">
                DAFTAR <span className="font-bold italic text-indigo-900">PEMBINA UPACARA</span> (GURU & GURU MAPEL)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Daftar resmi pembina upacara bendera khusus Kepala Sekolah, Guru Kelas (Fase A–C), dan Guru Mata Pelajaran (PJOK & PAIBP) UPTD SDN 5 Barandasi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-slate-200 overflow-x-auto">
                {['Semua', 'Kepala Sekolah', 'Guru Kelas', 'Guru Mapel'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPembinaCategory(cat)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                      pembinaCategory === cat
                        ? 'bg-indigo-900 text-white'
                        : 'text-slate-600 hover:text-indigo-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama / NIP / tugas..."
                  value={pembinaSearch}
                  onChange={(e) => setPembinaSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-indigo-900 w-full sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-sm border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-indigo-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                18
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Pembina</span>
                <span className="text-xs font-bold text-indigo-950">Guru & Guru Mapel</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-sm border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-indigo-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Kepala Sekolah</span>
                <span className="text-xs font-bold text-indigo-950">Pembina Utama</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-sm border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-indigo-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                13
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Guru Kelas</span>
                <span className="text-xs font-bold text-indigo-950">Kelas 1A - 6B</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-sm border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Guru Mapel</span>
                <span className="text-xs font-bold text-indigo-950">PJOK & PAIBP</span>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-sm bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-indigo-950 text-white uppercase font-bold tracking-wider text-[11px]">
                  <th className="py-3 px-4 border-b border-indigo-900 text-center w-12">No</th>
                  <th className="py-3 px-4 border-b border-indigo-900">Nama Pembina Upacara</th>
                  <th className="py-3 px-4 border-b border-indigo-900">NIP</th>
                  <th className="py-3 px-4 border-b border-indigo-900">Jabatan / Tugas</th>
                  <th className="py-3 px-4 border-b border-indigo-900">Kategori</th>
                  <th className="py-3 px-4 border-b border-indigo-900">Status</th>
                  <th className="py-3 px-4 border-b border-indigo-900 text-right">Giliran Upacara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPembina.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      Tidak ada data pembina upacara yang sesuai pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredPembina.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-indigo-900 bg-slate-50/50">
                        {item.no}
                      </td>
                      <td className="py-3 px-4 font-bold text-indigo-950 text-xs">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {item.nip}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-indigo-950 text-amber-300 font-bold px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider">
                          {item.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-semibold text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-indigo-900 text-[11px]">
                        {item.schedulePeriod}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid md:hidden gap-3">
            {filteredPembina.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center bg-white rounded-sm border border-slate-200">
                Tidak ada pembina upacara yang cocok dengan kata kunci.
              </p>
            ) : (
              filteredPembina.map((item) => (
                <div key={item.no} className="bg-white p-4 rounded-sm border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-sm bg-indigo-900 text-amber-300 font-bold text-xs flex items-center justify-center">
                      {item.no}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-indigo-950">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">NIP. {item.nip}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
                    <span className="bg-indigo-950 text-amber-300 font-bold px-2 py-0.5 rounded-sm text-[10px] uppercase">
                      {item.role}
                    </span>
                    <span className="text-slate-600 text-[11px] ml-auto font-semibold">
                      {item.schedulePeriod}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
