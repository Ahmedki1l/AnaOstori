import { toast } from 'react-toastify';
import { getNewToken } from './fireBaseAuthService';

// Error message constants in Arabic
export const ERROR_MESSAGES = {
  // HTTP Status Codes
  400: 'بيانات غير صحيحة، يرجى التحقق من المدخلات',
  401: 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول',
  403: 'ليس لديك صلاحية للوصول لهذا المورد',
  404: 'المورد المطلوب غير موجود',
  409: 'هناك تضارب في البيانات، يرجى التحقق',
  422: 'بيانات غير صحيحة أو غير مكتملة',
  429: 'تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة لاحقاً',
  500: 'خطأ في الخادم، يرجى المحاولة لاحقاً',
  502: 'خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً',
  503: 'الخدمة غير متاحة حالياً، يرجى المحاولة لاحقاً',
  504: 'انتهت مهلة الاتصال، يرجى المحاولة لاحقاً',
  
  // Network Errors
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة، يرجى التحقق من اتصال الإنترنت',
  TIMEOUT_ERROR: 'انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى',
  CORS_ERROR: 'خطأ في الوصول للمورد، يرجى المحاولة لاحقاً',
  
  // Firebase Auth Errors
  'auth/user-not-found': 'البريد الإلكتروني غير صحيح أو الحساب محذوف',
  'auth/wrong-password': 'كلمة المرور غير صحيحة',
  'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
  'auth/weak-password': 'كلمة المرور ضعيفة جداً',
  'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
  'auth/user-disabled': 'تم تعطيل الحساب',
  'auth/too-many-requests': 'تم تجاوز الحد الأقصى للمحاولات، يرجى الانتظار',
  'auth/operation-not-allowed': 'العملية غير مسموح بها',
  'auth/network-request-failed': 'فشل في الاتصال بالشبكة',
  
  // Generic Messages
  GENERIC_ERROR: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى',
  VALIDATION_ERROR: 'بيانات غير صحيحة، يرجى التحقق من المدخلات',
  UPLOAD_ERROR: 'فشل في رفع الملف، يرجى المحاولة مرة أخرى',
  DELETE_ERROR: 'فشل في الحذف، يرجى المحاولة مرة أخرى',
  SAVE_ERROR: 'فشل في الحفظ، يرجى المحاولة مرة أخرى',
  FETCH_ERROR: 'فشل في جلب البيانات، يرجى المحاولة مرة أخرى',
  AUTH_ERROR: 'خطأ في المصادقة، يرجى إعادة تسجيل الدخول',
  PERMISSION_ERROR: 'ليس لديك صلاحية لتنفيذ هذه العملية',
  RATE_LIMIT_ERROR: 'تم تجاوز الحد الأقصى للطلبات، يرجى الانتظار',
  MAINTENANCE_ERROR: 'الموقع تحت الصيانة، يرجى المحاولة لاحقاً'
};

