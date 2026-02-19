import axios, { AxiosError } from 'axios';
import type { CreateDonationInput, DonationsApiResponse } from '../interfaces';
import type {
  ApiErrorResponse,
  CategoriesApiResponse,
  CreateDonationApiResponse,
  FundraiserApiResponse,
  FundraisersApiResponse,
  GetDonationsParams,
  GetFundraisersParams,
  StatsApiResponse,
} from './types';

export type {
  ApiErrorResponse,
  CategoriesApiResponse,
  CreateDonationApiResponse,
  Fundraiser,
  FundraiserApiResponse,
  FundraisersApiResponse,
  GetDonationsParams,
  GetFundraisersParams,
  Pagination,
  StatsApiResponse,
} from './types';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.givebutter.com/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API methods (aligned with backend server.js routes) ---

export const api = {
  /**
   * GET /api/fundraisers
   * Optional: status, category, search, sortBy, sortOrder, page, limit
   */
  getFundraisers: async (params?: GetFundraisersParams): Promise<FundraisersApiResponse> => {
    const response = await client.get<FundraisersApiResponse>('/api/fundraisers', {
      params,
    });
    return response.data;
  },

  /**
   * GET /api/fundraisers/:id
   */
  getFundraiser: async (id: number): Promise<FundraiserApiResponse> => {
    const response = await client.get<FundraiserApiResponse>(`/api/fundraisers/${id}`);
    return response.data;
  },

  /**
   * GET /api/fundraisers/:id/donations
   * Optional: sortBy, sortOrder, page, limit
   */
  getDonations: async (
    fundraiserId: number,
    params?: GetDonationsParams
  ): Promise<DonationsApiResponse> => {
    const response = await client.get<DonationsApiResponse>(
      `/api/fundraisers/${fundraiserId}/donations`,
      { params }
    );
    return response.data;
  },

  /**
   * POST /api/fundraisers/:id/donations
   * Body: amount, donorName, message?, anonymous?
   */
  createDonation: async (
    fundraiserId: number,
    donation: CreateDonationInput
  ): Promise<CreateDonationApiResponse> => {
    const response = await client.post<CreateDonationApiResponse>(
      `/api/fundraisers/${fundraiserId}/donations`,
      donation
    );
    return response.data;
  },

  /**
   * GET /api/stats
   */
  getStats: async (): Promise<StatsApiResponse> => {
    const response = await client.get<StatsApiResponse>('/api/stats');
    return response.data;
  },

  /**
   * GET /api/categories
   */
  getCategories: async (): Promise<CategoriesApiResponse> => {
    const response = await client.get<CategoriesApiResponse>('/api/categories');
    return response.data;
  },
};

/** Type guard for API error response (backend returns success: false, message, errors?) */
export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as ApiErrorResponse).success === false &&
    'message' in data
  );
}

/** Get error message from axios error (backend message or errors array) */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = (error as AxiosError<ApiErrorResponse>).response?.data;
    if (isApiErrorResponse(data)) {
      if (data.errors?.length) return data.errors.join(', ');
      return data.message;
    }
    return error.message || 'Request failed';
  }
  return error instanceof Error ? error.message : 'Unknown error';
}
