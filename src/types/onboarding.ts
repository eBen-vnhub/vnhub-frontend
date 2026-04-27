export type TicketStatus =
  | 'UNASSIGNED'
  | 'AWAITING_VENDOR_LISTING'
  | 'VSM_REVIEW'
  | 'OPS_IN_PROGRESS'
  | 'VSM_FINAL_REVIEW'
  | 'COMPLETED';

export type BenefitStatus =
  | 'PENDING'
  | 'ASSIGNED_TO_OPS'
  | 'BUILDING'
  | 'IN_TESTING'
  | 'REVISION'
  | 'PENDING_LIVE'
  | 'LIVE_REVIEW'
  | 'LIVE';

export interface OnboardingTicket {
  id: string;
  vendor: number;
  vendor_id: number;
  vendor_name: string;
  subscription: number;
  subscription_plan: string;
  status: TicketStatus;
  assigned_vsm: string | null;
  assigned_vsm_name: string | null;
  assigned_ops: string | null;
  assigned_ops_name: string | null;
  setup_org: boolean;
  setup_location: boolean;
  setup_account: boolean;
  setup_admin: boolean;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface BenefitTracker {
  id: string;
  vendor: number;
  vendor_id: number;
  vendor_name: string;
  subscription: number;
  subscription_plan: string;
  benefit_number: number;
  status: BenefitStatus;
  assigned_ops: string | null;
  assigned_ops_name: string | null;
  assigned_vsm: string | null;
  assigned_vsm_name: string | null;
  test_link: string | null;
  live_link: string | null;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewPayload {
  approved: boolean;
  feedback?: string;
}

export interface UploadLinkPayload {
  link: string;
  internal_notes?: string;
}

export const ONBOARDING_COLUMNS: Record<string, TicketStatus[]> = {
  QUEUE: ['UNASSIGNED'],
  DATA_COLLECTION: ['AWAITING_VENDOR_LISTING'],
  REVIEW: ['VSM_REVIEW'],
  TECHNICAL_SETUP: ['OPS_IN_PROGRESS'],
  FINAL_REVIEW: ['VSM_FINAL_REVIEW'],
  DONE: ['COMPLETED'],
  OPS_IN_PROGRESS: ['OPS_IN_PROGRESS'],
  VSM_FINAL_REVIEW: ['VSM_FINAL_REVIEW'],
  COMPLETED: ['COMPLETED'],
};

export const BENEFIT_COLUMNS: Record<string, BenefitStatus[]> = {
  QUEUE: ['PENDING', 'ASSIGNED_TO_OPS'],
  IN_PROGRESS: ['BUILDING'],
  TEST_REVIEW: ['IN_TESTING', 'REVISION'],
  LIVE_REVIEW: ['PENDING_LIVE', 'LIVE_REVIEW'],
  DONE: ['LIVE'],
};
