import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface AuditReportData {
  documentName: string;
  date: string;
  overallScore: number;
  riskClassification: string;
  totalClauses: number;
  flaggedIssues: number;
  findings: Array<{
    title: string;
    description: string;
    status: 'passed' | 'flagged';
    riskLevel?: 'high' | 'medium' | 'low';
    recommendation?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  exportAuditReport(data: AuditReportData) {
    const doc = new jsPDF();
    
    // Theme Constants (Print Friendly but Brutalist)
    const brandYellow = [251, 191, 36]; // #FBBF24
    const textBlack = [17, 24, 39]; // #111827
    const textGray = [107, 114, 128]; // #6b7280
    const dangerRed = [220, 38, 38]; // #dc2626

    // 1. Cover / Header Area
    doc.setFillColor(17, 24, 39); // Very dark gray/black background for header
    doc.rect(0, 0, 210, 40, 'F');
    
    // Logo Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LEX.AUDIT', 14, 25);
    
    // Sub-logo
    doc.setTextColor(251, 191, 36);
    doc.text('REPORT', 60, 25);

    // Meta Information
    doc.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Audit Results Summary', 14, 55);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text(`Document: ${data.documentName}`, 14, 65);
    doc.text(`Date: ${data.date}`, 14, 71);
    
    // Executive Metrics
    doc.setFontSize(12);
    doc.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Overall Risk Score: ${data.overallScore}/100`, 130, 65);
    
    let classificationColor = data.riskClassification.includes('HIGH') ? dangerRed : textBlack;
    doc.setTextColor(classificationColor[0], classificationColor[1], classificationColor[2]);
    doc.text(`Classification: ${data.riskClassification}`, 130, 71);

    // Summary Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
    const summaryText = `This document underwent automated AI analysis. A total of ${data.totalClauses} clauses were reviewed, resulting in ${data.flaggedIssues} flagged issues requiring immediate legal attention.`;
    const splitSummary = doc.splitTextToSize(summaryText, 180);
    doc.text(splitSummary, 14, 85);

    // 2. Findings Table
    const tableData = data.findings
      .filter(f => f.status === 'flagged') // Only show flagged issues in PDF for brevity
      .map(finding => [
        finding.title,
        finding.riskLevel ? finding.riskLevel.toUpperCase() : 'N/A',
        finding.description,
        finding.recommendation || 'Requires manual review and amendment.'
      ]);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Critical Findings & Recommendations', 14, 110);

    autoTable(doc, {
      startY: 115,
      head: [['Clause / Issue', 'Risk', 'Analysis', 'Recommendation']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [17, 24, 39], // Black headers
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        textColor: [17, 24, 39],
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' }, // Title
        1: { cellWidth: 20, fontStyle: 'bold', textColor: [220, 38, 38] }, // Risk
        2: { cellWidth: 65 }, // Analysis
        3: { cellWidth: 65 }  // Recommendation
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // Very light gray for readability
      },
      margin: { top: 40 }
    });

    // Output
    doc.save(`LEX_AUDIT_Report_${data.documentName.replace(/\s+/g, '_')}.pdf`);
  }
}
