import { NewsComment } from '../types';

export const NEWS_LIKES_STORAGE_KEY = 'sdn5_news_likes_counts_v1';
export const USER_LIKED_NEWS_KEY = 'sdn5_user_liked_news_ids_v1';
export const NEWS_COMMENTS_STORAGE_KEY = 'sdn5_news_comments_store_v1';
export const USER_LIKED_COMMENTS_KEY = 'sdn5_user_liked_comments_v1';
export const USER_AUTHORED_COMMENTS_KEY = 'sdn5_user_authored_comment_ids_v1';

// Initial default likes count for each article
export const DEFAULT_NEWS_LIKES: Record<string, number> = {
  n1: 38,
  n2: 29,
  n3: 45,
  n4: 23,
  n5: 42,
  n6: 56,
};

// Realistic initial community comments for SDN 5 Barandasi
export const SEED_NEWS_COMMENTS: Record<string, NewsComment[]> = {
  n1: [
    {
      id: 'c-n1-1',
      newsId: 'n1',
      authorName: 'Ibu Nurul Aisyah',
      role: 'Orang Tua Siswa',
      content: 'Assalamu’alaikum, terima kasih informasinya sangat jelas dan membantu. Untuk jadwal verifikasi berkas fisik langsung di sekolah dibuka mulai jam berapa ya Bapak/Ibu Panitia?',
      createdAt: '02 Agustus 2026, 09:15',
      likes: 8
    },
    {
      id: 'c-n1-2',
      newsId: 'n1',
      authorName: 'Hastuti, S.Pd., Gr.',
      role: 'Guru / Tenaga Pendidik',
      content: 'Wa’alaikumussalam Ibu Nurul. Pelayanan verifikasi berkas fisik di sekretariat SPMB SDN 5 Barandasi dibuka setiap hari kerja pukul 08.00 - 12.00 WITA. Tim panitia siap mendampingi bimbingan teknis.',
      createdAt: '02 Agustus 2026, 10:30',
      likes: 12
    },
    {
      id: 'c-n1-3',
      newsId: 'n1',
      authorName: 'Rahmat Hidayat',
      role: 'Alumni',
      content: 'Alhamdulillah sistem SPMB sekarang sudah terintegrasi terpusat di portal Pusdatin Maros. Semoga almamater tercinta SDN 5 Barandasi terus mencetak siswa-siswi berprestasi!',
      createdAt: '03 Agustus 2026, 14:05',
      likes: 6
    }
  ],
  n2: [
    {
      id: 'c-n2-1',
      newsId: 'n2',
      authorName: 'H. Ahmad Basri',
      role: 'Orang Tua Siswa',
      content: 'Slide presentasi KSP di website ini sangat interaktif dan informatif! Kami para wali murid jadi paham betul arah 8 dimensi profil lulusan dan penerapan Deep Learning untuk anak-anak kami.',
      createdAt: '29 Juli 2026, 11:20',
      likes: 11
    },
    {
      id: 'c-n2-2',
      newsId: 'n2',
      authorName: 'Hadijah, S.Pd., M.Pd.',
      role: 'Guru / Tenaga Pendidik',
      content: 'Terima kasih banyak atas dukungan penuh seluruh orang tua siswa. Dokumen KSP ini disusun sebagai pedoman bersama untuk menghadirkan iklim belajar yang aman, ramah, dan membahagiakan anak didik.',
      createdAt: '29 Juli 2026, 13:45',
      likes: 15
    }
  ],
  n3: [
    {
      id: 'c-n3-1',
      newsId: 'n3',
      authorName: 'Daeng Bella',
      role: 'Masyarakat Umum',
      content: 'Selamat atas capaian Juara 1 Tingkat Kabupaten Maros! Sangat bangga melihat adik-adik SDN 5 Barandasi dengan bangga melestarikan seni tari Bugis-Makassar. Salama’ ki tapada salama’!',
      createdAt: '16 Juli 2026, 16:10',
      likes: 14
    },
    {
      id: 'c-n3-2',
      newsId: 'n3',
      authorName: 'Ibu Sitti Maryam',
      role: 'Orang Tua Siswa',
      content: 'Terima kasih banyak kepada Ibu Guru Pembina Tari yang sangat telaten membimbing anak-anak sejak latihan dasar. Anak saya jadi semakin percaya diri!',
      createdAt: '16 Juli 2026, 18:30',
      likes: 9
    },
    {
      id: 'c-n3-3',
      newsId: 'n3',
      authorName: 'Andi Muh. Fathir',
      role: 'Siswa',
      content: 'Selamat buat teman-teman tim tari SDN 5 Barandasi! Keren banget pialanya!',
      createdAt: '17 Juli 2026, 08:20',
      likes: 7
    }
  ],
  n4: [
    {
      id: 'c-n4-1',
      newsId: 'n4',
      authorName: 'Pak Darwis',
      role: 'Orang Tua Siswa',
      content: 'Semoga anak-anak kelas V dapat mengikuti gladi bersih dan pelaksanaan ANBK dengan lancar dan tanpa rasa tegang. Sukses selalu SDN 5 Barandasi!',
      createdAt: '11 Juli 2026, 08:45',
      likes: 9
    },
    {
      id: 'c-n4-2',
      newsId: 'n4',
      authorName: 'Operator ANBK',
      role: 'Guru / Tenaga Pendidik',
      content: 'Aamiin ya Rabbal Alamin. Sarana laboratorium komputer, jaringan internet, dan genset cadangan sudah disiapkan optimal. Anak-anak akan didampingi dengan tenang.',
      createdAt: '11 Juli 2026, 09:30',
      likes: 10
    }
  ],
  n5: [
    {
      id: 'c-n5-1',
      newsId: 'n5',
      authorName: 'Hj. Rahmawati. S, S.Pd., M.Pd.',
      role: 'Guru / Tenaga Pendidik',
      content: 'Regulasi Kemendikdasmen mengenai Deep Learning (Mindful, Meaningful, Joyful) ini sangat tepat diterapkan. Anak-anak tidak sekadar menghafal materi, tetapi memahami hakikat dan kegunaannya dalam kehidupan nyata.',
      createdAt: '19 Agustus 2026, 10:15',
      likes: 16
    },
    {
      id: 'c-n5-2',
      newsId: 'n5',
      authorName: 'Bapak Firman',
      role: 'Orang Tua Siswa',
      content: 'Sangat setuju sekali. Kami orang tua di rumah juga merasa anak-anak jadi lebih ceria berangkat ke sekolah karena suasana belajar yang menyenangkan dan ramah anak.',
      createdAt: '19 Agustus 2026, 14:40',
      likes: 12
    }
  ],
  n6: [
    {
      id: 'c-n6-1',
      newsId: 'n6',
      authorName: 'Dr. H. Mukhlis, M.Pd.',
      role: 'Masyarakat Umum',
      content: 'Kutipan filosofi Ki Hadjar Dewantara selalu relevan sepanjang masa. Kemitraan harmonis antara guru dan orang tua adalah fondasi utama pendidikan karakter generasi masa depan.',
      createdAt: '13 Agustus 2026, 11:00',
      likes: 18
    },
    {
      id: 'c-n6-2',
      newsId: 'n6',
      authorName: 'Ibu Rismawati',
      role: 'Orang Tua Siswa',
      content: 'Terima kasih atas artikel motivasi yang sangat menyejukkan hati ini. Mengingatkan kami orang tua untuk selalu sabar dan memberikan apresiasi tulus atas setiap usaha anak.',
      createdAt: '13 Agustus 2026, 15:25',
      likes: 15
    }
  ]
};

