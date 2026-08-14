import React, { useEffect, useState, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchHardwareCatalog, SheetProductItem } from '../services/solutionsApi';

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

interface HardwareCatalogProps {
  initialCategory?: string;
  title?: string;
  subtitle?: string;
}

export const HardwareCatalog: React.FC<HardwareCatalogProps> = ({
  initialCategory = 'All',
  title = 'LED Solutions',
  subtitle = 'Explore technical specifications, cabinet dimensions, and display hardware synced live from our inventory database.',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<SheetProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const elem = containerRef.current;
    if (!elem) return;

    const ctx = gsap.context(() => {
      const animElements = elem.querySelectorAll('.hw-anim');
      if (animElements.length > 0) {
        gsap.fromTo(
          animElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchHardwareCatalog()
      .then((data) => {
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error loading hardware catalog:', err);
          setError('Failed to load live specifications.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Outdoor Billboards' && item.category.toLowerCase().includes('outdoor')) ||
        (selectedCategory === 'LED Displays' && (item.category.toLowerCase().includes('display') || item.category.toLowerCase().includes('led')));

      const matchesSearch =
        !searchQuery ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dimensions.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);

    // Animate the grid items on page change
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.hw-product-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
      );
    }

    // Scroll back to the section top
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  // Generate pagination range with ellipses
  const getPaginationRange = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range: (number | '...')[] = [1];

    if (currentPage > 3) {
      range.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - 2) {
      range.push('...');
    }

    range.push(totalPages);
    return range;
  };

  return (
    <div ref={containerRef} style={{ marginTop: '40px' }}>
      {/* Section Header */}
      <div className="adv-section-header hw-anim" style={{ textAlign: 'center', maxWidth: '760px', marginInline: 'auto', marginBottom: '36px' }}>
        <h2 className="adv-section-h2">{title}</h2>
        <p className="adv-section-desc" style={{ marginInline: 'auto' }}>
          {subtitle}
        </p>
      </div>

      {/* Controls Bar: Search + Category Pills */}
      <div className="hw-anim" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {/* Search Input */}
        <div style={{ maxWidth: '480px', width: '100%', marginInline: 'auto', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by product name, dimensions, or cabinet type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px 14px 44px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1px solid rgba(15, 23, 42, 0.15)',
              color: '#0f172a',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
          }}>
            {categories.map((cat) => {
              const isActive = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className="hw-category-pill"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isActive
                      ? 'linear-gradient(135deg, #30579C, #6C97D3)'
                      : 'rgba(15, 23, 42, 0.03)',
                    color: isActive ? '#ffffff' : '#475569',
                    borderColor: isActive ? 'transparent' : 'rgba(15, 23, 42, 0.12)',
                    boxShadow: isActive ? '0 4px 14px rgba(48, 87, 156, 0.25)' : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              style={{
                height: '180px',
                borderRadius: '20px',
                background: 'rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', color: '#dc2626' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Paginated Product Grid */}
      {!loading && !error && (
        <>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '20px', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
              No hardware specifications matched your filter query.
            </div>
          ) : (
            <>
              {/* Results count & showing indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '0 4px',
              }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} products
                </span>
                {totalPages > 1 && (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>

              {/* Product Cards Grid */}
              <div
                ref={gridRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {paginatedItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="hw-product-card"
                    style={{
                      padding: '24px',
                      borderRadius: '20px',
                      background: '#ffffff',
                      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(48, 87, 156, 0.4)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.04)';
                    }}
                  >
                    <div>
                      {/* Category Badge + Availability */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          color: '#30579C',
                          background: 'rgba(48, 87, 156, 0.08)',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                        }}>
                          {item.category}
                        </span>
                        {item.availability && (
                          <span style={{ fontSize: '0.68rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                            Available
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
                        {item.productName}
                      </h4>

                      {/* Dimensions */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569', fontFamily: 'var(--font-mono)', background: 'rgba(15, 23, 42, 0.04)', padding: '6px 10px', borderRadius: '8px', marginBlock: '8px' }}>
                        <span style={{ color: '#64748b' }}>Dimensions:</span>
                        <strong style={{ color: '#0f172a' }}>{item.dimensions}</strong>
                      </div>

                      {item.description && (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px', lineHeight: '1.5' }}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Action Link */}
                    <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(15, 23, 42, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {item.price ? (
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#059669' }}>{item.price}</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Custom Specs</span>
                      )}

                      <a
                        href="#contact"
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#30579C',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'color 0.2s',
                        }}
                      >
                        Inquire Specs →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                }}>
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      background: currentPage === 1 ? 'rgba(15, 23, 42, 0.03)' : '#ffffff',
                      color: currentPage === 1 ? '#cbd5e1' : '#475569',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    aria-label="Previous page"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {getPaginationRange().map((page, idx) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${idx}`}
                        style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          userSelect: 'none',
                        }}
                      >
                        ···
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page as number)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          border: page === currentPage ? '1px solid transparent' : '1px solid rgba(15, 23, 42, 0.1)',
                          background: page === currentPage
                            ? 'linear-gradient(135deg, #30579C, #6C97D3)'
                            : '#ffffff',
                          color: page === currentPage ? '#ffffff' : '#475569',
                          fontWeight: page === currentPage ? '700' : '500',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: page === currentPage ? '0 4px 14px rgba(48, 87, 156, 0.3)' : 'none',
                        }}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      background: currentPage === totalPages ? 'rgba(15, 23, 42, 0.03)' : '#ffffff',
                      color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    aria-label="Next page"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
