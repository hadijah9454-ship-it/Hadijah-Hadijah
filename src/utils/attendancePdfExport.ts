import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MonthlyClassReport, DailyClassAttendance, Student, StudentAttendanceRecord } from '../types';

export function formatIndonesianDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${monthNames[mIdx] || month} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Ekspor Laporan Rekapitulasi Kehadiran Siswa Bulanan ke PDF
 * Dilengkapi Kop Surat Resmi Pemkab Maros, Dinas Pendidikan, dan Akreditasi B
 */
export function exportMonthlyAttendancePDF(report: MonthlyClassReport): void {
  // A4 Landscape: 297mm width, 210mm height
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297
  let currentY = 14;

  // 1. KOP SURAT RESMI
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('PEMERINTAH KABUPATEN MAROS', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFontSize(11);
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5.5;

  doc.setFontSize(13);
  doc.text('UPTD SATUAN PENDIDIKAN FORMAL SDN 5 BARANDASI', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(
    'NPSN: 40300262 | NSS: 101190110001 | Status: Negeri | AKREDITASI B',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 4;

  doc.text(
    'Alamat: Jl. Poros Maros - Pangkep Km. 3, Barandasi, Kel. Maccini Baji, Kec. Lau, Kab. Maros, Prov. Sulawesi Selatan 90514',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 3;

  // Double horizontal rule (Government Standard)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 1;
  doc.setLineWidth(0.2);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 6;

  // 2. JUDUL DOKUMEN
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('LAPORAN REKAPITULASI PRESENSI SISWA BULANAN', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    `Periode: ${report.monthName} | Tahun Ajaran 2026/2027 (Semester Ganjil)`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 6;

  // 3. INFORMASI ROMBEL & STATISTIK KELAS (Dua Box Berdampingan)
  const leftX = 14;
  const boxWidth = (pageWidth - 32) / 2; // ~132.5mm
  const infoBoxHeight = 18;

  // Box Kiri: Info Kelas
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(leftX, currentY, boxWidth, infoBoxHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('IDENTITAS KELAS & WALI KELAS', leftX + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Rombongan Belajar : ${report.classInfo.name} (${report.classInfo.room})`, leftX + 4, currentY + 8.5);
  doc.text(`Wali Kelas             : ${report.classInfo.teacherName}`, leftX + 4, currentY + 12);
  doc.text(`NIP Wali Kelas       : ${report.classInfo.teacherNip}`, leftX + 4, currentY + 15.5);

  // Box Kanan: Ringkasan Presensi
  const rightX = leftX + boxWidth + 4;
  doc.rect(rightX, currentY, boxWidth, infoBoxHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('REKAPITULASI AKUMULATIF BULANAN', rightX + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Hari Efektif Belajar : ${report.totalEffectiveDays} Hari`, rightX + 4, currentY + 8.5);
  doc.text(
    `Total Siswa : ${report.totalStudents} Orang (H: ${report.totalHadir} | S: ${report.totalSakit} | I: ${report.totalIzin} | A: ${report.totalAlpa})`,
    rightX + 4,
    currentY + 12
  );

  doc.setFont('helvetica', 'bold');
  if (report.warningCount > 0) {
    doc.setTextColor(190, 18, 60); // rose-700
    doc.text(
      `Tingkat Kehadiran: ${report.averageRate}%  [Peringatan: ${report.warningCount} siswa <80%]`,
      rightX + 4,
      currentY + 15.5
    );
  } else {
    doc.setTextColor(15, 118, 110); // teal-700
    doc.text(`Tingkat Kehadiran: ${report.averageRate}% (Target Tercapai 100%)`, rightX + 4, currentY + 15.5);
  }

  currentY += infoBoxHeight + 5;

  // 4. TABEL REKAPITULASI DENGAN AUTOTABLE
  const tableData = report.studentsReport.map((st, index) => {
    return [
      (index + 1).toString(),
      st.nisn,
      st.name,
      st.gender,
      `${st.totalEffectiveDays}`,
      `${st.hadir}`,
      `${st.sakit}`,
      `${st.izin}`,
      `${st.alpa}`,
      `${st.attendanceRate}%`,
      st.statusKeterangan
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [[
      'No', 'NISN', 'Nama Siswa', 'L/P', 'Hari Belajar', 
      'H', 'S', 'I', 'A', '% Kehadiran', 'Keterangan'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 27, 75], // indigo-950
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // No
      1: { cellWidth: 26, halign: 'center', font: 'courier' }, // NISN
      2: { cellWidth: 62 }, // Nama Siswa
      3: { cellWidth: 12, halign: 'center' }, // L/P
      4: { cellWidth: 24, halign: 'center' }, // Hari Belajar
      5: { cellWidth: 14, halign: 'center', fontStyle: 'bold', textColor: [15, 118, 110] }, // H
      6: { cellWidth: 14, halign: 'center', textColor: [3, 105, 161] }, // S
      7: { cellWidth: 14, halign: 'center', textColor: [180, 83, 9] }, // I
      8: { cellWidth: 14, halign: 'center', textColor: [190, 18, 60] }, // A
      9: { cellWidth: 24, halign: 'center', fontStyle: 'bold' }, // % Kehadiran
      10: { cellWidth: 'auto', halign: 'left' } // Keterangan
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didParseCell: (data) => {
      // Highlight low attendance rows in warning color
      if (data.section === 'body' && data.column.index === 9) {
        const valStr = data.cell.raw as string;
        const rate = parseFloat(valStr);
        if (!isNaN(rate) && rate < 80) {
          data.cell.styles.textColor = [190, 18, 60]; // Red
          data.cell.styles.fillColor = [254, 226, 226]; // Soft red background
          data.cell.styles.fontStyle = 'bold';
        }
      }
      if (data.section === 'body' && data.column.index === 10) {
        const val = data.cell.raw as string;
        if (val.includes('Kritis') || val.includes('Waspada')) {
          data.cell.styles.textColor = [190, 18, 60];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // 5. KOLOM TANDA TANGAN RESMI
  // Get Y position after table
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  
  // Check if enough space remains on page, else add page
  let signY = finalY + 10;
  if (signY + 38 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    signY = 20;
  }

  const todayStr = formatIndonesianDate(new Date().toISOString().split('T')[0]);

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  // Kiri: Kepala Sekolah
  const signLeftX = 35;
  doc.text('Mengetahui,', signLeftX, signY, { align: 'center' });
  doc.text('Kepala UPTD SDN 5 Barandasi', signLeftX, signY + 4.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.text('HADIJAH, S.Pd., M.Pd.', signLeftX, signY + 28, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. Terdaftar KSP UPTD SDN 5 Barandasi', signLeftX, signY + 32, { align: 'center' });

  // Kanan: Wali Kelas
  const signRightX = pageWidth - 55;
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(`Maros, ${todayStr}`, signRightX, signY, { align: 'center' });
  doc.text(`Wali Kelas ${report.classInfo.name},`, signRightX, signY + 4.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.text(report.classInfo.teacherName.toUpperCase(), signRightX, signY + 28, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${report.classInfo.teacherNip}`, signRightX, signY + 32, { align: 'center' });

  // 6. Simpan File PDF
  const cleanMonth = report.monthName.replace(/\s+/g, '_');
  const filename = `Laporan_Absensi_Bulanan_SDN5_${report.classInfo.id}_${cleanMonth}.pdf`;
  doc.save(filename);
}

/**
 * Ekspor Laporan Presensi Harian Siswa ke PDF
 */
export function exportDailyAttendancePDF(
  attendance: DailyClassAttendance,
  students: Student[]
): void {
  // A4 Portrait: 210mm width, 297mm height
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  let currentY = 12;

  // 1. KOP SURAT RESMI
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text('PEMERINTAH KABUPATEN MAROS', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFontSize(10);
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFontSize(12);
  doc.text('UPTD SATUAN PENDIDIKAN FORMAL SDN 5 BARANDASI', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text('NPSN: 40300262 | NSS: 101190110001 | AKREDITASI B', pageWidth / 2, currentY, { align: 'center' });
  currentY += 3.5;

  doc.text(
    'Alamat: Jl. Poros Maros - Pangkep Km. 3, Barandasi, Kec. Lau, Kab. Maros, Sulawesi Selatan 90514',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 2.5;

  // Double horizontal rule
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 0.8;
  doc.setLineWidth(0.2);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 5;

  // 2. JUDUL
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('LEMBAR REKAPITULASI PRESENSI HARIAN SISWA', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Tanggal: ${formatIndonesianDate(attendance.date)} | Rombel: ${attendance.className}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 5;

  // 3. STATISTIK KOTAK
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, currentY, pageWidth - 28, 14, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Wali Kelas: ${attendance.teacherName} (NIP: ${attendance.teacherNip})`, 18, currentY + 4.5);
  doc.text(
    `Total Terdaftar: ${attendance.summary.total} Siswa  |  Hadir: ${attendance.summary.hadir}  |  Sakit: ${attendance.summary.sakit}  |  Izin: ${attendance.summary.izin}  |  Alpa: ${attendance.summary.alpa}`,
    18,
    currentY + 8.5
  );

  doc.setFont('helvetica', 'bold');
  doc.text(
    `Persentase Kehadiran: ${attendance.summary.rate}%  |  Status Pengesahan: ${
      attendance.isVerifiedByPrincipal ? 'Disahkan Kepala Sekolah' : 'Belum Verifikasi KS'
    }`,
    18,
    currentY + 12
  );
  currentY += 18;

  // 4. TABEL HARIAN
  const tableData = students.map((st, idx) => {
    const rec: StudentAttendanceRecord = attendance.records[st.id] || { 
      studentId: st.id,
      status: 'H', 
      checkInTime: '07:15 WITA' 
    };
    const statusLabel = 
      rec.status === 'H' ? 'Hadir' :
      rec.status === 'S' ? 'Sakit' :
      rec.status === 'I' ? 'Izin' : 'Alpa (Tanpa Keterangan)';

    return [
      (idx + 1).toString(),
      st.nisn,
      st.name,
      st.gender,
      statusLabel,
      rec.checkInTime || '-',
      rec.note || '-'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'NISN', 'Nama Siswa', 'L/P', 'Status', 'Waktu Masuk', 'Keterangan / Catatan Guru']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 27, 75],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22, halign: 'center', font: 'courier' },
      2: { cellWidth: 50 },
      3: { cellWidth: 10, halign: 'center' },
      4: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw as string;
        if (val === 'Hadir') data.cell.styles.textColor = [15, 118, 110];
        else if (val === 'Sakit') data.cell.styles.textColor = [3, 105, 161];
        else if (val === 'Izin') data.cell.styles.textColor = [180, 83, 9];
        else if (val.includes('Alpa')) {
          data.cell.styles.textColor = [190, 18, 60];
          data.cell.styles.fillColor = [254, 226, 226];
        }
      }
    }
  });

  // 5. TANDA TANGAN
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  let signY = finalY + 8;
  if (signY + 35 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    signY = 20;
  }

  const signDateStr = formatIndonesianDate(attendance.date);

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);

  // Kiri
  const signLeftX = 35;
  doc.text('Mengetahui,', signLeftX, signY, { align: 'center' });
  doc.text('Kepala UPTD SDN 5 Barandasi', signLeftX, signY + 4, { align: 'center' });
  doc.setFont('times', 'bold');
  doc.text('HADIJAH, S.Pd., M.Pd.', signLeftX, signY + 24, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. Terdaftar KSP UPTD SDN 5 Barandasi', signLeftX, signY + 28, { align: 'center' });

  // Kanan
  const signRightX = pageWidth - 45;
  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Maros, ${signDateStr}`, signRightX, signY, { align: 'center' });
  doc.text(`Wali Kelas ${attendance.className},`, signRightX, signY + 4, { align: 'center' });
  doc.setFont('times', 'bold');
  doc.text(attendance.teacherName.toUpperCase(), signRightX, signY + 24, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${attendance.teacherNip}`, signRightX, signY + 28, { align: 'center' });

  const filename = `Presensi_Harian_SDN5_${attendance.classId}_${attendance.date}.pdf`;
  doc.save(filename);
}
