# 🗺️ Map.in — Historical Geography Explorer of India

> An interactive web application to explore India's geography, history, rivers, forts, dynasties, and cultural heritage through a beautiful visual SVG map.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 About

**Map.in** is a comprehensive, interactive educational tool that brings India's rich geographical and historical heritage to life. It combines modern web technologies with educational content to provide an engaging learning experience for students, educators, history enthusiasts, and anyone curious about India.

### Vision

Build a single, unified platform where users can explore:
- 🏛️ **28 States** and **8 Union Territories**
- 🌊 **14 Major River Systems**
- 🏰 **Historical Forts** and monuments
- 👑 **11 Major Dynasties** and empires
- 🗓️ **Historical Events** spanning thousands of years
- 🗣️ **Regional Languages** across India

All on one beautiful, interactive map!

---

## ✨ Features

### 🎯 Interactive Map Overlays

- **States** — Explore all 28 states with detailed information about capital, area, population, language, and key facts
- **Union Territories** — Discover 8 union territories with pinpoint markers
- **Rivers** — Trace 14 major river systems with smooth, flowing visualizations
- **Ghats** — View Western and Eastern Ghats, plus sacred river ghats
- **Forts** — Locate historical forts with dynasty information
- **Languages** — Visual representation of India's linguistic diversity
- **Dynasties** — Watch animated empire expansions from their capitals
- **Historical Events** — Timeline of major events in Indian history

### 🎭 Dynasty Expansion Animation

When you select a dynasty, watch as:
- ⭐ A glowing marker appears at the empire's capital
- 🌊 An expanding circle visualizes territorial growth
- 🎨 States highlight progressively based on distance from capital
- 💫 Smooth animations bring history to life

### 🔍 Smart Search

- Autocomplete search across all categories
- Instant results for states, rivers, forts, dynasties, and events
- Click any result to view details and location on map

### 📱 Responsive Design

- Works on desktop, tablet, and mobile devices
- Resizable side panel for detailed information
- Dark mode optimized for comfortable viewing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure and inline SVG map |
| **CSS3** | Styling, animations, and transitions |
| **Vanilla JavaScript** | All logic and interactivity |
| **Font Awesome** | Icons throughout the UI |
| **SVG** | Interactive India map with detailed paths |

**No frameworks. No build tools. No dependencies.**

Just pure web technologies for instant loading and maximum performance!

---

## 🚀 Quick Start

### Prerequisites

You only need a modern web browser:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**No server, Node.js, or npm required!**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/map.in.git
cd map.in
```

2. **Open in your browser**

Simply open `index.html` in your web browser:

**Option A: Double-click**
- Navigate to the project folder
- Double-click `index.html`

**Option B: Command line**
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

**Option C: Local server (optional)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have it)
npx serve

# Then open: http://localhost:8000
```

That's it! The application will load instantly in your browser.

---

## 📖 How to Use

### Basic Navigation

1. **Choose a Category**
   - Click any tag button at the top (States, Rivers, Forts, Dynasties, etc.)
   - The map overlay will change to show that category

2. **Interact with the Map**
   - Hover over states to see highlights
   - Click on states, markers, or rivers for detailed information
   - Information appears in the side panel on the right

3. **Search**
   - Click the 🔍 search icon in the top-right
   - Type to search across all categories
   - Click any result to view it on the map

4. **View Details**
   - Side panel shows comprehensive information
   - Includes facts, statistics, and historical context
   - Click "← Back to list" to return to overview

### Exploring Dynasties

1. Click the **Dynasties** tag (👑 crown icon)
2. Select any dynasty from the list
3. Watch the animated expansion from the capital city
4. View detailed information about the empire

### Theme Toggle

- Click the 🌙 moon icon to toggle between dark and light themes
- Dark theme is optimized for comfortable viewing

---

## 📁 Project Structure

