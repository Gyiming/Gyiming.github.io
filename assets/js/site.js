/* Section switching for the single-page layout.
   Progressive enhancement: without JS every section is stacked and visible. */

(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var baseTitle = doc.title;
  var tabs = Array.prototype.slice.call(doc.querySelectorAll('.tab[data-tab]'));
  var sections = Array.prototype.slice.call(doc.querySelectorAll('.section[data-section]'));
  var content = doc.getElementById('content');
  var mobileQuery = window.matchMedia('(max-width: 860px)');

  if (!tabs.length || !sections.length) return;

  function tabByName(name) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute('data-tab') === name) return tabs[i];
    }
    return null;
  }

  function updateTabOverflow() {
    var nav = doc.querySelector('.tabs');
    if (!nav) return;
    nav.classList.toggle('is-overflowing', nav.scrollWidth > nav.clientWidth + 2);
  }

  function revealTab(tab) {
    var nav = tab.parentNode;
    if (!mobileQuery.matches || !nav || nav.scrollWidth <= nav.clientWidth) return;

    var pad = 10;
    var left = nav.scrollLeft;
    var right = left + nav.clientWidth;
    var start = tab.offsetLeft;
    var end = start + tab.offsetWidth;

    if (start < left + pad) {
      nav.scrollTo({ left: Math.max(0, start - pad), behavior: 'smooth' });
    } else if (end > right - pad) {
      nav.scrollTo({ left: end - nav.clientWidth + pad, behavior: 'smooth' });
    }
  }

  function sectionStart() {
    if (!content) return 0;
    var offset = mobileQuery.matches ? (doc.querySelector('.sidebar').offsetHeight || 0) + 10 : 20;
    return content.getBoundingClientRect().top + window.pageYOffset - offset;
  }

  function activate(name, options) {
    var tab = tabByName(name);
    if (!tab) return false;
    options = options || {};

    sections.forEach(function (section) {
      var on = section.getAttribute('data-section') === name;
      section.classList.toggle('is-active', on);
      if (on) {
        section.removeAttribute('hidden');
      } else {
        section.setAttribute('hidden', '');
      }
    });

    tabs.forEach(function (item) {
      var on = item === tab;
      item.setAttribute('aria-selected', on ? 'true' : 'false');
      item.tabIndex = on ? 0 : -1;
    });

    doc.title = name === 'about' ? baseTitle : tab.getAttribute('data-title') + ' · Yiming Gan';
    revealTab(tab);

    if (options.updateHistory) {
      try {
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '#' + name);
        } else {
          window.location.hash = name;
        }
      } catch (error) {
        window.location.hash = name;
      }
    }

    if (options.focus) tab.focus({ preventScroll: true });

    if (options.scroll) {
      var top = sectionStart();
      if (window.pageYOffset > top + 4) {
        window.scrollTo({
          top: Math.max(top, 0),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
    }

    return true;
  }

  function nameFromHash() {
    return (window.location.hash || '').replace(/^#/, '');
  }

  /* Clicks on sidebar tabs and on inline links such as "Prospective Students". */
  doc.addEventListener('click', function (event) {
    var trigger = event.target.closest ? event.target.closest('[data-tab]') : null;
    if (!trigger) return;
    var name = trigger.getAttribute('data-tab');
    if (!tabByName(name)) return;
    event.preventDefault();
    activate(name, { updateHistory: true, scroll: true });
  });

  /* Keyboard navigation for the tab list. */
  doc.querySelector('.tabs').addEventListener('keydown', function (event) {
    var current = event.target.closest ? event.target.closest('.tab') : null;
    if (!current) return;
    var index = tabs.indexOf(current);
    var next = null;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = tabs[(index + 1) % tabs.length];
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = tabs[(index - 1 + tabs.length) % tabs.length];
        break;
      case 'Home':
        next = tabs[0];
        break;
      case 'End':
        next = tabs[tabs.length - 1];
        break;
      default:
        return;
    }

    event.preventDefault();
    activate(next.getAttribute('data-tab'), { updateHistory: true, focus: true, scroll: true });
  });

  /* Back / forward buttons and hand-edited hashes. */
  window.addEventListener('popstate', function () {
    var name = nameFromHash();
    if (!tabByName(name)) name = 'about';
    activate(name, { scroll: false });
  });

  window.addEventListener('hashchange', function () {
    var name = nameFromHash();
    if (!tabByName(name)) name = 'about';
    activate(name, { scroll: false });
  });

  /* Initial section: the one named in the URL, or About. */
  var initial = nameFromHash();
  if (!tabByName(initial)) initial = 'about';
  activate(initial, { scroll: false });

  updateTabOverflow();
  window.addEventListener('resize', updateTabOverflow);

  /* Give the page a class once JS has taken over. */
  root.classList.add('js-ready');
}());
