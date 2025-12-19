# Assets & Configuration Guide

## Image Assets Needed

### Hero Image
**Path:** `public/image_0.png`
**Size:** Recommend 500x500px or 600x400px
**Format:** PNG (transparent background recommended)
**Content:** Pixel art farmer character

### Favicon (optional)
**Path:** `public/favicon.ico` or `public/vite.svg`
**Size:** 32x32px

### Social Media Logos (if needed)
For partner section in marquee or footer:
- Sui Network logo
- Van Lang University logo
- OtterSec logo
- Suiet Wallet logo

## Configuration Files

### vite.config.ts
Already configured with:
- React plugin for JSX
- TypeScript support
- Build optimizations

No changes needed unless you want custom ports or asset handling.

### tsconfig.json
Settings:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",  // JSX support
    "strict": true,      // Strict type checking
    "esModuleInterop": true,
    "moduleResolution": "bundler"
  }
}
```

### package.json
**Important Dependencies:**
- `react` - UI framework
- `react-dom` - React DOM rendering
- `vite` - Build tool
- `typescript` - Type system

**Optional (for future features):**
- `@mysten/dapp-kit` - Sui wallet integration
- `@mysten/sui.js` - Sui SDK
- `react-router-dom` - Advanced routing (currently not used)
- `@tanstack/react-query` - Data fetching
- `framer-motion` - Animations
- `zustand` - State management

## Environment Variables

Create a `.env` file in the root (next to package.json):

```env
# For Sui Blockchain (optional, add when implementing blockchain features)
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# For backend API
VITE_API_BASE_URL=http://localhost:3000

# For analytics (optional)
VITE_GTAG_ID=
```

To use in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Build Configuration Details

### CSS Processing
- Vite automatically processes CSS
- CSS Modules get unique class names in production
- PostCSS support for future plugins (autoprefixer, etc.)

### Asset Handling
Images and static files in `public/` are served as-is:
```typescript
<img src="/image_0.png" alt="Hero" />
```

### Optimization
The production build:
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Splits code for better caching
- Creates source maps for debugging

## Customization Examples

### Change App Title
Edit `index.html`:
```html
<title>My SuiHarvest Portal</title>
```

### Change Base URL (for subdirectory deployment)
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/suiharvest/',  // if deployed to example.com/suiharvest
  // ...
})
```

### Add Google Fonts
Already imported in `App.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Press+Start+2P&display=swap');
```

To add more:
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
```

### Custom Font Files
Place in `public/fonts/` and reference:
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
}
```

## Deployment

### Vercel (Recommended for Frontend)
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
Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/SuiHarvest/',  // Your repo name
})
```

Then in package.json:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### Docker (for backend integration later)
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## Performance Checklist

- ✅ CSS Modules prevent style duplication
- ✅ Tree-shaking removes unused code
- ✅ Image assets in `/public`
- ⚠️ TODO: Add image optimization (once assets added)
- ⚠️ TODO: Consider lazy loading for game component
- ⚠️ TODO: Add Service Worker for offline support

## Security

### HTML Head
Already in `index.html`:
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Content Security Policy (optional)
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

### API Security
When integrating backend:
- Use HTTPS only
- Implement CORS properly
- Validate all user inputs
- Use secure tokens for authentication

## Testing Setup (Optional)

### Install Vitest
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Example test (components/__tests__/Navigation.test.tsx)
```typescript
import { render, screen } from '@testing-library/react';
import { Navigation } from '../Navigation';

describe('Navigation', () => {
  it('renders navigation buttons', () => {
    render(<Navigation currentPage="home" onPageChange={() => {}} 
            walletConnected={false} onWalletConnect={() => {}} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
```

## Monitoring & Analytics (Optional)

### Google Analytics
```typescript
// In main.tsx
import { useEffect } from 'react';

useEffect(() => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GTAG_ID}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GTAG_ID);
}, []);
```

---

Your web portal is ready for deployment and future enhancements! 📦
