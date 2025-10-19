# ⚡ Quick Start Guide

Get your enhanced portfolio running in 5 minutes!

## 🚀 Express Setup (2 Steps)

### Step 1: Switch to Enhanced Version
```bash
mv main.js main-old.js
mv main-new.js main.js
```

### Step 2: Start Development Server
```bash
npm run dev
```

That's it! Visit http://localhost:5173

## ✅ What to Test First

Open your browser and try:

1. **Click the theme toggle** (right side) - switches light/dark mode
2. **Click "Projects"** in navigation - shows 30 projects with filters
3. **Click "About Me"** - displays your bio with smooth camera transition
4. **Click "Get In Touch"** - opens contact form
5. **Scroll down** - see progress bar at top, back-to-top button appears
6. **Hover over elements** - enjoy smooth animations

## 🎨 Quick Customization

### Replace Placeholder Projects
Edit `/src/data/projects.js`:
```javascript
{
  id: 5,  // Change from placeholder
  title: "Your Real Project",
  description: "Your description",
  image: "/path/to/your/screenshot.jpg",
  url: "https://your-project.com",
  github: "https://github.com/you/repo",
  techStack: ["React", "Node.js"],
  category: "Full Stack",
  featured: true,
}
```

### Change Colors
Edit `style.css` `:root` section:
```css
--accent-color: #667eea;      /* Your primary color */
--secondary-accent: #764ba2;  /* Your secondary color */
```

### Update About Section
Edit `index.html` - find `.section--about` and update your bio.

## 🐛 Quick Fixes

### Issue: "Cannot find module"
```bash
# Make sure all files exist
ls -la src/core/
ls -la src/components/
ls -la src/data/
```

### Issue: Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Styles broken
- Clear browser cache: Ctrl+Shift+R
- Verify style.css has ~2000 lines: `wc -l style.css`

## 📦 Build for Production

```bash
npm run build
npm run preview  # Test production build
```

## 🚢 Deploy Now

### Vercel (Fastest)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
1. Build: `npm run build`
2. Drag `dist/` folder to netlify.com

## 📚 Need More Help?

- **Full Guide**: Read `UPGRADE_INSTRUCTIONS.md`
- **Documentation**: See `README-ENHANCED.md`
- **Summary**: Check `ENHANCEMENT_SUMMARY.md`

## 🎯 Quick Checklist

Before deploying:
- [ ] Replaced placeholder projects with real ones
- [ ] Updated colors if desired
- [ ] Tested on mobile and desktop
- [ ] Verified all links work
- [ ] No console errors
- [ ] Build succeeds

## 🎉 You're Ready!

Your enhanced portfolio includes:
- ✅ 30 projects with filtering
- ✅ Light/Dark theme
- ✅ Contact form
- ✅ Smooth animations
- ✅ Mobile optimized
- ✅ SEO ready

**Time to impress recruiters! 🚀**
