/**
 * MAVERICKS STUDIO — navigation, progressive reveal, and counters.
 * No dependencies; content remains visible when JavaScript is unavailable.
 */
(() => {
   document.documentElement.classList.add('js');

   document.addEventListener('DOMContentLoaded', () => {
        initNavBackground();
        initMobileMenu();
        initSmoothScroll();
        initReveal();
        initCounters();
     });

   /* ---- Nav background on scroll (fixed after hero) ------------------ */
   function initNavBackground() {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        let last = 0;
        const onScroll = () => {
            const y = window.scrollY;
            nav.classList.toggle('scrolled', y > window.innerHeight * 0.6);
            if (y > 600 && y > last) nav.style.transform = 'translateY(-100%)';
            else nav.style.transform = 'translateY(0)';
            last = y;
         };
        window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive:true });
   }

   /* ---- Mobile menu -------------------------------------------------- */
   function initMobileMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const menu = document.getElementById('mobileMenu');
        if (!btn || !menu) return;
        const close = () => { menu.classList.remove('active'); btn.classList.remove('active'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
        const toggle = () => {
            const open = !menu.classList.contains('active');
            menu.classList.toggle('active', open);
            btn.classList.toggle('active', open);
            btn.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
         };
        btn.addEventListener('click', toggle);
        btn.setAttribute('aria-expanded','false');
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
   }

   /* ---- Smooth scroll for in-page anchors ---------------------------- */
   function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const id = a.getAttribute('href');
                if (id === '#' || id.length < 2) return;
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    const off = (document.querySelector('.nav')?.offsetHeight || 0) + 20;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
                 }
             });
        });
   }

   /* ---- Scroll reveal ------------------------------------------------ */
   function initReveal() {
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
        }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
        els.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 0.08}s`; io.observe(el); });
   }

   /* ---- Animated counters ------------------------------------------------ */
   function initCounters() {
        const nums = document.querySelectorAll('[data-count]');
        if (!nums.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
        }, { threshold:0.5 });
        nums.forEach(n => io.observe(n));
   }
   function run(el) {
        const target = parseFloat(el.dataset.count);
        const dur = 2000, t0 = performance.now();
        const step = now => {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 4);
            el.textContent = target * e;
            el.textContent = Math.round(target * e);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
   }
})();
