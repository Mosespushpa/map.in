India Interactive Map (static)

This is a small static client-side project that displays an interactive India map (SVG) and shows basic state details on hover/focus.

Quick start (local)

1. From the repository root open `index.html` in your browser. On Windows PowerShell you can run:

```powershell
Start-Process .\index.html
```

2. Hover map states or use Tab + Enter/Space to focus and activate.

How the map data works

- The SVG markup lives in `map.svg` and is inlined into the page at runtime by `script.js`.
- Each state is an SVG `<path>` with an `id` matching a key in the `stateData` object inside `script.js`.
- `stateData` provides the display values: name, capital, area, population.
- If `stateData` lacks an entry for a hovered state, a small "No data for this state" badge appears and placeholder values are shown.

How to add or update state data

1. Open `script.js` and find the `stateData` object near the top.
2. Add or edit an entry using the map `id` as the key, for example:

```js
stateData['Kerala'] = {
  name: 'Kerala',
  capital: 'Thiruvananthapuram',
  area: '38,863 km²',
  population: '35 Million'
};
```

3. Save and reload `index.html` in your browser.

Notes & next steps

- Many paths in `map.svg` are currently placeholders (`d="..."` or empty). Replace them with sanitized path `d` values from an authoritative SVG source if you want full shape previews for every state.
- If you prefer, the SVG can be kept inline in `index.html` but separating into `map.svg` makes it easier to edit and reuse.
