import React, { useState } from 'react'
import { formatFullDate } from '../../constants/DateConverter'
import styles from './QRCodeCard.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'

export default function QRCodeCard({ qrCode, onDelete }) {
    const [imageError, setImageError] = useState(false)
    
    const handleDelete = () => {
        onDelete(qrCode._id)
    }

    const handleDownload = async (e) => {
        e.preventDefault()
        try {
            // Fetch the image
            const response = await fetch(qrCode.qrCodeCDNUrl)
            const blob = await response.blob()
            
            // Create a temporary URL for the blob
            const blobUrl = window.URL.createObjectURL(blob)
            
            // Create a temporary anchor element
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = `QRCode-${qrCode.bookName.replace(/ /g, '-')}.png`
            
            // Trigger the download
            document.body.appendChild(link)
            link.click()
            
            // Cleanup
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Error downloading QR code:', error)
            // Fallback to direct link
            window.open(qrCode.qrCodeCDNUrl, '_blank')
        }
    }

    const truncateUrl = (url, maxLength = 50) => {
        if (url.length <= maxLength) return url
        return url.substring(0, maxLength) + '...'
    }

    return (
        <div className={styles.card}>
            <div className={styles.qrCodeImage}>
                {!imageError ? (
                    <img 
                        src={qrCode.qrCodeCDNUrl} 
                        alt={`QR Code for ${qrCode.bookName}`}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={styles.imageError}>
                        <AllIconsComponenet width={48} height={48} iconName='rectangleBox' color={'#ccc'} />
                        <p>فشل في تحميل الصورة</p>
                    </div>
                )}
            </div>
            
            <div className={styles.cardContent}>
                <h3 className={styles.bookName} title={qrCode.bookName}>
                    {qrCode.bookName}
                </h3>
                
                <div className={styles.urlContainer}>
                    <span className={styles.urlLabel}>الرابط:</span>
                    <span className={styles.url} title={qrCode.targetUrl}>
                        {truncateUrl(qrCode.targetUrl)}
                    </span>
                </div>
                
                <div className={styles.dateContainer}>
                    <AllIconsComponenet width={16} height={16} iconName='calander' color={'#64748b'} />
                    <span className={styles.date}>
                        {formatFullDate(qrCode.createdAt)}
                    </span>
                </div>
            </div>
            
            <div className={styles.cardActions}>
                <button
                    onClick={handleDownload}
                    className={styles.downloadBtn}
                    title="تحميل رمز QR"
                >
                    <AllIconsComponenet width={20} height={20} iconName='downloadIcon' color={'#ffffff'} />
                    <span>تحميل</span>
                </button>
                <button 
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    title="حذف رمز QR"
                >
                    <AllIconsComponenet width={20} height={20} iconName='deleteIcon' color={'#ffffff'} />
                    <span>حذف</span>
                </button>
            </div>
        </div>
    )
}

