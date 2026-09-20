(function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  if (mobileMenuBtn && mobileNavOverlay && mobileNavClose) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    mobileNavClose.addEventListener('click', () => {
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close on link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

})();