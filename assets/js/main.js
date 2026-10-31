/* Progressive enhancement: the full content remains readable without JavaScript. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-navigation');
  const more = document.querySelector('.more-nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (more?.open) {
        more.open = false;
        more.querySelector('summary').focus();
      } else if (nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (more?.open && !more.contains(event.target)) more.open = false;
    });
  }

  const controls = document.querySelector('[data-publication-controls]');
  let resetPublications = () => {};
  if (controls) {
    const search = document.querySelector('#paper-search');
    const topic = document.querySelector('#paper-topic');
    const cards = [...document.querySelectorAll('.publication')];
    const groups = [...document.querySelectorAll('.publication-group')];
    const count = document.querySelector('#paper-count');
    const empty = document.querySelector('#empty-papers');
    const normalise = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const records = cards.map(card => ({
      card,
      text: normalise(card.textContent),
      topics: (card.dataset.topics || '').split(' ')
    }));
    function filter() {
      const words = normalise(search.value.trim()).split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const record of records) {
        const matches = (!topic.value || record.topics.includes(topic.value)) && words.every(word => record.text.includes(word));
        record.card.hidden = !matches;
        if (matches) visible += 1;
      }
      for (const group of groups) group.hidden = !group.querySelector('.publication:not([hidden])');
      count.textContent = `Showing ${visible} of ${cards.length} papers`;
      empty.hidden = visible !== 0;
    }
    controls.hidden = false;
    count.hidden = false;
    controls.addEventListener('submit', event => event.preventDefault());
    search.addEventListener('input', filter);
    topic.addEventListener('change', filter);
    resetPublications = () => { controls.reset(); filter(); };
    controls.querySelector('[data-reset-filters]').addEventListener('click', () => {
      resetPublications();
      search.focus();
    });
    filter();
  }

  // Let the browser handle normal section links. Only correct its position when
  // a legacy fragment is mapped or the target's hidden content is revealed.
  const oldFragments = { Papers1: 'papers', Papers2: 'papers', Talks: 'talks', Projects: 'projects', Students: 'group', DPhil: 'thesis' };
  let pendingHashScroll = 0;
  function revealHash() {
    cancelAnimationFrame(pendingHashScroll);
    pendingHashScroll = 0;
    const hash = location.hash;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(oldFragments[id] || id);
    if (!target) return;
    let needsScroll = target.id !== id;
    if (target.classList.contains('publication') && target.hidden) {
      resetPublications();
      needsScroll = true;
    }
    for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS' && !ancestor.open) {
        ancestor.open = true;
        needsScroll = true;
      }
    }
    if (!needsScroll) return;
    pendingHashScroll = requestAnimationFrame(() => {
      pendingHashScroll = 0;
      // A later section click must never be undone by a queued earlier jump.
      if (location.hash === hash) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }
  addEventListener('hashchange', revealHash);
  revealHash();

  // Include collapsed research explanations and older talks in printed copies.
  let printState = [];
  addEventListener('beforeprint', () => {
    printState = [...document.querySelectorAll('main details')].map(element => [element, element.open]);
    printState.forEach(([element]) => { element.open = true; });
  });
  addEventListener('afterprint', () => printState.forEach(([element, open]) => { element.open = open; }));
})();
