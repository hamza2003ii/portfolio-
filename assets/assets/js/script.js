// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const isLight = body.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const posts = document.querySelectorAll('.post');
const noResults = document.getElementById('noResults');
let debounceTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const query = searchInput.value.toLowerCase().trim().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    let visible = 0;
    posts.forEach(post => {
      const title = post.dataset.title.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
      const cat = post.dataset.cat.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
      if (title.includes(query) || cat.includes(query)) {
        post.style.display = '';
        visible++;
      } else {
        post.style.display = 'none';
      }
    });
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }, 300);
});

// Category filtering
const catButtons = document.querySelectorAll('[data-cat-filter]');
catButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    catButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.textContent.trim();
    let visible = 0;
    posts.forEach(post => {
      if (cat === 'الكل' || post.dataset.cat === cat) {
        post.style.display = '';
        visible++;
      } else {
        post.style.display = 'none';
      }
    });
    noResults.style.display = visible === 0 ? 'block' : 'none';
  });
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('show'));
});

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterForm.querySelector('input[type="email"]').value;
  alert(`تم الاشتراك بالبريد: ${email}`);
  newsletterForm.reset();
});

// Stickyfill (if needed)
if (window.Stickyfill) { const header = document.querySelector('header'); Stickyfill.add(header); }

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  });
}
