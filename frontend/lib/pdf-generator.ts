import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  healthScore: number;
  metrics: {
    title: string;
    value: string;
    trend: number;
  }[];
  insights: {
    message: string;
    severity: string;
    timestamp: string;
  }[];
  risks: {
    date: string;
    riskType: string;
    severity: string;
    status: string;
  }[];
  salesData: {
    month: string;
    revenue: number;
  }[];
}

export function generatePDFReport(data: ReportData, preview: boolean = false): jsPDF {
  const doc = new jsPDF();
  
  // Add watermark
  const addWatermark = (pageNum: number) => {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('OPSENSE', 105, 140, {
      align: 'center',
      angle: 45,
    });
    doc.setTextColor(0, 0, 0);
  };

  // Header
  doc.setFillColor(24, 0, 173);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('OpSense', 20, 20);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Business Intelligence Report', 20, 30);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 20);
  doc.text(`Report ID: RPT-${Date.now()}`, 150, 30);
  
  // Business Health Score Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Business Health Score', 20, 55);
  
  // Draw circular gauge representation
  doc.setFillColor(233, 236, 239);
  doc.circle(105, 85, 25, 'F');
  
  doc.setDrawColor(24, 0, 173);
  doc.setLineWidth(3);
  doc.circle(105, 85, 25, 'S');
  
  doc.setTextColor(33, 37, 41);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.healthScore}`, 105, 87, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125);
  doc.text('/ 100', 105, 95, { align: 'center' });
  
  // Metrics Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Key Performance Metrics', 20, 125);
  
  const metricsTable = data.metrics.map(m => [
    m.title,
    m.value,
    m.trend > 0 ? `+${m.trend}%` : `${m.trend}%`
  ]);
  
  autoTable(doc, {
    startY: 130,
    head: [['Metric', 'Value', 'Trend']],
    body: metricsTable,
    theme: 'striped',
    headStyles: {
      fillColor: [24, 0, 173],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });
  
  // AI Insights Section
  const insightsY = (doc as any).lastAutoTable?.finalY || 170;
  
  doc.addPage();
  addWatermark(2);
  
  doc.setFillColor(24, 0, 173);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AI-Generated Insights', 20, 13);
  
  doc.setTextColor(0, 0, 0);
  let yPosition = 35;
  
  data.insights.forEach((insight, index) => {
    if (yPosition > 270) {
      doc.addPage();
      addWatermark(doc.getNumberOfPages());
      yPosition = 20;
    }
    
    const severityColor = 
      insight.severity === 'High' ? [220, 53, 69] as [number, number, number] :
      insight.severity === 'Medium' ? [255, 193, 7] as [number, number, number] :
      [40, 167, 69] as [number, number, number];
    
    doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.roundedRect(20, yPosition, 170, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(insight.severity.toUpperCase(), 25, yPosition + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(insight.message, 25, yPosition + 15);
    
    doc.setFontSize(8);
    doc.text(new Date(insight.timestamp).toLocaleString(), 180, yPosition + 8, { align: 'right' });
    
    yPosition += 30;
  });
  
  // Risk Monitoring Section
  doc.addPage();
  addWatermark(3);
  
  doc.setFillColor(24, 0, 173);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Monitoring', 20, 13);
  
  const risksTable = data.risks.map(r => [
    r.date,
    r.riskType,
    r.severity,
    r.status
  ]);
  
  autoTable(doc, {
    startY: 30,
    head: [['Date', 'Risk Type', 'Severity', 'Status']],
    body: risksTable,
    theme: 'striped',
    headStyles: {
      fillColor: [24, 0, 173],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 80 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
    },
  });
  
  // Sales Analytics Section
  doc.addPage();
  addWatermark(4);
  
  doc.setFillColor(24, 0, 173);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Sales Analytics', 20, 13);
  
  const salesTable = data.salesData.map(s => [
    s.month,
    `$${s.revenue.toLocaleString()}`
  ]);
  
  autoTable(doc, {
    startY: 30,
    head: [['Month', 'Revenue']],
    body: salesTable,
    theme: 'striped',
    headStyles: {
      fillColor: [24, 0, 173],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      halign: 'center',
    },
  });
  
  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 280, 210, 17, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    doc.text('OpSense - AI Operational Intelligence Platform', 20, 287);
    doc.text(`Page ${i} of ${totalPages}`, 190, 287, { align: 'right' });
    doc.text('Confidential - For Internal Use Only', 105, 293, { align: 'center' });
  }
  
  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string = 'opsense-report.pdf') {
  doc.save(filename);
}
