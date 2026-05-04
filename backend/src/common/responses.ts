export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    timestamp: string;
    path: string;
  };
}

export const sendSuccess = <T>(data: T, statusCode = 200) => ({
  success: true,
  data,
});

export const sendError = (message: string, code?: string, statusCode = 400) => ({
  success: false,
  error: {
    message,
    code,
  },
});
