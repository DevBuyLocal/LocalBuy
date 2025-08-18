export interface TSubmitFeedback {
  type: 'Rating' | 'Comment' | 'Suggestion' | 'Complaint';
  message: string;
  rating?: number; // Required when type is 'Rating'
}

export interface TSubmitFeedbackResponse {
  data: {
    id: number;
    feedbackId: string;
    type: string;
    message: string;
    rating?: number;
    status: string;
    dateSubmitted: string;
  };
  message: string;
  success: boolean;
}
