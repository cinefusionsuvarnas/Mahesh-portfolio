const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach((element) => observer.observe(element));

const filterButtons = $$('.pill');
const productGrid = $('#productGrid');
const search = $('#productSearch');
let selectedFilter = 'all';

const apiBasePath = window.location.pathname.includes('/pages/') ? '../api' : './api';

if (productGrid) {
  fetch(`${apiBasePath}/get_portfolio.php`)
    .then(res => res.json())
    .then(data => {
        function filterProducts() {
          const query = search ? search.value.trim().toLowerCase() : '';
          const newCards = $$('.product-card');
          newCards.forEach((card) => {
            const matchesFilter = selectedFilter === 'all' || card.dataset.category === selectedFilter;
            const matchesSearch = card.dataset.name.toLowerCase().includes(query);
            card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch));
          });
        }

        filterButtons.forEach((button) => button.addEventListener('click', () => {
          selectedFilter = button.dataset.filter;
          filterButtons.forEach((item) => item.classList.toggle('active', item === button));
          filterProducts();
        }));
        
        if (search) search.addEventListener('input', filterProducts);

        if (data.success && data.portfolio.length) {
        // Update count
        const allWorkSpan = $('.pill[data-filter="all"] span');
        if (allWorkSpan) allWorkSpan.textContent = String(data.portfolio.length).padStart(2, '0');

        productGrid.innerHTML = data.portfolio.map((item, index) => {
          const delayClass = index > 0 ? 'reveal-delay' : '';
          const isVideo = item.image_path.match(/\.(mp4|webm|ogg)$/i);
          const onClickAttr = `onclick="openPortfolioModal('${item.title.replace(/'/g, "\\'")}', '${item.category.replace(/'/g, "\\'")}', '${item.description.replace(/'/g, "\\'")}', '${item.image_path}', ${isVideo ? 'true' : 'false'})" style="cursor: pointer;"`;
          
          const visualContent = isVideo 
            ? `<div class="product-visual visual-swell" style="position: relative; overflow: hidden; height: 290px; width: max-content; max-width: 100%;" aria-label="View ${item.title} case study" ${onClickAttr}>
                 <video src="${item.image_path}" style="height: 100%; max-width: 100%; object-fit: cover; display: block;" muted autoplay loop playsinline></video>
                 <span class="product-badge" style="z-index: 1;">${item.category}</span>
               </div>`
            : `<div class="product-visual visual-swell" style="position: relative; overflow: hidden; height: 290px; width: max-content; max-width: 100%;" aria-label="View ${item.title} case study" ${onClickAttr}>
                 <img src="${item.image_path}" style="height: 100%; max-width: 100%; object-fit: cover; display: block;">
                 <span class="product-badge" style="z-index: 1;">${item.category}</span>
               </div>`;

          return `
          <article class="product-card reveal is-visible ${delayClass}" data-category="${item.category}" data-name="${item.title}">
            ${visualContent}
            <div class="product-info">
              <div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
              </div>
              <div class="product-meta"><span>CASE STUDY</span><strong>${item.year}</strong></div>
            </div>
          </article>
          `;
        }).join('');
        
        // Initial filter pass
        filterProducts();
      } else {
        productGrid.innerHTML = '<p style="color:var(--muted); text-align:center; grid-column: 1 / -1; padding: 40px;">No portfolio items available.</p>';
      }
    })
    .catch(err => {
      productGrid.innerHTML = '<p style="color:#ff5f5f; text-align:center; grid-column: 1 / -1; padding: 40px;">Failed to load portfolio items.</p>';
    });
}

