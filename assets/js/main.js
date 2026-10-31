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

  // Section clicks must replace an unfinished keyboard/wheel scroll, rather
  // than let its remaining animation move the page away from the new target.
  const oldFragments = { Papers1: 'papers', Papers2: 'papers', Talks: 'talks', Projects: 'projects', Students: 'group', DPhil: 'thesis' };
  let pendingHashScroll = 0;
  function cancelHashScroll() {
    cancelAnimationFrame(pendingHashScroll);
    pendingHashScroll = 0;
  }
  function hashTarget(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
    if (!id) return null;
    const mapped = Object.prototype.hasOwnProperty.call(oldFragments, id) ? oldFragments[id] : id;
    const target = document.getElementById(mapped);
    return target ? { target, remapped: mapped !== id } : null;
  }
  function revealTarget(target) {
    let changed = false;
    if (target.classList.contains('publication') && target.hidden) {
      resetPublications();
      changed = true;
    }
    for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS' && !ancestor.open) {
        ancestor.open = true;
        changed = true;
      }
    }
    return changed;
  }
  function jumpToTarget(target, moveFocus = false) {
    // In Chromium an instant scroll can *adjust* an ongoing user animation
    // without cancelling it. A smooth request to the CURRENT position cancels
    // that animation without moving the viewport. Then make one instant jump.
    window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'smooth' });
    if (moveFocus) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' });
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    const destination = hashTarget(url.hash);
    if (!destination) return;
    // pushState changes the address/history without starting native fragment
    // scrolling. Leave native navigation intact if history is unavailable.
    try {
      if (url.hash !== location.hash) history.pushState(null, '', url.hash);
    } catch { return; }
    event.preventDefault();
    cancelHashScroll();
    revealTarget(destination.target);
    jumpToTarget(destination.target, true);
  });

  // Address-bar/deep links and Back/Forward retain browser history behaviour.
  // Correct the position only if content had to be revealed or an alias mapped.
  function revealHash() {
    cancelHashScroll();
    const hash = location.hash;
    const destination = hashTarget(hash);
    if (!destination) return;
    const changed = revealTarget(destination.target);
    if (!changed && !destination.remapped) return;
    pendingHashScroll = requestAnimationFrame(() => {
      pendingHashScroll = 0;
      if (location.hash === hash) jumpToTarget(destination.target);
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
