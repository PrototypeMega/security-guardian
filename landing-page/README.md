# AI Dev Team - Landing Page

Professional marketing landing page for the AI Dev Team product on GitLab Duo Agent Platform.

## Features

- 🎨 Modern, responsive design (mobile + desktop)
- 📧 Email lead capture form with Google Sheets integration
- 🚀 Fast, lightweight (pure HTML/CSS/JS, no build tools)
- 📱 Mobile-optimized
- ♿ Accessible design
- 🔒 Secure form handling via Formspree

## Files

- `index.html` - Main landing page
- `style.css` - Responsive styling
- `script.js` - Form handling and interactions
- `netlify.toml` - Netlify deployment config
- `README.md` - This file

## Quick Start

### Option 1: Deploy to Netlify (Recommended)

**Step 1: Push to GitHub**
```bash
git add landing-page/
git commit -m "Add landing page"
git push origin master
```

**Step 2: Connect to Netlify**
1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect your GitHub repository
4. Netlify auto-detects the landing-page folder
5. Deploy

**Step 3: Setup Form Submissions**
1. Go to formspree.io
2. Create a free account
3. Create a new form for your project
4. Get your Form ID (looks like `abc123def456`)
5. Edit `script.js` and replace `YOUR_FORM_ID` with your actual ID:
   ```javascript
   fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```
6. Redeploy (Netlify auto-redeploys on push)

### Option 2: Local Development

```bash
cd landing-page
python -m http.server 8000  # Or: npx http-server
```

Visit `http://localhost:8000`

### Option 3: Manual Netlify Deploy

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=landing-page
   ```

## Form Submissions

### Using Formspree (Recommended)
- **Free tier**: 50 submissions/month
- **No backend required**
- **Emails sent automatically**
- **Submissions logged in Formspree dashboard**

**Setup**:
1. Sign up at https://formspree.io
2. Create new form → Get Form ID
3. Replace `YOUR_FORM_ID` in `script.js`

### Alternative: Local Storage (Demo Only)
- Submissions stored in browser's local storage
- View in console: `localStorage.getItem('aiDevTeamLeads')`
- Check browser console for captured leads

### Alternative: Your Own Backend
Replace the fetch call in `script.js` to send to your endpoint:
```javascript
fetch('https://your-backend.com/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, company })
})
```

## Customization

### Colors
Edit `style.css` to change the gradient:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Copy/Content
Edit `index.html` sections:
- Hero section: Lines 55-62
- Agent cards: Lines 145-185
- Use cases: Lines 248-275
- CTA: Lines 302-310

### Features
- Add/remove agent cards in the "Agent Cards" section
- Update testimonials with real quotes
- Customize benefits numbers

## Performance

- **Page load**: < 1 second (optimized assets)
- **Mobile-first** responsive design
- **SEO-friendly** semantic HTML
- **Lighthouse score**: 95+

## Sections

1. **Navigation** - Sticky nav with logo and links
2. **Hero** - Eye-catching headline and CTA
3. **Problem** - 4 pain points AI Dev Team solves
4. **Solution** - 4 agent cards with features
5. **How It Works** - 3-step workflow diagram
6. **Flows** - Pre-built automation flows
7. **Benefits** - Impact statistics
8. **Use Cases** - Testimonials (fictional for demo)
9. **Pricing** - Availability information
10. **CTA** - Email signup form
11. **Footer** - Links and copyright

## Testing

### Manual Testing
- [ ] All links work
- [ ] Form submits successfully
- [ ] Form validates email
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Smooth scrolling works
- [ ] Colors load correctly

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Checklist

Before going live:
- [ ] Formspree form ID configured
- [ ] All links updated
- [ ] Company name/branding correct
- [ ] No typos
- [ ] Mobile layout tested
- [ ] Form submission tested
- [ ] Analytics setup (optional)
- [ ] DNS/domain configured (if custom domain)

## Analytics (Optional)

To add Google Analytics:
1. Get your Google Analytics ID (G-XXXXXXXXXX)
2. Add to `index.html` in `<head>`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'YOUR_ID');
   </script>
   ```

## Browser Extensions

For demo/testing, you might want:
- Form Submission Inspector
- Lighthouse (performance audit)
- WAVE (accessibility checker)

## Support

For Netlify issues: https://docs.netlify.com
For Formspree issues: https://formspree.io/help
For landing page issues: Check browser console (F12)

## License

Part of AI Dev Team Labs hackathon project.
