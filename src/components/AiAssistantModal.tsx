import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, X, Bot, User, HelpCircle, BookOpen, 
  UserCheck, Trophy, Phone, RefreshCw, ExternalLink
} from 'lucide-react';
import { ChatMessage } from '../types';
import { 
  SPMB_PORTAL_URL, SCHOOL_VISION, SCHOOL_MISSIONS,
  RAPOR_PENDIDIKAN_URL, MY_ASN_URL, SIBI_BUKU_URL,
  SIM_PKB_URL, INFO_GTK_URL, RUMAH_PENDIDIKAN_URL, RAPOR_PENDIDIKAN_2025_INFO,
  PENJARING_URL, LETS_READ_URL, LITERACY_CLOUD_URL, BACAPIBO_URL
} from '../data/schoolData';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePpdb?: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Halo! Saya AI Barandasi Bot 🏫, asisten virtual UPTD SDN 5 Barandasi, Kecamatan Lau, Kab. Maros. Ada yang bisa saya bantu mengenai info Pendaftaran SPMB 2026, Dokumen KSP, Ekstrakurikuler, atau Program Belajar SD?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Preset quick questions
  const quickQuestions = [
    'Pojok Literasi Digital?',
    'Rapor Pendidikan 2025?',
    'Link Portal Resmi (INFO GTK/SIM PKB)?',
    'Slide Presentasi KSP?',
    'Link Pendaftaran SPMB 2026?',
    'Alamat & Kontak Sekolah?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Smart Local Fallback Response Engine
    setTimeout(() => {
      let botResponseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('literasi digital') || lower.includes('penjaring') || lower.includes("let's read") || lower.includes('lets read') || lower.includes('literacy cloud') || lower.includes('bacapibo') || lower.includes('pibo') || lower.includes('bacaan anak')) {
        botResponseText = `📖 **Pojok Literasi Digital UPTD SDN 5 Barandasi (5 Platform Terpadu):**\n\n1. **SIBI Kemendikdasmen (Buku Teks & Kurikulum Merdeka):**\n   🔗 ${SIBI_BUKU_URL}\n   *Buku teks pelajaran SD, buku panduan guru, audio book, dan PDF legal resmi gratis.*\n\n2. **Penjaring (Penerjemahan Bahasa Kemendikdasmen):**\n   🔗 ${PENJARING_URL}\n   *Aplikasi penerjemahan cerita anak nusantara, dwibahasa, dan cerita rakyat nusantara.*\n\n3. **Let's Read (The Asia Foundation):**\n   🔗 ${LETS_READ_URL}\n   *Ribuan buku cerita bergambar anak dalam bahasa Indonesia & bahasa daerah (Bugis, Makassar, dll.).*\n\n4. **Literacy Cloud (Room to Read):**\n   🔗 ${LITERACY_CLOUD_URL}\n   *Buku cerita anak berjenjang, video membaca nyaring (read-aloud), dan panduan literasi.*\n\n5. **BacaPibo (PiBo):**\n   🔗 ${BACAPIBO_URL}\n   *Eksplorasi cerita anak digital bergambar interaktif dan ramah anak.*`;
      } else if (lower.includes('rapor') || lower.includes('mutu') || lower.includes('an') || lower.includes('literasi') || lower.includes('numerasi')) {
        botResponseText = `📊 **Rapor Pendidikan 2025 Milik UPTD SDN 5 Barandasi (Kemendikdasmen):**\n\nPrinsip: **Identifikasi, Refleksi, Benahi**\n🔗 Portal Resmi: ${RAPOR_PENDIDIKAN_URL}\n\nRingkasan Capaian Indikator 2025:\n- 🔴 **Kemampuan Literasi Murid:** Kurang (Solusi: manfaatkan Pojok Literasi Digital dengan SIBI, Penjaring, Let's Read, Literacy Cloud, dan BacaPibo)\n- 🟡 **Karakter Murid:** Sedang (*Peningkatan Paling Tinggi*)\n- 🟡 **Kondisi Keamanan Sekolah:** Sedang (Bebas perundungan & hukuman fisik)\n- 🟡 **Kondisi Kebinekaan Sekolah:** Sedang (Toleransi & kesetaraan)\n- 🔴 **Kemampuan Numerasi Murid:** Kurang (*Paling Perlu Ditingkatkan* - mari dampingi anak belajar matematika sehari-hari)\n- 🟡 **Kualitas Pembelajaran:** Sedang (*Capaian Terbaik*)\n\nMari bersama guru dan wali kelas bergotong royong meningkatkan mutu belajar anak!`;
      } else if (lower.includes('asn') || lower.includes('bkn')) {
        botResponseText = `🏛️ **Portal My ASN (BKN Digital):**\nLayanan kepegawaian mandiri ASN BKN untuk data profil, pangkat, dan kinerja:\n🔗 ${MY_ASN_URL}`;
      } else if (lower.includes('sibi') || lower.includes('buku') || lower.includes('teks')) {
        botResponseText = `📚 **SIBI - Sistem Informasi Perbukuan Indonesia (Kemendikdasmen):**\nAkses buku teks Kurikulum Merdeka gratis & resmi untuk siswa dan guru:\n🔗 ${SIBI_BUKU_URL}\n\n*Platform ini juga terintegrasi dalam Pojok Literasi Digital bersama Penjaring, Let's Read, Literacy Cloud, dan BacaPibo!*`;
      } else if (lower.includes('sim pkb') || lower.includes('simpkb') || lower.includes('kombel')) {
        botResponseText = `🎓 **SIM PKB - GTK Belajar Kemendikdasmen:**\nSistem Pengembangan Keprofesian Berkelanjutan untuk Guru & Tenaga Kependidikan:\n🔗 ${SIM_PKB_URL}`;
      } else if (lower.includes('info gtk') || lower.includes('infogtk') || lower.includes('sktp') || lower.includes('tpg')) {
        botResponseText = `📑 **INFO GTK Kemendikdasmen:**\nValidasi data Dapodik, beban mengajar, serta status penerbitan SKTP & Tunjangan Profesi Guru (TPG):\n🔗 ${INFO_GTK_URL}`;
      } else if (lower.includes('rumah pendidikan')) {
        botResponseText = `🏡 **Rumah Pendidikan Kemendikdasmen:**\nPortal ekosistem terpadu Kementerian Pendidikan Dasar dan Menengah:\n🔗 ${RUMAH_PENDIDIKAN_URL}`;
      } else if (lower.includes('portal') || lower.includes('tautan') || lower.includes('link resmi')) {
        botResponseText = `🌐 **Portal Layanan Resmi Kemendikdasmen & Kepegawaian:**\n1. **Rapor Pendidikan:** ${RAPOR_PENDIDIKAN_URL}\n2. **My ASN (BKN):** ${MY_ASN_URL}\n3. **SIM PKB GTK:** ${SIM_PKB_URL}\n4. **INFO GTK:** ${INFO_GTK_URL}\n5. **Rumah Pendidikan:** ${RUMAH_PENDIDIKAN_URL}\n\n📖 **5 Platform Literasi Digital Siswa:**\n- SIBI: ${SIBI_BUKU_URL}\n- Penjaring: ${PENJARING_URL}\n- Let's Read: ${LETS_READ_URL}\n- Literacy Cloud: ${LITERACY_CLOUD_URL}\n- BacaPibo: ${BACAPIBO_URL}\n\n📌 **Portal SPMB 2026 Maros:** ${SPMB_PORTAL_URL}`;
      } else if (lower.includes('spmb') || lower.includes('ppdb') || lower.includes('daftar')) {
        botResponseText = `📌 **Pendaftaran SPMB 2026:**\n\nPendaftaran Sistem Penerimaan Murid Baru dilaksanakan resmi secara online melalui Portal Pusdatin Maros:\n\n🔗 Link: ${SPMB_PORTAL_URL}\n\n- **Syarat Utama:** Akta Kelahiran, KK Orang Tua, Pasfoto 3x4 (Usia min 6-7 tahun per 1 Juli 2026).\n- Panitia SDN 5 Barandasi juga menyediakan pendampingan pendaftaran online gratis di sekolah!`;
      } else if (lower.includes('slide') || lower.includes('presentasi') || lower.includes('ksp') || lower.includes('kurikulum') || lower.includes('visi') || lower.includes('misi') || lower.includes('dokumen')) {
        botResponseText = `🖥️ **Slide Presentasi KSP UPTD SDN 5 Barandasi (12 Slide Lengkap):**\nTersedia slide profesional interaktif di menu **"Slide KSP"** atau bagian **Akademik** pada website ini dengan fitur:\n- 12 Slide Resmi: Identitas Resmi KSP, Karakteristik Lau Maros, Visi & 4 Pilar, 7 Misi Strategis, 8 Dimensi Profil Lulusan, Struktur KBM Intrakurikuler Fase A-C & Mulok Maros, Kokurikuler P5, Pendekatan Deep Learning, Kurikulum Terintegrasi (BSAN, IKAN, IPAK, Adiwiyata), Pembiasaan GSS & 18 Pembina Upacara, Komunitas Belajar (Kombel) Guru, serta Evaluasi & Pengesahan Resmi Disdikbud Maros.\n- Mode Layar Penuh (Proyektor), Putar Otomatis, dan Catatan Narasi Pembina.\n\n🌟 **Visi Satuan Pendidikan:**\n"${SCHOOL_VISION}"\n\n🎯 **7 Misi Satuan Pendidikan:**\n${SCHOOL_MISSIONS.map((m, i) => `${i + 1}. ${m}`).join('\n')}`;
      } else if (lower.includes('syarat') || lower.includes('umur') || lower.includes('usia')) {
        botResponseText = `📋 **Syarat Pendaftaran Murid Baru SD:**\n1. Usia 7 tahun (Utama) atau minimal 6 tahun per 1 Juli 2026.\n2. Fotokopi Akta Kelahiran (2 Lembar).\n3. Fotokopi Kartu Keluarga / KK (2 Lembar).\n4. Pasfoto 3x4 (4 Lembar).`;
      } else if (lower.includes('ekskul') || lower.includes('ekstrakurikuler') || lower.includes('pramuka') || lower.includes('sains')) {
        botResponseText = `🏆 **Ekstrakurikuler UPTD SDN 5 Barandasi:**\n- Pramuka Pengenal Gudep\n- Dokter Kecil & UKS\n- Klub Sains & Matematika Cilik\n- Sanggar Seni Tari Bugis-Makassar\n- Sanggar Olahraga & Bulutangkis SD`;
      } else if (lower.includes('pembina') || lower.includes('upacara')) {
        botResponseText = `🇮🇩 **Daftar Pembina Upacara Bendera Hari Senin UPTD SDN 5 Barandasi (18 Pendidik):**\n\n1. **Hadijah, S.Pd., M.Pd.** (Kepala Sekolah - Pembina Utama)\n2. **Hastuti, S.Pd., Gr.** (Guru Kelas 1A)\n3. **Hj. Rahmawati. S, S.Pd., M.Pd.** (Guru Kelas 1B)\n4. **Rasmi, S.Pd.** (Guru Kelas 1C)\n5. **Nurlela, S.Pd.** (Guru Kelas 2A)\n6. **Rosmiati, S.Pd.** (Guru Kelas 2B)\n7. **Dewi Novita, S.Pd. SD., Gr.** (Guru Kelas 3A)\n8. **Rezky Auliah, S.Pd.** (Guru Kelas 3B)\n9. **Agustina, S.Pd.I.** (Guru Kelas 4A)\n10. **Badaruddin, S.Pd., M.Pd.** (Guru Kelas 4B)\n11. **Nelly Arif, S.Pd. SD** (Guru Kelas 5A)\n12. **Nurhasanah, S.Pd. Gr., M.Pd.** (Guru Kelas 5B)\n13. **Mantasia, S.Pd.** (Guru Kelas 6A)\n14. **Nurliati, S.Pd., M.Pd.** (Guru Kelas 6B)\n15. **Nawir, S.Pd.** (Guru Mapel PJOK)\n16. **Mustaid, S.Pd.** (Guru Mapel PJOK)\n17. **Muliana, S.Pd., M.Pd.** (Guru Mapel PAIBP)\n18. **Nursaida, S.Pd.I.** (Guru Mapel PAIBP)`;
      } else if (lower.includes('alamat') || lower.includes('lokasi') || lower.includes('kontak') || lower.includes('telepon') || lower.includes('npsn')) {
        botResponseText = `📍 **Identitas & Lokasi Resmi Sekolah:**\n- **Nama Sekolah:** UPTD SDN 5 Barandasi (NPSN: 40300391 | NSS: 101190110001)\n- **Alamat:** JL. Pendidikan No. 11, Barandasi, Kel. Maccini Baji, Kec. Lau, Kab. Maros, Prov. Sulawesi Selatan, Kode POS 90513\n- **Email Resmi:** sd5barandasi@gmail.com\n- **Operator Sekolah:** SULARTI\n- **Koordinat Peta:** Lintang: -4.975385, Bujur: 119.572960\n- **Status / Akreditasi:** Negeri / Akreditasi B (SK: 18/I/DPMPTSP/108/2019)`;
      } else {
        botResponseText = `Terima kasih atas pertanyaannya! UPTD SDN 5 Barandasi siap menyambut calon murid baru T.A. 2026/2027.\n\nUntuk mendaftar SPMB 2026 silakan buka portal resmi Pusdatin Maros di:\n${SPMB_PORTAL_URL}`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-sm max-w-lg w-full h-[80vh] flex flex-col border border-indigo-900 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-amber-400 text-indigo-950 flex items-center justify-center font-bold border border-amber-500">
              <Sparkles className="w-5 h-5 text-indigo-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>AI SDN 5 BARANDASI</span>
                <span className="bg-emerald-900 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-emerald-700">
                  ONLINE
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">Asisten Informasi SPMB 2026 & KSP Sekolah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-sm hover:bg-indigo-900 transition-colors cursor-pointer border border-transparent hover:border-indigo-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-indigo-900 text-amber-300 border-indigo-800'
                  : 'bg-amber-400 text-indigo-950 border-amber-500'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-sm p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-900 text-white border border-indigo-800'
                  : 'bg-white text-slate-900 border border-slate-200'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[10px] mt-1 text-right font-medium ${
                  msg.sender === 'user' ? 'text-amber-300' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-sm border border-slate-200 w-fit">
              <Bot className="w-4 h-4 text-amber-500" />
              <span>AI sedang merespons...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-slate-100 hover:bg-indigo-50 text-indigo-950 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border border-slate-200 transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ketik pertanyaan tentang SPMB atau SDN 5 Barandasi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-xs sm:text-sm focus:outline-none focus:border-indigo-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-900 hover:bg-indigo-800 disabled:opacity-50 text-amber-300 p-2.5 rounded-sm transition-colors cursor-pointer border border-indigo-900"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