// Stable backend error codes -> Arabic messages.
// The backend returns { code, message } for known business errors; mapping on the
// stable `code` (never on human English text) keeps the frontend resilient to
// backend wording changes. Extend this table as new codes are added.
export const ERROR_CODE_MESSAGES = {
  // Report (student-list Excel export)
  DATE_RANGE_REQUIRED: 'يرجى تحديد تاريخ البداية والنهاية للتقرير.',
  RECIPIENT_UNKNOWN: 'تعذّر تحديد البريد الإلكتروني لإرسال التقرير إليه.',
  EMAIL_NOT_CONFIGURED: 'خدمة البريد الإلكتروني غير مهيأة حاليًا. تواصل مع الدعم الفني.',
  EMAIL_SEND_FAILED: 'تعذّر إرسال التقرير عبر البريد الإلكتروني. حاول مرة أخرى لاحقًا.',
  REPORT_GENERATION_FAILED: 'تعذّر إنشاء التقرير. حاول مرة أخرى لاحقًا.',

  // Course order / multi-student enrollment
  DUPLICATE_STUDENT_EMAIL: 'ما يصير تستخدم نفس البريد الإلكتروني لأكثر من طالب. كل طالب لازم يكون له بريد مختلف، عدّل البريد المكرر وحاول مرة ثانية.',
  ALREADY_ENROLLED: 'الطالب مسجّل مسبقًا في هذا الموعد، فما يمكن تسجيله مرة ثانية. احذفه من القائمة أو اختر موعدًا آخر.',
  NO_SEATS: 'ما تكفي المقاعد المتبقية في هذا الموعد لعدد الطلاب المختار. قلّل عدد الطلاب أو اختر موعدًا فيه مقاعد كافية.',
  INVALID_PHONE: 'تأكد من رقم الجوال، لازم يكون بصيغة 05XXXXXXXX.',
  GROUP_NOT_ALLOWED: 'هذه الدورة متاحة للتسجيل الفردي فقط، ما يمكن شراؤها لأكثر من طالب. فضلًا اختر طالبًا واحدًا.',

  // Book shop
  INSUFFICIENT_STOCK: 'الكمية المطلوبة غير متوفرة حاليًا. يرجى تقليل الكمية أو المحاولة لاحقًا.',

  // Enrollment / attendance
  NOT_ENROLLED: 'الطالب غير مسجّل في هذه الدورة.',
  ATTENDANCE_ALREADY_MARKED: 'تم تسجيل الحضور مسبقًا.',
  ATTENDANCE_NOT_STARTED: 'لم يبدأ تسجيل الحضور لهذا الموعد بعد.',
  INVALID_ATTENDANCE_KEY: 'رمز الحضور غير صحيح.',

  // Generic fallbacks (used only when the backend sends a code without an Arabic message)
  VALIDATION_ERROR: 'بيانات غير صحيحة، يرجى التحقق من المدخلات.',
  NOT_FOUND: 'العنصر المطلوب غير موجود.',
  PERMISSION_DENIED: 'ليس لديك صلاحية لتنفيذ هذه العملية.',
  BUSINESS_LOGIC_ERROR: 'تعذّر إكمال العملية. يرجى التحقق والمحاولة مرة أخرى.',
  FORCE_DELETE_REQUIRED: 'لا يمكن الحذف لوجود بيانات مرتبطة.',
  INTERNAL_ERROR: 'حدث خطأ في الخادم، يرجى المحاولة لاحقًا.',
};

/**
 * Resolve a SPECIFIC, business-meaningful message from a backend error, or null
 * if the error carries no specific information. "Specific" means the backend sent
 * a known stable `errorCode`/`code`, or an already-Arabic `message`. Generic HTTP
 * statuses and network failures are intentionally NOT specific.
 * Used by the global interceptor so it only surfaces real business errors and does
 * not double up with components that already toast their own generic message.
 */
export const getSpecificBackendMessage = (error) => {
  const data = error?.response?.data;
  // Prefer the backend's own Arabic message: it is hand-written per scenario and
  // is more specific than a code mapping (generic codes like VALIDATION_ERROR are
  // reused across many scenarios with different messages).
  if (typeof data?.message === 'string' && /[؀-ۿ]/.test(data.message)) {
    return data.message;
  }
  // Fallback: map the stable code when the backend sent no Arabic message.
  // The code field is `errorCode` (most handlers) or `code` (newer).
  const backendCode = data?.errorCode || data?.code;
  if (backendCode && ERROR_CODE_MESSAGES[backendCode]) {
    return ERROR_CODE_MESSAGES[backendCode];
  }
  return null;
};

/**
 * Resolve any API/network error to a single user-friendly Arabic string (always
 * returns something). Order: specific backend message -> Firebase auth code ->
 * network/timeout -> HTTP status -> generic fallback. Pure function, safe to reuse
 * in both interceptors and component catch blocks.
 */
export const getFriendlyMessage = (error) => {
  const specific = getSpecificBackendMessage(error);
  if (specific) return specific;

  const status = error?.response?.status;
  if (error?.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') return ERROR_MESSAGES.TIMEOUT_ERROR;
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  if (status && ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status];
  }
  return ERROR_MESSAGES.GENERIC_ERROR;
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error categories
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};

