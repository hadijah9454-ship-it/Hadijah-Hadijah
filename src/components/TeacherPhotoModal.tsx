import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Image as ImageIcon, Check, RefreshCw, Trash2, 
  Sparkles, Camera, Clipboard, AlertCircle, FileCheck, Layers, Link as LinkIcon 
} from 'lucide-react';
import { TEACHERS_LIST } from '../data/schoolData';
import { Teacher } from '../types';
import { 
  getStoredTeacherPhotos, saveTeacherPhoto, removeTeacherPhoto, 
  clearAllTeacherPhotos, compressImageFile, matchTeacherByFilename, 
  REQUESTED_TEACHER_NAMES, getTeacherEffectivePhoto
} from '../utils/teacherPhotoStore';

interface TeacherPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTeacherId?: string | null;
}

// 14 prioritized teacher IDs matching user request
const PRIORITY_TEACHER_IDS = [
  't1',  // Hadijah (Kepsek)
  't17', // Muliana
  't2',  // Hastuti
  't6',  // Rosmiati
  't12', // Nurhasanah
  't14', // Nurliati
  't7',  // Dewi Novita (Novita Dewi)
  't5',  // Nurlela (Nurlaela)
  't9',  // Agustina
  't11', // Nelly Arif
  't8',  // Rezky Auliah (Resky Aulia)
  't18', // Nursaida
  't4',  // Badaruddin
  't10'  // Rasmi
];

