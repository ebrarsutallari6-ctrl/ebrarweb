(() => {
  const navbar = document.querySelector('.navbar');
  const pageHasHero = Boolean(document.querySelector(
    '.container, .Hotels, .about-hero, .dining-hero, .contact-hero-image, .family:first-of-type, .suite, .entertainment'
  ));

  if (navbar) {
    let scheduled = false;
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', navbar.classList.contains('mobile-open') || !pageHasHero || window.scrollY > 48);
      scheduled = false;
    };
    const onScroll = () => {
      if (!scheduled) {
        window.requestAnimationFrame(updateNavbar);
        scheduled = true;
      }
    };
    updateNavbar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    navbar.querySelectorAll('a[href]').forEach((link) => {
      const linkPage = new URL(link.href, window.location.href).pathname.split('/').pop().toLowerCase();
      if (linkPage === currentPage) link.setAttribute('aria-current', 'page');
    });

    const menuToggle = document.createElement('button');
    menuToggle.className = 'nav-toggle';
    menuToggle.type = 'button';
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    navbar.append(menuToggle);

    const closeMenu = () => {
      navbar.classList.remove('mobile-open');
      navbar.classList.toggle('scrolled', !pageHasHero || window.scrollY > 48);
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('mobile-open');
      navbar.classList.toggle('scrolled', isOpen || !pageHasHero || window.scrollY > 48);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    navbar.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    }, { passive: true });
  }

  const revealTargets = [
    '.about-hero-content', '.about-intro', '.about-feature', '.about-values article',
    '.contact-page > .about-eyebrow', '.contact-page > h1', '.contact-intro', '.contact-options article',
    '.dining-hero-copy', '.dining-intro', '.dining-card', '.dining-cta',
    '.hotel', '.family-card', '.suite-card', '.entertainment-card',
    '.suite-item', '.pool-item', '.entertainment-item', '.family-item', '.memories-item',
    '.container2 > *'
  ];
  const elements = document.querySelectorAll(revealTargets.join(','));
  if (!elements.length) return;

  document.documentElement.classList.add('motion-ready');
  elements.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
  });

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((element) => observer.observe(element));
})();
