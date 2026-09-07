(function () {
  'use strict';

  var data = window.CONTRIBUTIONS || [];
  var stars = (window.STARS && window.STARS.repos) || {};

  // Exactly one of these is expected on every entry. It drives the language
  // badge and the Language filter; every other tag is an Area filter.
  var LANGUAGES = ['rust', 'go', 'python'];

  // First merged pull request, October 2019. The list starts at 2023 because
  // the years before it were single-line README and Hacktoberfest edits.
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

  function languageOf(entry) {
    for (var i = 0; i < entry.tags.length; i++) {
      if (LANGUAGES.indexOf(entry.tags[i]) !== -1) return entry.tags[i];
    }
    return null;
  }

  function areasOf(entry) {
    return entry.tags.filter(function (t) { return LANGUAGES.indexOf(t) === -1; });
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

    var language = languageOf(entry);
    if (language) meta.appendChild(el('span', 'badge lang-' + language, language));

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

    // Language already reads as the badge above, so only areas repeat here.
    var areas = areasOf(entry);
    if (areas.length) {
      var tags = el('ul', 'tags');
      areas.forEach(function (t) { tags.appendChild(el('li', 'tag', t)); });
      li.appendChild(tags);
    }

    return li;
  }

  /* ---------- data ---------- */

  var entries = data.slice().sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  function countPrs(list) {
    return list.reduce(function (n, e) { return n + e.prs.length; }, 0);
  }

  /* ---------- stats ---------- */

  function renderStats() {
    var repos = {};
    entries.forEach(function (e) { repos[e.repo] = true; });

    var languages = {};
    entries.forEach(function (e) {
      var l = languageOf(e);
      if (l) languages[l] = true;
    });

    var stats = [
      ['Merged PRs', String(countPrs(entries))],
      ['Repositories', String(Object.keys(repos).length)],
      ['Languages', String(Object.keys(languages).length)],
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
    entries.forEach(function (e) {
      e.tags.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });

    var byCount = function (a, b) {
      return counts[b] - counts[a] || a.localeCompare(b);
    };

    var groups = [
      { key: 'language', label: 'Language',
        tags: LANGUAGES.filter(function (t) { return counts[t]; }) },
      { key: 'area', label: 'Area',
        tags: Object.keys(counts).filter(function (t) {
          return LANGUAGES.indexOf(t) === -1;
        }).sort(byCount) }
    ];

    var active = { language: null, area: null };
    var wrap = document.getElementById('filters');
    var listEl = document.getElementById('merged-list');
    var emptyEl = document.getElementById('merged-empty');

    function matches(entry) {
      return (!active.language || entry.tags.indexOf(active.language) !== -1)
          && (!active.area || entry.tags.indexOf(active.area) !== -1);
    }

    function apply() {
      var shown = entries.filter(matches);
      listEl.textContent = '';
      shown.forEach(function (e) { listEl.appendChild(renderRow(e)); });
      emptyEl.hidden = shown.length > 0;
    }

    groups.forEach(function (group) {
      var row = el('div', 'filter-group');
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', 'Filter by ' + group.label.toLowerCase());
      row.appendChild(el('span', 'filter-label', group.label));

      var chips = [];

      function select(value) {
        active[group.key] = value;
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', String((c.dataset.value || null) === value));
        });
        apply();
      }

      function addChip(label, value) {
        var chip = el('button', 'chip', label);
        chip.type = 'button';
        chip.dataset.value = value || '';
        chip.setAttribute('aria-pressed', String(active[group.key] === value));
        chip.addEventListener('click', function () {
          select(active[group.key] === value ? null : value);
        });
        chips.push(chip);
        row.appendChild(chip);
      }

      addChip('all', null);
      group.tags.forEach(function (t) { addChip(t + ' ' + counts[t], t); });
      wrap.appendChild(row);
    });

    apply();
  }

  /* ---------- theme ---------- */

  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var root = document.documentElement;
      // Unstamped means dark: the stylesheet has no system-preference
      // override, so dark is what an untouched page renders.
      var current = root.getAttribute('data-theme') || 'dark';
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
  renderFootnote();
  initTheme();
})();
