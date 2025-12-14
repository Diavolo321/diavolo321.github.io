
// Burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu on link click (mobile)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Modal form
const modal = document.getElementById('modal');
const openBtns = document.querySelectorAll('.js-open-modal');
const closeEls = document.querySelectorAll('.js-close-modal');

function openModal() {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openBtns.forEach(btn => btn.addEventListener('click', openModal));
closeEls.forEach(el => el.addEventListener('click', closeModal));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

const subscribeForm = document.getElementById('subscribeForm');
const notify = document.getElementById('notify');
const closeNotifyBtns = document.querySelectorAll('.js-close-notify');

function openNotify(){
  if (!notify) return;
  notify.classList.add('is-open');
  notify.setAttribute('aria-hidden', 'false');
}

function closeNotify(){
  if (!notify) return;
  notify.classList.remove('is-open');
  notify.setAttribute('aria-hidden', 'true');
}

if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. закрываем основную модалку
    closeModal();

    // 2. показываем уведомление
    openNotify();

    // 3. автозакрытие через 4 секунды
    setTimeout(closeNotify, 4000);

    // 4. очистка формы
    subscribeForm.reset();
  });
}

closeNotifyBtns.forEach(btn =>
  btn.addEventListener('click', closeNotify)
);


// Simple slider
const track = document.getElementById('track');
const slides = track ? Array.from(track.children) : [];
let idx = 0;

function updateSlider() {
  if (!track) return;
  track.style.transform = `translateX(-${idx * 100}%)`;
}

const next = document.getElementById('next');
const prev = document.getElementById('prev');

if (next) next.addEventListener('click', () => {
  if (!slides.length) return;
  idx = (idx + 1) % slides.length;
  updateSlider();
});

if (prev) prev.addEventListener('click', () => {
  if (!slides.length) return;
  idx = (idx - 1 + slides.length) % slides.length;
  updateSlider();
});

// Parallax (light): элементы с классом .parallax и/или data-parallax
(() => {
  // Собираем элементы 1 раз (не на каждый scroll)
  const els = Array.from(document.querySelectorAll('.parallax, [data-parallax]'))
    // ВАЖНО: не трогаем экран 6 и всё, что внутри него
    .filter(el => !el.closest('#approach'));

  if (!els.length) return;

  // Запоминаем базовый transform, чтобы не перетирать его на scroll
  els.forEach(el => {
    if (!el.dataset.baseTransform) {
      const t = getComputedStyle(el).transform;
      // если transform = none, запоминаем пустую строку
      el.dataset.baseTransform = (t && t !== 'none') ? t : '';
    }
  });

  let ticking = false;

  function applyParallax() {
    const y = window.scrollY;

    els.forEach(el => {
      // Если есть data-parallax — используем его, иначе дефолт как было (0.06)
      const k = el.hasAttribute('data-parallax')
        ? parseFloat(el.getAttribute('data-parallax') || '0')
        : 0.06;

      const base = el.dataset.baseTransform || '';
      // Добавляем translateY, НЕ убивая другие transform
      el.style.transform = `${base} translateY(${y * k}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyParallax);
    }
  }, { passive: true });

  // чтобы после обновления было стабильно
  requestAnimationFrame(applyParallax);
})();



