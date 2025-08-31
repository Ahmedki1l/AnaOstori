# Comprehensive Error Handling Implementation Guide

## Overview

This guide explains how to implement comprehensive error handling across the entire AnaOstori website. The system handles all HTTP error codes, network errors, authentication errors, and provides user-friendly Arabic error messages.

## Architecture

The error handling system consists of three main components:

1. **Error Handler Service** (`services/errorHandlerService.js`) - Centralized error handling logic
2. **Enhanced API Service** (`services/enhancedApiService.js`) - API calls with integrated error handling
3. **React Hooks** (`hooks/useErrorHandler.js`) - Easy error handling in components
4. **Error Boundary** (`components/CommonComponents/ErrorBoundary/`) - Catches React errors

## 1. Error Handler Service

### Features
- Handles all HTTP status codes (400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504)
- Handles network errors, timeout errors, and CORS errors
- Handles Firebase authentication errors
- Automatic token refresh for 401 errors
- Error logging and categorization
- User-friendly Arabic error messages
- Retry mechanism for failed requests

### Usage

```javascript
import errorHandler from '../services/errorHandlerService';

// Handle any error
try {
  // Your code here
} catch (error) {
  const result = await errorHandler.handleError(error, 'Context');
  console.log('Error handled:', result);
}
```

### Error Categories

```javascript
import { ERROR_CATEGORIES, ERROR_SEVERITY } from '../services/errorHandlerService';

// Categories: NETWORK, AUTHENTICATION, AUTHORIZATION, VALIDATION, SERVER, CLIENT, UNKNOWN
// Severity: LOW, MEDIUM, HIGH, CRITICAL
```

## 2. Enhanced API Service

### Features
- Automatic error handling for all API calls
- Request/response interceptors
- Automatic token refresh
- Retry mechanism
- Request cancellation support
- Development logging

### Basic Usage

```javascript
import { enhancedApiService } from '../services/enhancedApiService';

// GET request
try {
  const response = await enhancedApiService.get('/users');
  console.log(response.data);
} catch (error) {
  // Error already handled by interceptor
  console.log('Request failed');
}

// POST request
try {
  const response = await enhancedApiService.post('/users', { name: 'John' });
  console.log(response.data);
} catch (error) {
  // Error already handled by interceptor
  console.log('Request failed');
}
```

### Route-based API calls (Backward compatibility)

```javascript
// Old way (still works)
const response = await enhancedApiService.postRoute({
  routeName: 'createUser',
  name: 'John'
});

// New way
const response = await enhancedApiService.post('/users', { name: 'John' });
```

### File Upload

```javascript
const formData = new FormData();
formData.append('file', file);

try {
  const response = await enhancedApiService.uploadFile('/upload', formData);
  console.log('Upload successful:', response.data);
} catch (error) {
  // Error already handled
}
```

## 3. React Hooks for Error Handling

### useErrorHandler Hook

```javascript
import { useErrorHandler } from '../hooks/useErrorHandler';

function MyComponent() {
  const {
    error,
    isLoading,
    hasError,
    clearError,
    executeWithErrorHandling,
    retry,
    reset
  } = useErrorHandler({
    showToast: true,
    logErrors: true,
    autoRetry: false,
    maxRetries: 3,
    context: 'MyComponent'
  });

  const handleSubmit = async (data) => {
    try {
      await executeWithErrorHandling(
        async (signal) => {
          // Your async operation here
          return await apiCall(data, { signal });
        },
        'Form Submission'
      );
    } catch (error) {
      // Error already handled
    }
  };

  if (hasError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={retry}>Retry</button>
        <button onClick={clearError}>Clear Error</button>
      </div>
    );
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### useApiCall Hook

```javascript
import { useApiCall } from '../hooks/useErrorHandler';