// Portfolio carousel logic
const prevProductBtn = $('#prevProduct');
const nextProductBtn = $('#nextProduct');
if (prevProductBtn && nextProductBtn && productGrid) {
  let isScrolling = false;
  
  function smoothScrollTo(element, change, duration, callback) {
    const start = element.scrollLeft;
    const startTime = performance.now();
    
    function animateScroll(currentTime) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Ease-in-out quadratic
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      element.scrollLeft = start + change * ease;
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        if (callback) callback();
      }
    }
    requestAnimationFrame(animateScroll);
  }

  prevProductBtn.addEventListener('click', () => {
    if (isScrolling || !productGrid.firstElementChild) return;
    
    let nodesToMove = [];
    let current = productGrid.lastElementChild;
    let itemWidth = 0;
    
    while (current) {
      nodesToMove.push(current);
      if (!current.classList.contains('is-hidden')) {
        itemWidth = current.offsetWidth + 15; // + gap
        break;
      }
      current = current.previousElementSibling;
    }
    
    if (itemWidth === 0) return;
    isScrolling = true;
    
    // Move nodes FIRST, then animate scroll from offset
    for (let i = nodesToMove.length - 1; i >= 0; i--) {
      productGrid.prepend(nodesToMove[i]);
    }
    productGrid.scrollLeft += itemWidth;
    
    smoothScrollTo(productGrid, -itemWidth, 400, () => {
      isScrolling = false;
    });
  });

  nextProductBtn.addEventListener('click', () => {
    if (isScrolling || !productGrid.firstElementChild) return;
    
    let nodesToMove = [];
    let current = productGrid.firstElementChild;
    let itemWidth = 0;
    
    while (current) {
      nodesToMove.push(current);
      if (!current.classList.contains('is-hidden')) {
        itemWidth = current.offsetWidth + 15; // + gap
        break;
      }
      current = current.nextElementSibling;
    }
    
    if (itemWidth === 0) return;
    isScrolling = true;
    
    smoothScrollTo(productGrid, itemWidth, 400, () => {
      nodesToMove.forEach(node => productGrid.appendChild(node));
      productGrid.scrollLeft -= itemWidth;
      isScrolling = false;
    });
  });
}
// Portfolio page logic
const portfolioGrid = $('.portfolio-grid');
if (portfolioGrid) {
  fetch(`${apiBasePath}/get_portfolio.php`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.portfolio.length) {
        portfolioGrid.innerHTML = data.portfolio.map((item, index) => {
          const isFeatured = index === 0 ? 'is-featured' : '';
          // Ensure correct path relative to portfolio.html
          const imagePath = item.image_path.startsWith('./') ? '.' + item.image_path : '../' + item.image_path;
          const isVideo = imagePath.match(/\.(mp4|webm|ogg)$/i);
          const artHeight = index === 0 ? '425px' : '330px';
          const onClickAttr = `onclick="openPortfolioModal('${item.title.replace(/'/g, "\\'")}', '${item.category.replace(/'/g, "\\'")}', '${item.description.replace(/'/g, "\\'")}', '${imagePath}', ${isVideo ? 'true' : 'false'})" style="cursor: pointer;"`;

          const artContent = isVideo
            ? `<div class="portfolio-art" style="position: relative; overflow: hidden; height: ${artHeight}; width: max-content; max-width: 100%;" ${onClickAttr}>
                 <video src="${imagePath}" style="height: 100%; max-width: 100%; object-fit: cover; display: block;" muted autoplay loop playsinline></video>
                 <span class="case-type" style="position: absolute; top: 20px; left: 20px; z-index: 1;">${String(index + 1).padStart(2, '0')} / ${item.category.toUpperCase()}</span>
               </div>`
            : `<div class="portfolio-art" style="position: relative; overflow: hidden; height: ${artHeight}; width: max-content; max-width: 100%;" ${onClickAttr}>
                 <img src="${imagePath}" style="height: 100%; max-width: 100%; object-fit: cover; display: block;">
                 <span class="case-type" style="position: absolute; top: 20px; left: 20px; z-index: 1;">${String(index + 1).padStart(2, '0')} / ${item.category.toUpperCase()}</span>
               </div>`;

          return `
          <article class="portfolio-card ${isFeatured}">
            ${artContent}
            <div class="portfolio-details">
              <div>
                <h2>${item.title}</h2>
                <p>${item.description}</p>
              </div>
              <span>${item.year}</span>
            </div>
          </article>
          `;
        }).join('');
      } else {
        portfolioGrid.innerHTML = '<p style="color:var(--muted); padding: 40px;">No portfolio items available.</p>';
      }
    })
    .catch(err => {
      portfolioGrid.innerHTML = '<p style="color:#ff5f5f; padding: 40px;">Failed to load portfolio items.</p>';
    });
}

