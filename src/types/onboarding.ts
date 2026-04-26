export type TicketStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED_TO_VSM'
  | 'AWAITING_VENDOR_LISTING'
  | 'VSM_REVIEW'
  | 'READY_FOR_OPS'
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
  INTAKE: ['UNASSIGNED', 'ASSIGNED_TO_VSM'],
  VENDOR_INPUT: ['AWAITING_VENDOR_LISTING', 'VSM_REVIEW'],
  HANDOVER: ['READY_FOR_OPS'],
  SETUP: ['OPS_IN_PROGRESS', 'VSM_FINAL_REVIEW'],
  DONE: ['COMPLETED'],
};

export const BENEFIT_COLUMNS: Record<string, BenefitStatus[]> = {
  QUEUE: ['PENDING', 'ASSIGNED_TO_OPS'],
  BUILDING: ['BUILDING'],
  REVIEW: ['IN_TESTING', 'REVISION'],
  GO_LIVE: ['PENDING_LIVE', 'LIVE'],
};
