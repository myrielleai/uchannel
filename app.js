document.addEventListener('DOMContentLoaded', () => {
  // 0. Scroll-triggered reveal animations
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // 1. Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Map Interaction Logic
  const mapPins = document.querySelectorAll('.map-pin');
  const tooltip = document.querySelector('.map-tooltip');
  const tooltipTitle = tooltip.querySelector('.map-tooltip-title');
  const tooltipResolution = tooltip.querySelector('.val-resolution');
  const tooltipSlots = tooltip.querySelector('.val-slots');
  const tooltipTraffic = tooltip.querySelector('.val-traffic');
  const tooltipAudience = tooltip.querySelector('.val-audience');

  // Screen Details database
  const screenDetails = {
    'edsa-ortigas': {
      title: 'EDSA - Ortigas Junction LED',
      resolution: '4K Ultra-HD (P10 LED)',
      slots: '8 Flexible Slots',
      traffic: '380,000+ daily vehicles',
      audience: 'B2B Professionals & Commuters'
    },
    'bgc-lawton': {
      title: 'BGC Lawton Ave Landmark LED',
      resolution: 'Full HD Dual-Face (P8 LED)',
      slots: '10 Slots (Real-time trigger)',
      traffic: '220,000+ daily vehicles',
      audience: 'Tech Employees & Premium Shoppers'
    },
    'makati-ave': {
      title: 'Makati Ave Central Business LED',
      resolution: 'Ultra-Bright P6 LED',
      slots: '6 Slots (Custom intervals)',
      traffic: '190,000+ daily pedestrians/cars',
      audience: 'Corporate Decision Makers & Executives'
    },
    'roxas-blvd': {
      title: 'Roxas Blvd Coastal Highway LED',
      resolution: 'Wide-Format HD LED (P10)',
      slots: '8 Slots (Dynamic scheduling)',
      traffic: '290,000+ daily vehicles',
      audience: 'Tourists, Commuters & Travelers'
    },
    'cebu-it': {
      title: 'Cebu IT Park Plaza Screen',
      resolution: 'High Definition Portrait (P6)',
      slots: '10 Slots (Instant scheduling)',
      traffic: '140,000+ daily foot traffic',
      audience: 'IT Professionals, Young Adults & BPOs'
    },
    'davao-global': {
      title: 'Davao Global City Boulevard LED',
      resolution: 'Ultra-HD Curved LED (P8)',
      slots: '8 Slots (Programmable content)',
      traffic: '110,000+ daily vehicles',
      audience: 'Southern Philippines Hub Consumers'
    }
  };

  // Set default active tooltip for EDSA Ortigas
  function showDetails(pinId) {
    const data = screenDetails[pinId];
    if (data) {
      tooltipTitle.textContent = data.title;
      tooltipResolution.textContent = data.resolution;
      tooltipSlots.textContent = data.slots;
      tooltipTraffic.textContent = data.traffic;
      tooltipAudience.textContent = data.audience;
      tooltip.classList.add('active');
    }
  }

  // Handle clicking on map pins
  mapPins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const pinId = pin.getAttribute('data-id');
      
      // Remove active states from other pins
      mapPins.forEach(p => {
        p.querySelector('.pin-core').style.background = '';
        p.querySelector('.pin-core').style.transform = '';
      });

      // Highlight current pin
      const core = pin.querySelector('.pin-core');
      core.style.background = '#fed136'; // Yellow accent from logo spectrum
      core.style.transform = 'scale(1.2)';

      showDetails(pinId);
    });
  });

  // Default activation on page load
  const defaultPin = document.querySelector('.map-pin[data-id="edsa-ortigas"]');
  if (defaultPin) {
    defaultPin.click();
  }

  // 3. Contact Form Submission Mockup
  const quoteForm = document.querySelector('.footer-form');
  const statusMsg = document.querySelector('.form-status');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation indicator
      const submitBtn = quoteForm.querySelector('.form-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'PRODUCING QUOTE...';
      submitBtn.disabled = true;

      // Mock API call
      setTimeout(() => {
        submitBtn.textContent = 'SENT';
        statusMsg.classList.add('success');
        statusMsg.textContent = 'Thank you! A RUCS U Channel consultant will contact you within 2 hours with your custom proposal.';
        quoteForm.reset();

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          statusMsg.style.display = 'none';
        }, 8000);
      }, 1500);
    });
  }
});