function MyComponent() {
  const { apiCall, isLoading, error, hasError } = useApiCall({
    autoRetry: true,
    maxRetries: 3
  });

  const fetchData = async () => {
    try {
      const result = await apiCall(enhancedApiService.get, '/users');
      console.log('Data:', result.data);
    } catch (error) {
      // Error already handled
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      {hasError && <p>Error occurred</p>}
    </div>
  );
}
```

### useFormSubmission Hook

```javascript
import { useFormSubmission } from '../hooks/useErrorHandler';

function MyForm() {
  const { submitForm, isLoading, error } = useFormSubmission({
    onSuccess: (result) => {
      console.log('Form submitted successfully:', result);
    },
    onError: (error) => {
      console.log('Form submission failed:', error);
    }
  });

  const handleSubmit = async (formData) => {
    try {
      await submitForm(formData, async (data, { signal }) => {
        return await apiCall('/submit', data, { signal });
      });
    } catch (error) {
      // Error already handled
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## 4. Error Boundary Component

### Basic Usage

```javascript
import ErrorBoundary from '../components/CommonComponents/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

```javascript
function App() {
  const customFallback = ({ error, retry, reportError }) => (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={retry}>Try Again</button>
      <button onClick={reportError}>Report Error</button>
    </div>
  );

  return (
    <ErrorBoundary fallback={customFallback}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### Higher-Order Component

```javascript
import { withErrorBoundary } from '../components/CommonComponents/ErrorBoundary/ErrorBoundary';

const MyComponent = () => <div>My Component</div>;

export default withErrorBoundary(MyComponent, {
  refreshOnRetry: true
});
```

## 5. Migration Guide

### Step 1: Replace old API calls

**Before:**
```javascript
import axios from 'axios';

try {
  const response = await axios.post('/api/users', data);
  console.log(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle 401
  } else if (error.response?.status === 500) {
    // Handle 500
  }
  // ... more error handling
}
```

**After:**
```javascript
import { enhancedApiService } from '../services/enhancedApiService';

try {
  const response = await enhancedApiService.post('/api/users', data);
  console.log(response.data);
} catch (error) {
  // Error already handled automatically
}
```

### Step 2: Update components to use hooks

**Before:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiCall();
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```javascript
const { executeWithErrorHandling, isLoading, error } = useErrorHandler();

const handleSubmit = async () => {
  try {
    await executeWithErrorHandling(async () => {
      await apiCall();
    });
  } catch (error) {
    // Error already handled
  }
};
```

### Step 3: Add error boundaries

```javascript
// Wrap your main app
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

// Wrap individual pages or components that might fail
function UserProfile() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}
```

## 6. Error Messages

All error messages are in Arabic and user-friendly:

- **400**: بيانات غير صحيحة، يرجى التحقق من المدخلات
- **401**: انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول
- **403**: ليس لديك صلاحية للوصول لهذا المورد
- **404**: المورد المطلوب غير موجود
- **409**: هناك تضارب في البيانات، يرجى التحقق
- **422**: بيانات غير صحيحة أو غير مكتملة
- **429**: تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة لاحقاً
- **500**: خطأ في الخادم، يرجى المحاولة لاحقاً

## 7. Best Practices

### 1. Always use the enhanced API service
```javascript
// ✅ Good
import { enhancedApiService } from '../services/enhancedApiService';
const response = await enhancedApiService.get('/users');

// ❌ Bad
import axios from 'axios';
const response = await axios.get('/users');
```

### 2. Use error handling hooks in components
```javascript
// ✅ Good
const { executeWithErrorHandling, isLoading, error } = useErrorHandler();

// ❌ Bad
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### 3. Wrap components with error boundaries
```javascript
// ✅ Good
<ErrorBoundary>
  <Component />
</ErrorBoundary>

// ❌ Bad
<Component />
```

### 4. Provide context for better error tracking
```javascript
// ✅ Good
const result = await errorHandler.handleError(error, 'User Registration');

// ❌ Bad
const result = await errorHandler.handleError(error);
```

### 5. Use retry mechanisms for transient failures
```javascript
// ✅ Good
const { apiCall } = useApiCall({ autoRetry: true, maxRetries: 3 });

// ❌ Bad
// No retry mechanism
```

## 8. Testing

### Test error scenarios
```javascript
import { useErrorBoundary } from '../hooks/useErrorHandler';

function TestComponent() {
  const { triggerError } = useErrorBoundary();

  const testError = () => {
    triggerError(new Error('Test error'));
  };

  return <button onClick={testError}>Test Error</button>;
}
```

### Test API error handling
```javascript
// Mock API failure
jest.spyOn(enhancedApiService, 'get').mockRejectedValue({
  isAxiosError: true,
  response: { status: 500, data: { message: 'Server error' } }
});
```

## 9. Monitoring and Debugging

### View error log
```javascript
import { enhancedApiService } from '../services/enhancedApiService';

// Get all logged errors
const errorLog = enhancedApiService.getErrorLog();
console.log('Error log:', errorLog);

// Clear error log
enhancedApiService.clearErrorLog();
```

### Development logging
In development mode, the system automatically logs:
- Successful API calls with duration
- All errors with context
- Request/response details

## 10. Troubleshooting

### Common Issues

1. **Token refresh not working**
   - Check if `getNewToken` function is properly implemented
   - Verify Firebase configuration

2. **Error messages not showing**
   - Ensure `react-toastify` is properly configured
   - Check if toast container is mounted

3. **API calls still failing**
   - Verify environment variables are set correctly
   - Check network connectivity
   - Ensure backend endpoints are working

### Debug Mode

Enable debug mode by setting:
```javascript
localStorage.setItem('debug', 'true');
```

This will show additional logging information in the console.

## Conclusion

This comprehensive error handling system provides:

- **Automatic error handling** for all HTTP status codes
- **User-friendly Arabic error messages**
- **Automatic token refresh** for authentication errors
- **Retry mechanisms** for transient failures
- **Error boundaries** for React errors
- **Easy-to-use hooks** for components
- **Comprehensive logging** for debugging
- **Backward compatibility** with existing code

By implementing this system, you'll have robust error handling across your entire application, improving user experience and making debugging easier for developers.
