import { TEACHERS_LIST } from '../data/schoolData';
import { Teacher } from '../types';

export const PHOTO_STORAGE_KEY = 'sdn5_custom_teacher_photos_v1';
export const PHOTO_UPDATED_EVENT = 'sdn5_teacher_photos_updated';

// Priority teachers explicitly requested by user
export const REQUESTED_TEACHER_NAMES = [
  'Hadijah (Kepsek)',
  'Muliana',
  'Hastuti',
  'Rosmiati',
  'Nurhasanah',
  'Nurliati',
  'Novita Dewi',
  'Nurlaela',
  'Agustina',
  'Nelly Arif',
  'Resky Aulia',
  'Nursaida',
  'Badaruddin',
  'Rasmi'
];

/**
 * Retrieve all custom photos stored in localStorage
 */
export function getStoredTeacherPhotos(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read custom teacher photos from localStorage', err);
    return {};
  }
}

/**
 * Get effective photo URL for a teacher (custom uploaded or default)
 */
export function getTeacherEffectivePhoto(teacher: Teacher, customPhotos?: Record<string, string>): string {
  const store = customPhotos || getStoredTeacherPhotos();
  if (store[teacher.id]) {
    return store[teacher.id];
  }
  return teacher.photo;
}

/**
 * Save custom photo for a teacher
 */
export function saveTeacherPhoto(teacherId: string, dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredTeacherPhotos();
    current[teacherId] = dataUrl;
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(PHOTO_UPDATED_EVENT, { detail: { teacherId, dataUrl } }));
  } catch (err) {
    console.error('Failed to save teacher photo', err);
    throw err;
  }
}

/**
 * Remove custom photo for a teacher
 */
export function removeTeacherPhoto(teacherId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredTeacherPhotos();
    delete current[teacherId];
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(PHOTO_UPDATED_EVENT, { detail: { teacherId } }));
  } catch (err) {
    console.error('Failed to remove teacher photo', err);
  }
}

/**
 * Clear all custom photos
 */
export function clearAllTeacherPhotos(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PHOTO_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(PHOTO_UPDATED_EVENT, { detail: { cleared: true } }));
  } catch (err) {
    console.error('Failed to clear photos', err);
  }
}

/**
 * Compress an image file/blob to prevent localStorage quota exhaustion.
 * Standardizes to max 640x640px, JPEG quality 0.85 (typically 30KB - 60KB per portrait).
 */
export function compressImageFile(file: File | Blob, maxWidth = 640, maxHeight = 640, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses berkas gambar'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar'));
    reader.readAsDataURL(file);
  });
}

/**
 * Smart matcher: recognizes teacher from a filename or user text query.
 * Matches Indonesian names like "Muliana", "Hastuti", "Rosmiati", "Novita Dewi", "Nurlaela", etc.
 */
export function matchTeacherByFilename(filename: string): Teacher | undefined {
  const clean = filename.toLowerCase().replace(/[^a-z0-9]/g, ' ');

  // Direct special match for principal
  if (clean.includes('kepsek') || clean.includes('hadijah') || clean.includes('kepala')) {
    return TEACHERS_LIST.find(t => t.id === 't1');
  }

  // Check specific alias mappings
  const aliasMap: Record<string, string> = {
    'muliana': 't17',
    'hastuti': 't2',
    'rosmiati': 't6',
    'nurhasanah': 't12',
    'hasanah': 't12',
    'nurliati': 't14',
    'liati': 't14',
    'novita': 't7',
    'dewi novita': 't7',
    'nurlaela': 't5',
    'nurlela': 't5',
    'lela': 't5',
    'agustina': 't9',
    'nelly': 't11',
    'nelly arif': 't11',
    'resky': 't8',
    'rezky': 't8',
    'aulia': 't8',
    'auliah': 't8',
    'nursaida': 't18',
    'saida': 't18',
    'badaruddin': 't4',
    'badar': 't4',
    'rasmi': 't10',
    'rahmawati': 't3',
    'mantasia': 't13',
    'nawir': 't15',
    'mustaid': 't16',
    'safaruddin': 't19',
    'safar': 't19',
    'arman': 't20',
    'sularti': 't21'
  };

  for (const [key, teacherId] of Object.entries(aliasMap)) {
    if (clean.includes(key)) {
      return TEACHERS_LIST.find(t => t.id === teacherId);
    }
  }

  // Fallback: match by actual teacher name parts
  return TEACHERS_LIST.find(teacher => {
    const teacherClean = teacher.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const parts = teacherClean.split(' ').filter(p => p.length > 3 && !['s.pd', 'm.pd', 's.pd.i', 's.pd.sd', 'gr.'].includes(p));
    return parts.some(p => clean.includes(p));
  });
}
