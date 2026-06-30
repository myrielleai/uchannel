document.addEventListener('DOMContentLoaded', () => {
  // 0. Signature 3D element — a faceted glass "spectrum gem" in the hero
  initHeroGem();

  // 1. Scroll-triggered reveal animations
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

  // 2. Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Map Interaction Logic
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

  // 4. Contact Form Submission Mockup
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

// Signature 3D element: a faceted "spectrum gem" rendered with Three.js.
// Built from nested icosahedra (a glass-like solid + a glowing wireframe edge),
// echoing the brand's color spectrum and the idea of light refracted into a display.
function initHeroGem() {
  const canvas = document.getElementById('hero-gem-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroSection = document.getElementById('hero');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  // Group holds the gem so we can rotate/float it as one unit
  const gemGroup = new THREE.Group();
  scene.add(gemGroup);

  const geometry = new THREE.IcosahedronGeometry(1.6, 0);

  // Translucent glass-like solid faces
  const glassMaterial = new THREE.MeshPhongMaterial({
    color: 0x0c1a30,
    transparent: true,
    opacity: 0.35,
    shininess: 120,
    specular: 0x00f2fe,
    flatShading: true,
  });
  const glassMesh = new THREE.Mesh(geometry, glassMaterial);
  gemGroup.add(glassMesh);

  // Glowing wireframe edges to read the gem's facets clearly
  const edges = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x6fe9ff, transparent: true, opacity: 0.55 });
  const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
  gemGroup.add(edgeLines);

  // A second, smaller inner gem in a spectrum accent color for depth
  const innerGeometry = new THREE.IcosahedronGeometry(0.85, 0);
  const innerEdges = new THREE.EdgesGeometry(innerGeometry);
  const innerEdgeMaterial = new THREE.LineBasicMaterial({ color: 0xfed136, transparent: true, opacity: 0.35 });
  const innerEdgeLines = new THREE.LineSegments(innerEdges, innerEdgeMaterial);
  gemGroup.add(innerEdgeLines);

  gemGroup.position.set(3.4, 0.1, 0);
  gemGroup.scale.setScalar(window.innerWidth < 1100 ? 0.8 : 1.05);

  // Lighting: soft ambient plus two colored point lights matching the brand spectrum
  scene.add(new THREE.AmbientLight(0x404040, 1.2));

  const tealLight = new THREE.PointLight(0x00f2fe, 1.4, 20);
  tealLight.position.set(-3, 2, 4);
  scene.add(tealLight);

  const magentaLight = new THREE.PointLight(0xe81c4f, 1.1, 20);
  magentaLight.position.set(3, -2, 3);
  scene.add(magentaLight);

  function handleResize() {
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    gemGroup.scale.setScalar(window.innerWidth < 1100 ? 0.8 : 1.05);
  }
  window.addEventListener('resize', handleResize);

  if (prefersReducedMotion) {
    // Render a single static, gently-angled frame and stop — no continuous animation
    gemGroup.rotation.set(0.4, 0.6, 0);
    renderer.render(scene, camera);
    return;
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    gemGroup.rotation.y = t * 0.18;
    gemGroup.rotation.x = Math.sin(t * 0.25) * 0.15;
    innerEdgeLines.rotation.y = -t * 0.3;
    gemGroup.position.y = 0.1 + Math.sin(t * 0.5) * 0.12;
    renderer.render(scene, camera);
  }
  animate();
}
