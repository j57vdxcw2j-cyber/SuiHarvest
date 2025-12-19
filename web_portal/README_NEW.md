# 🌽 SuiHarvest Web Portal

A modern, modular React/TypeScript web portal for the SuiHarvest farming game.

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd web_portal
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/                    # React components
│   ├── Navigation.tsx            # Header navigation
│   ├── Home.tsx                  # Landing page
│   ├── Wiki.tsx                  # Documentation
│   ├── Game.tsx                  # Interactive game
│   ├── Contact.tsx               # Contact form
│   ├── *.module.css              # Component-scoped styles
│   └── index.ts                  # Component exports
├── styles/
│   └── globals.css               # Global styles & CSS variables
├── App.tsx                       # Main app component
├── main.tsx                      # React entry point
└── App.css                       # App-specific styles
```

## 🎨 Features

### Pages
- **Home** - Landing page with hero, features, how-to, stats, and FAQ
- **Wiki** - Interactive documentation with sidebar navigation
- **Game** - Playable farming game with stamina system
- **Contact** - Contact form and business info

### UI Components
- Navigation bar with wallet connect
- Animated background grid
- Responsive card grids
- FAQ accordion
- Game map with interactive zones
- Form validation

### Game Mechanics
- 50 Stamina pool
- Action costs: Chop (6), Mine (8), Farm (2)
- Farm plots (9 available)
- Stamina bar visualization
- Daily reset functionality

## 🎯 What's Inside

### Modern Stack
- ✅ React 19 - UI library
- ✅ TypeScript - Type safety
- ✅ Vite - Lightning-fast builds
- ✅ CSS Modules - Scoped styling
- ✅ Responsive Design - Mobile-first

### Animations
- Grid background animation
- Character floating effect
- Marquee scrolling
- Page transitions
- Button hover effects

### Accessibility
- Semantic HTML
- Form labels
- Color contrast compliance
- Keyboard navigation

## 🚀 Available Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview built version
npm run lint      # ESLint checks
```

## 📦 Build Output

```
✓ dist/index.html                   0.45 kB
✓ dist/assets/index-Dh8bDqlZ.css   12.31 kB (gzipped: 3.35 kB)
✓ dist/assets/index-UYlzHckr.js    206.23 kB (gzipped: 64.91 kB)
```

## 🎮 Game Interactions

### In-Game Actions
1. **Click "ENTER WORLD"** to start the day
2. **Click rocks (🪨)** to mine (costs 8 stamina)
3. **Click trees (🌲)** to chop (costs 6 stamina)
4. **Click plots (🌱)** to farm (costs 2 stamina)
5. **Click tent (⛺)** to sleep and reset

### Gameplay Loop
- Start with 50 stamina
- Perform actions to gather resources
- Submit quest for rewards
- Sleep to reset and burn items

## 🔧 Customization

### Change Colors
Edit `src/styles/globals.css`:
```css
:root {
  --sui-blue: #3E7DFF;
  --sui-dark: #0F172A;
  /* ... more variables ... */
}
```

### Add New Pages
1. Create `src/components/NewPage.tsx`
2. Create `src/components/NewPage.module.css`
3. Add export to `src/components/index.ts`
4. Update `src/App.tsx` page routing

### Add Assets
Place images in `/public/` and reference:
```html
<img src="/image_0.png" alt="Description" />
```

## 📱 Responsive Breakpoints

- **Desktop** - 1100px+ (full layout)
- **Tablet** - 768px-1099px (grid adjustments)
- **Mobile** - <768px (stacked layout)

## 🔐 Security Notes

- No sensitive data in frontend code
- Environment variables for API endpoints
- Input validation on contact form
- Content Security Policy ready

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### GitHub Pages
Requires `base` in `vite.config.ts`

## 🔌 Future Enhancements

- [ ] Sui wallet integration
- [ ] Backend API connection
- [ ] Real game state management
- [ ] Leaderboard integration
- [ ] Analytics tracking
- [ ] PWA support
- [ ] Dark mode toggle
- [ ] Multi-language support

## 📚 Documentation

See additional guides:
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Architecture overview
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration from HTML
- [ASSETS_AND_CONFIG.md](./ASSETS_AND_CONFIG.md) - Configuration details

## 🐛 Troubleshooting

### Port in Use
```bash
npm run dev -- --port 3000
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npx tsc --noEmit
```

## 📞 Support

For issues or questions, refer to the included documentation or create an issue.

## 📄 License

Copyright 2024 SuiHarvest. All rights reserved.

---

Built with ❤️ for Sui Network
