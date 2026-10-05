export type IdeaCategory = 'Semua' | 'Produk' | 'Kreatif' | 'Bisnis' | 'Teknologi' | 'Kehidupan' | 'Riset';

export type IdeaStatus = 'draft' | 'analyzing' | 'validated' | 'paused' | 'done';

export type ColorTheme = 'cream' | 'sage' | 'peach' | 'sky' | 'lavender';

export interface DecisionItem {
  id: string;
  timestamp: string;
  decision: string;
  rationale: string;
}

export interface RevisionSnapshot {
  id: string;
  timestamp: string;
  summary: string;
  previousState: {
    title: string;
    problem: string;
    hypothesis: string;
    notes: string;
    status: IdeaStatus;
  };
}

export interface AIAnalysisResult {
  timestamp: string;
  mode: 'deep' | 'research' | 'quick';
  summary: string;
  problemBreakdown: string[];
  keyInsights: string[];
  potentialRisks: string[];
  actionItems: string[];
  groundingSources?: Array<{ title: string; url: string }>;
}

export interface Idea {
  id: string;
  title: string;
  problem: string;
  hypothesis: string;
  notes: string;
  category: IdeaCategory;
  status: IdeaStatus;
  colorTheme: ColorTheme;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  analysis?: AIAnalysisResult;
  decisions: DecisionItem[];
  revisions: RevisionSnapshot[];
}

export type ActionType = 
  | 'CREATE_IDEA'
  | 'UPDATE_CONTENT'
  | 'AI_DEEP_THINKING'
  | 'AI_SEARCH_RESEARCH'
  | 'AI_QUICK_REFINE'
  | 'STATUS_CHANGE'
  | 'DECISION_LOGGED'
  | 'EXPORT_SHEETS'
  | 'SCHEDULE_CALENDAR'
  | 'CREATE_SLIDES'
  | 'RESTORE_REVISION';

export interface ActivityLog {
  id: string;
  ideaId?: string;
  ideaTitle?: string;
  action: ActionType;
  detail: string;
  timestamp: string;
  author: string;
}
