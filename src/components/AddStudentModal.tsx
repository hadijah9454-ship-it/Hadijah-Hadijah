import React, { useState } from 'react';
import { X, UserPlus, GraduationCap, Phone, User, Check, Sparkles, AlertCircle } from 'lucide-react';
import { SCHOOL_CLASSES } from '../data/studentAttendanceData';
import { addStudentToClass } from '../utils/studentAttendanceStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultClassId: string;
  onStudentAdded: (studentName: string, className: string) => void;
}

export const AddStudentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultClassId,
  onStudentAdded
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(defaultClassId);
  const [name, setName] = useState<string>('');
  const [nisn, setNisn] = useState<string>('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentClass = SCHOOL_CLASSES.find(c => c.id === selectedClassId) || SCHOOL_CLASSES[0];

  const handleGenerateNisn = () => {
    const level = currentClass.level;
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    setNisn(`01${8 - Math.min(level, 6)}29${randomSixDigits}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama lengkap siswa wajib diisi!');
      return;
    }

    let finalNisn = nisn.trim();
    if (!finalNisn) {
      const level = currentClass.level;
      const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
      finalNisn = `01${8 - Math.min(level, 6)}29${randomSixDigits}`;
    }

    addStudentToClass(selectedClassId, {
      name: name.trim(),
      nisn: finalNisn,
      gender,
      parentName: parentName.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined
    });

    onStudentAdded(name.trim(), currentClass.name);
    // Reset form
    setName('');
    setNisn('');
    setParentName('');
    setParentPhone('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-lg w-full border border-slate-300 shadow-2xl relative p-6 space-y-5 my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5 text-indigo-950">
            <div className="w-8 h-8 rounded-sm bg-indigo-900 text-amber-300 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-tight">
                Tambah Murid Baru Pada Presensi
              </h3>
              <p className="text-[11px] text-slate-500">
                Pendaftaran siswa aktif ke daftar hadir kelas UPTD SDN 5 Barandasi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Rombel / Target Class */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Rombongan Belajar / Kelas:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-900 cursor-pointer"
            >
              {SCHOOL_CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} — Wali Kelas: {cls.teacherName} ({cls.room})
                </option>
              ))}
            </select>
          </div>

          {/* Student Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap Murid: <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Contoh: Muhammad Farhan Al-Faris"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-900"
              />
            </div>
          </div>

          {/* Gender & NISN row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenis Kelamin: <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('L')}
                  className={`py-2 px-3 rounded-sm font-bold text-xs flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
                    gender === 'L'
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Laki-laki (L)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('P')}
                  className={`py-2 px-3 rounded-sm font-bold text-xs flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
                    gender === 'P'
                      ? 'bg-pink-900 text-white border-pink-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Perempuan (P)</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  NISN:
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNisn}
                  className="text-[10px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="10 digit NISN Dapodik"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-mono text-slate-900 focus:outline-hidden focus:border-indigo-900"
              />
            </div>
          </div>

          {/* Parent Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Orang Tua / Wali:
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Contoh: Bapak Daeng Bella"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-indigo-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                No. WhatsApp / HP Orang Tua:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-mono text-slate-900 focus:outline-hidden focus:border-indigo-900"
                />
              </div>
            </div>
          </div>

          {/* Info Badge */}
          <div className="bg-amber-50 p-3 rounded-sm border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-700" />
              <span>Otomatisasi Sistem Presensi Digital SDN 5 Barandasi</span>
            </div>
            <p>
              Murid baru akan langsung muncul pada daftar presensi harian {currentClass.name} dan tercatat hadir (H) secara default dengan jam masuk 07:15 WITA.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>Simpan & Daftarkan Murid</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
