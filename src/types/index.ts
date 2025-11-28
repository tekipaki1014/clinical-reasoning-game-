export interface Case {
  id: string;
  title: string;
  description: string;
}

export interface AssessmentItem {
  id: string;
  name: string;
  category: string;
}

export interface CaseSolution {
  caseId: string;
  assessmentId: string;
  priorityWeight: number;
  mustHave: boolean;
  rationale: string;
}

export interface GameState {
  selectedCaseId: string | null;
  selectedAssessmentIds: string[];
  isSubmitted: boolean;
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  percentage: number;
  missingItems: CaseSolution[];
  missingMustHaves: CaseSolution[];
  extraItems: AssessmentItem[];
  correctItems: CaseSolution[];
}
