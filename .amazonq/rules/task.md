phase 1
Implement a vertical timeline component.

Requirements:

- Fixed on left side.
- Years:
  1947
  1950
  1956
  1960
  1971
  1987
  2000
  2014
  2025

Features:

- Click year.
- Highlight active year.
- Smooth scrolling.
- Emit event:
  yearChanged(year)

Create:

timeline.js
timeline.css

Do not modify existing map functionality.

phase 2
Create a tag navigation system below navbar.

Tags:

States
Union Territories
Rivers
Ghats
Forts
Languages
Dynasties
Historical Events

Requirements:

- Active state styling.
- Toggle category.
- Emit:

categoryChanged(category)

Modern pill-button styling.

Keep existing theme design.

phase 3
Create a timeline-driven data engine.

Create:

timeline-data.js

Store data by year.

Example:

{
  "1947": {...},
  "1950": {...},
  "1956": {...},
  "1960": {...},
  "1971": {...},
  "2000": {...},
  "2014": {...},
  "2025": {...}
}

Requirements:

- loadYear(year)
- updateMap(year)
- updateInfoPanel(year)

Architecture should support future GeoJSON files.

phase 4
Create global search functionality.

Search targets:

States
Union Territories
Rivers
Forts
Dynasties
Historical Events

Features:

Autocomplete
Fuzzy search
Keyboard navigation

Results:

Highlight map object
Zoom to object
Open side panel

Create:

search.js
search.css

phase 5
Create river overlay layer.

Major rivers:

Ganga
Yamuna
Brahmaputra
Godavari
Krishna
Kaveri
Narmada
Tapti
Mahanadi

Requirements:

SVG overlay.
Toggle via tags.
Hover interaction.
Information panel integration.
Animated river glow effect.

phase 6

Create fort markers.

Examples:

Red Fort
Golconda Fort
Gingee Fort
Chitradurga Fort
Mehrangarh Fort
Agra Fort

Requirements:

Map markers.
Clustering when zoomed out.
Popup on click.
Information panel integration.

phase 7 
Implement historical state visualization.

Years:

1947
1950
1956
1960
1971
2000
2014
Present

Requirements:

Separate GeoJSON per year.

Example:

geojson/
    1947.json
    1950.json
    1956.json
    1960.json
    1971.json
    2000.json
    2014.json
    present.json

When timeline changes:

1. Load corresponding GeoJSON.
2. Animate transition.
3. Update side panel.
4. Update labels.

Use SVG path transitions.