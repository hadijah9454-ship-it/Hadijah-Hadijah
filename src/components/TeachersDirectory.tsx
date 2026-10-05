import React, { useState, useEffect } from 'react';
import { 
  Users, Search, GraduationCap, Mail, BookOpen, Quote, 
  Award, X, CheckCircle2, FileText, ExternalLink, Camera, Sparkles, Upload, UserCheck 
} from 'lucide-react';
import { 
  TEACHERS_LIST,
  INFO_GTK_URL, SIM_PKB_URL, MY_ASN_URL, SIBI_BUKU_URL,
  RAPOR_PENDIDIKAN_URL, RUMAH_PENDIDIKAN_URL 
} from '../data/schoolData';
import { Teacher } from '../types';
import { 
  getStoredTeacherPhotos, getTeacherEffectivePhoto, 
  saveTeacherPhoto, compressImageFile, PHOTO_UPDATED_EVENT 
} from '../utils/teacherPhotoStore';
import { setActiveSelectedTeacher } from '../utils/studentAttendanceStore';
import { TeacherPhotoModal } from './TeacherPhotoModal';

export const TeachersDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoTeacherId, setSelectedPhotoTeacherId] = useState<string | null>(null);

  // Sync custom photos with local store & events
  useEffect(() => {
    setCustomPhotos(getStoredTeacherPhotos());
    const handler = () => {
      setCustomPhotos(getStoredTeacherPhotos());
    };
    window.addEventListener(PHOTO_UPDATED_EVENT, handler);
    return () => window.removeEventListener(PHOTO_UPDATED_EVENT, handler);
  }, []);

  const categories = ['Semua', 'MIPA', 'IPS', 'Bahasa', 'Seni & Bimbingan'];

  const filteredTeachers = TEACHERS_LIST.filter((teacher) => {
    const matchesCategory = selectedCategory === 'Semua' || teacher.category === selectedCategory;
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacher.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (teacher.status && teacher.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          teacher.education.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PNS':
        return 'bg-emerald-900 text-emerald-100 border-emerald-700';
      case 'PPPK':
        return 'bg-blue-900 text-blue-100 border-blue-700';
      case 'PW Tendik':
        return 'bg-purple-900 text-purple-100 border-purple-700';
      case 'PW Pengelola Umum Operasional':
        return 'bg-violet-900 text-violet-100 border-violet-700';
      case 'Honor':
        return 'bg-amber-900 text-amber-200 border-amber-700';
      default:
        return 'bg-slate-800 text-slate-100 border-slate-600';
    }
  };

  const customPhotoCount = Object.keys(customPhotos).length;

  return (
    <section id="guru" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-[1px] w-8 bg-indigo-900" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                TENAGA PENDIDIK & KEPENDIDIKAN
              </span>
            </div>
            <h2 className="text-3xl font-light text-indigo-950 tracking-tight">
              DIREKTORI GURU & <span className="font-bold italic text-indigo-900">KEPALA SEKOLAH</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Data Kepala Sekolah, Guru, dan Tenaga Kependidikan UPTD SDN 5 Barandasi resmi tercantum pada dokumen KSP Sekolah.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Photo Paste / Management button */}
            <button
              onClick={() => {
                setSelectedPhotoTeacherId(null);
                setIsPhotoModalOpen(true);
              }}
              className="bg-amber-400 hover:bg-amber-300 text-indigo-950 px-4 py-2.5 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-amber-500 shadow-xs shrink-0 cursor-pointer"
              title="Ganti atau tempel foto guru dan kepala sekolah"
            >
              <Camera className="w-4 h-4 text-indigo-950" />
              <span>Ganti & Tempel Foto Guru ({customPhotoCount})</span>
            </button>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama guru / mapel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-xs focus:outline-none focus:border-indigo-900"
              />
            </div>
          </div>
        </div>

        {/* Quick Portal Toolbar for GTK & ASN */}
        <div className="bg-indigo-950 text-slate-200 p-3 sm:p-4 rounded-sm border border-indigo-900 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider shrink-0">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Portal Layanan GTK & ASN:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <a href={INFO_GTK_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-900/80 hover:bg-amber-400 hover:text-indigo-950 px-2.5 py-1 rounded-sm border border-indigo-800 transition-colors flex items-center gap-1">
              <span>INFO GTK</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
            <a href={SIM_PKB_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-900/80 hover:bg-amber-400 hover:text-indigo-950 px-2.5 py-1 rounded-sm border border-indigo-800 transition-colors flex items-center gap-1">
              <span>SIM PKB</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
            <a href={MY_ASN_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-900/80 hover:bg-amber-400 hover:text-indigo-950 px-2.5 py-1 rounded-sm border border-indigo-800 transition-colors flex items-center gap-1">
              <span>My ASN BKN</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
            <a href={SIBI_BUKU_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-900/80 hover:bg-amber-400 hover:text-indigo-950 px-2.5 py-1 rounded-sm border border-indigo-800 transition-colors flex items-center gap-1">
              <span>SIBI Buku</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
            <a href={RAPOR_PENDIDIKAN_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-900/80 hover:bg-amber-400 hover:text-indigo-950 px-2.5 py-1 rounded-sm border border-indigo-800 transition-colors flex items-center gap-1">
              <span>Rapor Pendidikan</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
            <a href={RUMAH_PENDIDIKAN_URL} target="_blank" rel="noopener noreferrer" className="bg-indigo-900/80 hover:bg-amber-400 hover:text-indigo-950 px-2.5 py-1 rounded-sm border border-indigo-800 transition-colors flex items-center gap-1">
              <span>Rumah Pendidikan</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-indigo-900 text-amber-300 border-indigo-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Rumpun {cat}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-indigo-900" />
            <span>Arahkan kursor ke foto guru atau klik tombol kamera untuk mengganti / menempelkan foto.</span>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => {
            const hasCustomPhoto = Boolean(customPhotos[teacher.id]);
            const effectivePhoto = getTeacherEffectivePhoto(teacher, customPhotos);

            return (
              <div
                key={teacher.id}
                onClick={() => setActiveTeacher(teacher)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    try {
                      const compressed = await compressImageFile(file);
                      saveTeacherPhoto(teacher.id, compressed);
                    } catch (err) {
                      console.error('Failed to save dropped photo', err);
                    }
                  }
                }}
                className="bg-white rounded-sm p-5 border border-slate-200 hover:border-indigo-900 transition-all flex flex-col justify-between group cursor-pointer shadow-xs relative"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Teacher Photo with Camera Overlay */}
                    <div className="relative group/photo shrink-0">
                      <img
                        src={effectivePhoto}
                        alt={teacher.name}
                        className="w-20 h-20 rounded-sm object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhotoTeacherId(teacher.id);
                          setIsPhotoModalOpen(true);
                        }}
                        title="Klik untuk ganti / tempel foto guru ini"
                        className="absolute inset-0 bg-indigo-950/75 text-amber-300 rounded-sm opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold transition-opacity cursor-pointer p-1 text-center"
                      >
                        <Camera className="w-4 h-4 mb-0.5 text-amber-300" />
                        <span>Ganti Foto</span>
                      </button>
                      {hasCustomPhoto && (
                        <span 
                          className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs" 
                          title="Foto kustom tersimpan"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-indigo-950 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                          {teacher.subject}
                        </span>
                        {teacher.status && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${getStatusColor(teacher.status)}`}>
                            {teacher.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold tracking-tight text-indigo-950 mt-1 line-clamp-1 group-hover:text-indigo-900 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono truncate">NIP. {teacher.nip}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-start gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-900 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium">{teacher.education}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{teacher.experience}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-sm italic text-slate-700 text-xs border border-slate-200">
                    "{teacher.quote}"
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-900 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-[11px] lowercase text-slate-500 font-normal truncate max-w-[170px]">
                    <Mail className="w-3.5 h-3.5 text-indigo-900 shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform shrink-0">Profil Detail →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Teacher Detail Modal */}
        {activeTeacher && (
          <div className="fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6 relative border border-slate-200 shadow-2xl">
              <button
                onClick={() => setActiveTeacher(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative group/modalphoto shrink-0">
                  <img
                    src={getTeacherEffectivePhoto(activeTeacher, customPhotos)}
                    alt={activeTeacher.name}
                    className="w-24 h-24 rounded-sm object-cover border-2 border-indigo-900"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => {
                      setSelectedPhotoTeacherId(activeTeacher.id);
                      setIsPhotoModalOpen(true);
                      setActiveTeacher(null);
                    }}
                    className="absolute inset-0 bg-indigo-950/80 text-amber-300 rounded-sm opacity-0 group-hover/modalphoto:opacity-100 flex flex-col items-center justify-center text-[11px] font-bold transition-opacity cursor-pointer p-1"
                  >
                    <Camera className="w-5 h-5 mb-1 text-amber-300" />
                    <span>Ganti Foto</span>
                  </button>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="bg-indigo-950 text-amber-400 text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                      {activeTeacher.subject}
                    </span>
                    {activeTeacher.status && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider ${getStatusColor(activeTeacher.status)}`}>
                        {activeTeacher.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-indigo-950">{activeTeacher.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. {activeTeacher.nip}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-sm border border-slate-200">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[11px]">Status Kepegawaian:</span>
                    <span className="font-extrabold text-indigo-900">{activeTeacher.status || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[11px]">Kualifikasi:</span>
                    <span className="font-extrabold text-indigo-900">{activeTeacher.qualification || '-'}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-indigo-950 uppercase tracking-wider block">Tugas / Jabatan:</span>
                  <p className="font-semibold text-slate-800">{activeTeacher.subject}</p>
                </div>
                <div>
                  <span className="font-bold text-indigo-950 uppercase tracking-wider block">Pendidikan Terakhir:</span>
                  <p>{activeTeacher.education}</p>
                </div>
                <div>
                  <span className="font-bold text-indigo-950 uppercase tracking-wider block">Pengalaman & Pengabdian:</span>
                  <p>{activeTeacher.experience}</p>
                </div>
                <div>
                  <span className="font-bold text-indigo-950 uppercase tracking-wider block">Email Resmi:</span>
                  <p className="text-indigo-900 font-semibold">{activeTeacher.email}</p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-sm border border-amber-200 italic text-slate-800 text-xs">
                "{activeTeacher.quote}"
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveSelectedTeacher(activeTeacher.id);
                    setActiveTeacher(null);
                    const absensiEl = document.getElementById('absensi');
                    if (absensiEl) {
                      absensiEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2.5 rounded-sm text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border border-indigo-800 shadow-xs"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Buka Presensi & Pantau Kehadiran ({activeTeacher.name})</span>
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedPhotoTeacherId(activeTeacher.id);
                      setIsPhotoModalOpen(true);
                      setActiveTeacher(null);
                    }}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold py-2.5 rounded-sm text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border border-amber-500 shadow-xs"
                  >
                    <Camera className="w-4 h-4 text-indigo-950" />
                    <span>Ganti Foto Guru</span>
                  </button>

                  <button
                    onClick={() => setActiveTeacher(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-6 rounded-sm text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Photo Manager / Paste Modal */}
        <TeacherPhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          initialTeacherId={selectedPhotoTeacherId}
        />

      </div>
    </section>
  );
};

