import React, { useState } from 'react';
import { 
  GraduationCap, Mail, Phone, MapPin, Instagram, Youtube, 
  Facebook, Linkedin, ArrowRight, Heart, Send, CheckCircle2, ExternalLink, BookOpen
} from 'lucide-react';
import { 
  SPMB_PORTAL_URL,
  RAPOR_PENDIDIKAN_URL, MY_ASN_URL, SIBI_BUKU_URL,
  SIM_PKB_URL, INFO_GTK_URL, RUMAH_PENDIDIKAN_URL,
  PENJARING_URL, LETS_READ_URL, LITERACY_CLOUD_URL, BACAPIBO_URL
} from '../data/schoolData';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPpdb?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPpdb }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 3500);
    }
  };

  return (
    <footer className="bg-indigo-950 text-slate-400 border-t border-indigo-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Identity & Address */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-amber-400 flex items-center justify-center text-indigo-950 font-black text-base shadow-xs">
                5
              </div>
              <div>
                <h3 className="text-white font-extrabold text-sm tracking-tight leading-tight">UPTD SDN 5 BARANDASI</h3>
                <p className="text-[10px] text-amber-400 tracking-wider font-semibold uppercase">Kabupaten Maros, Sulawesi Selatan</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-xs leading-relaxed">
              Mewujudkan generasi bertakwa, berkarakter, cerdas, terampil, dan berwawasan lingkungan menuju Indonesia Emas 2045.
            </p>

            <div className="space-y-2 text-slate-300 text-xs pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>JL. Pendidikan No. 11, Barandasi, Kel. Maccini Baji, Kec. Lau, Kab. Maros, Prov. Sulawesi Selatan 90513</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 text-amber-400 font-bold text-[10px] text-center shrink-0">ID</span>
                <span>NPSN: 40300391 | NSS: 101190110001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sd5barandasi@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-sm bg-indigo-900 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:bg-indigo-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-sm bg-indigo-900 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:bg-indigo-800 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-sm bg-indigo-900 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:bg-indigo-800 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Academic & Quick Nav */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Navigasi & Dokumen</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={SPMB_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 font-extrabold hover:underline cursor-pointer uppercase tracking-wider text-[11px] flex items-center gap-1"
                >
                  <span>Portal SPMB 2026</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ksp')}
                  className="hover:text-amber-300 transition-colors cursor-pointer uppercase tracking-wider text-[11px] flex items-center gap-1 text-left"
                >
                  <span>Slide Presentasi KSP</span>
                </button>
              </li>
              <li><button onClick={() => onNavigate('rapor')} className="text-amber-300 hover:underline transition-colors cursor-pointer uppercase tracking-wider text-[11px] font-bold flex items-center gap-1">Literasi & Rapor 2025</button></li>
              <li><button onClick={() => onNavigate('guru')} className="hover:text-amber-300 transition-colors cursor-pointer uppercase tracking-wider text-[11px]">Direktori Guru & Staff</button></li>
              <li><button onClick={() => onNavigate('kontak')} className="hover:text-amber-300 transition-colors cursor-pointer uppercase tracking-wider text-[11px]">Kontak & Alamat</button></li>
            </ul>
          </div>

          {/* Literasi Digital (SIBI, Penjaring, Let's Read, Literacy Cloud, BacaPibo) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-[0.2em]">Literasi Digital</h4>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href={SIBI_BUKU_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">SIBI Buku Kemendikdasmen</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={PENJARING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">Penjaring Penerjemahan</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={LETS_READ_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">Let's Read Asia</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={LITERACY_CLOUD_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">Literacy Cloud</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={BACAPIBO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">BacaPibo Cerita Anak</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Portal Resmi Kemendikdasmen & BKN */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">Portal Resmi</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href={RAPOR_PENDIDIKAN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">Rapor Pendidikan</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={MY_ASN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">My ASN (BKN)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={SIM_PKB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">SIM PKB GTK</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={INFO_GTK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">INFO GTK</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
              <li>
                <a href={RUMAH_PENDIDIKAN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center justify-between group">
                  <span className="truncate">Rumah Pendidikan</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Buletin Sekolah</h4>
            <p className="text-xs text-slate-300">Dapatkan info kegiatan sekolah & SPMB langsung ke email.</p>

            {subscribed ? (
              <div className="bg-emerald-950 border border-emerald-700 p-3 rounded-sm text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Terima kasih! Email Anda telah terdaftar.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-900/60 border border-indigo-800 rounded-sm text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold py-2 px-3 rounded-sm text-xs uppercase tracking-widest transition-colors cursor-pointer border border-amber-500 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Langganan</span>
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="pt-10 mt-10 border-t border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} UPTD SDN 5 Barandasi Maros. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">NPSN: 40300262</span>
            <span className="hover:text-slate-300 cursor-pointer">Akreditasi B</span>
            <span className="hover:text-slate-300 cursor-pointer">Kurikulum Merdeka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
