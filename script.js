document.documentElement.classList.add('js');
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prog = document.querySelector('.scroll-progress');
  var nav = document.querySelector('.site-nav');
  var top = document.querySelector('.to-top');
  var fill = document.querySelector('.t-fill');
  var decos = document.querySelectorAll('.deco');

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    if (prog) prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', y > 20);
    if (top) top.classList.toggle('show', y > 500);
    if (!reduce) decos.forEach(function (d, i) { d.style.translate = '0 ' + (y * (i ? -0.06 : 0.08)) + 'px'; });
    if (fill) {
      var tl = fill.parentElement.getBoundingClientRect();
      var p = (window.innerHeight * 0.6 - tl.top) / tl.height;
      fill.style.setProperty('--fill', Math.max(0, Math.min(1, p)) * 100 + '%');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('.bar b').forEach(function (b) { b.style.width = b.dataset.level + '%'; });
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i % 4) * 0.1 + 's');
    io.observe(el);
  });
  if (reduce) document.querySelectorAll('.bar b').forEach(function (b) { b.style.width = b.dataset.level + '%'; });

  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  var copy = document.querySelector('.copy-btn');
  if (copy) copy.addEventListener('click', function () {
    var t = copy.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).catch(function () {
      var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove();
    });
    copy.textContent = 'Tersalin ✓'; copy.classList.add('done');
    setTimeout(function () { copy.textContent = 'Copy'; copy.classList.remove('done'); }, 1800);
  });

  var form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form);
    var body = 'Halo Shalvia,\n\n' + f.get('pesan') + '\n\nSalam,\n' + f.get('nama') + ' (' + f.get('email') + ')';
    location.href = 'mailto:shalviafs@icloud.com?subject=' + encodeURIComponent('Pesan dari ' + f.get('nama')) + '&body=' + encodeURIComponent(body);
  });
})();

(function () {
  var figs = Array.prototype.slice.call(document.querySelectorAll('.gallery figure'));
  if (!figs.length) return;
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Pratinjau foto');
  lb.innerHTML = '<button class="lb-x" aria-label="Tutup">×</button><button class="lb-prev" aria-label="Sebelumnya">‹</button><button class="lb-next" aria-label="Berikutnya">›</button><img alt=""><p></p>';
  document.body.appendChild(lb);
  var img = lb.querySelector('img'), cap = lb.querySelector('p'), i = 0;
  function show(n) {
    i = (n + figs.length) % figs.length;
    var im = figs[i].querySelector('img');
    img.src = im.src; img.alt = im.alt; cap.textContent = im.alt;
  }
  function open(n) { show(n); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  figs.forEach(function (f, n) {
    f.tabIndex = 0;
    f.addEventListener('click', function () { open(n); });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(n); });
  });
  lb.querySelector('.lb-x').onclick = close;
  lb.querySelector('.lb-prev').onclick = function () { show(i - 1); };
  lb.querySelector('.lb-next').onclick = function () { show(i + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();