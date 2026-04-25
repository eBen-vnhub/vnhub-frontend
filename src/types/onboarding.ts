export type TicketStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED_TO_VSM'
  | 'AWAITING_VENDOR_FORMS'
  | 'VSM_REVIEW'
  | 'READY_FOR_OPS'
  | 'OPS_PROCESSING'
  | 'IN_TESTING'
  | 'OPS_REVISION'
  | 'PENDING_LIVE_LINK'
  | 'AWAITING_FINAL_VSM_APPROVAL'
  | 'COMPLETED';

export type BenefitStatus =
  | 'PENDING'
  | 'VSM_REVIEW'
  | 'ASSIGNED_TO_OPS'
  | 'BUILDING'
  | 'TESTING'
  | 'LIVE';

export interface OnboardingTicket {
  id: string;
  vendor_name: string;
  subscription_plan: string;
  status: TicketStatus;
  assigned_vsm: string | null;
  assigned_vsm_name: string | null;
  assigned_ops: string | null;
  assigned_ops_name: string | null;
  test_link: string | null;
  live_link: string | null;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface BenefitTracker {
  id: string;
  vendor: number;
  vendor_name: string;
  subscription: number;
  subscription_plan: string;
  benefit_number: number;
  status: BenefitStatus;
  assigned_ops: string | null;
  assigned_ops_name: string | null;
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

export const KANBAN_COLUMNS: Record<string, TicketStatus[]> = {
  INTAKE: ['UNASSIGNED', 'ASSIGNED_TO_VSM'],
  VENDOR_INPUT: ['AWAITING_VENDOR_FORMS', 'VSM_REVIEW'],
  OPS_PIPELINE: ['READY_FOR_OPS', 'OPS_PROCESSING', 'OPS_REVISION'],
  TESTING: ['IN_TESTING', 'PENDING_LIVE_LINK'],
  FINAL: ['AWAITING_FINAL_VSM_APPROVAL', 'COMPLETED'],
};
