import { 
  DailyClassAttendance, 
  AttendanceStatus, 
  StudentAttendanceRecord, 
  Student, 
  MonthlyClassReport, 
  MonthlyStudentReport 
} from '../types';
import { SCHOOL_CLASSES, CLASS_STUDENTS_ROSTER, getInitialSeedAttendance } from '../data/studentAttendanceData';
import { getAllMonthlyWarnings } from './attendanceWarningStore';

export const ATTENDANCE_STORAGE_KEY = 'sdn5_student_attendance_records_v1';
export const ACTIVE_TEACHER_STORAGE_KEY = 'sdn5_active_selected_teacher_v1';
export const CUSTOM_STUDENTS_STORAGE_KEY = 'sdn5_custom_added_students_v1';
export const STUDENT_ROSTER_UPDATED_EVENT = 'sdn5_student_roster_updated';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCustomAddedStudents(): Record<string, Student[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CUSTOM_STUDENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getClassStudents(classId: string): Student[] {
  const baseStudents = CLASS_STUDENTS_ROSTER[classId] || [];
  const customMap = getCustomAddedStudents();
  const customList = customMap[classId] || [];
  return [...baseStudents, ...customList];
}

export function addStudentToClass(
  classId: string, 
  studentData: {
    name: string;
    nisn: string;
    gender: 'L' | 'P';
    parentName?: string;
    parentPhone?: string;
  }
): Student {
  const customMap = getCustomAddedStudents();
  const currentCustom = customMap[classId] || [];
  
  const newStudent: Student = {
    id: `std-${classId.toLowerCase()}-cstm-${Date.now().toString(36)}`,
    nisn: studentData.nisn.trim() || `019${Math.floor(100000 + Math.random() * 900000)}`,
    name: studentData.name.trim(),
    gender: studentData.gender,
    classId,
    parentName: studentData.parentName?.trim() || undefined,
    parentPhone: studentData.parentPhone?.trim() || undefined,
  };

  customMap[classId] = [...currentCustom, newStudent];

  try {
    localStorage.setItem(CUSTOM_STUDENTS_STORAGE_KEY, JSON.stringify(customMap));
    
    // Also update today's attendance record if present
    const today = getTodayDateString();
    const all = getAllAttendanceStorage();
    const key = `${today}-${classId}`;
    if (all[key]) {
      const att = all[key];
      att.records[newStudent.id] = {
        studentId: newStudent.id,
        status: 'H',
        checkInTime: '07:15 WITA'
      };
      saveClassAttendance(att);
    }

    window.dispatchEvent(new CustomEvent(STUDENT_ROSTER_UPDATED_EVENT, { detail: { classId, student: newStudent } }));
  } catch (e) {
    console.warn('Failed to add student', e);
  }

  return newStudent;
}

export function deleteCustomStudent(classId: string, studentId: string): void {
  const customMap = getCustomAddedStudents();
  const currentCustom = customMap[classId] || [];
  customMap[classId] = currentCustom.filter(s => s.id !== studentId);

  try {
    localStorage.setItem(CUSTOM_STUDENTS_STORAGE_KEY, JSON.stringify(customMap));
    window.dispatchEvent(new CustomEvent(STUDENT_ROSTER_UPDATED_EVENT, { detail: { classId, studentId } }));
  } catch (e) {
    console.warn('Failed to remove custom student', e);
  }
}

export function getAllAttendanceStorage(): Record<string, DailyClassAttendance> {
  const todayStr = getTodayDateString();
  const seedDefaults = getInitialSeedAttendance(todayStr);

  if (typeof window === 'undefined') {
    return seedDefaults;
  }

  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(seedDefaults));
      return seedDefaults;
    }
    const parsed = JSON.parse(raw);
    return { ...seedDefaults, ...parsed };
  } catch {
    return seedDefaults;
  }
}