// ==========================================
// NEWS LIKES HELPERS
// ==========================================

export function getStoredNewsLikes(): Record<string, number> {
  if (typeof window === 'undefined') return DEFAULT_NEWS_LIKES;
  try {
    const raw = localStorage.getItem(NEWS_LIKES_STORAGE_KEY);
    if (!raw) return DEFAULT_NEWS_LIKES;
    return { ...DEFAULT_NEWS_LIKES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NEWS_LIKES;
  }
}

export function getUserLikedNews(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_LIKED_NEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getNewsLikeInfo(newsId: string, fallbackInitial = 25): { count: number; isLiked: boolean } {
  const likesMap = getStoredNewsLikes();
  const userLikes = getUserLikedNews();
  const count = likesMap[newsId] !== undefined ? likesMap[newsId] : (DEFAULT_NEWS_LIKES[newsId] ?? fallbackInitial);
  const isLiked = userLikes.includes(newsId);
  return { count, isLiked };
}

export function toggleNewsLike(newsId: string, fallbackInitial = 25): { count: number; isLiked: boolean } {
  const currentLikes = getStoredNewsLikes();
  const userLikes = getUserLikedNews();
  const isCurrentlyLiked = userLikes.includes(newsId);
  
  let currentCount = currentLikes[newsId] !== undefined ? currentLikes[newsId] : (DEFAULT_NEWS_LIKES[newsId] ?? fallbackInitial);
  let newLikedList: string[];
  let newCount: number;

  if (isCurrentlyLiked) {
    newLikedList = userLikes.filter(id => id !== newsId);
    newCount = Math.max(0, currentCount - 1);
  } else {
    newLikedList = [...userLikes, newsId];
    newCount = currentCount + 1;
  }

  currentLikes[newsId] = newCount;

  try {
    localStorage.setItem(USER_LIKED_NEWS_KEY, JSON.stringify(newLikedList));
    localStorage.setItem(NEWS_LIKES_STORAGE_KEY, JSON.stringify(currentLikes));
    window.dispatchEvent(new CustomEvent('sdn5_news_likes_updated', { detail: { newsId, newCount, isLiked: !isCurrentlyLiked } }));
  } catch (err) {
    console.warn('Failed to save news like to localStorage', err);
  }

  return { count: newCount, isLiked: !isCurrentlyLiked };
}

// ==========================================
// NEWS COMMENTS HELPERS
// ==========================================

export function getStoredNewsComments(newsId: string): NewsComment[] {
  if (typeof window === 'undefined') {
    return SEED_NEWS_COMMENTS[newsId] || [];
  }

  try {
    const raw = localStorage.getItem(NEWS_COMMENTS_STORAGE_KEY);
    const allCommentsMap: Record<string, NewsComment[]> = raw ? JSON.parse(raw) : {};
    
    if (allCommentsMap[newsId]) {
      return allCommentsMap[newsId];
    }

    // Seed defaults
    const defaults = SEED_NEWS_COMMENTS[newsId] || [];
    return defaults;
  } catch {
    return SEED_NEWS_COMMENTS[newsId] || [];
  }
}

export function getAllStoredCommentsMap(): Record<string, NewsComment[]> {
  if (typeof window === 'undefined') return SEED_NEWS_COMMENTS;
  try {
    const raw = localStorage.getItem(NEWS_COMMENTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    // Merge seeds for news items not yet in storage
    const merged = { ...SEED_NEWS_COMMENTS, ...parsed };
    return merged;
  } catch {
    return SEED_NEWS_COMMENTS;
  }
}

export function addNewsComment(
  newsId: string, 
  authorName: string, 
  role: NewsComment['role'], 
  content: string
): NewsComment {
  const currentComments = getStoredNewsComments(newsId);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + `, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newComment: NewsComment = {
    id: `c-${newsId}-${Date.now()}`,
    newsId,
    authorName: authorName.trim(),
    role,
    content: content.trim(),
    createdAt: dateFormatted,
    likes: 0
  };

  const updatedComments = [newComment, ...currentComments];
  const allMap = getAllStoredCommentsMap();
  allMap[newsId] = updatedComments;

  try {
    localStorage.setItem(NEWS_COMMENTS_STORAGE_KEY, JSON.stringify(allMap));
    
    // Remember that this user authored this comment (so they can delete it if needed)
    const rawAuthored = localStorage.getItem(USER_AUTHORED_COMMENTS_KEY);
    const authoredList: string[] = rawAuthored ? JSON.parse(rawAuthored) : [];
    authoredList.push(newComment.id);
    localStorage.setItem(USER_AUTHORED_COMMENTS_KEY, JSON.stringify(authoredList));

    window.dispatchEvent(new CustomEvent('sdn5_news_comments_updated', { detail: { newsId } }));
  } catch (err) {
    console.warn('Failed to save comment to localStorage', err);
  }

  return newComment;
}

export function deleteNewsComment(newsId: string, commentId: string): boolean {
  const currentComments = getStoredNewsComments(newsId);
  const filtered = currentComments.filter(c => c.id !== commentId);
  const allMap = getAllStoredCommentsMap();
  allMap[newsId] = filtered;

  try {
    localStorage.setItem(NEWS_COMMENTS_STORAGE_KEY, JSON.stringify(allMap));
    window.dispatchEvent(new CustomEvent('sdn5_news_comments_updated', { detail: { newsId } }));
    return true;
  } catch (err) {
    console.warn('Failed to delete comment', err);
    return false;
  }
}

export function isCommentAuthoredByMe(commentId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(USER_AUTHORED_COMMENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(commentId);
  } catch {
    return false;
  }
}

export function getUserLikedComments(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_LIKED_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleCommentLike(newsId: string, commentId: string): { count: number; isLiked: boolean } {
  const userLikes = getUserLikedComments();
  const isLiked = userLikes.includes(commentId);
  const comments = getStoredNewsComments(newsId);

  let newLikedList: string[];
  let updatedCount = 0;

  if (isLiked) {
    newLikedList = userLikes.filter(id => id !== commentId);
  } else {
    newLikedList = [...userLikes, commentId];
  }

  const updatedComments = comments.map(c => {
    if (c.id === commentId) {
      const count = isLiked ? Math.max(0, c.likes - 1) : c.likes + 1;
      updatedCount = count;
      return { ...c, likes: count };
    }
    return c;
  });

  const allMap = getAllStoredCommentsMap();
  allMap[newsId] = updatedComments;

  try {
    localStorage.setItem(USER_LIKED_COMMENTS_KEY, JSON.stringify(newLikedList));
    localStorage.setItem(NEWS_COMMENTS_STORAGE_KEY, JSON.stringify(allMap));
    window.dispatchEvent(new CustomEvent('sdn5_news_comments_updated', { detail: { newsId } }));
  } catch (err) {
    console.warn('Failed to update comment like', err);
  }

  return { count: updatedCount, isLiked: !isLiked };
}
