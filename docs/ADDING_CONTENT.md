# Adding Content to Focus Cinema Website

All pages are high-performance static HTML using modern `<picture>` elements with AVIF and WebP optimization.

---

## 1. Fast Method: Edit `site/data/portfolio.json`
Every live portfolio card and photo tile is indexed in [`site/data/portfolio.json`](file:///Users/faezankhan/Documents/Focus Cinema Website/site/data/portfolio.json).
Whenever you add a new project, add an entry to the corresponding category in `site/data/portfolio.json`:

```json
{
  "title": "Project Name",
  "category": "Real estate",
  "platform": "youtube",
  "videoId": "NEW_VIDEO_ID",
  "url": "https://youtu.be/NEW_VIDEO_ID",
  "image": "images/new-project.jpg",
  "alt": "Descriptive alt text for the project"
}
```

Then run the asset validator to verify JPEG, WebP, and AVIF availability:
```bash
python3 tools/build-portfolio.py
```

---

## 2. Horizontal YouTube Cards (`portfolio.html` & `index.html`)
To add a new horizontal video card directly to `portfolio.html`, duplicate an existing card inside `<div class="cat-grid">`:

```html
<a class="pv" href="https://youtu.be/VIDEO_ID" target="_blank" rel="noopener noreferrer" aria-label="Project Name — Watch on YouTube (opens in a new tab)">
  <div class="pv-t">
    <picture style="position:absolute;inset:0;width:100%;height:100%">
      <source srcset="images/your-thumb.avif" type="image/avif">
      <source srcset="images/your-thumb.webp" type="image/webp">
      <img src="images/your-thumb.jpg" alt="Project Name by Focus Cinema" width="1600" height="900" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block">
    </picture>
    <span class="pv-yt">
      <svg width="18" height="13" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" rx="4" fill="#FFFFFF"></rect><path d="M8 4l5 3-5 3z" fill="#D90000"></path></svg>
      Watch on YouTube
    </span>
  </div>
  <div class="pv-name"><b>Project Name</b><i>Category</i></div>
</a>
```

---

## 3. Vertical Instagram Reel Cards (`portfolio.html`)
Sections with `class="cat vert"` (Real Estate Ads, Spa Cinematic Shoots) use 9:16 phone-frame mockups. Add a card like this:

```html
<a class="pv" href="https://www.instagram.com/reel/REEL_ID/" target="_blank" rel="noopener noreferrer" aria-label="Project Name — Watch on Instagram (opens in a new tab)">
  <div class="pv-t">
    <picture style="position:absolute;inset:0;width:100%;height:100%">
      <source srcset="images/reel-cover.avif" type="image/avif">
      <source srcset="images/reel-cover.webp" type="image/webp">
      <img src="images/reel-cover.jpg" alt="Project Name Reel by Focus Cinema" width="800" height="1350" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block">
    </picture>
    <span class="pv-yt">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="1" fill="#FFFFFF" stroke="none"></circle></svg>
      Watch on Instagram
    </span>
  </div>
  <div class="pv-name"><b>Project Name</b><i>Reel</i></div>
</a>
```

---

## 4. Photography & Drone Stills
Add a photo tile inside the photo category grid:

```html
<div class="pv">
  <div class="pv-t">
    <picture style="position:absolute;inset:0;width:100%;height:100%">
      <source srcset="images/new-photo.avif" type="image/avif">
      <source srcset="images/new-photo.webp" type="image/webp">
      <img src="images/new-photo.jpg" alt="Clear descriptive text of the scene" width="1600" height="1000" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block">
    </picture>
  </div>
</div>
```

---

## 5. Converting New Images to WebP & AVIF
Place your original high-resolution `.jpg` into `site/images/`, then run the conversion one-liner:
```bash
python3 -c "
from PIL import Image; import subprocess, sys
p = 'site/images/YOUR_IMAGE.jpg'
Image.open(p).save(p.replace('.jpg', '.webp'), 'WEBP', quality=84, method=6)
subprocess.run(['sips', '-s', 'format', 'avif', p, '--out', p.replace('.jpg', '.avif')])
"
```
