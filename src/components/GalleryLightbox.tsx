import React, { useEffect } from 'react';
import { GalleryItem } from '../data/solutionsData';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (item) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div
      className="adv-lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery Image: ${item.title}`}
    >
      <div className="adv-lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="adv-lightbox-close"
          aria-label="Close Lightbox"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="adv-lightbox-nav adv-lightbox-prev"
          aria-label="Previous Image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="adv-lightbox-nav adv-lightbox-next"
          aria-label="Next Image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Main Image Stage */}
        <div className="adv-lightbox-image-stage">
          <img
            src={item.image}
            alt={item.alt}
            className="adv-lightbox-img"
          />
        </div>

        {/* Image Metadata Bar */}
        <div className="adv-lightbox-info">
          <div>
            <span className="adv-lightbox-category">{item.category}</span>
            <h3 className="adv-lightbox-title">{item.title}</h3>
          </div>
          <div className="adv-lightbox-meta-right">
            <span className="adv-lightbox-location">📍 {item.location}</span>
            <a
              href={`/advertising-solutions/${item.formatSlug}/`}
              className="adv-lightbox-link"
            >
              Format Specs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
