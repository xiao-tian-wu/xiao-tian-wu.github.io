# Xiaotian Wu — Academic Homepage

A full-screen, horizontal academic homepage for `https://xiao-tian-wu.github.io/`.
It retains the immersive slide structure of the supplied reference while using
an original “research notebook” visual system: an ivory navigation bar, mineral
green and clay accents, asymmetric layouts, section numerals, and restrained
mathematical notation. The site is plain HTML, CSS, and JavaScript, so there is
no framework or build step.

## Publish on GitHub Pages

1. Create a public GitHub repository named `xiao-tian-wu.github.io`.
2. Upload everything in this folder to the repository and push it to `main`.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, select **Deploy from a branch**, then choose
   `main` and `/ (root)`.
5. GitHub Pages will publish the site at
   `https://xiao-tian-wu.github.io/`.

## Content

The publication list was transferred from the public Google Sites academic
profile. Before publishing, place the CV and preprint PDFs in the `files`
folder using the filenames listed in `files/README.md`. The published site will
then serve them directly from GitHub Pages without depending on Google Drive.
The journal article points to its official publisher page, and the first
preprint also includes its arXiv link.

## Editing

- Page content: `index.html`
- Colors, typography, and layout: `styles.css`
- Navigation and keyboard controls: `script.js`
- Backgrounds: three images stored in `images`, with local copies so the
  site does not depend on an image host. Credits and source links are listed in
  `IMAGE-CREDITS.md`.

The layout is responsive and supports horizontal touch gestures, mouse/trackpad
scrolling, arrow keys, reduced-motion preferences, social metadata, robots.txt,
and a sitemap.
