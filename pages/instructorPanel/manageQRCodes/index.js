import React, { useState, useEffect } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { qrCodeService } from '../../../services/qrCodeService'
import { toast } from 'react-toastify'
import CreateQRCodeModal from '../../../components/QRCodeManagement/CreateQRCodeModal'
import ConfirmDeleteModal from '../../../components/QRCodeManagement/ConfirmDeleteModal'
import QRCodeCard from '../../../components/QRCodeManagement/QRCodeCard'
import Empty from '../../../components/CommonComponents/Empty'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageQRCodes.module.scss'

const Index = () => {
    const [qrCodes, setQrCodes] = useState([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)
    
    // Search and pagination states
    const [searchText, setSearchText] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize] = useState(20)
    const [debounceTimer, setDebounceTimer] = useState(null)

    useEffect(() => {
        fetchQRCodes()
    }, [currentPage])

    useEffect(() => {
        // Debounce search
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }
        
        const timer = setTimeout(() => {
            setCurrentPage(1)
            fetchQRCodes()
        }, 500)
        
        setDebounceTimer(timer)
        
        return () => clearTimeout(timer)
    }, [searchText])

    const fetchQRCodes = async () => {
        setLoading(true)
        try {
            const data = await qrCodeService.getAllQRCodes(currentPage, pageSize, searchText)
            setQrCodes(data.qrCodes || [])
            setTotalPages(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching QR codes:', error)
            toast.error('فشل في تحميل رموز QR', { rtl: true })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateQRCode = async (bookName, url) => {
        setCreating(true)
        try {
            await qrCodeService.generateQRCode(bookName, url, false)
            toast.success('تم إنشاء رمز QR بنجاح', { rtl: true })
            fetchQRCodes()
        } catch (error) {
            console.error('Error creating QR code:', error)
            
            if (error?.response?.status === 400) {
                toast.error('بيانات غير صحيحة، يرجى التحقق من المدخلات', { rtl: true })
            } else if (error?.response?.status === 500) {
                toast.error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى', { rtl: true })
            } else {
                toast.error('فشل في إنشاء رمز QR', { rtl: true })
            }
        } finally {
            setCreating(false)
        }
    }

    const handleDeleteQRCode = async () => {
        if (!deleteTarget) return
        
        setDeleting(true)
        try {
            await qrCodeService.deleteQRCode(deleteTarget, true)
            toast.success('تم حذف رمز QR بنجاح', { rtl: true })
            fetchQRCodes()
        } catch (error) {
            console.error('Error deleting QR code:', error)
            
            if (error?.response?.status === 404) {
                toast.error('رمز QR غير موجود', { rtl: true })
            } else if (error?.response?.status === 500) {
                toast.error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى', { rtl: true })
            } else {
                toast.error('فشل في حذف رمز QR', { rtl: true })
            }
        } finally {
            setDeleting(false)
            setDeleteTarget(null)
        }
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchText('')
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleOpenDeleteModal = (qrCodeId) => {
        setDeleteTarget(qrCodeId)
    }

    const handleCloseDeleteModal = () => {
        setDeleteTarget(null)
    }

    const customEmptyComponent = (
        <Empty 
            emptyText={'لا يوجد رموز QR'} 
            containerhight={400} 
            buttonText={'إضافة رمز QR'} 
            onClick={() => setCreating(true)} 
        />
    )

    // Filter QR codes client-side for real-time search
    const filteredQRCodes = searchText
        ? qrCodes.filter(qr => 
            qr.bookName.toLowerCase().includes(searchText.toLowerCase()) ||
            qr.targetUrl.toLowerCase().includes(searchText.toLowerCase())
          )
        : qrCodes

    return (
        <div className='maxWidthDefault px-4'>
            <div style={{ height: 30 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={[
                        { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                        { lable: 'إدارة رموز QR', link: null },
                    ]}
                />
            </div>

            <div className={styles.header}>
                <h1 className="head2">إدارة رموز QR</h1>
                <div className={styles.headerActions}>
                    <button 
                        className="primarySolidBtn" 
                        onClick={() => setCreating(true)}
                    >
                        + إضافة رمز QR
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <AllIconsComponenet 
                        width={20} 
                        height={20} 
                        iconName='newFilterIcon' 
                        color={'#64748b'} 
                    />
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearchChange}
                        placeholder="ابحث عن اسم الكتاب أو الرابط..."
                        className={styles.searchInput}
                    />
                    {searchText && (
                        <button
                            onClick={handleClearSearch}
                            className={styles.clearSearchBtn}
                            title="مسح البحث"
                        >
                            <AllIconsComponenet 
                                width={16} 
                                height={16} 
                                iconName='closeicon' 
                                color={'#64748b'} 
                            />
                        </button>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className={styles.loadingContainer}>
                    <p className={styles.loadingText}>جاري التحميل...</p>
                </div>
            )}

            {/* QR Codes Grid */}
            {!loading && filteredQRCodes.length === 0 && !searchText && (
                customEmptyComponent
            )}

            {!loading && filteredQRCodes.length === 0 && searchText && (
                <div className={styles.noResults}>
                    <AllIconsComponenet 
                        width={64} 
                        height={64} 
                        iconName='newFilterIcon' 
                        color={'#cbd5e1'} 
                    />
                    <p>لا توجد نتائج للبحث</p>
                </div>
            )}

            {!loading && filteredQRCodes.length > 0 && (
                <>
                    <div className={styles.qrGrid}>
                        {filteredQRCodes.map(qr => (
                            <QRCodeCard
                                key={qr._id}
                                qrCode={qr}
                                onDelete={handleOpenDeleteModal}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && !searchText && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.paginationBtn}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                السابق
                            </button>
                            <span className={styles.pageInfo}>
                                صفحة {currentPage} من {totalPages}
                            </span>
                            <button
                                className={styles.paginationBtn}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                التالي
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Create Modal */}
            {creating && (
                <CreateQRCodeModal
                    onSave={handleCreateQRCode}
                    onClose={() => setCreating(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <ConfirmDeleteModal
                    title="هل أنت متأكد من حذف رمز QR هذا؟"
                    onConfirm={handleDeleteQRCode}
                    onClose={handleCloseDeleteModal}
                    isLoading={deleting}
                />
            )}
        </div>
    )
}

export default Index