/**
 * Main error handler class
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Handle HTTP errors with proper categorization
   */
  handleHttpError(error, context = '') {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message;
    const errorData = error?.response?.data;

    // Log error for debugging
    this.logError({
      type: 'HTTP_ERROR',
      status,
      message,
      context,
      errorData,
      timestamp: new Date().toISOString(),
      url: error?.config?.url,
      method: error?.config?.method
    });

    // Handle specific status codes
    switch (status) {
      case 401:
        return this.handleUnauthorizedError(error, context);
      case 403:
        return this.handleForbiddenError(error, context);
      case 404:
        return this.handleNotFoundError(error, context);
      case 409:
        return this.handleConflictError(error, context);
      case 422:
        return this.handleValidationError(error, context);
      case 429:
        return this.handleRateLimitError(error, context);
      case 500:
      case 502:
      case 503:
      case 504:
        return this.handleServerError(error, context);
      default:
        return this.handleGenericHttpError(error, context);
    }
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error, context = '') {
    this.logError({
      type: 'NETWORK_ERROR',
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    });

    if (error.code === 'NETWORK_ERROR') {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR, { rtl: true });
    } else if (error.code === 'ECONNABORTED') {
      toast.error(ERROR_MESSAGES.TIMEOUT_ERROR, { rtl: true });
    } else {
      toast.error(ERROR_MESSAGES.GENERIC_ERROR, { rtl: true });
    }

    return {
      handled: true,
      category: ERROR_CATEGORIES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      message: ERROR_MESSAGES.NETWORK_ERROR
    };
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(error, context = '') {
    this.logError({
      type: 'AUTH_ERROR',
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    });

    // Handle Firebase auth errors
    if (error.code && ERROR_MESSAGES[error.code]) {
      toast.error(ERROR_MESSAGES[error.code], { rtl: true });
      return {
        handled: true,
        category: ERROR_CATEGORIES.AUTHENTICATION,
        severity: ERROR_SEVERITY.MEDIUM,
        message: ERROR_MESSAGES[error.code]
      };
    }

    // Generic auth error
    toast.error(ERROR_MESSAGES.AUTH_ERROR, { rtl: true });
    return {
      handled: true,
      category: ERROR_CATEGORIES.AUTHENTICATION,
      severity: ERROR_SEVERITY.MEDIUM,
      message: ERROR_MESSAGES.AUTH_ERROR
    };
  }

  /**
   * Handle 401 Unauthorized errors with token refresh
   */
  async handleUnauthorizedError(error, context = '') {
    try {
      // Try to refresh token
      await getNewToken();
      
      // Retry the original request
      const config = error.config;
      if (config && !config._retry) {
        config._retry = true;
        config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
        
        // Return the retry promise
        return {
          handled: true,
          shouldRetry: true,
          config,
          category: ERROR_CATEGORIES.AUTHENTICATION,
          severity: ERROR_SEVERITY.MEDIUM
        };
      }
    } catch (refreshError) {
      // Token refresh failed, redirect to login
      this.logError({
        type: 'TOKEN_REFRESH_FAILED',
        message: refreshError.message,
        context,
        timestamp: new Date().toISOString()
      });

      toast.error(ERROR_MESSAGES[401], { rtl: true });
      
      // Preserve payment form data before clearing localStorage
      const paymentFormData = localStorage.getItem('paymentFormData');
      
      // Clear storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      // Restore payment form data if it existed (for 401 redirect flow)
      if (paymentFormData) {
        localStorage.setItem('paymentFormData', paymentFormData);
      }
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return {
        handled: true,
        shouldRedirect: true,
        category: ERROR_CATEGORIES.AUTHENTICATION,
        severity: ERROR_SEVERITY.CRITICAL,
        message: ERROR_MESSAGES[401]
      };
    }

    return {
      handled: true,
      category: ERROR_CATEGORIES.AUTHENTICATION,
      severity: ERROR_SEVERITY.MEDIUM,
      message: ERROR_MESSAGES[401]
    };
  }

  /**
   * Handle 403 Forbidden errors
   */
  handleForbiddenError(error, context = '') {
    toast.error(ERROR_MESSAGES[403], { rtl: true });
    return {
      handled: true,
      category: ERROR_CATEGORIES.AUTHORIZATION,
      severity: ERROR_SEVERITY.HIGH,
      message: ERROR_MESSAGES[403]
    };
  }

  /**
   * Handle 404 Not Found errors
   */
  handleNotFoundError(error, context = '') {
    toast.error(ERROR_MESSAGES[404], { rtl: true });
    return {
      handled: true,
      category: ERROR_CATEGORIES.CLIENT,
      severity: ERROR_SEVERITY.MEDIUM,
      message: ERROR_MESSAGES[404]
    };
  }

  /**
   * Handle 409 Conflict errors
   */
  handleConflictError(error, context = '') {
    const message = error?.response?.data?.message || ERROR_MESSAGES[409];
    toast.error(message, { rtl: true });
    return {
      handled: true,
      category: ERROR_CATEGORIES.VALIDATION,
      severity: ERROR_SEVERITY.MEDIUM,
      message
    };
  }

  /**
   * Handle 422 Validation errors
   */
  handleValidationError(error, context = '') {
    const message = error?.response?.data?.message || ERROR_MESSAGES[422];
    toast.error(message, { rtl: true });
    return {
      handled: true,
      category: ERROR_CATEGORIES.VALIDATION,
      severity: ERROR_SEVERITY.MEDIUM,
      message
    };
  }

  /**
   * Handle 429 Rate Limit errors
   */
  handleRateLimitError(error, context = '') {
    toast.error(ERROR_MESSAGES[429], { rtl: true });
    return {
      handled: true,
      category: ERROR_CATEGORIES.CLIENT,
      severity: ERROR_SEVERITY.MEDIUM,
      message: ERROR_MESSAGES[429]
    };
  }

  /**
   * Handle server errors (5xx)
   */
  handleServerError(error, context = '') {
    const status = error?.response?.status;
    const message = ERROR_MESSAGES[status] || ERROR_MESSAGES[500];
    
    toast.error(message, { rtl: true });
    
    return {
      handled: true,
      category: ERROR_CATEGORIES.SERVER,
      severity: ERROR_SEVERITY.HIGH,
      message
    };
  }

  /**
   * Handle generic HTTP errors
   */
  handleGenericHttpError(error, context = '') {
    const status = error?.response?.status;
    const message = ERROR_MESSAGES[status] || ERROR_MESSAGES.GENERIC_ERROR;
    
    toast.error(message, { rtl: true });
    
    return {
      handled: true,
      category: ERROR_CATEGORIES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      message
    };
  }

  /**
   * Main error handler that determines error type and routes accordingly
   */
  async handleError(error, context = '') {
    // Handle axios errors
    if (error.isAxiosError) {
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        return this.handleNetworkError(error, context);
      }
      return this.handleHttpError(error, context);
    }

    // Handle Firebase auth errors
    if (error.code && error.code.startsWith('auth/')) {
      return this.handleAuthError(error, context);
    }

    // Handle generic errors
    this.logError({
      type: 'GENERIC_ERROR',
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    });

    toast.error(ERROR_MESSAGES.GENERIC_ERROR, { rtl: true });
    
    return {
      handled: true,
      category: ERROR_CATEGORIES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      message: ERROR_MESSAGES.GENERIC_ERROR
    };
  }

  /**
   * Log errors for debugging and monitoring
   */
  logError(errorInfo) {
    this.errorLog.push(errorInfo);
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // Here you could also send errors to external monitoring services
    // like Sentry, LogRocket, etc.
  }

  /**
   * Get error log for debugging
   */
  getErrorLog() {
    return this.errorLog;
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Create a retry wrapper for failed requests
   */
  async withRetry(operation, maxRetries = this.maxRetries, delay = this.retryDelay) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export the instance and class
export default errorHandler;
export { ErrorHandler };
