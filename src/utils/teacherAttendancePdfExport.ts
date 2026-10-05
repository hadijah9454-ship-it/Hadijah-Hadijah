import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DailyTeacherAttendanceReport } from './teacherAttendanceStore';
import { formatIndonesianDate } from './attendancePdfExport';

export function exportTeacherAttendancePDF(report: DailyTeacherAttendanceReport): void {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
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
    'Alamat: Jl. Poros Maros - Pangkep Km. 3, Barandasi, Kel. Maccini Baji, Kec. Lau, Kab. Maros, Sulawesi Selatan 90514',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 3;

  // Double horizontal rule
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 1;
  doc.setLineWidth(0.2);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 6;

  // 2. JUDUL
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('LAPORAN HARIAN PRESENSI GURU & TENAGA KEPENDIDIKAN (SIMAK)', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    `Hari / Tanggal: ${formatIndonesianDate(report.date)} | Terintegrasi Sistem Pengawas Bina & Kepala Sekolah`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 6;

  // 3. STATISTIK RINGKASAN
  const leftX = 14;
  const boxWidth = pageWidth - 28;
  const infoBoxHeight = 13;

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(leftX, currentY, boxWidth, infoBoxHeight, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `Total GTK: ${report.summary.totalTeachers} Orang  |  Hadir Tepat Waktu: ${report.summary.hadirTepatWaktu}  |  Terlambat: ${report.summary.terlambat}  |  Izin Dinas: ${report.summary.izinDinas}  |  Sakit: ${report.summary.sakit}  |  Cuti: ${report.summary.cuti}`,
    leftX + 4,
    currentY + 5
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110); // emerald-700
  doc.text(
    `Tingkat Kehadiran: ${report.summary.attendanceRate}%  |  Verifikasi KS: ${report.isVerifiedByPrincipal ? 'SUDAH DISAHKAN' : 'BELUM'}  |  Supervisi Pengawas Bina: ${report.isVerifiedByPengawas ? 'SUDAH TERVERIFIKASI' : 'BELUM'}`,
    leftX + 4,
    currentY + 9.5
  );

  currentY += infoBoxHeight + 5;

  // 4. TABEL GURU
  const recordsArray = Object.values(report.records);
  const tableData = recordsArray.map((r, index) => {
    const statusText = 
      r.status === 'HADIR_TEPAT_WAKTU' ? 'Hadir Tepat Waktu' :
      r.status === 'TERLAMBAT' ? 'Terlambat' :
      r.status === 'IZIN_DINAS' ? 'Izin Dinas / KKG' :
      r.status === 'SAKIT' ? 'Sakit' :
      r.status === 'CUTI' ? 'Cuti' : 'Belum Absen';

    return [
      (index + 1).toString(),
      r.nip || '-',
      r.name,
      r.role,
      statusText,
      r.checkInTime || '-',
      r.checkOutTime || '-',
      r.locationStatus,
      r.teachingJournal || '-'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [[
      'No', 'NIP', 'Nama Guru / Tenaga Pendidik', 'Tugas / Rombel', 
      'Status Presensi', 'Jam Masuk*', 'Jam Pulang*', 'Lokasi GPS', 'Jurnal / Agenda Hari Ini'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 27, 75],
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
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 26, halign: 'center', font: 'courier' },
      2: { cellWidth: 44, fontStyle: 'bold' },
      3: { cellWidth: 32 },
      4: { cellWidth: 26, halign: 'center' },
      5: { cellWidth: 20, halign: 'center', font: 'courier', fontStyle: 'bold' },
      6: { cellWidth: 20, halign: 'center', font: 'courier' },
      7: { cellWidth: 28, halign: 'center' },
      8: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14, bottom: 22 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw as string;
        if (val === 'Hadir Tepat Waktu') data.cell.styles.textColor = [15, 118, 110];
        else if (val === 'Terlambat') data.cell.styles.textColor = [180, 83, 9];
        else if (val.includes('Dinas')) data.cell.styles.textColor = [3, 105, 161];
        else if (val === 'Sakit') data.cell.styles.textColor = [190, 18, 60];
      }
    }
  });

  // Footer notes & signatures
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  let signY = finalY + 6;
  if (signY + 38 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    signY = 18;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('*Keterangan: Jam masuk & jam pulang tercatat otomatis dari waktu server sistem (WITA) dan terkunci untuk menjamin akurasi dan integritas data.', 14, signY);
  signY += 5;

  const todayStr = formatIndonesianDate(report.date);

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  // Kiri: Pengawas Pembina
  const signLeftX = 45;
  doc.text('Mengetahui / Mengawasi,', signLeftX, signY, { align: 'center' });
  doc.text('Pengawas Pembina Gugus II Kec. Lau', signLeftX, signY + 4.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.text(report.pengawasName, signLeftX, signY + 24, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${report.pengawasNip}`, signLeftX, signY + 28, { align: 'center' });

  // Kanan: Kepala Sekolah
  const signRightX = pageWidth - 45;
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(`Maros, ${todayStr}`, signRightX, signY, { align: 'center' });
  doc.text('Kepala UPTD SDN 5 Barandasi,', signRightX, signY + 4.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.text(report.principalName, signRightX, signY + 24, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. Terdaftar KSP UPTD SDN 5 Barandasi', signRightX, signY + 28, { align: 'center' });

  const filename = `Laporan_Presensi_Guru_SDN5_Barandasi_${report.date}.pdf`;
  doc.save(filename);
}
