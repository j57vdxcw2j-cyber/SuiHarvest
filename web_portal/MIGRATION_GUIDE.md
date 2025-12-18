# Web Portal Migration Guide

## What Changed

### ✅ Improvements Made

1. **Component Architecture**
   - Single monolithic HTML → 5 reusable React components
   - Each component manages its own state and styling
   - Easier to maintain, test, and extend

2. **Styling**
   - Inline styles → CSS Modules (scoped styling)
   - Single large CSS block → Organized global variables + component-specific styles
   - Better performance and no class name collisions

3. **Code Organization**
   - 1 HTML file → Multiple TSX files with clear separation of concerns
   - `components/` folder for UI components
   - `styles/` folder for global styling
   - Type-safe with TypeScript

4. **Navigation**
   - Old: Router-based navigation (React Router)
   - New: Simple state-based page switching (lighter, no router needed yet)
   - Same UX, simpler implementation

5. **Game Logic**
   - Encapsulated in Game component
   - Stamina state management with React hooks
   - Clean action handlers

## File Mapping

| Old (HTML) | New (React) |
|-----------|-----------|
| Hero section | Home.tsx (hero-block) |
| Features cards | Home.tsx (block-white) |
| How It Works | Home.tsx (step-grid) |
| FAQ section | Home.tsx (faq-item) |
| Newsletter | Home.tsx (newsletter-content) |
| Wiki page | Wiki.tsx |
| Game page | Game.tsx |
| Contact page | Contact.tsx |
| Navigation | Navigation.tsx |
| All CSS | globals.css + module.css files |

## Installation & Running

### First Time Setup
```bash
cd web_portal
npm install
```

### Development
```bash
npm run dev
```
Open `http://localhost:5173` in your browser

### Production Build
```bash
npm run build
npm run preview  # preview the built version
```

## Key Implementation Details

### Page Routing (No React Router)
```typescript
// In App.tsx
const [currentPage, setCurrentPage] = useState<PageType>('home');

// Switch pages
const handlePageChange = (page: PageType) => {
  setCurrentPage(page);
  window.scrollTo(0, 0);
};

// Render based on state
{currentPage === 'home' && <Home />}
{currentPage === 'wiki' && <Wiki />}
// etc...
```

### Styling Pattern
Each component has a `.module.css` file:
```typescript
// Usage
import styles from './Home.module.css';

<div className={styles.heroContentWrapper}>
  {/* Content */}
</div>
```

### Game State Management
```typescript
const [gameStarted, setGameStarted] = useState(false);
const [stamina, setStamina] = useState(50);

const gameAction = (type: 'chop' | 'mine' | 'farm') => {
  const cost = type === 'chop' ? 6 : type === 'mine' ? 8 : 2;
  if(stamina >= cost) {
    setStamina(stamina - cost);
  }
};
```

## Common Customizations

### Add a New Page

1. Create `src/components/MyPage.tsx`:
```typescript
export function MyPage() {
  return <div className="page-section">Your content here</div>;
}
```

2. Create `src/components/MyPage.module.css`:
```css
.container { /* styles */ }
```

3. Update `src/components/index.ts`:
```typescript
export { MyPage } from './MyPage';
```

4. Update `src/App.tsx`:
```typescript
type PageType = 'home' | 'wiki' | 'game' | 'contact' | 'mypage';

// Add to render:
{currentPage === 'mypage' && <MyPage />}

// Add to Navigation:
<button onClick={() => onPageChange('mypage')}>My Page</button>
```

### Change Colors

Edit `src/styles/globals.css`:
```css
:root {
  --sui-blue: #3E7DFF;  /* Change this */
  --sui-dark: #0F172A;  /* Or this */
  /* etc... */
}
```

### Add Responsive Breakpoints

Add to component `.module.css`:
```css
@media (max-width: 768px) {
  .container { /* mobile styles */ }
}

@media (max-width: 480px) {
  .container { /* small phone styles */ }
}
```

## Performance Notes

- ✅ CSS Modules prevent unused style loading
- ✅ Component code-splitting ready for production
- ✅ Vite HMR for instant development feedback
- ✅ Tree-shaking removes dead code

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (CSS Grid, modern JS syntax)

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run build
```

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### CSS changes not reflecting
- Vite caches CSS modules
- Clear `.vite` folder and restart dev server

### TypeScript errors
```bash
npx tsc --noEmit  # Check all errors
```

## Future Enhancements

1. **Sui Wallet Integration**
   - Add `@mysten/dapp-kit` back to package.json
   - Wrap App with `<SuiClientProvider>`
   - Use `useSignAndExecuteTransaction` hook

2. **State Management**
   - Consider Zustand/Redux for global game state
   - Persisted wallet connections

3. **Testing**
   - Vitest for unit tests
   - React Testing Library for component tests
   - Example: `Game.test.tsx`

4. **Database**
   - Backend API for game state
   - Connect game actions to Sui Move contracts

5. **Animations**
   - Framer Motion for smooth transitions
   - Canvas for game map rendering

---

Your codebase is now modern, maintainable, and ready to scale! 🚀
