export interface TSupportRequest {
  id: number;
  supportId: string; // This is the ticket ID like "#000009"
  title: string;
  category: 'PRODUCT' | 'ORDER' | 'DELIVERY' | 'GENERAL';
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dateSubmitted: string; // This is createdAt
  lastUpdated: string; // This is updatedAt
  assignedAdmin?: string | null;
  resolutionChannel?: string | null;
  resolvedAt?: string | null;
}

export interface TSupportRequestResponse {
  request: TSupportRequest;
}

export interface TSupportRequestsResponse {
  data: {
    requests: TSupportRequest[];
    pagination: {
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      totalCount: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

export interface TSubmitSupportRequest {
  title: string;
  category: 'Product' | 'Order' | 'Delivery' | 'General';
  description: string;
}

export interface TSubmitSupportResponse {
  data: {
    id: number;
    supportId: string;
    title: string;
    category: string;
    description: string;
    status: string;
    priority: string;
    dateSubmitted: string;
  };
  message: string;
  success: boolean;
}
