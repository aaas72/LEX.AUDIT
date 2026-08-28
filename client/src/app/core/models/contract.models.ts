export interface ContractSummary {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: string;
  riskLevel: string;
  overallRiskScore: number;
}

export interface ContractDetail {
  id: string;
  fileName: string;
  uploadedAt: string;
  userPartyRole: string;
  report: AuditReport | null;
}

export interface AuditReport {
  id: string;
  contractId: string;
  language: string;
  inferredContractType: string;
  inferredIndustry: string;
  status: string; // "Pending", "Processing", "Completed", "Failed"
  errorMessage: string;
  totalClauses: number;
  analyzedClauses: number;
  flaggedFindings: number;
  overallRiskScore: number;
  riskClassification: string; // "Low", "Medium", "High", "Critical"
  executiveSummary: string;
  completedAt: string;
  findings: AuditFinding[];
}

export interface AuditFinding {
  id: string;
  auditReportId: string;
  clauseId: string;
  category: string; 
  verbatimQuote: string;
  riskTitle: string;
  riskLevel: string; 
  asymmetryScore: number;
  marketDeviationScore: number;
  impactScore: number;
  reasoningText: string;
  worstCaseScenario: string;
  alternativesJson: string; // JSON string containing alternative suggestions
}

export interface RedlineAlternative {
  originalText: string;
  suggestedText: string;
  explanation: string;
}
