import { request } from './api';

export interface BackofficeVendorSummary {
  id: number;
  companyName: string;
  companyCountry: string;
  businessCategory: string;
  subscriptionCount: number;
  teamCount: number;
  createdAt: string;
  latestStatus: string | null;
}

export interface BackofficeTeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userType: string;
}

export interface BackofficeSubscription {
  id: number;
  plan: string;
  billingCycle: string;
  status: string;
  nextStep: string;
  createdAt: string;
}

export interface BackofficeVendorDetail extends BackofficeVendorSummary {
  companyWebsite: string;
  businessTypeB2C: boolean;
  businessTypeB2B: boolean;
  subscriptions: BackofficeSubscription[];
  teamMembers: BackofficeTeamMember[];
}

const backofficeService = {
  getVendors: () => 
    request<BackofficeVendorSummary[]>('/backoffice/vendors/'),

  getVendorDetail: (vendorId: string | number) => 
    request<BackofficeVendorDetail>(`/backoffice/vendors/${vendorId}/`),

  getVendorListings: (vendorId: string | number) => 
    request<{ vendorListing: any; benefitListing: any }>(`/backoffice/vendors/${vendorId}/listings/`),
};

export default backofficeService;
