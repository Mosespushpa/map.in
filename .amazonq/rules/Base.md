I am building a web application called "Map.in".

Current Stack:
- HTML
- CSS
- Vanilla JavaScript
- SVG India map

Current Features:
- Interactive India SVG map
- Hover and click state selection
- Information side panel
- Theme toggle
- Responsive layout

I want to transform this into a Historical Geography Explorer of India.

The UI should follow this layout:

---------------------------------------------------
| Logo | Map.in | Search | Theme Toggle |
---------------------------------------------------
| Timeline | Tags Navigation                  |
---------------------------------------------------
|          |                                  |
| Timeline | Main Historical Map              |
|          |                                  |
|          |                                  |
---------------------------------------------------
| Information Side Panel                      |
---------------------------------------------------

Features:

1. Vertical Timeline
- Left side fixed timeline.
- Years from 1947 to present.
- Slider with draggable handle.
- Selected year controls map data.

2. Historical State Boundaries
- Map changes according to selected year.
- Example years:
    1947
    1950
    1956
    1960
    1971
    2000
    2014
    Present

3. Category Tags
Horizontal category buttons:

- States
- Union Territories
- Rivers
- Mountain Ranges
- Ghats
- Forts
- Dynasties
- Languages
- Historical Events

Only one category active at a time.

4. Information Panel
Right-side panel should display:

Title
Description
Images
Facts
Timeline Events
Geo Statistics

5. Search Functionality

Search:
- State
- River
- Fort
- Dynasty
- Historical Event

Highlight map result.

6. Map Animation

When year changes:
- Smooth morph animation
- Fade transition
- Loading indicator

7. Data Structure

Create separate JSON files:

states.json
rivers.json
forts.json
ghats.json
historical-events.json
timeline.json

8. Architecture

Create:

components/
    navbar.js
    timeline.js
    tags.js
    map.js
    sidepanel.js

data/
    states.json
    rivers.json
    forts.json
    timeline.json

9. Design Requirements

Use:

Modern glassmorphism
Purple-blue gradient navbar
Dark scientific atlas theme
Smooth animations
Professional geography dashboard appearance

10. Deliverables

Phase 1:
- Timeline implementation
- Tags implementation
- Data loading architecture

Phase 2:
- Historical state rendering

Phase 3:
- River overlays
- Fort overlays

Phase 4:
- Search
- Animations

Phase 5:
- Complete historical atlas
``