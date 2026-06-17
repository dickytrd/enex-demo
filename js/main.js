/* ==========================================================================
   ENEX Bonn - Main JavaScript
   ========================================================================== */

console.log('[Main.js] Script loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Main.js] DOMContentLoaded fired');

  /* --------------------------------------------------------------------------
     Mobile Menu Toggle
     -------------------------------------------------------------------------- */
  const menuToggle = document.querySelector('.site-nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const overlay = document.querySelector('.mobile-menu__overlay');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* --------------------------------------------------------------------------
     Floating Navbar Scroll Effect
     -------------------------------------------------------------------------- */
  const siteNav = document.querySelector('.site-nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      siteNav?.classList.add('is-scrolled');
    } else {
      siteNav?.classList.remove('is-scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  /* --------------------------------------------------------------------------
     Smooth Scroll for Anchor Links
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        closeMenu();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     Hero Swiper - Background + Content Slide Navigation
     -------------------------------------------------------------------------- */
  (function initHeroSwiper() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const heroBgs = heroSection.querySelectorAll('.hero__bg');
    const heroSlides = heroSection.querySelectorAll('.hero__frame-slide');
    const heroPhones = heroSection.querySelectorAll('.phone-img');
    const prevBtn = heroSection.querySelector('.hero__frame-arrow--prev');
    const nextBtn = heroSection.querySelector('.hero__frame-arrow--next');

    const totalSlides = heroBgs.length;
    let currentSlide = 0;
    let isAnimating = false;

    function goToSlide(newIndex) {
      if (isAnimating) return;
      if (newIndex === currentSlide) return;

      isAnimating = true;

      const oldIndex = currentSlide;
      currentSlide = (newIndex + totalSlides) % totalSlides;

      // Animate backgrounds
      heroBgs.forEach((bg, i) => {
        if (i === oldIndex) {
          bg.classList.add('is-exiting');
          bg.classList.remove('is-active');
        } else if (i === currentSlide) {
          bg.classList.add('is-active');
          bg.classList.remove('is-exiting');
        } else {
          bg.classList.remove('is-active', 'is-exiting');
        }
      });

      // Animate slide content
      heroSlides.forEach((slide, i) => {
        if (i === oldIndex) {
          slide.classList.add('is-exiting');
          slide.classList.remove('is-active');
        } else if (i === currentSlide) {
          slide.classList.add('is-active');
          slide.classList.remove('is-exiting');
        } else {
          slide.classList.remove('is-active', 'is-exiting');
        }
      });

      // Animate phone images
      heroPhones.forEach((phone, i) => {
        if (i === oldIndex) {
          phone.classList.add('is-exiting');
          phone.classList.remove('is-active');
        } else if (i === currentSlide) {
          phone.classList.add('is-active');
          phone.classList.remove('is-exiting');
        } else {
          phone.classList.remove('is-active', 'is-exiting');
        }
      });

      // Cleanup after animation
      setTimeout(() => {
        heroBgs.forEach(bg => bg.classList.remove('is-exiting'));
        heroSlides.forEach(slide => slide.classList.remove('is-exiting'));
        heroPhones.forEach(phone => phone.classList.remove('is-exiting'));
        isAnimating = false;
      }, 800);
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    // Button event listeners
    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    // Keyboard navigation when hero is in viewport
    document.addEventListener('keydown', (e) => {
      const heroRect = heroSection.getBoundingClientRect();
      const heroInView = heroRect.top < window.innerHeight && heroRect.bottom > 0;

      if (heroInView) {
        if (e.key === 'ArrowRight') {
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
        }
      }
    });

    // Optional: Auto-advance every 6 seconds
    let autoAdvance = setInterval(nextSlide, 6000);

    // Pause auto-advance on hover
    heroSection.addEventListener('mouseenter', () => {
      clearInterval(autoAdvance);
    });

    heroSection.addEventListener('mouseleave', () => {
      autoAdvance = setInterval(nextSlide, 6000);
    });

    console.log('[Hero Swiper] Initialized with', totalSlides, 'slides');
  })();

  /* --------------------------------------------------------------------------
     Why Cards - Toggle Overlay on Plus Button Click
     -------------------------------------------------------------------------- */
  const whyCards = document.querySelectorAll('.why__card');

  whyCards.forEach(card => {
    const iconBtn = card.querySelector('.why__card-icon');

    if (iconBtn) {
      iconBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        // Close other cards first
        whyCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('is-expanded');
          }
        });

        // Toggle current card
        card.classList.toggle('is-expanded');
      });
    }
  });

  // Close overlay when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.why__card')) {
      whyCards.forEach(card => card.classList.remove('is-expanded'));
    }
  });

  /* --------------------------------------------------------------------------
     Testimonials - Tab Expansion
     -------------------------------------------------------------------------- */
  const testimonialTabs = document.querySelectorAll('.testimonials__tab');

  testimonialTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Skip if already expanded
      if (this.classList.contains('is-expanded')) return;

      // Remove expanded from all tabs
      testimonialTabs.forEach(t => t.classList.remove('is-expanded'));

      // Expand clicked tab
      this.classList.add('is-expanded');
    });
  });

  // Ensure first tab is expanded on load (if not already via HTML class)
  if (testimonialTabs.length > 0 && !document.querySelector('.testimonials__tab.is-expanded')) {
    testimonialTabs[0].classList.add('is-expanded');
  }

  /* --------------------------------------------------------------------------
     Reference Section - Rotary Bearing Carousel
     -------------------------------------------------------------------------- */
  const referenceCards = document.querySelectorAll('.reference__card');
  const prevBtn = document.querySelector('.reference__nav-btn--prev');
  const nextBtn = document.querySelector('.reference__nav-btn--next');
  const projectTitle = document.querySelector('.reference__info-title');
  const projectLocation = document.querySelector('.reference__info-location');

  if (referenceCards.length === 0) return;

  // Card positions on the bearing (7 positions)
  // Index 0 = front center, positions go clockwise
  const positions = ['center', 'r1', 'r2', 'r3', 'l3', 'l2', 'l1'];

  // Project data for each card
  const projectData = [
    { title: 'Solarkraftwerk Bonn-Nord', location: 'Bonn, Germany' },
    { title: 'Windpark Rheinland', location: 'Cologne, Germany' },
    { title: 'Energiezentrum Frankfurt', location: 'Frankfurt, Germany' },
    { title: 'Biomasse Anlage Süd', location: 'Munich, Germany' },
    { title: 'Wasserkraft Alpen', location: 'Stuttgart, Germany' },
    { title: 'Solarfeld Dresden', location: 'Dresden, Germany' },
    { title: 'Offshore Wind Bremen', location: 'Bremen, Germany' }
  ];

  let currentRotation = 0;
  let isAnimating = false;

  // Store previous position for each card to detect wrapping
  const cardPrevPos = new Map();
  referenceCards.forEach((card, i) => {
    cardPrevPos.set(card, i);
  });

  function updateCarousel(direction) {
    if (isAnimating) return;
    isAnimating = true;

    // Update rotation index
    if (direction === 'next') {
      currentRotation = (currentRotation + 1) % positions.length;
    } else {
      currentRotation = (currentRotation - 1 + positions.length) % positions.length;
    }

    // Reassign position classes to cards
    referenceCards.forEach((card, index) => {
      const prevPosIndex = cardPrevPos.get(card);
      const newPosIndex = (index - currentRotation + positions.length) % positions.length;

      // Detect wrapping: card moves from l3 (index 4) to r3 (index 3) or vice versa
      const isWrapping = (prevPosIndex === 3 && newPosIndex === 4) ||
                         (prevPosIndex === 4 && newPosIndex === 3);

      if (isWrapping) {
        // Disable transition, fade out, move instantly, then fade back
        card.style.transition = 'none';
        card.style.opacity = '0';

        // Force reflow
        void card.offsetHeight;

        // Remove all position classes and add new one
        positions.forEach(pos => card.classList.remove(`reference__card--${pos}`));
        card.classList.add(`reference__card--${positions[newPosIndex]}`);

        // Re-enable transition and fade back in after a frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = '';
            card.style.opacity = '';
          });
        });
      } else {
        // Normal transition
        positions.forEach(pos => card.classList.remove(`reference__card--${pos}`));
        card.classList.add(`reference__card--${positions[newPosIndex]}`);
      }

      // Store new position
      cardPrevPos.set(card, newPosIndex);
    });

    // Update project info display
    const centerCardIndex = currentRotation;
    if (projectTitle && projectData[centerCardIndex]) {
      projectTitle.textContent = projectData[centerCardIndex].title;
    }
    if (projectLocation && projectData[centerCardIndex]) {
      projectLocation.textContent = projectData[centerCardIndex].location;
    }

    // Reset animation lock
    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }

  prevBtn?.addEventListener('click', () => updateCarousel('prev'));
  nextBtn?.addEventListener('click', () => updateCarousel('next'));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateCarousel('prev');
    if (e.key === 'ArrowRight') updateCarousel('next');
  });

  // Click on card to bring it to center
  referenceCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('reference__card--center')) return;

      const currentPosIndex = (index - currentRotation + positions.length) % positions.length;

      // Determine shortest path
      if (currentPosIndex <= 3) {
        for (let i = 0; i < currentPosIndex; i++) {
          setTimeout(() => updateCarousel('next'), i * 100);
        }
      } else {
        const steps = positions.length - currentPosIndex;
        for (let i = 0; i < steps; i++) {
          setTimeout(() => updateCarousel('prev'), i * 100);
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     Services Section - Scroll-Based Swiper with Scrubbable Progress Bar
     -------------------------------------------------------------------------- */
  const servicesSection = document.querySelector('.services');
  const servicesInner = document.querySelector('.services__inner');
  const servicesSlides = document.querySelectorAll('.services__slide');
  const servicesLines = document.querySelectorAll('.services__lines');

  if (servicesSection && servicesInner && servicesSlides.length > 0) {
    const totalSlides = servicesSlides.length;
    let currentSlide = 0; // 0-indexed now
    let isScrubbing = false;
    let isAnimating = false;

    // Initialize first slide
    function initFirstSlide() {
      const firstSlide = servicesSlides[0];
      firstSlide.classList.add('is-active');
      // Skip entering animation for initial state
    }

    function updateServicesUI(slideIndex, animate = true) {
      // Clamp slideIndex to valid range (0-indexed)
      slideIndex = Math.max(0, Math.min(totalSlides - 1, slideIndex));

      if (slideIndex === currentSlide) return;
      if (isAnimating && animate) return;

      const oldSlideEl = servicesSlides[currentSlide];
      const newSlideEl = servicesSlides[slideIndex];

      if (animate && oldSlideEl && newSlideEl && oldSlideEl !== newSlideEl) {
        isAnimating = true;

        // Step 1: Clear ALL slides except old and new (important!)
        servicesSlides.forEach((slide, i) => {
          if (i !== currentSlide && i !== slideIndex) {
            slide.classList.remove('is-active', 'is-exiting', 'is-entering');
          }
        });

        // Step 2: Start exit animation on old slide
        oldSlideEl.classList.remove('is-active');
        oldSlideEl.classList.add('is-exiting');

        // Step 3: Start enter animation on new slide (slight delay for overlap effect)
        setTimeout(() => {
          newSlideEl.classList.add('is-active', 'is-entering');
        }, 100);

        // Step 4: Clean up old slide after exit animation
        setTimeout(() => {
          oldSlideEl.classList.remove('is-exiting');
        }, 700);

        // Step 5: Remove entering class after enter animation
        setTimeout(() => {
          newSlideEl.classList.remove('is-entering');
          isAnimating = false;
        }, 900);
      } else {
        // No animation - instant switch
        servicesSlides.forEach((slide, i) => {
          slide.classList.remove('is-active', 'is-exiting', 'is-entering');
          if (i === slideIndex) {
            slide.classList.add('is-active');
          }
        });
      }

      currentSlide = slideIndex;
    }

    // Update progress bar width based on real scroll position (0-100%)
    function updateProgressBars(scrollProgress) {
      // Update ALL slides' progress bars to show real-time scroll progress
      // This ensures the progress bar is already at the correct position when slides switch
      servicesSlides.forEach(slide => {
        const progressBar = slide.querySelector('.services__line-progress');
        if (progressBar) {
          progressBar.style.width = `${scrollProgress * 100}%`;
        }
      });
    }

    // Handle sticky positioning via JS
    function handleServicesScroll() {
      if (isScrubbing) return;

      const rect = servicesSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Determine sticky state
      if (sectionTop > 0) {
        servicesInner.classList.remove('is-fixed', 'is-bottom');
      } else if (sectionTop <= 0 && sectionTop > -(sectionHeight - viewportHeight)) {
        servicesInner.classList.add('is-fixed');
        servicesInner.classList.remove('is-bottom');
      } else {
        servicesInner.classList.remove('is-fixed');
        servicesInner.classList.add('is-bottom');
      }

      // Calculate scroll progress within the section (0 to 1)
      const scrollableHeight = sectionHeight - viewportHeight;
      const scrolled = -sectionTop;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      // Update progress bar with real-time scroll position
      updateProgressBars(progress);

      // Map progress to slide index (0-indexed)
      const slideIndex = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));

      updateServicesUI(slideIndex);
    }

    // Scrubbing functionality
    function initScrubbing() {
      servicesLines.forEach(linesEl => {
        let startX = 0;
        let startProgress = 0;
        let isDragging = false;

        function onScrubStart(e) {
          // Only respond to direct clicks/touches on the progress bar
          if (e.target.closest('.services__lines') !== linesEl) return;

          e.preventDefault();
          isScrubbing = true;
          isDragging = true;
          document.body.style.userSelect = 'none';
          linesEl.style.cursor = 'grabbing';

          const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
          startX = clientX;

          // Calculate current progress from scroll position
          const rect = servicesSection.getBoundingClientRect();
          const sectionHeight = rect.height;
          const viewportHeight = window.innerHeight;
          const scrollableHeight = sectionHeight - viewportHeight;
          const scrolled = -rect.top;
          startProgress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

          document.addEventListener('mousemove', onScrubMove);
          document.addEventListener('mouseup', onScrubEnd);
          document.addEventListener('touchmove', onScrubMove, { passive: false });
          document.addEventListener('touchend', onScrubEnd);
        }

        function onScrubMove(e) {
          if (!isDragging) return;
          e.preventDefault();

          const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
          const trackWidth = linesEl.offsetWidth;
          const deltaX = clientX - startX;
          const deltaProgress = deltaX / trackWidth;

          // Calculate new progress (clamped between 0 and 1)
          const newProgress = Math.max(0, Math.min(1, startProgress + deltaProgress));

          // Update progress bar with real-time scrub position
          updateProgressBars(newProgress);

          // Calculate new slide index (0-indexed)
          const newSlideIndex = Math.min(totalSlides - 1, Math.floor(newProgress * totalSlides));

          // Update UI without animation during scrub
          updateServicesUI(newSlideIndex, false);

          // Scroll to match the progress
          const rect = servicesSection.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionHeight = rect.height;
          const viewportHeight = window.innerHeight;
          const scrollableHeight = sectionHeight - viewportHeight;
          const targetScroll = sectionTop + (newProgress * scrollableHeight);

          window.scrollTo({
            top: targetScroll,
            behavior: 'auto'
          });
        }

        function onScrubEnd() {
          isDragging = false;
          isScrubbing = false;
          document.body.style.userSelect = '';
          linesEl.style.cursor = '';
          document.removeEventListener('mousemove', onScrubMove);
          document.removeEventListener('mouseup', onScrubEnd);
          document.removeEventListener('touchmove', onScrubMove);
          document.removeEventListener('touchend', onScrubEnd);
        }

        // Click to jump to position
        linesEl.addEventListener('click', (e) => {
          if (isDragging) return;

          const rect = linesEl.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const progress = Math.max(0, Math.min(1, clickX / rect.width));

          // Update progress bar immediately
          updateProgressBars(progress);

          // Scroll to match the progress
          const sectionRect = servicesSection.getBoundingClientRect();
          const sectionTop = window.scrollY + sectionRect.top;
          const sectionHeight = sectionRect.height;
          const viewportHeight = window.innerHeight;
          const scrollableHeight = sectionHeight - viewportHeight;
          const targetScroll = sectionTop + (progress * scrollableHeight);

          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        });

        linesEl.addEventListener('mousedown', onScrubStart);
        linesEl.addEventListener('touchstart', onScrubStart, { passive: false });
      });
    }

    // Throttle scroll handler for performance
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          handleServicesScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Initialize
    initFirstSlide();
    updateProgressBars();
    handleServicesScroll();
    initScrubbing();
  }

  /* --------------------------------------------------------------------------
     Heading Animation - Solid Shape Reveal with Line Stagger
     Uses GSAP + ScrollTrigger + Custom Line Splitter
     -------------------------------------------------------------------------- */
  // Track which headings have been animated
  const animatedHeadings = new WeakSet();

  function initHeadingAnimations() {
    console.log('[Heading Animation] Starting init...');

    // Check if GSAP and plugins are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    console.log('[Heading Animation] GSAP + ScrollTrigger registered');

    // Target all major headings
    const headingSelectors = [
      '.hero__headline',
      '.why__headline',
      '.reference__headline',
      '.testimonials__headline',
      '.cta__headline',
      '.about__headline',
      '.referenzen-hero__title',
      '.referenzen-projects__title',
      '.referenzen-cta__title',
      '.uber-hero__headline',
      '.uber-team__title',
      '.uber-certs__title',
      '.impressum-hero__headline',
      '.impressum-cta__headline',
      '.kontakt-hero__headline',
      '.kontakt-cta__headline',
      '.contact-info__title',
      '.leistungen-hero__title',
      '.leistungen-services__title',
      '.leistungen-cta__title',
      '.uber-about__headline'
    ];

    const headings = document.querySelectorAll(headingSelectors.join(', '));
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#48c7f4';

    console.log('[Heading Animation] Found headings:', headings.length);
    console.log('[Heading Animation] Accent color:', accentColor);

    headings.forEach((heading, index) => {
      console.log(`[Heading Animation] Processing heading ${index}:`, heading.className);
      // Skip if already animated
      if (animatedHeadings.has(heading)) {
        console.log(`[Heading Animation] Skipping (already animated)`);
        return;
      }
      animatedHeadings.add(heading);

      initLineReveal(heading, accentColor);
    });

    console.log('[Heading Animation] Init complete');
  }

  // Detect visual lines using Range API - returns line boundaries
  function detectVisualLines(element) {
    // Get all text nodes recursively
    function getTextNodes(node) {
      const textNodes = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
      let n;
      while (n = walker.nextNode()) {
        if (n.textContent.trim()) textNodes.push(n);
      }
      return textNodes;
    }

    const textNodes = getTextNodes(element);
    if (textNodes.length === 0) return [];

    // Get rects for each character
    const charRects = [];
    const range = document.createRange();

    textNodes.forEach(textNode => {
      for (let i = 0; i < textNode.length; i++) {
        const char = textNode.textContent[i];
        if (char === ' ' || char === '\n' || char === '\t') continue;

        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        const rect = range.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
          charRects.push({
            top: rect.top,
            left: rect.left,
            right: rect.right,
            height: rect.height
          });
        }
      }
    });

    if (charRects.length === 0) return [];

    // Group by line (chars within 5px vertical tolerance)
    charRects.sort((a, b) => a.top - b.top || a.left - b.left);

    const lines = [];
    let currentLine = [charRects[0]];
    let currentTop = charRects[0].top;

    for (let i = 1; i < charRects.length; i++) {
      const rect = charRects[i];
      if (Math.abs(rect.top - currentTop) <= 5) {
        currentLine.push(rect);
      } else {
        lines.push(currentLine);
        currentLine = [rect];
        currentTop = rect.top;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Calculate boundaries for each line
    return lines.map(lineChars => ({
      top: Math.min(...lineChars.map(c => c.top)),
      left: Math.min(...lineChars.map(c => c.left)),
      right: Math.max(...lineChars.map(c => c.right)),
      height: Math.max(...lineChars.map(c => c.height))
    }));
  }

  // Line-by-line solid shape reveal
  function initLineReveal(heading, accentColor) {
    console.log('[initLineReveal] Starting for:', heading.className);

    // Store original HTML for cleanup
    const originalHTML = heading.innerHTML;

    // Detect visual line breaks with boundaries
    const lines = detectVisualLines(heading);
    console.log('[initLineReveal] Detected lines:', lines.length);

    // If only one line detected, use single bar
    if (lines.length <= 1) {
      console.log('[initLineReveal] Single line - using single bar reveal');
      initSingleBarReveal(heading, accentColor, originalHTML);
      return;
    }

    // Get heading rect
    const headingRect = heading.getBoundingClientRect();

    const primaryBars = [];
    const secondaryBars = [];

    // Store original styles for cleanup
    const originalPosition = heading.style.position;
    const originalOverflow = heading.style.overflow;
    const originalZIndex = heading.style.zIndex;

    // Add position relative to heading and ensure overflow is visible
    heading.style.position = 'relative';
    heading.style.overflow = 'visible';
    heading.style.zIndex = '10';

    // Create reveal bars for each line - sized to actual text width
    // Each line gets 2 bars: secondary (lighter, behind) + primary (main color, front)
    lines.forEach((line, index) => {
      const topOffset = line.top - headingRect.top;
      const leftOffset = line.left - headingRect.left;
      const lineWidth = line.right - line.left;
      const barHeight = line.height + 4; // +4 for padding

      // Secondary bar (lighter color, behind, wipes second)
      const secondaryBar = document.createElement('div');
      secondaryBar.className = 'heading-reveal-bar heading-reveal-bar--secondary';
      secondaryBar.style.cssText = `
        position: absolute;
        top: ${topOffset - 2}px;
        left: ${leftOffset}px;
        width: ${lineWidth}px;
        height: ${barHeight}px;
        background: color-mix(in oklch, ${accentColor}, white 50%);
        transform-origin: right center;
        z-index: 1;
        pointer-events: none;
      `;
      heading.appendChild(secondaryBar);
      secondaryBars.push(secondaryBar);

      // Primary bar (main color, front, wipes first)
      const primaryBar = document.createElement('div');
      primaryBar.className = 'heading-reveal-bar heading-reveal-bar--primary';
      primaryBar.style.cssText = `
        position: absolute;
        top: ${topOffset - 2}px;
        left: ${leftOffset}px;
        width: ${lineWidth}px;
        height: ${barHeight}px;
        background: ${accentColor};
        transform-origin: right center;
        z-index: 2;
        pointer-events: none;
      `;
      heading.appendChild(primaryBar);
      primaryBars.push(primaryBar);
    });

    console.log('[initLineReveal] Created', primaryBars.length, 'bars, setting up ScrollTrigger');

    // Animation function
    function animateBars() {
      console.log('[initLineReveal] Animating bars');
      // Animate primary bars first (front layer)
      gsap.to(primaryBars, {
        scaleX: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power2.inOut'
      });

      // Animate secondary bars with slight delay (following behind)
      gsap.to(secondaryBars, {
        scaleX: 0,
        duration: 0.9,
        stagger: 0.15,
        delay: 0.12, // Follows primary
        ease: 'power2.inOut',
        onComplete: () => {
          // Cleanup - remove all bars and restore styles
          primaryBars.forEach(bar => bar.remove());
          secondaryBars.forEach(bar => bar.remove());
          heading.style.position = originalPosition || '';
          heading.style.overflow = originalOverflow || '';
          heading.style.zIndex = originalZIndex || '';
        }
      });
    }

    // Check if heading is already in viewport
    const headingTop = heading.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const isInView = headingTop < windowHeight * 0.9;

    console.log('[initLineReveal] Is in view:', isInView, 'headingTop:', headingTop, 'threshold:', windowHeight * 0.9);

    if (isInView) {
      // Already in viewport - animate immediately with small delay
      console.log('[initLineReveal] Already in view - animating immediately');
      setTimeout(animateBars, 100);
    } else {
      // Create ScrollTrigger for headings not yet in view
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 90%',
        once: true,
        onEnter: animateBars
      });
    }
  }

  // Single bar reveal for single-line headings
  function initSingleBarReveal(heading, accentColor, originalHTML) {
    console.log('[initSingleBarReveal] Starting for:', heading.className);

    // Measure actual text dimensions before wrapping
    const headingRect = heading.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(heading);
    const textRect = range.getBoundingClientRect();

    // Calculate text width and position relative to heading
    const textWidth = textRect.width;
    const textLeft = textRect.left - headingRect.left;
    const textTop = textRect.top - headingRect.top;
    const textHeight = textRect.height;

    // Store original position and ensure visibility
    const originalPosition = heading.style.position;
    const originalOverflow = heading.style.overflow;
    const originalZIndex = heading.style.zIndex;
    heading.style.position = 'relative';
    heading.style.overflow = 'visible';
    heading.style.zIndex = '10';

    // Secondary bar (lighter color, behind, wipes second)
    const secondaryBar = document.createElement('div');
    secondaryBar.className = 'heading-reveal-bar heading-reveal-bar--secondary';
    secondaryBar.style.cssText = `
      position: absolute;
      top: ${textTop}px;
      left: ${textLeft}px;
      width: ${textWidth}px;
      height: ${textHeight + 4}px;
      background: color-mix(in oklch, ${accentColor}, white 50%);
      transform-origin: right center;
      z-index: 1;
      pointer-events: none;
    `;
    heading.appendChild(secondaryBar);

    // Primary bar (main color, front, wipes first)
    const primaryBar = document.createElement('div');
    primaryBar.className = 'heading-reveal-bar heading-reveal-bar--primary';
    primaryBar.style.cssText = `
      position: absolute;
      top: ${textTop}px;
      left: ${textLeft}px;
      width: ${textWidth}px;
      height: ${textHeight + 4}px;
      background: ${accentColor};
      transform-origin: right center;
      z-index: 2;
      pointer-events: none;
    `;
    heading.appendChild(primaryBar);

    console.log('[initSingleBarReveal] Bars created, setting up ScrollTrigger');
    console.log('[initSingleBarReveal] Primary bar:', primaryBar);
    console.log('[initSingleBarReveal] Heading rect:', heading.getBoundingClientRect());

    // Animation function
    function animateBars() {
      console.log('[initSingleBarReveal] Animating bars');
      // Animate primary bar first
      gsap.to(primaryBar, {
        scaleX: 0,
        duration: 1.0,
        ease: 'power2.inOut'
      });

      // Animate secondary bar with slight delay (following behind)
      gsap.to(secondaryBar, {
        scaleX: 0,
        duration: 1.0,
        delay: 0.12,
        ease: 'power2.inOut',
        onComplete: () => {
          // Cleanup - remove bars and restore styles
          primaryBar.remove();
          secondaryBar.remove();
          heading.style.position = originalPosition || '';
          heading.style.overflow = originalOverflow || '';
          heading.style.zIndex = originalZIndex || '';
        }
      });
    }

    // Check if heading is already in viewport
    const headingTop = heading.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const isInView = headingTop < windowHeight * 0.9;

    console.log('[initSingleBarReveal] Is in view:', isInView, 'headingTop:', headingTop, 'threshold:', windowHeight * 0.9);

    if (isInView) {
      // Already in viewport - animate immediately with small delay
      console.log('[initSingleBarReveal] Already in view - animating immediately');
      setTimeout(animateBars, 100);
    } else {
      // Create ScrollTrigger for headings not yet in view
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 90%',
        once: true,
        onEnter: animateBars
      });
    }
  }

  // Initialize heading animations after fonts and layout are ready
  // Use multiple fallbacks to ensure animation works on all pages
  function tryInitHeadingAnimations() {
    console.log('[tryInit] Checking GSAP...', typeof gsap !== 'undefined', typeof ScrollTrigger !== 'undefined');
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initHeadingAnimations();
    } else {
      console.warn('[tryInit] GSAP or ScrollTrigger not yet available');
    }
  }

  // Try after short delay (for pages where fonts load quickly)
  console.log('[HeadingAnim] Setting up initialization timers...');
  setTimeout(() => {
    console.log('[HeadingAnim] Timer 1 fired (100ms after DOMContentLoaded)');
    tryInitHeadingAnimations();
  }, 100);

  // Also try after fonts are ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      console.log('[HeadingAnim] Fonts ready, trying init');
      setTimeout(tryInitHeadingAnimations, 50);
    });
  }

  // Final fallback on window load
  window.addEventListener('load', () => {
    console.log('[HeadingAnim] Window load, final fallback');
    setTimeout(tryInitHeadingAnimations, 100);
  });

});
