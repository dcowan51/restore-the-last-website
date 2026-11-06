
// Every page opens at the top, so the story starts at step one. A link to a section keeps its place.
(() => {
  if (location.hash) return;
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  const top = () => { window.scrollTo(0, 0); document.getElementById('top')?.scrollIntoView({ block: 'start' }); };
  top();
  addEventListener('load', top, { once: true });
  addEventListener('pageshow', (ev) => { if (ev.persisted) top(); });
})();

// Scroll stories: the visual stays pinned while the beats scroll past it, one at a time.
// Each beat names its scene (data-scene) and, where it has one, the number on the counter
// (data-n, data-lbl) and how many tests have failed so far (data-k). Without script every beat
// still reads in order and the first scene shows.
(() => {
  document.querySelectorAll('[data-reveal]').forEach((rv) => {
    const stage = rv.querySelector('.rv-stage');
    const beats = [...rv.querySelectorAll('.rb')];
    const scenes = [...rv.querySelectorAll('[data-scene-id]')];
    const num = rv.querySelector('[data-rnum]');
    const lbl = rv.querySelector('[data-rlbl]');
    const rows = [...rv.querySelectorAll('[data-t]')];
    let at = -1;
    const show = (n) => {
      if (n === at) return;
      at = n;
      const b = beats[n].dataset;
      stage.dataset.at = n;
      stage.dataset.scene = b.scene;
      scenes.forEach((s) => s.classList.toggle('on', s.dataset.sceneId === b.scene));
      if (num) {
        num.parentElement.hidden = !b.n;
        num.textContent = b.n || '';
        lbl.textContent = b.lbl || '';
        stage.toggleAttribute('data-zero', b.n === '0');
      }
      const k = +(b.k || 0);
      rows.forEach((r) => {
        r.classList.toggle('x', +r.dataset.t <= k);
        r.classList.toggle('cur', +r.dataset.t === k && beats[n].querySelector('h2')?.textContent.startsWith('Test'));
      });
      beats.forEach((x, i) => x.classList.toggle('on', i === n));
    };
    rv.classList.add('js');
    let ticking = false;
    const update = () => {
      ticking = false;
      const wide = innerWidth >= 900;
      const line = wide ? innerHeight * 0.55 : stage.getBoundingClientRect().bottom + innerHeight * 0.14;
      let n = 0;
      beats.forEach((b, i) => { if (b.getBoundingClientRect().top <= line) n = i; });
      show(n);
    };
    const onScroll = () => { if (!ticking) { ticking = true; setTimeout(update, 30); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  });

  // A link to something inside a closed fold opens the fold first.
  const openTo = (id, instant) => {
    const el = id && document.getElementById(decodeURIComponent(id));
    if (!el) return;
    let d = el.closest('details');
    while (d) { d.open = true; d = d.parentElement.closest('details'); }
    if (el.tagName === 'DETAILS') el.open = true;
    setTimeout(() => el.scrollIntoView(instant ? { behavior: 'instant' } : undefined), 0);
  };
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (a) openTo(a.getAttribute('href').slice(1));
  });
  addEventListener('hashchange', () => openTo(location.hash.slice(1)));
  // Arriving from another page: open the fold, then jump once the page has laid out.
  if (location.hash) {
    openTo(location.hash.slice(1), true);
    addEventListener('load', () => openTo(location.hash.slice(1), true), { once: true });
  }
})();
