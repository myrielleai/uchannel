import React, { useEffect, useState, useMemo } from 'react';
import { fetchHardwareCatalog, SheetProductItem } from '../services/solutionsApi';

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
  const [items, setItems] = useState<SheetProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

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

  // Group filtered items by subcategory
  const groupedItems = useMemo(() => {
    const map = new Map<string, SheetProductItem[]>();
    filteredItems.forEach((item) => {
      const cat = item.category || 'General Specifications';
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(item);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories((prev) => {
      const currentlyCollapsed = prev[categoryName] !== false;
      return {
        ...prev,
        [categoryName]: !currentlyCollapsed,
      };
    });
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    groupedItems.forEach(([cat]) => {
      allExpanded[cat] = false;
    });
    setCollapsedCategories(allExpanded);
  };

  const collapseAll = () => {
    setCollapsedCategories({});
  };

  return (
    <div style={{ marginTop: '40px' }}>
      {/* Section Header */}
      <div className="adv-section-header" style={{ textAlign: 'center', maxWidth: '760px', marginInline: 'auto', marginBottom: '36px' }}>
        <h2 className="adv-section-h2">{title}</h2>
        <p className="adv-section-desc" style={{ marginInline: 'auto' }}>
          {subtitle}
        </p>
      </div>

      {/* Controls Bar: Search + Category Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
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

      {/* Hardware Accordion / Collapsible Sections */}
      {!loading && !error && (
        <>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '20px', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
              No hardware specifications matched your filter query.
            </div>
          ) : (
            <div>
              {/* Expand / Collapse All Bar */}
              {groupedItems.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={expandAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: '#2563eb',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Expand All
                  </button>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <button
                    type="button"
                    onClick={collapseAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Collapse All
                  </button>
                </div>
              )}

              {/* Subcategories */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {groupedItems.map(([categoryName, groupProducts]) => {
                  const isCollapsed = collapsedCategories[categoryName] !== false;
                  return (
                    <div
                      key={categoryName}
                      style={{
                        borderRadius: '20px',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        background: '#ffffff',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      {/* Subcategory Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(categoryName)}
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#ffffff',
                          border: 'none',
                          borderBottom: isCollapsed ? 'none' : '1px solid rgba(15, 23, 42, 0.08)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '10px',
                              background: 'rgba(37, 99, 235, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#2563eb',
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </div>
                          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
                            {categoryName}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: '#2563eb',
                              background: 'rgba(37, 99, 235, 0.08)',
                              padding: '3px 10px',
                              borderRadius: '999px',
                            }}
                          >
                            {groupProducts.length} {groupProducts.length === 1 ? 'Product' : 'Products'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                            {isCollapsed ? 'Expand' : 'Collapse'}
                          </span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            style={{
                              transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Subcategory Grid */}
                      {!isCollapsed && (
                        <div style={{ padding: '24px', background: '#f8fafc' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {groupProducts.map((item, index) => (
                              <div
                                key={`${item.id}-${index}`}
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
                                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)';
                                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.04)';
                                }}
                              >
                                <div>
                                  {/* Status Row */}
                                  {item.availability && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '14px' }}>
                                      <span style={{ fontSize: '0.68rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                                        Available
                                      </span>
                                    </div>
                                  )}

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
                                      color: '#2563eb',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    Inquire Specs →
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

