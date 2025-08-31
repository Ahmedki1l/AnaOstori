import React from 'react';
import { toast } from 'react-toastify';
import errorHandler from '../../../services/errorHandlerService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information
    this.setState({ errorInfo });
    
    // Log error to centralized error handler
    errorHandler.logError({
      type: 'REACT_ERROR_BOUNDARY',
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Show user-friendly error message
    toast.error('حدث خطأ غير متوقع، يرجى تحديث الصفحة', { rtl: true });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
    
    // Optionally refresh the page
    if (this.props.refreshOnRetry) {
      window.location.reload();
    }
  };

  handleReportError = () => {
    const errorData = {
      errorId: this.state.errorId,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Log error for reporting
    console.error('Error to report:', errorData);
    
    // Here you could send the error to your error reporting service
    // like Sentry, LogRocket, etc.
    
    toast.success('تم تسجيل الخطأ، سنقوم بمعالجته قريباً', { rtl: true });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          errorId: this.state.errorId,
          retry: this.handleRetry,
          reportError: this.handleReportError
        });
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback" dir="rtl">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>عذراً، حدث خطأ غير متوقع</h2>
            <p>نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو تحديث الصفحة.</p>
            
            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="retry-button"
              >
                إعادة المحاولة
              </button>
              
              <button 
                onClick={this.handleReportError}
                className="report-button"
              >
                الإبلاغ عن الخطأ
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>تفاصيل الخطأ (للمطورين)</summary>
                <div className="error-stack">
                  <h4>الخطأ:</h4>
                  <pre>{this.state.error?.toString()}</pre>
                  
                  <h4>معلومات المكون:</h4>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                  
                  <h4>معرف الخطأ:</h4>
                  <code>{this.state.errorId}</code>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for manually triggering error boundary (useful for testing)
export const useErrorBoundary = () => {
  const triggerError = (error) => {
    throw error;
  };

  return { triggerError };
};

export default ErrorBoundary;
