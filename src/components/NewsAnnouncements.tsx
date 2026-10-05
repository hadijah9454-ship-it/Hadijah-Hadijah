import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, Calendar, User, Clock, Search, ArrowRight, 
  X, Megaphone, Trophy, Sparkles, Share2, Heart, MessageSquare, 
  Send, ThumbsUp, Trash2, ExternalLink, CornerDownRight, Check,
  MessageCircle, Sparkle
} from 'lucide-react';
import { NEWS_LIST } from '../data/schoolData';
import { NewsItem, NewsComment } from '../types';
import { 
  getStoredNewsLikes, 
  getUserLikedNews, 
  toggleNewsLike,
  getAllStoredCommentsMap,
  addNewsComment,
  deleteNewsComment,
  toggleCommentLike,
  getUserLikedComments,
  isCommentAuthoredByMe
} from '../utils/newsInteractionStore';

export const NewsAnnouncements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Likes and comments state
  const [likesMap, setLikesMap] = useState<Record<string, number>>(getStoredNewsLikes);
  const [userLikedNews, setUserLikedNews] = useState<string[]>(getUserLikedNews);
  const [commentsMap, setCommentsMap] = useState<Record<string, NewsComment[]>>(getAllStoredCommentsMap);
  const [userLikedComments, setUserLikedComments] = useState<string[]>(getUserLikedComments);

  // Comment submission form state
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState<NewsComment['role']>('Orang Tua Siswa');
  const [commentContent, setCommentContent] = useState('');
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [commentSort, setCommentSort] = useState<'terbaru' | 'populer'>('terbaru');

  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement | null>(null);

  // Sync state on custom window events
  useEffect(() => {
    const handleLikesUpdated = () => {
      setLikesMap(getStoredNewsLikes());
      setUserLikedNews(getUserLikedNews());
    };

    const handleCommentsUpdated = () => {
      setCommentsMap(getAllStoredCommentsMap());
      setUserLikedComments(getUserLikedComments());
    };

    window.addEventListener('sdn5_news_likes_updated', handleLikesUpdated);
    window.addEventListener('sdn5_news_comments_updated', handleCommentsUpdated);

    return () => {
      window.removeEventListener('sdn5_news_likes_updated', handleLikesUpdated);
      window.removeEventListener('sdn5_news_comments_updated', handleCommentsUpdated);
    };
  }, []);

  const handleToggleNewsLike = (newsId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fallback = NEWS_LIST.find(n => n.id === newsId)?.initialLikes ?? 25;
    const result = toggleNewsLike(newsId, fallback);
    
    setLikesMap(prev => ({ ...prev, [newsId]: result.count }));
    setUserLikedNews(prev => 
      result.isLiked ? [...prev, newsId] : prev.filter(id => id !== newsId)
    );
  };

  const handleToggleCommentLike = (newsId: string, commentId: string) => {
    const result = toggleCommentLike(newsId, commentId);
    setUserLikedComments(prev => 
      result.isLiked ? [...prev, commentId] : prev.filter(id => id !== commentId)
    );
    setCommentsMap(getAllStoredCommentsMap());
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNews) return;

    if (!authorName.trim()) {
      setNotificationMsg({ text: 'Mohon isi nama Anda terlebih dahulu.', type: 'info' });
      return;
    }
    if (!commentContent.trim() || commentContent.trim().length < 3) {
      setNotificationMsg({ text: 'Komentar terlalu singkat, tuliskan minimal beberapa kata.', type: 'info' });
      return;
    }

    setIsSubmitting(true);
    const finalContent = replyTarget 
      ? `Membalas @${replyTarget}: ${commentContent.trim()}`
      : commentContent.trim();

    addNewsComment(selectedNews.id, authorName, role, finalContent);
    
    setCommentContent('');
    setReplyTarget(null);
    setIsSubmitting(false);
    setNotificationMsg({ text: 'Terima kasih! Komentar Anda berhasil diterbitkan.', type: 'success' });
    setCommentsMap(getAllStoredCommentsMap());

    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleDeleteComment = (newsId: string, commentId: string) => {
    if (window.confirm('Hapus komentar Anda?')) {
      deleteNewsComment(newsId, commentId);
      setCommentsMap(getAllStoredCommentsMap());
      setNotificationMsg({ text: 'Komentar telah dihapus.', type: 'info' });
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleReplyClick = (targetName: string) => {
    setReplyTarget(targetName);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
      commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleShare = (news: NewsItem) => {
    const shareData = {
      title: news.title,
      text: news.summary,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // user cancelled share
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setNotificationMsg({ text: 'Tautan berita telah disalin ke papan klip!', type: 'success' });
      setTimeout(() => setNotificationMsg(null), 3500);
    }
  };

  const filteredNews = NEWS_LIST.filter((item) => {
    const matchesCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: NewsItem['category']) => {
    switch (category) {
      case 'prestasi':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-amber-300 flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-700" /> Prestasi</span>;
      case 'ppdb':
        return <span className="bg-indigo-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-300" /> PPDB / SPMB</span>;
      case 'pengumuman':
        return <span className="bg-rose-100 text-rose-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-rose-300 flex items-center gap-1"><Megaphone className="w-3 h-3 text-rose-700" /> Pengumuman</span>;
      default:
        return <span className="bg-slate-100 text-indigo-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-slate-300 flex items-center gap-1"><Newspaper className="w-3 h-3 text-indigo-900" /> Berita</span>;
    }
  };

  const getRoleBadge = (commentRole: NewsComment['role']) => {
    switch (commentRole) {
      case 'Orang Tua Siswa':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Orang Tua Siswa</span>;
      case 'Guru / Tenaga Pendidik':
        return <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Guru / Tenaga Pendidik</span>;
      case 'Siswa':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Siswa SDN 5</span>;
      case 'Alumni':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Alumni</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Masyarakat</span>;
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-indigo-900 text-white',
      'bg-emerald-700 text-white',
      'bg-amber-600 text-white',
      'bg-rose-700 text-white',
      'bg-cyan-800 text-white',
      'bg-purple-800 text-white'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Get active comments for modal
  const currentNewsComments = selectedNews ? (commentsMap[selectedNews.id] || []) : [];
  const sortedComments = [...currentNewsComments].sort((a, b) => {
    if (commentSort === 'populer') {
      return b.likes - a.likes;
    }
    return 0; // Default order is chronological/reverse from storage
  });

  return (
    <section id="berita" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-[1px] w-8 bg-indigo-900" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-900">
                PUSAT INFORMASI & INTERAKSI
              </span>
            </div>
            <h2 className="text-3xl font-light text-indigo-950 tracking-tight">
              BERITA, REGULASI & <span className="font-bold italic text-indigo-900">INTERAKSI</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Dapatkan berita aktual, referensi regulasi pendidikan resmi, prestasi, dan berikan tanggapan serta apresiasi Anda.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik, regulasi, prestasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] uppercase font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'semua', label: 'Semua Artikel' },
              { id: 'berita', label: 'Berita Sekolah' },
              { id: 'pengumuman', label: 'Pengumuman & Regulasi' },
              { id: 'prestasi', label: 'Prestasi Siswa' },
              { id: 'ppdb', label: 'SPMB / PPDB' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-sm text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-indigo-950">{filteredNews.length}</span> artikel
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-slate-50 rounded-sm p-12 text-center border border-slate-200">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Tidak ada artikel ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori berbeda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => {
              const likeCount = likesMap[news.id] ?? news.initialLikes ?? 25;
              const isLiked = userLikedNews.includes(news.id);
              const commentsCount = (commentsMap[news.id] || []).length;

              return (
                <article
                  key={news.id}
                  className="bg-white rounded-sm border border-slate-200 overflow-hidden hover:border-indigo-900 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                  onClick={() => setSelectedNews(news)}
                >
                  {/* News Image Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      {getCategoryBadge(news.category)}
                    </div>
                    {news.isImportant && (
                      <div className="absolute top-3 right-3 bg-indigo-950 text-amber-300 border border-indigo-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        Penting
                      </div>
                    )}
                  </div>

                  {/* News Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {news.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {news.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-indigo-950 line-clamp-2 group-hover:text-indigo-900 transition-colors leading-snug">
                        {news.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {news.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                      {/* Author & Read More */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate max-w-[60%]">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{news.author}</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                          Baca
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Interaction Bar on Card: Likes & Comments */}
                      <div className="pt-2 border-t border-dashed border-slate-100 flex items-center justify-between text-xs">
                        {/* Like Button on Card */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleNewsLike(news.id, e)}
                          title={isLiked ? 'Batalkan suka' : 'Sukai berita ini'}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                            isLiked 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
                          }`}
                        >
                          <Heart 
                            className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                              isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                            }`} 
                          />
                          <span>{likeCount}</span>
                          <span className="hidden sm:inline text-[11px] font-normal">{isLiked ? 'Disukai' : 'Suka'}</span>
                        </button>

                        {/* Comment Counter on Card */}
                        <div 
                          className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-900 font-medium px-2 py-1 rounded-sm hover:bg-indigo-50 transition-colors"
                          title="Lihat komentar dan berinteraksi"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{commentsCount}</span>
                          <span className="text-[11px] text-slate-400">Komentar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Detailed News Modal with Rich Article & Interactive Comments Section */}
        {selectedNews && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-sm max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-300 relative my-6 shadow-2xl">
              
              {/* Modal Image Header */}
              <div className="relative h-60 sm:h-72 bg-indigo-950">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                <button
                  onClick={() => {
                    setSelectedNews(null);
                    setNotificationMsg(null);
                  }}
                  className="absolute top-4 right-4 bg-indigo-950/90 hover:bg-rose-700 text-white p-2 rounded-sm transition-colors cursor-pointer shadow-md"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  {getCategoryBadge(selectedNews.category)}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-8 space-y-6">
                
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-900" />
                    {selectedNews.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-900" />
                    {selectedNews.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-900" />
                    {selectedNews.readTime}
                  </span>
                </div>

                {/* News Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-950 leading-snug">
                  {selectedNews.title}
                </h2>

                {/* Official Source Reference (if available) */}
                {selectedNews.sourceName && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-sm text-xs text-indigo-950">
                    <span className="font-bold text-indigo-900">Sumber Rujukan Akurat:</span>
                    <span className="text-slate-700">{selectedNews.sourceName}</span>
                    {selectedNews.sourceUrl && (
                      <a 
                        href={selectedNews.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-900 font-bold hover:underline ml-auto"
                      >
                        Kunjungi Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedNews.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-slate-200">
                      #{tag}
                    </span>
                  ))}
                </div>

                <hr className="border-slate-200" />

                {/* Article Content */}
                <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedNews.content}
                </div>

                {/* Interactive Article Action Bar (Like, Share, Comment Shortcut) */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Primary Like Button */}
                    {(() => {
                      const isLiked = userLikedNews.includes(selectedNews.id);
                      const count = likesMap[selectedNews.id] ?? selectedNews.initialLikes ?? 25;
                      return (
                        <button
                          type="button"
                          onClick={() => handleToggleNewsLike(selectedNews.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                            isLiked
                              ? 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600'
                              : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-300'
                          }`}
                        >
                          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-white text-white' : 'text-rose-600'}`} />
                          <span>{isLiked ? 'Anda Menyukai Ini' : 'Sukai Artikel'}</span>
                          <span className="bg-black/10 px-1.5 py-0.5 rounded-full text-[11px]">{count}</span>
                        </button>
                      );
                    })()}

                    {/* Scroll to Comments Button */}
                    <button
                      type="button"
                      onClick={() => {
                        commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        commentInputRef.current?.focus();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider bg-white text-indigo-950 hover:bg-indigo-50 border border-slate-300 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-900" />
                      <span>{currentNewsComments.length} Komentar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare(selectedNews)}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-sm cursor-pointer border border-slate-300 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Bagikan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNews(null)}
                      className="bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>

                {/* Toast Notification (if any) */}
                {notificationMsg && (
                  <div className={`p-3 rounded-sm text-xs font-medium flex items-center gap-2 ${
                    notificationMsg.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                      : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                  }`}>
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{notificationMsg.text}</span>
                  </div>
                )}

                {/* ============================================================== */}
                {/* KOLOM KOMENTAR & INTERAKSI PENGUNJUNG                          */}
                {/* ============================================================== */}
                <div ref={commentsSectionRef} className="pt-6 border-t-2 border-indigo-900/20 space-y-6">
                  
                  {/* Section Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-indigo-900" />
                        <h3 className="text-lg font-bold text-indigo-950">
                          Kolom Komentar & Interaksi Pengunjung
                        </h3>
                        <span className="bg-indigo-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {currentNewsComments.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sampaikan tanggapan, apresiasi, doa, atau pertanyaan Anda. Terbuka untuk seluruh warga sekolah dan masyarakat.
                      </p>
                    </div>

                    {/* Sort comments */}
                    {currentNewsComments.length > 1 && (
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm text-[11px] font-semibold self-start">
                        <button
                          type="button"
                          onClick={() => setCommentSort('terbaru')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            commentSort === 'terbaru' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Terbaru
                        </button>
                        <button
                          type="button"
                          onClick={() => setCommentSort('populer')}
                          className={`px-2.5 py-1 rounded-sm cursor-pointer ${
                            commentSort === 'populer' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Terpopuler
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comment Submission Form */}
                  <form onSubmit={handleSubmitComment} className="bg-slate-50 border border-slate-300 p-4 sm:p-5 rounded-sm space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center justify-between">
                      <span>Tulis Komentar Baru</span>
                      {replyTarget && (
                        <div className="flex items-center gap-1 text-indigo-700 normal-case font-normal text-xs bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200">
                          <span>Membalas <strong>@{replyTarget}</strong></span>
                          <button 
                            type="button" 
                            onClick={() => setReplyTarget(null)}
                            className="text-rose-600 hover:text-rose-800 font-bold ml-1 cursor-pointer"
                          >
                            × Batal
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Nama Lengkap / Panggilan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Contoh: Ibu Nurhayati / Daeng Rauf"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Peran / Hubungan
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as NewsComment['role'])}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-xs font-medium focus:outline-hidden focus:border-indigo-900 cursor-pointer"
                        >
                          <option value="Orang Tua Siswa">👨‍👩‍👧 Orang Tua Siswa</option>
                          <option value="Guru / Tenaga Pendidik">👨‍🏫 Guru / Tenaga Pendidik</option>
                          <option value="Siswa">🎓 Siswa UPTD SDN 5 Barandasi</option>
                          <option value="Alumni">🏛️ Alumni</option>
                          <option value="Masyarakat Umum">🌐 Masyarakat Umum</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Isi Komentar / Tanggapan <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        ref={commentInputRef}
                        required
                        rows={3}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Tuliskan apresiasi, pertanyaan, atau masukan Anda dengan santun..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-xs leading-relaxed focus:outline-hidden focus:border-indigo-900 resize-y"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        * Komentar akan langsung tampil secara publik di halaman berita ini.
                      </span>
                      <button
                        type="submit"
                        disabled={isSubmitting || !commentContent.trim() || !authorName.trim()}
                        className="flex items-center gap-1.5 px-5 py-2 bg-indigo-900 hover:bg-indigo-950 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Comments */}
                  <div className="space-y-3">
                    {sortedComments.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-sm">
                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Belum Ada Komentar</p>
                        <p className="text-xs text-slate-500 mt-1">Jadilah yang pertama menulis tanggapan atau apresiasi untuk berita ini!</p>
                      </div>
                    ) : (
                      sortedComments.map((comment) => {
                        const isCommentLiked = userLikedComments.includes(comment.id);
                        const canDelete = isCommentAuthoredByMe(comment.id);

                        return (
                          <div 
                            key={comment.id}
                            className="bg-white border border-slate-200 p-4 rounded-sm hover:border-slate-300 transition-colors space-y-2.5"
                          >
                            {/* Comment Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(comment.authorName)}`}>
                                  {getInitials(comment.authorName)}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-bold text-indigo-950">
                                      {comment.authorName}
                                    </span>
                                    {getRoleBadge(comment.role)}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {comment.createdAt}
                                  </span>
                                </div>
                              </div>

                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(selectedNews.id, comment.id)}
                                  title="Hapus komentar Anda"
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-sm cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Comment Text */}
                            <p className="text-xs text-slate-700 leading-relaxed pl-10 whitespace-pre-line">
                              {comment.content}
                            </p>

                            {/* Comment Actions: Like & Reply */}
                            <div className="pl-10 pt-1 flex items-center gap-4 text-[11px]">
                              {/* Like Comment */}
                              <button
                                type="button"
                                onClick={() => handleToggleCommentLike(selectedNews.id, comment.id)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-sm transition-colors cursor-pointer font-medium ${
                                  isCommentLiked 
                                    ? 'text-rose-700 bg-rose-50 font-bold' 
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                <ThumbsUp className={`w-3 h-3 ${isCommentLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                                <span>{comment.likes > 0 ? comment.likes : 'Suka'}</span>
                              </button>

                              {/* Reply to this comment */}
                              <button
                                type="button"
                                onClick={() => handleReplyClick(comment.authorName)}
                                className="flex items-center gap-1 text-indigo-900 hover:text-indigo-950 hover:underline font-semibold cursor-pointer"
                              >
                                <CornerDownRight className="w-3 h-3" />
                                <span>Balas</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

