export type Region = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  area_pct: number;
  mean_evidence: number;
};

export type Analysis = {
  id: string;
  filename: string;
  verdict: string;
  preliminary_score: number;
  manipulated_area_pct: number;
  region_count: number;
  width: number;
  height: number;
  caption: string;
  caption_provided: boolean;
  multimodal_status: string;
  model_status: string;
  warning: string;
  regions: Region[];
  artifacts: {
    original: string;
    overlay: string;
    mask: string;
    heatmap: string;
    report: string;
  };
  created_at: string;
};

export type ResearchStatus = {
  project: string;
  current_stage: string;
  completed: string[];
  pending: string[];
  demo_message: string;
};
