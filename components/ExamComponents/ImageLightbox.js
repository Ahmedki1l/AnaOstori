import React, { useState } from 'react';
import Image from 'next/image';
import Spinner from '../CommonComponents/spinner';
import styles from './ImageLightbox.module.scss';

export default function ImageLightbox({ src, alt }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // // Preload image for overlay
  // React.useEffect(() => {
  //   if (open) {
  //     setOverlayLoading(true);
  //     const img = new window.Image();
  //     img.src = src;
  //     img.onload = () => setOverlayLoading(false);
  //     img.onerror = () => setOverlayLoading(false);
  //   }
  // }, [open, src]);

  return (
    <>
      {/* 1) Thumbnail */}
      <div className={styles.mainContainer}>
        <div
          className={styles.imageContainer}
          onClick={() => setOpen(true)}
        >
          {loading && (
            <div style={{ minHeight: 120, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner width={"2"} height={"2"} />
            </div>
          )}
          <Image
            src={src}
            alt={alt}
            layout="responsive"
            width={400}
            height={250}
            onLoadingComplete={() => { setLoading(false); console.log('Thumbnail image loaded:', src); }}
            onError={(e) => { setLoading(false); console.log('Thumbnail image failed to load:', src, e); }}
            style={{ display: loading ? 'none' : 'block', cursor: 'pointer' }}
            unoptimized={false}
            priority={false}
          />
        </div>
      </div>

      {/* 2) Overlay when open */}
      {open && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setOpen(false)}
        >
          <div style={{ position: 'relative', minHeight: 200, minWidth: 200 }}>
            {overlayLoading && (
              <div style={{ minHeight: 200, minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner width={"3"} height={"3"} />
              </div>
            )}
            <Image
              src={src}
              alt={alt}
              className={styles.lightboxImage}
              fill
              onLoadingComplete={() => { setOverlayLoading(false); console.log('Overlay image loaded:', src); }}
              onError={(e) => { setOverlayLoading(false); console.log('Overlay image failed to load:', src, e); }}
              style={{ display: overlayLoading ? 'none' : 'block', borderRadius: 4, boxShadow: '0 0 16px rgba(0,0,0,0.5)' }}
              unoptimized={false}
              priority={true}
            />
            <button
              className={styles.lightboxClose}
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16 }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
