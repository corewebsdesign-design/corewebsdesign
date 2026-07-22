/* ==========================================================
   Core Webs Design — script.js
   Mobilní navigace, scroll-reveal animace, kontaktní formulář
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobilní navigace ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll-reveal animace ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Kontaktní formulář — odeslání přes Formspree ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.style.color = '#f87171';
        status.textContent = 'Vyplňte prosím všechna povinná pole.';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.style.color = '';
      status.textContent = 'Odesílám…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            status.style.color = '';
            status.textContent = 'Děkujeme! Vaše zpráva byla odeslána, ozveme se co nejdříve.';
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.error) || 'Odeslání se nezdařilo.');
            });
          }
        })
        .catch(function () {
          status.style.color = '#f87171';
          status.textContent = 'Odeslání se nezdařilo. Zkuste to prosím znovu, nebo nám napište na corewebsdesign@gmail.com.';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

});