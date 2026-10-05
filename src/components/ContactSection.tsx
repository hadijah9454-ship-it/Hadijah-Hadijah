import React, { useState } from 'react';
import { 
  Building2, FileCheck2, Layers, PhoneCall, Mail, MapPin, CheckCircle2, 
  Send, ExternalLink, ShieldCheck, Zap, Globe, Plus, Minus, Navigation, 
  X, Award, FileText, UserCheck, AlertCircle
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Pertanyaan Umum',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [showSkModal, setShowSkModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'identitas' | 'dokumen' | 'sarpras' | 'kontak' | 'semua'>('semua');
  const [zoomOffset, setZoomOffset] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', category: 'Pertanyaan Umum', message: '' });
    }, 4000);
  };

  // OpenStreetMap BBox based on zoom offset
  const delta = 0.005 * Math.pow(0.6, zoomOffset);
  const minLng = 119.572960 - delta * 1.5;
  const minLat = -4.975385 - delta;
  const maxLng = 119.572960 + delta * 1.5;
  const maxLat = -4.975385 + delta;
  const mapIframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=-4.975385%2C119.572960`;

  return (
    <section id="kontak" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-[1px] w-8 bg-indigo-900" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
              HUBUNGI KAMI
            </span>
          </div>
          <h2 className="text-3xl font-light text-indigo-950 tracking-tight">
            PUSAT LAYANAN & <span className="font-bold italic text-indigo-900">LOKASI SEKOLAH</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Punya pertanyaan mengenai info pendaftaran SPMB, kunjungan sekolah, atau kemitraan? Silakan hubungi kami.
          </p>
        </div>

        {/* Tab Filter for School Profile Data */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('semua')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'semua'
                ? 'bg-indigo-900 text-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Data Satuan Pendidikan
          </button>
          <button
            onClick={() => setActiveTab('identitas')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'identitas'
                ? 'bg-indigo-900 text-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Identitas Sekolah
          </button>
          <button
            onClick={() => setActiveTab('dokumen')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'dokumen'
                ? 'bg-indigo-900 text-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Dokumen & Perijinan
          </button>
          <button
            onClick={() => setActiveTab('sarpras')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'sarpras'
                ? 'bg-indigo-900 text-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Sarana & Prasarana
          </button>
          <button
            onClick={() => setActiveTab('kontak')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'kontak'
                ? 'bg-indigo-900 text-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kontak & Operator
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Official Kemendikdasmen Data & Map Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Identitas Satuan Pendidikan */}
            {(activeTab === 'semua' || activeTab === 'identitas') && (
              <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-indigo-950 px-5 py-3.5 flex items-center justify-between border-b border-indigo-900">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                      Identitas Satuan Pendidikan
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-xs bg-indigo-900 text-amber-300 border border-indigo-700 uppercase tracking-wider">
                    DIKDAS • NEGERI
                  </span>
                </div>
                
                <div className="p-4 sm:p-5 text-xs divide-y divide-slate-100 font-sans">
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Nama</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-bold text-indigo-950">UPTD SDN 5 Barandasi</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">NPSN</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono font-bold text-slate-900">40300391</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Alamat</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 text-slate-800">Jl. Pendidikan No.11 Barandasi</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Desa/Kelurahan</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">MACCINI BAJI</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Kecamatan/Kota (LN)</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">KEC. LAU</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Kab.-Kota/Negara (LN)</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">KAB. MAROS</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Provinsi/Luar Negeri (LN)</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">PROV. SULAWESI SELATAN</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Status Sekolah</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-bold text-emerald-700">NEGERI</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Bentuk Pendidikan</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">SD</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Jenjang Pendidikan</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">DIKDAS</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Dokumen dan Perijinan */}
            {(activeTab === 'semua' || activeTab === 'dokumen') && (
              <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                      Dokumen dan Perijinan
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-xs bg-amber-400 text-indigo-950 uppercase tracking-wider">
                    AKREDITASI: B
                  </span>
                </div>
                
                <div className="p-4 sm:p-5 text-xs divide-y divide-slate-100 font-sans">
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Kementerian Pembina</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">Kementerian Pendidikan Dasar dan Menengah</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Naungan</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">Pemerintah Daerah</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">NPYP</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono text-slate-600">-</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Nomor SK Izin Operasional</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono font-bold text-indigo-950">18/I/DPMPTSP/108/2019</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">TMT SK Operasional</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-semibold text-slate-900">Tanggal 11-01-2019</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Operasional TST SK</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono text-slate-600">-</span>
                  </div>
                  <div className="grid grid-cols-12 py-2 items-center">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Berkas SK Operasional</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7">
                      <button
                        onClick={() => setShowSkModal(true)}
                        className="inline-flex items-center gap-1.5 text-indigo-900 hover:text-indigo-950 font-extrabold hover:underline bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-sm border border-amber-300 transition-colors cursor-pointer text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-900" />
                        <span>Lihat SK Operasional</span>
                      </button>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Tanggal Upload SK Op.</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono text-slate-700">09-04-2023 04:50:55</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Akreditasi</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-extrabold text-amber-600 text-sm">B</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Sarana dan Prasarana */}
            {(activeTab === 'semua' || activeTab === 'sarpras') && (
              <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                      Sarana dan Prasarana
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-slate-800 text-amber-300 border border-slate-700 uppercase tracking-wider">
                    SARPRAS SEKOLAH
                  </span>
                </div>
                
                <div className="p-4 sm:p-5 text-xs divide-y divide-slate-100 font-sans">
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Luas Tanah</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-bold text-slate-900">1.405 m²</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Akses Internet</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 text-slate-700 font-mono">1. - &nbsp; 2. -</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Sumber Listrik</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-bold text-slate-900 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>PLN</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Kontak & Operator */}
            {(activeTab === 'semua' || activeTab === 'kontak') && (
              <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                      Kontak
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                    OPERATOR: SULARTI
                  </span>
                </div>
                
                <div className="p-4 sm:p-5 text-xs divide-y divide-slate-100 font-sans">
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Fax</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono text-slate-600">-</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Telepon</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono text-slate-600">-</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">E-mail</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7">
                      <a href="mailto:sd5barandasi@gmail.com" className="font-mono font-bold text-indigo-900 hover:text-indigo-950 hover:underline">
                        sd5barandasi@gmail.com
                      </a>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Situs web</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-mono text-slate-600">-</span>
                  </div>
                  <div className="grid grid-cols-12 py-2">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-semibold">Operator</span>
                    <span className="col-span-1 text-slate-400 text-center">:</span>
                    <span className="col-span-6 sm:col-span-7 font-bold text-indigo-950 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SULARTI</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Official Address Banner */}
            <div className="bg-indigo-950 text-white rounded-sm p-5 border border-indigo-900 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Alamat Resmi Satuan Pendidikan:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                JL. Pendidikan No. 11, Barandasi, Kel. Maccini Baji, Kec. Lau Kab. Maros, Prov. Sulawesi Selatan, Kode POS 90513 NSS : 101190110001, NPSN: 40300391, Email. sd5barandasi@gmail.com
              </p>
            </div>

            {/* Peta (Leaflet | © OpenStreetMap) */}
            <div className="bg-white rounded-sm border border-slate-300 shadow-2xs overflow-hidden">
              <div className="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Peta
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.openstreetmap.org/?mlat=-4.975385&mlon=119.572960#map=18/-4.975385/119.572960"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-amber-300 hover:underline flex items-center gap-1 font-bold"
                    title="Buka di OpenStreetMap"
                  >
                    <span>Buka Peta Penuh</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Leaflet-styled Container */}
              <div className="relative h-72 w-full bg-slate-100 overflow-hidden">
                
                {/* Simulated Leaflet Zoom Buttons (+ / -) */}
                <div className="absolute top-3 left-3 z-10 flex flex-col bg-white rounded-xs shadow-md border border-slate-300 overflow-hidden font-bold">
                  <button
                    onClick={() => setZoomOffset(prev => Math.min(prev + 1, 3))}
                    className="w-8 h-8 flex items-center justify-center text-slate-800 hover:bg-slate-100 text-lg transition-colors border-b border-slate-200 cursor-pointer"
                    title="Perbesar Peta (+)"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoomOffset(prev => Math.max(prev - 1, -2))}
                    className="w-8 h-8 flex items-center justify-center text-slate-800 hover:bg-slate-100 text-lg transition-colors cursor-pointer"
                    title="Perkecil Peta (−)"
                  >
                    −
                  </button>
                </div>

                {/* Leaflet Attribution Watermark in Bottom-Right */}
                <div className="absolute bottom-0 right-0 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] text-slate-700 border-t border-l border-slate-300 font-sans flex items-center gap-1 shadow-2xs">
                  <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    Leaflet
                  </a>
                  <span className="text-slate-400">|</span>
                  <span>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">OpenStreetMap</a></span>
                </div>

                {/* Map Iframe */}
                <iframe
                  title="Peta Lokasi UPTD SDN 5 Barandasi"
                  src={mapIframeUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              {/* Coordinates Footer Bar */}
              <div className="bg-slate-950 text-amber-300 px-4 py-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Lintang :</span>
                  <span className="font-bold text-white">-4.975385000000</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Bujur :</span>
                  <span className="font-bold text-white">119.572960000000</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-sans font-semibold">
                  ✓ Koordinat Terverifikasi Dapodik
                </div>
              </div>

            </div>

          </div>

          {/* Form Side */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-indigo-950">Kirim Pesan / Pertanyaan</h3>
              <p className="text-xs text-slate-600 mt-0.5">Layanan administrasi UPTD SDN 5 Barandasi siap membantu pertanyaan Anda seputar SPMB dan layanan sekolah.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold uppercase tracking-wider text-emerald-950">Pesan Terkirim!</h4>
                <p className="text-xs text-emerald-800">Terima kasih telah menghubungi UPTD SDN 5 Barandasi. Tanggapan akan dikirim via Email / WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Orang Tua / Calon Murid"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nomor Telepon / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Kategori Pertanyaan *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-indigo-900 font-semibold"
                  >
                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                    <option value="Informasi SPMB 2026">Pendaftaran Murid Baru (SPMB 2026)</option>
                    <option value="Akademik & Kurikulum">Kurikulum KSP & Pembelajaran</option>
                    <option value="Kunjungan Sekolah">Kunjungan / Koordinasi Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Isi Pesan *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pertanyaan atau pesan Anda di sini secara detail..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-indigo-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-bold py-3.5 rounded-sm text-xs uppercase tracking-widest border border-indigo-900 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}

            {/* Quick Email & Operator Box */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Operator Sekolah:</span>
                <span className="font-bold text-indigo-950">SULARTI</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Email Pengaduan & Info:</span>
                <a href="mailto:sd5barandasi@gmail.com" className="font-mono text-indigo-900 font-bold hover:underline">
                  sd5barandasi@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">NPSN / NSS:</span>
                <span className="font-mono text-slate-900">40300391 / 101190110001</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* SK Operasional Modal */}
      {showSkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-indigo-950 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-amber-300">
                  Data Berkas SK Operasional
                </h3>
              </div>
              <button
                onClick={() => setShowSkModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-sm cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Status Izin Operasional: RESMI & TERVERIFIKASI DAPODIK</span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Satuan Pendidikan:</span>
                  <span className="font-bold text-slate-900">UPTD SDN 5 Barandasi</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Nomor SK Izin:</span>
                  <span className="font-mono font-bold text-indigo-950">18/I/DPMPTSP/108/2019</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">TMT SK Operasional:</span>
                  <span className="font-semibold text-slate-800">Tanggal 11-01-2019</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Tanggal Upload SK:</span>
                  <span className="font-mono text-slate-700">09-04-2023 04:50:55</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Kementerian Pembina:</span>
                  <span className="text-slate-800">Kementerian Pendidikan Dasar dan Menengah</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Naungan:</span>
                  <span className="text-slate-800">Pemerintah Daerah Kabupaten Maros</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Status Akreditasi:</span>
                  <span className="font-extrabold text-amber-600">Peringkat B</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSkModal(false)}
                  className="bg-indigo-950 hover:bg-indigo-900 text-amber-300 px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
