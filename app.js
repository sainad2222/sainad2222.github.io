(function () {
  'use strict';

  var data = window.CONTRIBUTIONS || [];
  var stars = (window.STARS && window.STARS.repos) || {};

  // First merged pull request, October 2019. The list above starts at 2023
  // because the years before it were single-line README and Hacktoberfest edits.
  var FIRST_YEAR = 2019;

  /* ---------- formatting ---------- */

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function formatDate(iso) {
    var p = String(iso).split('-');
    return MONTHS[Number(p[1]) - 1] + ' ' + p[0];
  }

  function formatStars(n) {
    if (typeof n !== 'number' || n < 0) return null;
    if (n < 1000) return String(n);
    var k = n / 1000;
    return (k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)) + 'k';
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- rows ---------- */

  function renderRow(entry) {
    var li = el('li', 'contrib');

    var head = el('div', 'contrib-head');

    var repo = el('a', 'repo', entry.repo);
    repo.href = 'https://github.com/' + entry.repo;
    head.appendChild(repo);

    var prs = el('span', 'pr');
    entry.prs.forEach(function (pr, i) {
      if (i > 0) prs.appendChild(document.createTextNode(' '));
      var a = el('a', 'pr-link', '#' + pr.n);
      a.href = pr.url;
      prs.appendChild(a);
    });
    head.appendChild(prs);

    var meta = el('div', 'meta');
    meta.appendChild(el('span', 'badge ' + entry.state, entry.state));
    var count = stars[entry.repo];
    var pretty = formatStars(count);
    if (pretty) {
      var s = el('span', 'stars', '★ ' + pretty);
      s.title = count.toLocaleString() + ' stars on ' + entry.repo;
      meta.appendChild(s);
    }
    meta.appendChild(el('span', 'date', formatDate(entry.date)));
    head.appendChild(meta);

    li.appendChild(head);

    var h3 = el('h3', 'contrib-title');
    var link = el('a', 'stretched', entry.title);
    link.href = entry.prs[0].url;
    h3.appendChild(link);
    li.appendChild(h3);

    li.appendChild(el('p', 'contrib-problem', entry.problem));

    if (entry.tags && entry.tags.length) {
      var tags = el('ul', 'tags');
      entry.tags.forEach(function (t) { tags.appendChild(el('li', 'tag', t)); });
      li.appendChild(tags);
    }

    return li;
  }

  function fill(listEl, entries) {
    listEl.textContent = '';
    entries.forEach(function (e) { listEl.appendChild(renderRow(e)); });
  }

  /* ---------- data slices ---------- */

  function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }

  var merged = data.filter(function (e) { return e.state === 'merged'; }).sort(byDateDesc);
  var open = data.filter(function (e) { return e.state === 'open'; }).sort(byDateDesc);

  function countPrs(entries) {
    return entries.reduce(function (n, e) { return n + e.prs.length; }, 0);
  }

  /* ---------- stats ---------- */

  function renderStats() {
    var repos = {};
    data.forEach(function (e) { repos[e.repo] = true; });

    var stats = [
      ['Merged PRs', String(countPrs(merged))],
      ['Repositories', String(Object.keys(repos).length)],
      ['Open PRs', String(countPrs(open))],
      ['Contributing since', String(FIRST_YEAR)]
    ];

    var wrap = document.getElementById('stats');
    stats.forEach(function (pair) {
      // dt before dd, as <dl> requires. CSS reverses them so the number
      // sits above its label.
      var box = el('div', 'stat');
      box.appendChild(el('dt', null, pair[0]));
      box.appendChild(el('dd', null, pair[1]));
      wrap.appendChild(box);
    });
  }

  /* ---------- filters ---------- */

  function renderFilters() {
    var counts = {};
    merged.forEach(function (e) {
      (e.tags || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });

    var tags = Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a] || a.localeCompare(b);
    });

    var wrap = document.getElementById('filters');
    var listEl = document.getElementById('merged-list');
    var emptyEl = document.getElementById('merged-empty');
    var active = null;

    function apply() {
      var shown = active
        ? merged.filter(function (e) { return (e.tags || []).indexOf(active) !== -1; })
        : merged;
      fill(listEl, shown);
      emptyEl.hidden = shown.length > 0;
    }

    function makeChip(label, value) {
      var chip = el('button', 'chip', label);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', String(active === value));
      chip.addEventListener('click', function () {
        active = (active === value) ? null : value;
        Array.prototype.forEach.call(wrap.children, function (c) {
          c.setAttribute('aria-pressed', String(c.dataset.value === (active || '')));
        });
        apply();
      });
      chip.dataset.value = value || '';
      return chip;
    }

    wrap.appendChild(makeChip('all', null));
    tags.forEach(function (t) { wrap.appendChild(makeChip(t, t)); });

    apply();
  }

  /* ---------- theme ---------- */

  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme');
      if (!current) {
        // No explicit choice yet, so read the system preference. Where
        // matchMedia is unavailable, fall back to dark, which is what the
        // stylesheet renders by default.
        var prefersLight = window.matchMedia
          ? window.matchMedia('(prefers-color-scheme: light)').matches
          : false;
        current = prefersLight ? 'light' : 'dark';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- footnote ---------- */

  function renderFootnote() {
    var updated = window.STARS && window.STARS.updated;
    if (!updated) return;
    document.getElementById('stars-footnote').textContent =
      'Star counts refreshed automatically, last on ' + formatDate(updated) + '.';
  }

  renderStats();
  renderFilters();
  fill(document.getElementById('open-list'), open);
  renderFootnote();
  initTheme();
})();
