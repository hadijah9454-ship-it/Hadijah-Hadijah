import React, { useState } from 'react';
import { 
  UserCheck, FileText, CheckCircle2, AlertCircle, ArrowRight, 
  ArrowLeft, Search, Sparkles, Printer, ExternalLink, ShieldCheck, HelpCircle, Phone, Info
} from 'lucide-react';
import { SPMB_PORTAL_URL } from '../data/schoolData';

interface PPDBSectionProps {
  onOpenAi: () => void;
}

export const PPDBSection: React.FC<PPDBSectionProps> = ({ onOpenAi }) => {
  const [activeTab, setActiveTab] = useState<'portal' | 'panduan' | 'layanan'>('portal');
  
  return (
    <section id="ppdb" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Header Title */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-[1px] w-8 bg-indigo-900" />
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-900">
              SPMB 2026 — UPTD SDN 5 BARANDASI MAROS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-indigo-950 tracking-tight">
            PENDAFTARAN SPMB 2026 <span className="font-extrabold italic text-indigo-900">(BUKAN PPDB LAGI)</span>
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            Pendaftaran Sistem Penerimaan Murid Baru (SPMB) T.A. 2026/2027 UPTD SDN 5 Barandasi resmi dilaksanakan terintegrasi melalui portal online <strong>Pusdatin Kabupaten Maros</strong>.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="inline-flex p-1 bg-slate-100 rounded-sm border border-slate-200 mt-2">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-5 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-indigo-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-950'
              }`}
            >
              Link Portal SPMB Pusdatin
            </button>
            <button
              onClick={() => setActiveTab('panduan')}
              className={`px-5 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'panduan'
                  ? 'bg-indigo-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-950'
              }`}
            >
              Syarat & Alur Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('layanan')}
              className={`px-5 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'layanan'
                  ? 'bg-indigo-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-950'
              }`}
            >
              Layanan Bantuan Sekolah
            </button>
          </div>
        </div>

        {/* Tab 1: Portal Banner Direct Link */}
        {activeTab === 'portal' && (
          <div className="bg-slate-50 border-2 border-indigo-900 rounded-sm p-8 sm:p-12 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
              <div className="space-y-2">
                <span className="bg-amber-400 text-indigo-950 px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-sm border border-amber-500 inline-block">
                  Pusdatin Kabupaten Maros
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase tracking-tight">
                  Akses Resmi Pendaftaran SPMB 2026
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  Klik tombol di bawah ini untuk membuka dashboard SPMB 2026 resmi Kabupaten Maros guna melakukan pendaftaran calon peserta didik UPTD SDN 5 Barandasi.
                </p>
              </div>

              <a
                href={SPMB_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-300 text-indigo-950 px-8 py-4 rounded-sm text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-colors shadow-md border border-amber-500 cursor-pointer shrink-0"
              >
                <span>BUKA PORTAL SPMB 2026</span>
                <ExternalLink className="w-5 h-5 text-indigo-950" />
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-2">
              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-900 rounded-sm flex items-center justify-center font-bold text-xs">1</div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Buka Link Portal SPMB</h4>
                <p className="text-[11px] text-slate-600">Kunjungi link <code>https://spmb2026.pusdatinmaros.id/dashboard</code> melalui HP/Laptop.</p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-900 rounded-sm flex items-center justify-center font-bold text-xs">2</div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Pilih SDN 5 Barandasi</h4>
                <p className="text-[11px] text-slate-600">Pilih sekolah tujuan UPTD SDN 5 Barandasi Kecamatan Lau pada menu pilihan sekolah dasar.</p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-900 rounded-sm flex items-center justify-center font-bold text-xs">3</div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Upload Berkas Syarat</h4>
                <p className="text-[11px] text-slate-600">Unggah foto Akta Kelahiran, Kartu Keluarga (KK), dan pasfoto calon siswa baru.</p>
              </div>
            </div>

            <div className="bg-indigo-950 text-amber-300 p-4 rounded-sm border border-indigo-900 text-xs flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Pendaftaran online buka 24 jam. Bagi wali murid yang kesulitan mendaftar mandiri, silakan membawa berkas fisik ke sekolah.</span>
              </div>
              <button
                onClick={onOpenAi}
                className="bg-amber-400 hover:bg-amber-300 text-indigo-950 px-3 py-1.5 rounded-sm font-extrabold text-[11px] uppercase tracking-wider cursor-pointer border border-amber-500"
              >
                Tanya AI SPMB
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Panduan Syarat & Alur */}
        {activeTab === 'panduan' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-sm space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-2 border-b border-slate-200 pb-3">
                <FileText className="w-5 h-5 text-indigo-900" />
                <span>Syarat Dokumen Pendaftaran (SD)</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Usia minimal 6 - 7 tahun per 1 Juli 2026 (Diutamakan usia 7 tahun).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi Akta Kelahiran Calon Siswa (2 Lembar).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi Kartu Keluarga / KK Orang Tua / Wali (2 Lembar).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi KTP Kedua Orang Tua / Wali.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pasfoto Calon Siswa Ukuran 3x4 (4 Lembar, Latar Merah/Biru).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Surat Keterangan Lulus / Ijazah TK / PAUD (Jika Ada).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-sm space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-2 border-b border-slate-200 pb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-900" />
                <span>Jadwal Pelaksanaan SPMB 2026</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-sm flex justify-between items-center">
                  <div>
                    <span className="font-bold text-indigo-950 block">Pendaftaran SPMB Online</span>
                    <span className="text-slate-500 text-[11px]">Melalui spmb2026.pusdatinmaros.id</span>
                  </div>
                  <span className="font-extrabold text-amber-600 text-[11px]">10 JULI - 15 AGUSTUS 2026</span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-sm flex justify-between items-center">
                  <div>
                    <span className="font-bold text-indigo-950 block">Verifikasi Berkas Fisik Sekolah</span>
                    <span className="text-slate-500 text-[11px]">Di Ruang Panitia SDN 5 Barandasi</span>
                  </div>
                  <span className="font-extrabold text-indigo-900 text-[11px]">SOP Setiap Jam Kerja</span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-sm flex justify-between items-center">
                  <div>
                    <span className="font-bold text-indigo-950 block">Pengumuman & Daftar Ulang</span>
                    <span className="text-slate-500 text-[11px]">Penetapan Murid Baru T.A. 2026/2027</span>
                  </div>
                  <span className="font-extrabold text-emerald-600 text-[11px]">18 AGUSTUS 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Layanan Bantuan Sekolah */}
        {activeTab === 'layanan' && (
          <div className="bg-indigo-950 text-white rounded-sm p-8 sm:p-10 border border-indigo-900 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 text-indigo-950 flex items-center justify-center rounded-sm font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-amber-300">
                  Pendampingan Pendaftaran Langsung di Sekolah
                </h3>
                <p className="text-xs text-slate-300">
                  Panitia SPMB UPTD SDN 5 Barandasi siap membantu mendaftarkan calon murid baru secara online bagi orang tua yang membutuhkan panduan.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-xs border-t border-indigo-900 pt-6">
              <div>
                <span className="font-extrabold text-amber-400 uppercase tracking-widest block mb-2">Lokasi Sekretariat SPMB:</span>
                <p className="text-slate-200 leading-relaxed">
                  Ruang Pelayanan Operator Dapodik & SPMB<br />
                  Gedung UPTD SDN 5 Barandasi, Kecamatan Lau, Kabupaten Maros, Sulawesi Selatan.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-amber-400 uppercase tracking-widest block mb-2">Jam Layanan Bantuan:</span>
                <p className="text-slate-200 leading-relaxed">
                  Senin - Sabtu: Pukul 08.00 - 12.00 WITA<br />
                  Contact Person / WA Operator: 0812-3456-7890 (Hasnah, A.Md)
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href={SPMB_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-300 text-indigo-950 px-6 py-3 rounded-sm font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer border border-amber-500"
              >
                <span>Buka Link Dashboard SPMB 2026</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
