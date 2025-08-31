import { useState, useCallback, useRef } from 'react';
import errorHandler from '../services/errorHandlerService';

/**
 * Custom hook for handling errors in React components
 * Provides error state, loading state, and error handling methods
 */
export const useErrorHandler = (options = {}) => {
  const {
    showToast = true,
    logErrors = true,
    autoRetry = false,
    maxRetries = 3,
    retryDelay = 1000,
    onError = null,
    onSuccess = null,
    context = 'Component'
  } = options;

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  /**
   * Handle errors with optional retry logic
   */
  const handleError = useCallback(async (error, errorContext = context) => {
    if (logErrors) {
      console.error(`Error in ${errorContext}:`, error);
    }

    // Set error state
    setError(error);

    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }

    // Handle error through centralized error handler
    try {
      const result = await errorHandler.handleError(error, errorContext);
      
      // If error handler suggests retry and autoRetry is enabled
      if (result.shouldRetry && autoRetry && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        return { shouldRetry: true, result };
      }

      return { shouldRetry: false, result };
    } catch (handlerError) {
      console.error('Error handler failed:', handlerError);
      return { shouldRetry: false, result: null };
    }
  }, [context, logErrors, onError, autoRetry, retryCount, maxRetries]);

  /**
   * Execute async operation with error handling
   */
  const executeWithErrorHandling = useCallback(async (
    operation,
    operationContext = context,
    options = {}
  ) => {
    const {
      showLoading = true,
      clearErrorOnStart = true,
      onSuccess: operationSuccess = onSuccess,
      onError: operationError = onError
    } = options;

    try {
      // Clear previous errors and set loading
      if (clearErrorOnStart) {
        clearError();
      }
      if (showLoading) {
        setLoading(true);
      }

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Execute operation
      const result = await operation(abortControllerRef.current.signal);

      // Clear error and loading on success
      clearError();
      setLoading(false);

      // Call success handler
      if (operationSuccess) {
        operationSuccess(result);
      }

      return result;
    } catch (error) {
      // Don't handle errors if operation was cancelled
      if (error.name === 'AbortError') {
        return;
      }

      setLoading(false);
      
      // Handle error
      const { shouldRetry } = await handleError(error, operationContext);
      
      // Call error handler
      if (operationError) {
        operationError(error);
      }

      // If should retry and autoRetry is enabled, retry the operation
      if (shouldRetry && autoRetry && retryCount < maxRetries) {
        setTimeout(() => {
          executeWithErrorHandling(operation, operationContext, options);
        }, retryDelay * (retryCount + 1));
      }

      throw error;
    }
  }, [
    context,
    clearError,
    setLoading,
    handleError,
    onSuccess,
    onError,
    autoRetry,
    retryCount,
    maxRetries,
    retryDelay
  ]);

  /**
   * Cancel ongoing operations
   */
  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  }, []);

  /**
   * Retry last failed operation
   */
  const retry = useCallback(async (operation, operationContext = context) => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      return executeWithErrorHandling(operation, operationContext, { clearErrorOnStart: false });
    }
    throw new Error('Max retries exceeded');
  }, [retryCount, maxRetries, executeWithErrorHandling, context]);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setRetryCount(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    // State
    error,
    isLoading,
    retryCount,
    hasError: !!error,
    
    // Actions
    clearError,
    setLoading,
    handleError,
    executeWithErrorHandling,
    cancelOperation,
    retry,
    reset,
    
    // Utility
    canRetry: retryCount < maxRetries,
    remainingRetries: maxRetries - retryCount
  };
};

/**
 * Hook for handling API calls with error handling
 */
export const useApiCall = (options = {}) => {
  const errorHandler = useErrorHandler(options);
  
  const apiCall = useCallback(async (apiFunction, ...args) => {
    return errorHandler.executeWithErrorHandling(
      async (signal) => {
        // Add abort signal to API call if supported
        if (apiFunction.length > args.length) {
          return apiFunction(...args, { signal });
        }
        return apiFunction(...args);
      },
      'API Call'
    );
  }, [errorHandler]);

  return {
    ...errorHandler,
    apiCall
  };
};

/**
 * Hook for handling form submissions with error handling
 */
export const useFormSubmission = (options = {}) => {
  const errorHandler = useErrorHandler(options);
  
  const submitForm = useCallback(async (formData, submitFunction) => {
    return errorHandler.executeWithErrorHandling(
      async (signal) => {
        return submitFunction(formData, { signal });
      },
      'Form Submission'
    );
  }, [errorHandler]);

  return {
    ...errorHandler,
    submitForm
  };
};

/**
 * Hook for handling file uploads with error handling
 */
export const useFileUpload = (options = {}) => {
  const errorHandler = useErrorHandler(options);
  
  const uploadFile = useCallback(async (file, uploadFunction) => {
    return errorHandler.executeWithErrorHandling(
      async (signal) => {
        return uploadFunction(file, { signal });
      },
      'File Upload'
    );
  }, [errorHandler]);

  return {
    ...errorHandler,
    uploadFile
  };
};

export default useErrorHandler;
