export default class FeedbackHandler {
  loading: any;
  errors: any;
  success: any;
  status: any;
  message: any;
  
  startLoading(model?: string): void;
  finishLoading(model?: string): void;
  setError(error: any, model?: string): void;
  clearError(model?: string): void;
  showSuccess(model?: string): void;
  removeSuccess(model?: string): void;
  showToast({success, error, warning, info}: {success?: string, error?: string, warning?: string, info?: string}, toast: any): void;
} 