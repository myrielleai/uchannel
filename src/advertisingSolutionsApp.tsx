import React from 'react';
import { createRoot } from 'react-dom/client';
import AdvertisingSolutionsPage from './pages/AdvertisingSolutionsPage';
import SolutionDetailPage from './pages/SolutionDetailPage';

const initAdvertisingSolutionsApp = () => {
  const container = document.getElementById('advertising-solutions-app');
  if (!container) return;

  const slug = container.getAttribute('data-slug');
  const root = createRoot(container);

  if (slug) {
    root.render(React.createElement(SolutionDetailPage, { slug }));
  } else {
    root.render(React.createElement(AdvertisingSolutionsPage));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdvertisingSolutionsApp);
} else {
  initAdvertisingSolutionsApp();
}
