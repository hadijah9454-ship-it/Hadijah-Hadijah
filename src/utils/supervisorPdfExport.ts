import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SupervisedSchool, UncheckedTeacherAlert, SUPERVISOR_PROFILE, getSupervisorSummary } from './supervisorStore';
import { formatIndonesianDate } from './attendancePdfExport';

export function exportSupervisorReportPDF(
  dateStr: string,
  schools: SupervisedSchool[],
  alerts: UncheckedTeacherAlert[],
  cutoffTime: string
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 14;
  const summary = getSupervisorSummary();

  // 1. KOP SURAT RESMI DINAS PENDIDIKAN KABUPATEN MAROS
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('PEMERINTAH KABUPATEN MAROS', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFontSize(11.5);
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5.5;

  doc.setFontSize(13);
  doc.text('KELOMPOK JABATAN FUNGSIONAL PENGAWAS SEKOLAH', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(
    'Wilayah Kerja: Gugus Satuan Pendidikan Formal Jenjang SD Kecamatan Lau, Kabupaten Maros',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 4;

  doc.text(
    'Sekretariat: Jl. Asoka No. 3, Pettuadae, Kec. Turikale, Kab. Maros, Sulawesi Selatan 90516 | Pos-el: pengawas.lau@maroskab.go.id',
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

  // 2. JUDUL DOKUMEN SUPERVISI
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('LAPORAN HASIL MONITORING REAL-TIME DISIPLIN KEHADIRAN GURU SE-WILAYAH BINAAN', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    `Hari/Tanggal: ${formatIndonesianDate(dateStr)} | Pengawas Pembina: ${SUPERVISOR_PROFILE.name} (NIP: ${SUPERVISOR_PROFILE.nip})`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 6;

  // 3. KOTAK STATISTIK AGREGAT WILAYAH BINAAN
  const leftX = 14;
  const boxWidth = pageWidth - 28;
  const infoBoxHeight = 14;

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(leftX, currentY, boxWidth, infoBoxHeight, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `Total Sekolah Binaan: ${summary.totalSchools} Satuan Pendidikan  |  Total Tenaga Pendidik & Kependidikan (GTK): ${summary.totalTeachers} Orang`,
    leftX + 4,
    currentY + 5
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(
    `Rata-rata Disiplin Wilayah: ${summary.overallRate}%  |  Hadir Tepat Waktu: ${summary.totalHadir}  |  Terlambat: ${summary.totalTerlambat}  |  Izin/Sakit: ${summary.totalIzin + summary.totalSakit}  |  Belum Presensi (> ${cutoffTime} WITA): ${summary.totalBelumAbsen} Orang`,
    leftX + 4,
    currentY + 10
  );
  currentY += infoBoxHeight + 5;

  // 4. TABEL REKAPITULASI SEKOLAH BINAAN
  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('I. Rekapitulasi Tingkat Kedisiplinan Per Satuan Pendidikan Binaan', leftX, currentY);
  currentY += 2;

  const schoolTableData = schools.map((sch, idx) => [
    idx + 1,
    sch.name,
    sch.npsn,
    sch.principalName,
    sch.totalTeachers,
    sch.hadirTepatWaktu,
    sch.terlambat,
    sch.izinDinas,
    sch.sakit + sch.cuti,
    sch.belumAbsen,
    `${sch.disciplineRate}%`,
    sch.isVerifiedBySupervisor ? 'Disahkan Pengawas' : 'Menunggu Validasi'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [[
      'No', 'Nama Satuan Pendidikan', 'NPSN', 'Kepala Sekolah', 
      'Total GTK', 'Tepat Waktu', 'Terlambat', 'Izin', 'Sakit', 'Belum Absen', 
      'Disiplin (%)', 'Status Supervisi'
    ]],
    body: schoolTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 27, 75], // indigo-950
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left', fontStyle: 'bold', cellWidth: 48 },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'left', cellWidth: 42 },
      4: { halign: 'center', cellWidth: 16 },
      5: { halign: 'center', cellWidth: 18 },
      6: { halign: 'center', cellWidth: 16 },
      7: { halign: 'center', cellWidth: 14 },
      8: { halign: 'center', cellWidth: 14 },
      9: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      10: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      11: { halign: 'center', cellWidth: 35 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 5. TABEL DAFTAR GURU PERINGATAN DINI (BELUM PRESENSI LEWAT BATAS JAM)
  if (currentY > 160) {
    doc.addPage();
    currentY = 14;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(190, 18, 60); // rose-700
  doc.text(`II. Peringatan Dini Pengawas: Daftar GTK Belum Melakukan Presensi (Cut-off: ${cutoffTime} WITA)`, leftX, currentY);
  currentY += 2;

  const alertTableData = alerts.map((al, idx) => [
    idx + 1,
    al.teacherName,
    al.teacherNip,
    al.role,
    al.schoolName,
    al.principalName,
    `${al.minutesOverdue} Menit Terlambat`,
    al.actionNote || 'Perlu konfirmasi segera'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [[
      'No', 'Nama Guru / Tendik', 'NIP', 'Tugas / Rombel', 
      'Satuan Pendidikan', 'Kepala Sekolah Penanggung Jawab', 
      'Status Keterlambatan', 'Tindak Lanjut Supervisi'
    ]],
    body: alertTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [159, 18, 57], // rose-900
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left', fontStyle: 'bold', cellWidth: 42 },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'left', cellWidth: 32 },
      4: { halign: 'left', cellWidth: 40 },
      5: { halign: 'left', cellWidth: 40 },
      6: { halign: 'center', fontStyle: 'bold', textColor: [190, 18, 60], cellWidth: 30 },
      7: { halign: 'left', cellWidth: 47 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 6. LEMBAR PENGESAHAN PENGAWAS BINA
  if (currentY > 170) {
    doc.addPage();
    currentY = 14;
  }

  const sigColWidth = 90;
  const sigRightX = pageWidth - 14 - sigColWidth;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Sebelah Kanan: Pengawas Pembina
  doc.text(`Maros, ${formatIndonesianDate(dateStr)}`, sigRightX + sigColWidth / 2, currentY, { align: 'center' });
  currentY += 4;
  doc.setFont('times', 'bold');
  doc.text('Pengawas Pembina Jenjang SD Kec. Lau', sigRightX + sigColWidth / 2, currentY, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.text('Dinas Pendidikan dan Kebudayaan Kab. Maros', sigRightX + sigColWidth / 2, currentY + 3.5, { align: 'center' });

  currentY += 20; // Space for signature

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text(SUPERVISOR_PROFILE.name, sigRightX + sigColWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIP. ${SUPERVISOR_PROFILE.nip}`, sigRightX + sigColWidth / 2, currentY, { align: 'center' });
  doc.text(`Pangkat/Gol: ${SUPERVISOR_PROFILE.rank}`, sigRightX + sigColWidth / 2, currentY + 3.5, { align: 'center' });

  // Save the PDF
  const filename = `Laporan_Pengawas_Bina_Hj_Mirna_${dateStr.replace(/-/g, '')}.pdf`;
  doc.save(filename);
}
