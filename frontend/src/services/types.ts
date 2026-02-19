import type { Donation } from '../interfaces';

export interface Fundraiser {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  imageUrl: string;
  createdAt: string;
  status: string;
  category?: string;
  organizer?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Query params for GET /api/fundraisers (matches server.js) */
export interface GetFundraisersParams {
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/** Query params for GET /api/fundraisers/:id/donations (matches server.js) */
export interface GetDonationsParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FundraisersApiResponse {
  success: boolean;
  data: Fundraiser[];
  pagination: Pagination;
}

export interface FundraiserApiResponse {
  success: boolean;
  data: Fundraiser;
}

export interface CreateDonationApiResponse {
  success: boolean;
  message: string;
  data: Donation;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  error?: string;
}

/** Stats response for GET /api/stats */
export interface StatsApiResponse {
  success: boolean;
  data: {
    fundraisers: { total: number; active: number; completed: number };
    fundraising: { totalRaised: number; totalGoal: number; percentage: string };
    donations: { totalCount: number; totalAmount: number; averageAmount: string };
  };
}

/** Categories response for GET /api/categories */
export interface CategoriesApiResponse {
  success: boolean;
  data: string[];
}