```
map.in/
├── index.html              # Main HTML file with inline SVG map
├── script.js               # Core application logic and data
├── style.css               # Main stylesheet
├── timeline-data.js        # Timeline data engine
├── logo.png                # Application logo (PNG)
├── logo.avif               # Application logo (AVIF format)
├── components/
│   ├── data-loader.js      # Data loading utilities
│   ├── overlays.js         # Map overlay rendering logic
│   ├── overlays.css        # Overlay-specific styles
│   ├── search.js           # Search functionality
│   ├── search.css          # Search component styles
│   ├── tags.js             # Category tag system
│   ├── tags.css            # Tag button styles
│   └── timeline.js         # Timeline slider component
├── resources/
│   └── images/
│       └── States/         # State-specific images
│           ├── Tamil Nadu/
│           │   ├── t1.webp
│           │   └── t2.jpg
│           └── Telangana/
│               ├── t1.webp
│               └── t2.jpg
└── README.md               # This file
```

### Key Files Explained

| File | Description |
|------|-------------|
| `index.html` | Entry point with embedded SVG map of India |
| `script.js` | All data (states, rivers, forts, dynasties) and core logic |
| `style.css` | Complete visual styling and design system |
| `components/overlays.js` | Handles all map overlays and animations |
| `components/search.js` | Search and autocomplete functionality |
| `components/tags.js` | Category selection system |

---

## 🎨 Design System

### Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Deep Navy | `#0a0e27` |
| State Fill | Dark Blue | `#1e2a4a` |
| State Border | Cyan | `#00e5ff` |
| Accent | Orange | `#ff9800` |
| Rivers | Blue | `#3498db`, `#56ccf2` |
| Navbar | Purple-Blue Gradient | `#667eea` → `#764ba2` |

### Typography

- **Primary Font**: Segoe UI, system-ui
- **Fallbacks**: -apple-system, BlinkMacSystemFont, sans-serif

---

## 🌐 Browser Support

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| IE 11 | N/A | ❌ Not Supported |

**Note:** Internet Explorer is not supported. Please use a modern browser.

---

## 📊 Data Coverage

| Category | Count |
|----------|-------|
| States | 28 |
| Union Territories | 8 |
| Major Rivers | 14 |
| Historical Forts | 4+ (expandable) |
| Dynasties | 11 |
| Historical Events | 12+ |
| Regional Languages | 16+ |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding New Data

#### Add a New State

1. Add SVG `<path>` to `index.html` with unique `id`
2. Add entry to `statesData` in `script.js`
3. Update `stateLanguages` mapping

#### Add a New River

1. Add entry to `RIVERS` array in `components/overlays.js` with waypoints
2. Add matching entry to `riversData` in `script.js`

#### Add a New Dynasty

1. Add entry to `dynastiesData` in `script.js`
2. Include: `id`, `name`, `period`, `capital`, `color`, `states[]`, `facts[]`
3. Add capital coordinates if needed in `components/overlays.js`

#### Add a New Fort

1. Add entry to `fortsData` in `script.js`
2. Include: `name`, `coordinates: [lat, lng]`, `dynasty`, `built`, `facts[]`

### Development Guidelines

- Keep all data inline in `script.js` (no external data files)
- Follow existing code style and conventions
- Test in multiple browsers before submitting
- Update this README if adding new features

### Reporting Issues

Found a bug or have a suggestion?
1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Browser and version

---

## 📝 License

This project is licensed under the **MIT License**.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Font Awesome** for the icon library
- **Indian Geography** data compiled from public sources
- **Historical Information** from various educational resources

---

## 📧 Contact

For questions, suggestions, or collaboration:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/map.in/issues)
- **Email**: your.email@example.com

---

## 🎯 Future Enhancements

Planned features for future versions:

- [ ] Timeline scrubber to view territorial changes by year
- [ ] Multi-dynasty comparison mode
- [ ] 3D terrain visualization
- [ ] Export functionality (images, data)
- [ ] Offline mode support
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Audio descriptions for accessibility
- [ ] Battle animations between empires
- [ ] Trade route visualizations

---

## 📈 Version History

### v1.0.0 (Current)
- ✅ Interactive India map with 28 states and 8 UTs
- ✅ 14 major river systems with smooth paths
- ✅ Dynasty expansion animations
- ✅ Search functionality
- ✅ Multiple overlay categories
- ✅ Responsive design
- ✅ Dark theme

---

<div align="center">

**Built with ❤️ using HTML, CSS, and Vanilla JavaScript**

No frameworks • No build tools • Just the web

[⭐ Star this repo](https://github.com/yourusername/map.in) if you find it useful!

</div>
