export const TIKTOK_PIXEL_ID = 'C8EFF248D8GECQQUBBBG'

export const pageview = () => {
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq === 'function') {
    window.ttq('track', 'PageView')
  }
}

// TikTok Pixel tracking functions
export const event = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq === 'function') {
    window.ttq('track', eventName, parameters)
  }
}

// Common TikTok events
export const trackCompleteRegistration = (parameters = {}) => {
  event('CompleteRegistration', parameters)
}

export const trackPurchase = (parameters = {}) => {
  event('Purchase', parameters)
}

export const trackViewContent = (parameters = {}) => {
  event('ViewContent', parameters)
}

export const trackAddToCart = (parameters = {}) => {
  event('AddToCart', parameters)
}

export const trackInitiateCheckout = (parameters = {}) => {
  event('InitiateCheckout', parameters)
}