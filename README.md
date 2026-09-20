# sainad2222.github.io

Personal site. Static HTML, CSS and vanilla JS, served from `main` by GitHub Pages.
No build step, no dependencies.

| File | |
| --- | --- |
| `index.html` | The page shell. |
| `styles.css` | All styling. Palette is CSS custom properties at the top. |
| `app.js` | Renders the contribution rows, filtering and the theme toggle. |
| `data/contributions.js` | **The record. This is the file you edit.** |
| `data/stars.js` | Generated. Do not edit. |
| `scripts/refresh_stars.py` | Rewrites `data/stars.js`. Stdlib only. |

## Adding a contribution

Append one object to `data/contributions.js`:

```js
{
  "repo": "owner/name",
  "prs": [{ "n": 1234, "url": "https://github.com/owner/name/pull/1234" }],
  "title": "What the change was",
  "date": "2026-09-06",
  "problem": "What was broken or missing, and why it mattered. Two sentences.",
  "tags": ["rust", "observability"]
}
```

That is the whole edit. The stat strip, the filter chips and the ordering all derive
from this file, so nothing else needs updating.

- Only merged work belongs here.
- `prs` is a list, so one entry can cover a group of PRs that landed as one piece of work.
- `tags` needs **exactly one language** (`rust`, `go` or `python`). It becomes the coloured
  badge on the row and the Language filter. Every other tag becomes an Area filter and
  shows as a chip under the description.
- Add `"featured": true` to pin an entry above the date order, with a left accent bar and
  a `★ featured` marker. Use it for the handful you most want read.
- To add a language, put it in the `LANGUAGES` list at the top of `app.js` and add a
  `--lang-<name>` colour pair in `styles.css`, in both the dark and light blocks. Without
  that the row renders no badge.
- Star counts are deliberately absent. They live in `data/stars.js`, keyed by repo.

## Star counts

`.github/workflows/refresh-stars.yml` runs `scripts/refresh_stars.py` every Monday, and
commits `data/stars.js` only when a number actually changed. New repos are picked up
automatically because the script reads its repo list out of `contributions.js`.

To run it by hand:

```sh
python3 scripts/refresh_stars.py           # rewrite data/stars.js
python3 scripts/refresh_stars.py --check   # exit 1 if out of date, write nothing
```

Unauthenticated the GitHub API allows 60 requests an hour, which is enough for this list
but not much more. Export `GH_TOKEN` to raise it.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
