The repository is a small client-side interactive India map built with plain HTML/CSS/JS. Provide concise, task-oriented guidance for AI coding agents working in this repo.

Quick summary
- Tech stack: static site (HTML + CSS + vanilla JS). No build system, package manager, or server-side code.
- Primary files: `index.html` (SVG map markup + panels), `script.js` (interaction logic, `stateData` object), `style.css` (layout and hover styles).

Primary goals for agents
- Add features or fix UI/UX strictly within the static client; avoid adding heavy frameworks.
- Keep edits small and local: prefer modifying `script.js` for behavior and `index.html` for SVG path updates.

Important patterns and conventions
- Each state on the map is an SVG <path> with id equal to a key used in `stateData` inside `script.js`. Example: `id="Mizoram"` maps to `stateData.Mizoram`.
- `stateData` is the canonical in-repo dataset for display values (name, capital, area, population). The code looks up data by element id on mouseenter.
- The preview uses `<path id="preview-path">` and copies the hovered state's `d` attribute into it to render the preview.
- Interaction lifecycle in `script.js` (mouseenter handler): update text fields (`#display-name`, `#cap`, `#area`, `#pop`), set preview path `d`, and append the hovered path to its parent to visually raise it.

Files to inspect when changing behavior
- `script.js` — single source of interaction behavior. Search for `stateData` or `.state` query selector.
- `index.html` — large inline SVG: path ids, `viewBox`, and `preview-path` are important. Keep path ids stable; renaming must be mirrored in `stateData`.
- `style.css` — hover transforms (scale/translate/drop-shadow). Adjusting visual effects should be done here.

Examples of safe edits
- Add a new state dataset: add a key to `stateData` with matching `id` in `index.html`.
- Add keyboard accessibility: implement `focus` and `keydown` handlers on `.state` elements in `script.js` (mirror mouseenter behavior).
- Lazy-fill missing path `d`: if a path has empty `d` (see `Andhra_Pradesh`), prefer sourcing it from a sanitized external SVG or authoring a minimal placeholder and comment why.

Edge cases observed
- Several `<path>` elements have placeholder `d="..."` or empty `d` — treat these as incomplete assets. Code should guard against reading an empty `d` before setting preview path.
- `README.md` is empty — do not rely on it for workflows.

Developer workflows
- No build: open `index.html` in a browser (file://) for local dev. Use the browser devtools to inspect SVG layout and event listeners.
- Debugging: instrument `script.js` with console.log statements or use breakpoints on the `.state` event listeners.

Do NOT do
- Do not introduce heavy toolchains (Webpack, React, etc.) without explicit request.
- Do not modify path `id` values without updating `stateData` accordingly.

If you need to add tests
- There are no tests currently. If requested, add small DOM-based tests (Jest+jsdom) and include a minimal `package.json`. Prefer keeping this optional unless the user asks.

When you make a change
- Keep commits atomic and small (UI fix, dataset update, accessibility enhancement).
- Mention which file(s) changed and explain why (e.g., `script.js`: add keyboard handlers to mirror hover interactions).

Questions for the author (if unclear)
- Should missing or placeholder paths be completed in-repo, or is it acceptable to leave them as placeholders with a note?
- Do you want to keep the whole map inline in `index.html`, or move SVGs to separate files for maintainability?

Short examples (copy-paste friendly)
- Guard before preview update in `script.js`:

  const d = this.getAttribute('d');
  if (d && d.trim()) preview.setAttribute('d', d);

- Add keyboard support:

  state.setAttribute('tabindex', '0');
  state.addEventListener('focus', () => state.dispatchEvent(new Event('mouseenter')));
  state.addEventListener('keydown', e => { if (e.key === 'Enter') {/* open details or toggle selection */} });

End of instructions.