export const TeacherPhotoModal: React.FC<TeacherPhotoModalProps> = ({
  isOpen,
  onClose,
  initialTeacherId
}) => {
  const [photosMap, setPhotosMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'priority' | 'all'>('priority');
  const [targetedTeacherId, setTargetedTeacherId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInputTeacherId, setUrlInputTeacherId] = useState<string | null>(null);
  const [urlInputValue, setUrlInputValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const singleTeacherFileRef = useRef<HTMLInputElement>(null);

  // Load photos on mount / open
  useEffect(() => {
    if (isOpen) {
      setPhotosMap(getStoredTeacherPhotos());
      if (initialTeacherId) {
        setTargetedTeacherId(initialTeacherId);
        // Switch tab if targeted teacher is not in priority
        if (!PRIORITY_TEACHER_IDS.includes(initialTeacherId)) {
          setActiveTab('all');
        }
      }
    }
  }, [isOpen, initialTeacherId]);

  // Global paste handler when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const targetId = targetedTeacherId || (activeTab === 'priority' ? PRIORITY_TEACHER_IDS[0] : TEACHERS_LIST[0].id);
            const targetTeacher = TEACHERS_LIST.find(t => t.id === targetId);
            
            try {
              setIsProcessing(true);
              const compressed = await compressImageFile(file);
              saveTeacherPhoto(targetId, compressed);
              setPhotosMap(getStoredTeacherPhotos());
              setStatusMessage({
                type: 'success',
                text: `Foto dari clipboard berhasil ditempel untuk ${targetTeacher?.name || 'Guru'}!`
              });
            } catch (err) {
              setStatusMessage({
                type: 'error',
                text: 'Gagal memproses gambar dari clipboard.'
              });
            } finally {
              setIsProcessing(false);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, targetedTeacherId, activeTab]);

  if (!isOpen) return null;

  // Single teacher photo file change
  const handleSingleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, teacherId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressed = await compressImageFile(file);
      saveTeacherPhoto(teacherId, compressed);
      setPhotosMap(getStoredTeacherPhotos());
      const teacher = TEACHERS_LIST.find(t => t.id === teacherId);
      setStatusMessage({
        type: 'success',
        text: `Foto baru berhasil disimpan untuk ${teacher?.name}!`
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Gagal memproses foto. Pastikan format JPG, PNG, atau WebP.'
      });
    } finally {
      setIsProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  // Batch files upload (matches by filename)
  const handleBatchFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    let matchedCount = 0;
    const unmatchedNames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const matchedTeacher = matchTeacherByFilename(file.name);
      if (matchedTeacher) {
        try {
          const compressed = await compressImageFile(file);
          saveTeacherPhoto(matchedTeacher.id, compressed);
          matchedCount++;
        } catch (err) {
          console.error(`Error saving ${file.name}`, err);
        }
      } else {
        unmatchedNames.push(file.name);
      }
    }

    setPhotosMap(getStoredTeacherPhotos());
    setIsProcessing(false);

    if (matchedCount > 0) {
      setStatusMessage({
        type: 'success',
        text: `${matchedCount} foto berhasil dicocokkan otomatis berdasarkan nama dan tersimpan!`
      });
    } else {
      setStatusMessage({
        type: 'info',
        text: 'Tidak ada nama guru yang cocok secara otomatis pada nama berkas foto.'
      });
    }
  };

  // Remove photo for single teacher
  const handleRemovePhoto = (teacherId: string) => {
    removeTeacherPhoto(teacherId);
    setPhotosMap(getStoredTeacherPhotos());
    setStatusMessage({
      type: 'info',
      text: 'Foto kustom dihapus dan dikembalikan ke foto bawaan.'
    });
  };

  // Apply URL photo
  const handleApplyUrl = (teacherId: string) => {
    if (!urlInputValue.trim()) return;
    saveTeacherPhoto(teacherId, urlInputValue.trim());
    setPhotosMap(getStoredTeacherPhotos());
    setUrlInputTeacherId(null);
    setUrlInputValue('');
    setStatusMessage({
      type: 'success',
      text: 'Foto dari tautan URL berhasil disimpan!'
    });
  };

  // Filter list by tab
  const displayTeachers = activeTab === 'priority'
    ? PRIORITY_TEACHER_IDS.map(id => TEACHERS_LIST.find(t => t.id === id)).filter(Boolean) as Teacher[]
    : TEACHERS_LIST;

  const customPhotoCount = Object.keys(photosMap).length;

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-4xl w-full my-auto flex flex-col max-h-[92vh] border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between border-b border-indigo-900 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-indigo-950 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                Manajemen Foto Guru & Tendik
              </span>
              {customPhotoCount > 0 && (
                <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {customPhotoCount} Foto Kustom Aktif
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Ganti & Tempel Foto Tenaga Pendidik
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Unggah, seret (drag & drop), atau tempel langsung (Ctrl+V) foto guru UPTD SDN 5 Barandasi. Foto akan otomatis disimpan ke peramban dan langsung tampil di website.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-sm hover:bg-indigo-900 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert / Notification banner */}
        {statusMessage && (
          <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-b shrink-0 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
            statusMessage.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' :
            'bg-blue-50 text-blue-900 border-blue-200'
          }`}>
            <span className="font-medium flex items-center gap-2">
              {statusMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {statusMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600" />}
              {statusMessage.text}
            </span>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold hover:underline cursor-pointer ml-4"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Batch Dropzone & Quick Paste info */}
        <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 shrink-0">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleBatchFiles(e.dataTransfer.files);
              }
            }}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-900 bg-white p-4 rounded-sm text-center transition-all cursor-pointer group flex flex-col sm:flex-row items-center justify-between gap-4"
            onClick={() => batchFileInputRef.current?.click()}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900 shrink-0 group-hover:bg-indigo-900 group-hover:text-amber-400 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-indigo-950">
                  Unggah Banyak Berkas Foto Sekaligus (Batch Upload)
                </p>
                <p className="text-[11px] text-slate-500">
                  Pilih beberapa foto guru sekaligus dari komputer/HP (misal: Muliana.jpg, Hastuti.jpg, Badaruddin.jpg). Sistem akan otomatis mencocokkannya.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="bg-indigo-900 hover:bg-indigo-800 text-amber-300 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider shrink-0 transition-colors pointer-events-none"
            >
              Pilih Berkas Foto
            </button>
            <input
              ref={batchFileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleBatchFiles(e.target.files);
                }
              }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clipboard className="w-3.5 h-3.5 text-indigo-900" />
              Tips Tempel Cepat: Salin gambar foto (Ctrl+C), klik salah satu guru di bawah, lalu tekan <b>Ctrl+V</b> di keyboard.
            </span>
            {customPhotoCount > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Kembalikan semua foto guru ke tampilan standar sekolah?')) {
                    clearAllTeacherPhotos();
                    setPhotosMap({});
                    setStatusMessage({ type: 'info', text: 'Semua foto guru dikembalikan ke bawaan.' });
                  }
                }}
                className="text-rose-700 hover:text-rose-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Semua Foto
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-5 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('priority')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'priority'
                ? 'border-indigo-900 text-indigo-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>14 Guru Permintaan Pengguna ({PRIORITY_TEACHER_IDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'border-indigo-900 text-indigo-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-900" />
            <span>Semua Tenaga Pendidik & Tendik ({TEACHERS_LIST.length})</span>
          </button>
        </div>

        {/* Teachers List / Scrollable Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          <div className="grid sm:grid-cols-2 gap-4">
            {displayTeachers.map((teacher, index) => {
              const hasCustomPhoto = Boolean(photosMap[teacher.id]);
              const effectivePhoto = getTeacherEffectivePhoto(teacher, photosMap);
              const isTargeted = targetedTeacherId === teacher.id;

              return (
                <div
                  key={teacher.id}
                  onClick={() => setTargetedTeacherId(teacher.id)}
                  tabIndex={0}
                  className={`bg-white border rounded-sm p-4 transition-all flex flex-col justify-between space-y-3 cursor-pointer relative group ${
                    isTargeted
                      ? 'border-indigo-900 ring-2 ring-indigo-900/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {/* Priority Order Number Badge */}
                  {activeTab === 'priority' && (
                    <div className="absolute top-2 right-2 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      #{index + 1}
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={effectivePhoto}
                        alt={teacher.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-sm border border-slate-300"
                        referrerPolicy="no-referrer"
                      />
                      {hasCustomPhoto ? (
                        <div 
                          title="Foto kustom tersimpan"
                          className="absolute -top-1.5 -left-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs"
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div 
                          title="Foto bawaan sekolah"
                          className="absolute -top-1.5 -left-1.5 bg-slate-400 text-white rounded-full p-0.5 shadow-xs"
                        >
                          <ImageIcon className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 pr-6 flex-1 min-w-0">
                      <span className="bg-indigo-950 text-amber-300 text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-sm inline-block">
                        {teacher.subject}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-indigo-950 leading-tight truncate" title={teacher.name}>
                        {teacher.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono truncate">NIP. {teacher.nip}</p>
                      
                      <div className="pt-0.5">
                        {hasCustomPhoto ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200 inline-block">
                            ✓ Foto Kustom Aktif
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm inline-block">
                            Foto Bawaan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this teacher */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Upload Button */}
                      <label className="inline-flex items-center gap-1 bg-indigo-900 hover:bg-indigo-800 text-white px-2.5 py-1.5 rounded-sm text-[11px] font-bold transition-colors cursor-pointer uppercase tracking-wider">
                        <Camera className="w-3 h-3 text-amber-300" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSingleFileChange(e, teacher.id)}
                        />
                      </label>

                      {/* URL Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUrlInputTeacherId(urlInputTeacherId === teacher.id ? null : teacher.id);
                        }}
                        className="text-slate-600 hover:text-indigo-900 p-1.5 hover:bg-slate-100 rounded-sm text-xs cursor-pointer"
                        title="Masukkan URL Tautan Foto"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {hasCustomPhoto && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(teacher.id);
                        }}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        title="Kembalikan foto bawaan"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* URL Input Form if active */}
                  {urlInputTeacherId === teacher.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2 bg-slate-50 rounded-sm border border-slate-200 flex items-center gap-2 mt-2"
                    >
                      <input
                        type="url"
                        placeholder="Tempel link URL foto (https://...)"
                        value={urlInputValue}
                        onChange={(e) => setUrlInputValue(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-indigo-900"
                      />
                      <button
                        onClick={() => handleApplyUrl(teacher.id)}
                        className="bg-indigo-900 hover:bg-indigo-800 text-amber-300 px-2 py-1 rounded-sm text-xs font-bold shrink-0"
                      >
                        Terapkan
                      </button>
                    </div>
                  )}

                  {/* Focused Target Helper Hint */}
                  {isTargeted && (
                    <div className="text-[10px] text-indigo-900 bg-indigo-50/70 p-1.5 rounded-sm border border-indigo-200/50 flex items-center justify-between">
                      <span>✓ Siap menerima tempelan clipboard (Ctrl+V)</span>
                      <span className="font-mono text-[9px] uppercase font-bold">Terpilih</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            Pembaruan foto tersimpan di peramban dan otomatis tampil pada direktori profil serta halaman sekolah.
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-6 py-2.5 rounded-sm text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Selesai & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
