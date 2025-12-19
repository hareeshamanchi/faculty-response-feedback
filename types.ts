
export interface RawFeedbackRow {
  facultyName: string;
  section: string;
  rating: number;
  comments: string;
  courseName?: string;
  [key: string]: any;
}

export interface FacultyInsight {
  facultyName: string;
  section: string;
  overallRating: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestedModifications: string[];
  banding: 'Outstanding' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement' | 'Critical';
}

export interface AnalysisResult {
  insights: FacultyInsight[];
  topPerformers: string[];
  overallSummary: string;
}

export interface ProcessingState {
  loading: boolean;
  error: string | null;
  progress: number;
}
