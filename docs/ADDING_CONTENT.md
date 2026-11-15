# Adding content

All pages are plain HTML. Images live in `site/images/`. Use JPEG/WebP, 1280x720 for horizontal thumbnails, ~9:16 for reels.

## 1. Horizontal YouTube card (portfolio.html)
Copy an existing card inside the right `<section id="..." class="cat">` > `<div class="cat-grid">`:

```html
<a class="pv" href="https://youtu.be/VIDEO_ID" target="_blank" rel="noopener">
  <div class="pv-t" style="background-image:url(images/NEW-THUMB.jpg)">
    <span class="pv-yt">Watch on YouTube</span>
  </div>
  <div class="pv-name"><b>Project name</b><i>Category</i></div>
</a>
```
(An existing card such as Fairfield by Marriott Vadodara shows the exact markup, including the small YouTube icon. Duplicate it and change the link, image and name.)

## 2. Vertical Instagram reel card
Sections with `class="cat vert"` (Real Estate Ads, Spa Cinematic Shoots, AI Content) use phone-frame tiles. Duplicate an existing card in that section and change the `href`, the thumbnail image and the name. Instagram thumbnails cannot be fetched automatically: take a screenshot of the reel cover and save it in `images/`.

## 3. Empty categories
Wedding Drone Shoots and AI Content currently have no videos, so their sections are not on the live site. To bring one back, add a section after Real Estate Cinematic Walk-through:

```html
<section id="wedding-drone" class="cat">
  <div class="cat-head"><span class="cat-n">08</span><h2>Wedding Drone Shoots</h2></div>
  <div class="cat-grid"> ...cards... </div>
</section>
```
and add `<a class="chip" href="#wedding-drone">Wedding Drone Shoots</a>` to the chip row at the top. AI Content uses `class="cat vert"`.

## 4. Photography
Drone Photography and Photography use `<div class="pv"><div class="pv-t dA" role="img" aria-label="..."></div></div>` tiles. Duplicate a tile and give it an inline `style="background-image:url(images/NEW.jpg)"` (or add a CSS class), and write a meaningful `aria-label`.
The Home page "High-quality photography" strip (6 slots) is hidden until six photos are supplied.

## 5. Showreel
Home page showreel YouTube ID is `C2CJpW53Ucw` (in the `REEL` script near the bottom of index.html and the two links).
