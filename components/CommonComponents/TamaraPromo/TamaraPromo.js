import React, { useEffect, useState } from 'react'
import styles from './TamaraPromo.module.scss'

const TamaraPromo = ({ amount, className = '' }) => {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)

  useEffect(() => {
    // Configure Tamara Widget
    window.tamaraWidgetConfig = {
      lang: 'ar', // Arabic language
      country: 'SA', // Saudi Arabia
      publicKey: process.env.NEXT_PUBLIC_TAMARA_PUBLIC_KEY || 'pk_test_123456789', // Replace with actual public key
      style: {
        fontSize: '14px',
        badgeRatio: 1,
      }
    }

    // Load Tamara Widget script if not already loaded
    if (!document.querySelector('script[src="https://cdn.tamara.co/widget-v2/tamara-widget.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://cdn.tamara.co/widget-v2/tamara-widget.js'
      script.defer = true
      script.onload = () => {
        setIsWidgetLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Tamara widget')
      }
      document.head.appendChild(script)
    } else {
      setIsWidgetLoaded(true)
    }
  }, [])

  // Refresh widget when amount changes
  useEffect(() => {
    if (isWidgetLoaded && window.TamaraWidgetV2 && amount) {
      setTimeout(() => {
        window.TamaraWidgetV2.refresh()
      }, 100)
    }
  }, [amount, isWidgetLoaded])

  if (!amount) {
    return null
  }

  return (
    <div className={`${styles.tamaraPromo} ${className}`}>
        
        {/* Tamara Summary Widget - Using Default Template */}
        <div className={styles.widgetContainer}>
          <tamara-widget 
            type="tamara-summary" 
            inline-type="2" 
            amount={amount}
          />
      </div>
    </div>
  )
}

export default TamaraPromo 