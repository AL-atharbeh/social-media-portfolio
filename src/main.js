import './style.css';

// ==========================================================================
// Initialization & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initBrutalistCursor();
  initStickyHeader();
  initMobileMenu();
  initDragSwiper();
  initMarqueeScrollTrigger();
  initScrollReveals();
  initTiltElements();
  initContactForm();
});

// ==========================================================================
// 1. Custom Brutalist Cursor
// ==========================================================================
function initBrutalistCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor tracking animation using linear interpolation (lerp)
  function animateCursor() {
    // Lerp logic for outer frame
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Lerp logic for inner dot
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for interactive elements
  const updateHoverStates = () => {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .collage-item, .visual-showcase-container, .polaroid-attachment, .swiper-slide-card');
    interactiveElements.forEach((el) => {
      // Remove to prevent duplicate binding
      el.removeEventListener('mouseenter', addHoverClass);
      el.removeEventListener('mouseleave', removeHoverClass);
      
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });
  };

  function addHoverClass() { cursor.classList.add('hovered'); }
  function removeHoverClass() { cursor.classList.remove('hovered'); }

  updateHoverStates();
  
  // Re-observe on DOM changes to ensure dynamic bindings
  const observer = new MutationObserver(updateHoverStates);
  observer.observe(document.body, { childList: true, subtree: true });
}

// ==========================================================================
// 2. Sticky Header Nav
// ==========================================================================
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ==========================================================================
// 3. Mobile Navigation Menu
// ==========================================================================
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (!menuToggle || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    
    // Animate hamburger lines
    const spans = menuToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// ==========================================================================
// 4. Drag-to-Scroll Swipe Physics (Desktop + Mobile Drag Support)
// ==========================================================================
function initDragSwiper() {
  const slider = document.querySelector('.swiper-outer-container');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.style.scrollBehavior = 'auto'; // Temporarily disable smooth snaps for fluid dragging
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
    slider.style.scrollBehavior = 'smooth';
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
    slider.style.scrollBehavior = 'smooth';
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity factor multiplier
    slider.scrollLeft = scrollLeft - walk;
  });
}

// ==========================================================================
// 5. Marquee Speed scroll feedback
// ==========================================================================
function initMarqueeScrollTrigger() {
  const marqueeTrack = document.querySelector('.marquee-track');
  if (!marqueeTrack) return;

  let lastScrollY = window.scrollY;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Adjust marquee scroll speed dynamically based on user scroll velocity
    const speedBoost = Math.min(delta * 0.18, 14);
    const duration = Math.max(22 - speedBoost, 3.5); // Speed up track
    
    marqueeTrack.style.animationDuration = `${duration}s`;

    // Clear timeout and restore standard velocity
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      marqueeTrack.style.animationDuration = '22s';
    }, 150);
  });
}

// ==========================================================================
// 6. Scroll Reveal Animations (Intersection Observer)
// ==========================================================================
function initScrollReveals() {
  // Select main layout modules to apply dynamic reveal classes
  const revealTargets = document.querySelectorAll(
    '.hero-text-block, .hero-portrait-wrapper, .about-halftone-left, .about-card-center, .section-card-wrapper, .brutalist-title-wrapper, .collage-item, .posters-container-card, .contact-card, .swiper-slide-card'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal-item');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));
}

// ==========================================================================
// 7. Dynamic 3D Tilt Hover Effects
// ==========================================================================
function initTiltElements() {
  const tiltElements = document.querySelectorAll('.collage-item, .about-index-card, .polaroid-attachment');

  // Disable mouse tracking tilts on touchscreens to prevent erratic layout shifts
  if (window.matchMedia('(pointer: coarse)').matches) return;

  tiltElements.forEach(el => {
    el.classList.add('tilt-element');
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation ratios (-8 to 8 degrees)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================================================
// 8. Contact Form Submissions (Rebranded for Bashar Yousef)
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    status.className = 'form-status';
    status.textContent = 'Transmitting requirements...';
    
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'TRANSMITTING...';
    submitBtn.disabled = true;

    // Simulate server call
    setTimeout(() => {
      status.className = 'form-status success';
      status.textContent = 'Message successfully transmitted. Bashar Yousef will contact you shortly!';
      
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Clear status message after 6 seconds
      setTimeout(() => {
        status.style.opacity = '0';
        setTimeout(() => {
          status.textContent = '';
          status.style.opacity = '1';
          status.className = 'form-status';
        }, 500);
      }, 6000);

    }, 1500);
  });
}
