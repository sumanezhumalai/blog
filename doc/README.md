# Blog Starter Template — Refactoring & Architecture Guide

## 1. Overview & Purpose

This repository was transformed from a multi-section static portfolio website (originally derived from Billy Sweeney's template) into a **clean, minimal starter template** designed specifically as the foundation for a modern **Blog Project (Astro + MDX)**.

### Purpose
To strip away all legacy portfolio content, personal credentials, and unused media assets while **preserving the signature design system and interactive chrome**:
- 17-theme dynamic HSL color engine
- Floating interactive theme spectrum slider (`app-aside`)
- 12-column grid overlay developer tool
- Letter-staggered typography hover interactions
- Repurposed minimal text-only footer (`section.contact`)
- Pure vanilla JS interaction engine (zero dependencies)

---

## 2. Preserved Architecture & Features

### 🎨 Color & Theme System (`styles/color.css` & `styles/variables.css`)
- **17 Themes**: `theme--00` (Dark) through `theme--16` (Light), with 15 accent spectrum variations in between.
- **Spectrum Slider (`app-aside`)**: Floating vertical slider in the bottom-left corner with hover/touch expand mechanics and CSS variable transitions.
- **Auto Dark Mode Detection**: Automatically sets `theme--00` if user OS prefers dark mode.
- **Keyboard Shortcuts**:
  - `w` or `b`: Toggle between black (`theme--00`) and white (`theme--16`) themes.
  - `s`: Cycle sequentially through the theme spectrum.

### 📐 Grid System & Overlay (`styles/grid.css` & `styles/media-queries.css`)
- **12-Column Responsive Grid**: Uses CSS Grid variables (`--grid--app-columns`).
- **Developer Grid Overlay (`app-grid-overlay`)**: Visual grid overlay toggleable via:
  - Sidebar grid icon button (`.option.grid`).
  - Keyboard shortcuts: `g` or `;`.

### 🔤 Header & Brand Typography (`styles/main.css`)
- **Header (`app-header`)**: Fixed top bar with staggered letter hover animation across full brand name (`<span>S</span><span>u</span>...`).
- **Font System (`styles/font.css`)**: Preserves `@font-face` for `Roobert-Medium.woff2` stored in `assets/font/`.

### ✉️ Repurposed Footer (`section.contact`)
- Repurposed from portfolio contact section to a clean, text-only blog footer.
- Retains live availability status indicator (`.look` pulse dot), tagline, direct email, and phone link.

### 🌅 Optional Splash Cover (`<!-- COVER SECTION -->`)
- Commented out in `index.html` as a built-in template feature.
- Can be uncommented anytime to restore the smooth page-load splash screen.

---

## 3. What Was Cleaned & Removed

| Category | Removed Items | Reason |
| :--- | :--- | :--- |
| **Navbar & Menu** | `<nav class="app-nav">`, `.option.navigation` (hamburger), all mobile nav overlays & scroll-spy | Cleaned completely per design request to focus layout on blog content. |
| **HTML Sections** | `intro`, `work`, `values`, `background`, `references`, `about` | Legacy portfolio content replaced by placeholder comments for blog components. |
| **Media Assets** | `assets/app/*` (webp/svgs), `assets/svg/*` | Deleted unused project thumbnails, portfolio icons, and background images. |
| **Stylesheets** | `about.css` → renamed to `main.css` | Stripped all section-specific CSS and dead code (reduced from 1,017 lines to 495 lines). |
| **Media Queries** | Section-specific rules, empty queries, mobile nav animations | Refactored `media-queries.css` (reduced to ~90 lines). |
| **Scripts** | jQuery, Easing, Modernizr, portfolio scroll handlers, nav scroll-spy | Replaced with pure vanilla JS `scripts/script.js` (213 lines). |

---

## 4. Directory Structure

```
/home/suman/Projects/blog/
├── assets/
│   └── font/
│       └── Roobert-Medium.woff2   # Primary font asset
├── doc/
│   ├── BRANCHES.md                # Git branch and remote reference
│   └── README.md                  # This documentation file
├── index.html                     # Refactored minimal starter HTML
├── scripts/
│   └── script.js                  # Pure vanilla JS interaction & theme engine
└── styles/
    ├── color.css                  # 17-theme color definitions (Sacred)
    ├── font.css                   # Font face & typography rules
    ├── grid.css                   # Overlay grid CSS
    ├── main.css                   # Primary layout & component styles
    ├── media-queries.css          # Responsive breakpoint overrides
    ├── normalize-8.0.1.css        # CSS normalization
    ├── reset.css                  # Minimal CSS reset
    └── variables.css              # Typography, grid & color CSS vars
```

---

## 5. Roadmap: Astro + MDX Conversion

The template is now ready for the next development phase:

1. **Astro Initialization**:
   - Initialize Astro inside the repository directory (`npx create-astro@latest ./`).
2. **Component Migration**:
   - Convert `app-header`, `app-aside` (Theme Slider), `app-grid-overlay`, and `section.contact` (Footer) into reusable Astro components (`src/components/`).
3. **MDX Blog Content**:
   - Configure Astro Content Collections (`src/content/blog/`) for writing articles using MDX with custom UI components.
4. **Asset Relocation**:
   - Move font files and static assets to Astro's `public/` directory.

---

## 6. Repository & Branch Reference (Updated 2026-09-27)

> See also: `doc/BRANCHES.md` for full details.

### Remote

* **GitHub:** `sumanezhumalai/blog` — `git@github.com:sumanezhumalai/blog.git` (`origin`)
* Added via `git remote add origin git@github.com:sumanezhumalai/blog.git`

### Branches

| Branch | Purpose | Status |
| :--- | :--- | :--- |
| `main` | Stable / production — pushed to `origin/main` (`be83406`), tracks `origin/main` | `git switch main` |
| `rc` | Release candidate / development — renamed from `quattrodots` via `git branch -m quattrodots rc` (non-destructive) | `git switch rc` (current) |

Both branches currently point to the same commit `be83406` (`refactor(pre-astro)`). History is linear (6 commits, no merges). Rename only moved `.git/refs/heads/quattrodots` → `.git/refs/heads/rc`; SHAs, working tree, and reflog unchanged. No remote existed before, so no collision.

Quick verify:
```bash
git branch -a
git log --oneline --graph --all --decorate
git remote -v
```
