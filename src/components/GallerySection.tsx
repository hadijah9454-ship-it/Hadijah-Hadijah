import React, { useState } from 'react';
import { 
  Camera, Eye, X, Play, Image as ImageIcon, Sparkles, MapPin 
} from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhoto, setActivePhoto] = useState<{ url: string; title: string; category: string } | null>(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Upacara Bendera Senin Pagi & Pengibaran Sang Saka',
      category: 'Kegiatan',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Praktikum Biologi & Riset Mikroskopis Lab STEM',
      category: 'Fasilitas',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'Pentas Seni & Tari Saman Kolosal Siswa',
      category: 'Seni',
      url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      title: 'Pertandingan Final Basket DBL Series',
      category: 'Prestasi',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      title: 'Suasana Belajar Nyaman di Perpustakaan Digital',
      category: 'Fasilitas',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 6,
      title: 'Pameran Karya Inovasi Daur Ulang P5 Kurikulum Merdeka',
      category: 'Kegiatan',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const filteredItems = galleryItems.filter(
    item => selectedCategory === 'Semua' || item.category === selectedCategory
  );

  return (
    <section id="galeri" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-[1px] w-8 bg-indigo-900" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                DOKUMENTASI SEKOLAH
              </span>
            </div>
            <h2 className="text-3xl font-light text-indigo-950 tracking-tight">
              GALERI FOTO & <span className="font-bold italic text-indigo-900">SUASANA SEKOLAH</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Intip momen seru kegiatan belajar, kompetisi, dan kehidupan sekolah UPTD SDN 5 Barandasi.</p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {['Semua', 'Kegiatan', 'Fasilitas', 'Seni', 'Prestasi'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-indigo-900 text-amber-300 border-indigo-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-sm overflow-hidden bg-indigo-950 h-64 border border-slate-200 hover:border-indigo-900 transition-all cursor-pointer"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/30 to-transparent p-5 flex flex-col justify-end">
                <span className="bg-amber-400 text-indigo-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm w-fit mb-1.5">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-snug group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
              </div>
              <div className="absolute top-4 right-4 bg-indigo-950/80 p-2 rounded-sm text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-800">
                <Eye className="w-4 h-4 text-amber-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-indigo-950 rounded-sm overflow-hidden border border-indigo-800 relative shadow-2xl">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 bg-indigo-900 text-white p-2 rounded-sm cursor-pointer hover:bg-indigo-800 z-10 border border-indigo-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[65vh] bg-black">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-indigo-950 text-white flex items-center justify-between border-t border-indigo-900">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{activePhoto.category}</span>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white mt-0.5">{activePhoto.title}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
