export interface Donation {
  id: number;
  fundraiserId: number;
  amount: number;
  donorName: string;
  message: string;
  createdAt: string;
  anonymous: boolean;
}

export interface CreateDonationInput {
  amount: number;
  donorName: string;
  message?: string;
  anonymous?: boolean;
}

export interface DonationsApiResponse {
  success: boolean;
  data: Donation[];
  summary?: {
    totalAmount: number;
    totalCount: number;
    averageAmount: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateDonationApiResponse {
  success: boolean;
  message: string;
  data: Donation;
}
