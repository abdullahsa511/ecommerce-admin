export class FeedbackHandler {
  loading: any;
  error: any;
  success: any;
  successMessage: any;
  
  startLoading(model?: string): void;
  finishLoading(model?: string): void;
  setError(error: any, model?: string): void;
  clearError(model?: string): void;
  showSuccess(model?: string): void;
  removeSuccess(model?: string): void;
} 