export function getClassAttendance(date: string, classId: string): DailyClassAttendance {
  const all = getAllAttendanceStorage();
  const key = `${date}-${classId}`;
  const students = getClassStudents(classId);
  
  if (all[key]) {
    const existing = all[key];
    let changed = false;
    students.forEach(st => {
      if (!existing.records[st.id]) {
        existing.records[st.id] = {
          studentId: st.id,
          status: 'H',
          checkInTime: '07:15 WITA'
        };
        changed = true;
      }
    });
    if (changed) {
      saveClassAttendance(existing);
    }
    return existing;
  }

  // If not yet created for this date/class, initialize with students
  const cls = SCHOOL_CLASSES.find(c => c.id === classId) || SCHOOL_CLASSES[0];
  const records: Record<string, StudentAttendanceRecord> = {};

  students.forEach(st => {
    records[st.id] = {
      studentId: st.id,
      status: 'H',
      checkInTime: '07:15 WITA'
    };
  });

  const total = students.length;
  const initialAttendance: DailyClassAttendance = {
    id: key,
    date,
    classId,
    className: cls.name,
    teacherId: cls.teacherId,
    teacherName: cls.teacherName,
    teacherNip: cls.teacherNip,
    records,
    summary: {
      total,
      hadir: total,
      sakit: 0,
      izin: 0,
      alpa: 0,
      rate: 100
    },
    submittedAt: 'Baru saja',
    isVerifiedByPrincipal: false
  };

  all[key] = initialAttendance;
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn('Storage save failed', e);
  }

  return initialAttendance;
}

export function saveClassAttendance(attendance: DailyClassAttendance): void {
  const all = getAllAttendanceStorage();
  const key = `${attendance.date}-${attendance.classId}`;

  // Recalculate summary
  const recordsArray = Object.values(attendance.records);
  const total = recordsArray.length;
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alpa = 0;

  recordsArray.forEach(rec => {
    if (rec.status === 'H') hadir++;
    else if (rec.status === 'S') sakit++;
    else if (rec.status === 'I') izin++;
    else if (rec.status === 'A') alpa++;
  });

  const rate = total > 0 ? Number(((hadir / total) * 100).toFixed(1)) : 100;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

  const updated: DailyClassAttendance = {
    ...attendance,
    summary: {
      total,
      hadir,
      sakit,
      izin,
      alpa,
      rate
    },
    submittedAt: timeStr,
    id: key
  };

  all[key] = updated;

  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('sdn5_student_attendance_updated', {
      detail: { date: attendance.date, classId: attendance.classId }
    }));
  } catch (err) {
    console.warn('Failed to save attendance', err);
  }
}

export function updateStudentRecord(
  date: string, 
  classId: string, 
  studentId: string, 
  status: AttendanceStatus, 
  note?: string
): void {
  const current = getClassAttendance(date, classId);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

  const updatedRecords = {
    ...current.records,
    [studentId]: {
      studentId,
      status,
      note,
      checkInTime: status === 'H' ? (current.records[studentId]?.checkInTime || timeStr) : undefined
    }
  };

  saveClassAttendance({
    ...current,
    records: updatedRecords
  });
}

export function markAllStudentsPresent(date: string, classId: string): void {
  const current = getClassAttendance(date, classId);
  const students = getClassStudents(classId);
  const records: Record<string, StudentAttendanceRecord> = {};
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

  students.forEach(st => {
    records[st.id] = {
      studentId: st.id,
      status: 'H',
      checkInTime: timeStr
    };
  });

  saveClassAttendance({
    ...current,
    records
  });
}

export function verifyAttendanceByPrincipal(date: string, classId?: string): void {
  const all = getAllAttendanceStorage();
  const now = new Date();
  const verifiedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

  if (classId) {
    const key = `${date}-${classId}`;
    if (all[key]) {
      all[key].isVerifiedByPrincipal = true;
      all[key].verifiedAt = verifiedTime;
    }
  } else {
    // Verify all classes for that date
    Object.keys(all).forEach(k => {
      if (k.startsWith(`${date}-`)) {
        all[k].isVerifiedByPrincipal = true;
        all[k].verifiedAt = verifiedTime;
      }
    });
  }

  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('sdn5_student_attendance_updated', {
      detail: { date, verified: true }
    }));
  } catch (err) {
    console.warn('Verify attendance failed', err);
  }
}

