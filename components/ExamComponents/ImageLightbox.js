import React, { useState } from 'react';
import styles from './ImageLightbox.module.scss';

export default function ImageLightbox({ src, alt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 1) Thumbnail */}
      <div
        className={styles.imageContainer}
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} />
      </div>

      {/* 2) Overlay when open */}
      {open && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className={styles.lightboxImage}
            // prevent click-through
            onClick={e => e.stopPropagation()}
          />
          <button
            className={styles.lightboxClose}
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
