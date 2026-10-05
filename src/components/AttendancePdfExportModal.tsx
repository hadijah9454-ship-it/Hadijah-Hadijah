import React, { useState, useMemo } from 'react';
import { 
  X, FileText, Download, Printer, Calendar, Users, 
  CheckCircle2, AlertTriangle, School, Award, ChevronRight, Check
} from 'lucide-react';
import { SCHOOL_CLASSES } from '../data/studentAttendanceData';
import { 
  getClassStudents, 
  getClassAttendance, 
  getMonthlyClassReport 
} from '../utils/studentAttendanceStore';
import { 
  exportMonthlyAttendancePDF, 
  exportDailyAttendancePDF,
  formatIndonesianDate
} from '../utils/attendancePdfExport';
import { MonthlyClassReport } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultClassId: string;
  defaultDate: string;
}

export const AttendancePdfExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultClassId,
  defaultDate
}) => {
  const [reportType, setReportType] = useState<'monthly' | 'daily'>('monthly');
  const [selectedClassId, setSelectedClassId] = useState<string>(defaultClassId);
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Compute monthly report data
  const monthlyReport: MonthlyClassReport = useMemo(() => {
    return getMonthlyClassReport(selectedClassId, selectedMonth);
  }, [selectedClassId, selectedMonth]);

  // Compute daily attendance data
  const dailyAttendance = useMemo(() => {
    return getClassAttendance(selectedDate, selectedClassId);
  }, [selectedDate, selectedClassId]);

  const classStudents = useMemo(() => {
    return getClassStudents(selectedClassId);
  }, [selectedClassId]);

  if (!isOpen) return null;

  const currentClassInfo = SCHOOL_CLASSES.find(c => c.id === selectedClassId) || SCHOOL_CLASSES[0];

  const handleExportPDF = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      if (reportType === 'monthly') {
        exportMonthlyAttendancePDF(monthlyReport);
      } else {
        exportDailyAttendancePDF(dailyAttendance, classStudents);
      }
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Export PDF error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintPreview = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-4xl w-full border border-slate-300 shadow-2xl relative p-5 sm:p-7 space-y-5 my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3 text-indigo-950">
            <div className="w-9 h-9 rounded-sm bg-indigo-900 text-amber-300 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-tight">
                  Ekspor Laporan Kehadiran Siswa (Format PDF)
                </h3>
                <span className="bg-amber-100 text-indigo-950 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-amber-300 uppercase tracking-wider">
                  Akreditasi B
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Laporan resmi dengan Kop Surat Dinas Pendidikan Kabupaten Maros & tanda tangan pengesahan
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

        {/* Options Toolbar */}
        <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 space-y-4">
          
          {/* Row 1: Report Scope Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilih Format Laporan:
              </label>
              <div className="inline-flex rounded-sm bg-slate-200 p-0.5">
                <button
                  type="button"
                  onClick={() => setReportType('monthly')}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    reportType === 'monthly'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Rekapitulasi Bulanan (20 Hari)
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('daily')}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    reportType === 'daily'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Presensi Harian
                </button>
              </div>
            </div>

            {/* Class selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilih Rombongan Belajar:
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-bold text-indigo-950 focus:outline-hidden focus:border-indigo-900 cursor-pointer"
              >
                {SCHOOL_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.teacherName})
                  </option>
                ))}
              </select>
            </div>

            {/* Period selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {reportType === 'monthly' ? 'Bulan Laporan:' : 'Tanggal Laporan:'}
              </label>
              {reportType === 'monthly' ? (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-bold text-indigo-950 focus:outline-hidden focus:border-indigo-900 cursor-pointer"
                >
                  <option value="September 2026">September 2026 (Aktif)</option>
                  <option value="Agustus 2026">Agustus 2026</option>
                  <option value="Juli 2026">Juli 2026</option>
                  <option value="Oktober 2026">Oktober 2026 (Proyeksi)</option>
                </select>
              ) : (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-bold text-indigo-950 focus:outline-hidden focus:border-indigo-900 cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Row 2: Live Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-3 border-t border-slate-200 text-xs">
            <div className="bg-white p-2.5 rounded-sm border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Siswa</span>
              <span className="text-base font-black text-indigo-950">
                {reportType === 'monthly' ? monthlyReport.totalStudents : classStudents.length}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Rata-rata Hadir</span>
              <span className="text-base font-black text-emerald-700">
                {reportType === 'monthly' ? `${monthlyReport.averageRate}%` : `${dailyAttendance.summary.rate}%`}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Hadir (H)</span>
              <span className="text-base font-black text-teal-700">
                {reportType === 'monthly' ? monthlyReport.totalHadir : dailyAttendance.summary.hadir}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Sakit (S)</span>
              <span className="text-base font-black text-sky-700">
                {reportType === 'monthly' ? monthlyReport.totalSakit : dailyAttendance.summary.sakit}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Izin (I)</span>
              <span className="text-base font-black text-amber-700">
                {reportType === 'monthly' ? monthlyReport.totalIzin : dailyAttendance.summary.izin}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Alpa (A)</span>
              <span className="text-base font-black text-rose-700">
                {reportType === 'monthly' ? monthlyReport.totalAlpa : dailyAttendance.summary.alpa}
              </span>
            </div>
          </div>
        </div>

        {/* Live Document Preview Box */}
        <div className="border border-slate-300 rounded-sm p-4 sm:p-5 bg-white space-y-4 max-h-[300px] overflow-y-auto">
          {/* Header Preview */}
          <div className="text-center border-b-2 border-black pb-2 space-y-0.5 font-serif">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-800">PEMERINTAH KABUPATEN MAROS - DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
            <h4 className="text-xs sm:text-sm font-black uppercase text-indigo-950 tracking-wide">
              UPTD SATUAN PENDIDIKAN FORMAL SDN 5 BARANDASI
            </h4>
            <p className="text-[9px] text-slate-600 italic">
              NPSN: 40300262 | NSS: 101190110001 | Status: Negeri | AKREDITASI B | Kec. Lau, Kab. Maros
            </p>
          </div>

          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 pt-1">
            <div>
              <p>Rombel: <strong>{currentClassInfo.name}</strong></p>
              <p>Wali Kelas: <strong>{currentClassInfo.teacherName}</strong> (NIP. {currentClassInfo.teacherNip})</p>
            </div>
            <div className="text-right">
              <p>Periode: <strong>{reportType === 'monthly' ? selectedMonth : formatIndonesianDate(selectedDate)}</strong></p>
              <p>Format Dokumen: <strong>PDF Standar Laporan Kedinasan</strong></p>
            </div>
          </div>

          {/* Student Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-950 text-white text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-2 px-2.5 w-10 text-center">No</th>
                  <th className="py-2 px-2.5">NISN</th>
                  <th className="py-2 px-2.5">Nama Siswa</th>
                  <th className="py-2 px-2.5 w-10 text-center">L/P</th>
                  {reportType === 'monthly' ? (
                    <>
                      <th className="py-2 px-2 text-center">Hari</th>
                      <th className="py-2 px-2 text-center">H</th>
                      <th className="py-2 px-2 text-center">S</th>
                      <th className="py-2 px-2 text-center">I</th>
                      <th className="py-2 px-2 text-center">A</th>
                      <th className="py-2 px-2 text-center">% Kehadiran</th>
                      <th className="py-2 px-2.5">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2 px-2 text-center">Status</th>
                      <th className="py-2 px-2 text-center">Waktu</th>
                      <th className="py-2 px-2.5">Catatan</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {reportType === 'monthly' ? (
                  monthlyReport.studentsReport.slice(0, 8).map((st, idx) => (
                    <tr key={st.studentId} className={st.attendanceRate < 80 ? 'bg-rose-50/50' : ''}>
                      <td className="py-1.5 px-2.5 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-1.5 px-2.5 font-mono text-[10px]">{st.nisn}</td>
                      <td className="py-1.5 px-2.5 font-semibold text-indigo-950">{st.name}</td>
                      <td className="py-1.5 px-2.5 text-center">{st.gender}</td>
                      <td className="py-1.5 px-2 text-center">{st.totalEffectiveDays}</td>
                      <td className="py-1.5 px-2 text-center font-bold text-teal-700">{st.hadir}</td>
                      <td className="py-1.5 px-2 text-center text-sky-700">{st.sakit}</td>
                      <td className="py-1.5 px-2 text-center text-amber-700">{st.izin}</td>
                      <td className="py-1.5 px-2 text-center text-rose-700">{st.alpa}</td>
                      <td className="py-1.5 px-2 text-center font-bold">
                        <span className={st.attendanceRate < 80 ? 'text-rose-700 bg-rose-100 px-1 py-0.5 rounded-xs' : 'text-slate-800'}>
                          {st.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-xs font-semibold ${
                          st.attendanceRate < 80 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.statusKeterangan}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  classStudents.slice(0, 8).map((st, idx) => {
                    const rec = dailyAttendance.records[st.id] || { status: 'H' };
                    return (
                      <tr key={st.id}>
                        <td className="py-1.5 px-2.5 text-center text-slate-500">{idx + 1}</td>
                        <td className="py-1.5 px-2.5 font-mono text-[10px]">{st.nisn}</td>
                        <td className="py-1.5 px-2.5 font-semibold text-indigo-950">{st.name}</td>
                        <td className="py-1.5 px-2.5 text-center">{st.gender}</td>
                        <td className="py-1.5 px-2 text-center font-bold">
                          {rec.status === 'H' ? <span className="text-emerald-700">Hadir</span> :
                           rec.status === 'S' ? <span className="text-sky-700">Sakit</span> :
                           rec.status === 'I' ? <span className="text-amber-700">Izin</span> :
                           <span className="text-rose-700 font-black">Alpa</span>}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono text-[10px]">{rec.checkInTime || '-'}</td>
                        <td className="py-1.5 px-2.5 text-slate-500 text-[10px]">{rec.note || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="text-center py-2 text-[10px] text-slate-500 italic bg-slate-50 border-t border-slate-200">
              Menampilkan pratinjau 8 dari {reportType === 'monthly' ? monthlyReport.totalStudents : classStudents.length} siswa. File PDF lengkap akan memuat seluruh siswa dalam format siap cetak.
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-600 text-white rounded-sm text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-300" />
              <span>
                File PDF berhasil diekspor dan diunduh ke perangkat Anda ({reportType === 'monthly' ? `Laporan_Absensi_Bulanan_SDN5_${selectedClassId}` : `Presensi_Harian_SDN5_${selectedClassId}`}.pdf)!
              </span>
            </div>
            <button onClick={() => setDownloadSuccess(false)} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Format Resmi UPTD SDN 5 Barandasi (Akreditasi B)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handlePrintPreview}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Cetak / Print</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md border border-indigo-700"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isDownloading ? 'Menyiapkan PDF...' : 'Unduh File PDF (.pdf)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