export function getSchoolRealtimeSummary(date: string) {
  const all = getAllAttendanceStorage();
  let totalStudents = 0;
  let totalHadir = 0;
  let totalSakit = 0;
  let totalIzin = 0;
  let totalAlpa = 0;
  let submittedClassesCount = 0;

  const classSummaries = SCHOOL_CLASSES.map(cls => {
    const key = `${date}-${cls.id}`;
    const attendance = all[key];
    
    if (attendance) {
      submittedClassesCount++;
      totalStudents += attendance.summary.total;
      totalHadir += attendance.summary.hadir;
      totalSakit += attendance.summary.sakit;
      totalIzin += attendance.summary.izin;
      totalAlpa += attendance.summary.alpa;
      return {
        classInfo: cls,
        attendance,
        isRecorded: true
      };
    } else {
      const classTotal = getClassStudents(cls.id).length;
      totalStudents += classTotal;
      return {
        classInfo: cls,
        attendance: null,
        isRecorded: false
      };
    }
  });

  const overallRate = totalStudents > 0 ? Number(((totalHadir / totalStudents) * 100).toFixed(1)) : 100;

  return {
    date,
    totalStudents,
    totalHadir,
    totalSakit,
    totalIzin,
    totalAlpa,
    overallRate,
    totalClasses: SCHOOL_CLASSES.length,
    submittedClassesCount,
    classSummaries
  };
}

export function getMonthlyClassReport(classId: string, monthName: string = 'September 2026'): MonthlyClassReport {
  const cls = SCHOOL_CLASSES.find(c => c.id === classId) || SCHOOL_CLASSES[0];
  const students = getClassStudents(classId);
  const monthlyWarnings = getAllMonthlyWarnings();
  const totalEffectiveDays = 20;

  let totalHadir = 0;
  let totalSakit = 0;
  let totalIzin = 0;
  let totalAlpa = 0;
  let warningCount = 0;

  const studentsReport: MonthlyStudentReport[] = students.map((st, idx) => {
    const warning = monthlyWarnings.find(w => w.studentId === st.id);
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;
    let attendanceRate = 100;
    let statusKeterangan: MonthlyStudentReport['statusKeterangan'] = 'Sangat Baik';

    if (warning) {
      hadir = warning.hadir;
      sakit = warning.sakit;
      izin = warning.izin;
      alpa = warning.alpa;
      attendanceRate = warning.attendanceRate;
      statusKeterangan = warning.riskLevel === 'kritis' ? 'Kritis (<70%)' : 'Cukup / Waspada';
      warningCount++;
    } else {
      const variation = (idx + st.name.length) % 7;
      if (variation === 0) {
        hadir = 18;
        sakit = 2;
        izin = 0;
        alpa = 0;
        attendanceRate = 90.0;
        statusKeterangan = 'Sangat Baik';
      } else if (variation === 1) {
        hadir = 17;
        sakit = 1;
        izin = 2;
        alpa = 0;
        attendanceRate = 85.0;
        statusKeterangan = 'Baik';
      } else if (variation === 2) {
        hadir = 19;
        sakit = 1;
        izin = 0;
        alpa = 0;
        attendanceRate = 95.0;
        statusKeterangan = 'Sangat Baik';
      } else {
        hadir = 20;
        sakit = 0;
        izin = 0;
        alpa = 0;
        attendanceRate = 100.0;
        statusKeterangan = 'Sangat Baik';
      }
    }

    totalHadir += hadir;
    totalSakit += sakit;
    totalIzin += izin;
    totalAlpa += alpa;

    return {
      studentId: st.id,
      nisn: st.nisn,
      name: st.name,
      gender: st.gender,
      classId,
      totalEffectiveDays,
      hadir,
      sakit,
      izin,
      alpa,
      attendanceRate,
      statusKeterangan,
      parentName: st.parentName,
      parentPhone: st.parentPhone
    };
  });

  const totalPossible = students.length * totalEffectiveDays;
  const averageRate = totalPossible > 0 ? Number(((totalHadir / totalPossible) * 100).toFixed(1)) : 100;

  return {
    classInfo: cls,
    monthName,
    year: 2026,
    totalEffectiveDays,
    studentsReport,
    totalStudents: students.length,
    averageRate,
    totalHadir,
    totalSakit,
    totalIzin,
    totalAlpa,
    warningCount
  };
}

export function getActiveSelectedTeacher(): string {
  if (typeof window === 'undefined') return 't13'; // Mantasia, S.Pd. - Guru Kelas 6A
  return localStorage.getItem(ACTIVE_TEACHER_STORAGE_KEY) || 't13';
}

export function setActiveSelectedTeacher(teacherId: string): void {
  try {
    localStorage.setItem(ACTIVE_TEACHER_STORAGE_KEY, teacherId);
    window.dispatchEvent(new CustomEvent('sdn5_active_teacher_changed', { detail: { teacherId } }));
  } catch (err) {
    console.warn('Failed to save active teacher', err);
  }
}