// Dynamic Scroll Track logic for index.html "03 / SELECTED WORK"
const adminScrollTrack = $('#adminScrollTrack');
if (adminScrollTrack) {
  fetch(`${apiBasePath}/get_portfolio.php`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.portfolio.length) {
        // Double the array to create a seamless infinite scroll effect
        const displayItems = [...data.portfolio, ...data.portfolio]; 
        
        adminScrollTrack.innerHTML = displayItems.map((item, index) => {
          // Adjust image path for index.html
          const imagePath = item.image_path.startsWith('./') ? item.image_path : './' + item.image_path;
          const isVideo = imagePath.match(/\.(mp4|webm|ogg)$/i);
          const onClickAttr = `onclick="openPortfolioModal('${item.title.replace(/'/g, "\\'")}', '${item.category.replace(/'/g, "\\'")}', '${item.description.replace(/'/g, "\\'")}', '${imagePath}', ${isVideo ? 'true' : 'false'})" style="cursor: pointer;"`;

          const mediaContent = isVideo 
            ? `<video src="${imagePath}" style="width: 320px; height: 400px; object-fit: cover; border-radius: 16px;" muted autoplay loop playsinline></video>`
            : `<img src="${imagePath}" style="width: 320px; height: 400px; object-fit: cover; border-radius: 16px;">`;

          return `
          <div class="scroll-item" style="flex-shrink: 0; position: relative; overflow: hidden; border-radius: 16px; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(0.98)';" onmouseout="this.style.transform='scale(1)';" ${onClickAttr}>
            ${mediaContent}
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 25px; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%); z-index: 2;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--lime); font-weight: 700; margin-bottom: 6px; display: block;">${item.category}</span>
              <h3 style="margin: 0; font-size: 20px; color: #fff;">${item.title}</h3>
            </div>
          </div>
          `;
        }).join('');
        
        // CSS Animation for seamless scrolling
        const style = document.createElement('style');
        style.textContent = `
          @keyframes infiniteScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 15px)); }
          }
          .admin-scroll-track {
            animation: infiniteScroll 25s linear infinite;
          }
          .admin-scroll-track:hover {
            animation-play-state: paused;
          }
        `;
        document.head.appendChild(style);
      } else {
        adminScrollTrack.innerHTML = '<p style="color:var(--muted); padding: 40px; width: 100%; text-align: center;">No portfolio items available.</p>';
      }
    })
    .catch(err => {
      adminScrollTrack.innerHTML = '<p style="color:#ff5f5f; padding: 40px; width: 100%; text-align: center;">Failed to load portfolio items.</p>';
    });
}

const testimonials = $$('.testimonial');
const testimonialIndex = $('#testimonialIndex');
let activeTestimonial = 0;
if (testimonials.length && testimonialIndex) {
  function showTestimonial(index) {
    activeTestimonial = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((card, i) => card.classList.toggle('active', i === activeTestimonial));
    testimonialIndex.textContent = String(activeTestimonial + 1).padStart(2, '0');
  }
  $('#prevTestimonial').addEventListener('click', () => showTestimonial(activeTestimonial - 1));
  $('#nextTestimonial').addEventListener('click', () => showTestimonial(activeTestimonial + 1));
}

const themeButton = $('#themeButton');
if (themeButton) {
  // Check and apply saved theme on load
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeButton.querySelector('span').textContent = '☼';
  }

  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeButton.querySelector('span').textContent = isLight ? '☼' : '◑';
    themeButton.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Toggle color theme');
  });
}

// Inject Global Portfolio Modal
document.body.insertAdjacentHTML('beforeend', `
  <div class="product-modal-overlay" id="portfolioModalOverlay" onclick="if(event.target === this) closePortfolioModal()">
    <div class="product-modal">
      <button class="product-modal-close" aria-label="Close modal" onclick="closePortfolioModal()">×</button>
      <div class="product-modal-visual" id="portfolioModalVisual"></div>
      <span class="product-modal-type" id="portfolioModalCategory"></span>
      <h2 class="product-modal-title" id="portfolioModalTitle"></h2>
      <p class="product-modal-desc" id="portfolioModalDesc"></p>
    </div>
  </div>
`);

window.openPortfolioModal = function(title, category, desc, url, isVideo) {
  document.getElementById('portfolioModalTitle').textContent = title;
  document.getElementById('portfolioModalCategory').textContent = category;
  document.getElementById('portfolioModalDesc').textContent = desc;
  
  const mediaHtml = isVideo 
    ? `<video src="${url}" style="width: 100%; height: 100%; max-height: 500px; object-fit: contain;" controls autoplay playsinline></video>`
    : `<img src="${url}" style="width: 100%; height: 100%; max-height: 500px; object-fit: contain;">`;
    
  document.getElementById('portfolioModalVisual').innerHTML = mediaHtml;
  document.getElementById('portfolioModalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closePortfolioModal = function() {
  document.getElementById('portfolioModalOverlay').classList.remove('active');
  document.getElementById('portfolioModalVisual').innerHTML = ''; // Stop video
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (event) => {
  if (search && event.key === '/' && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }
});
