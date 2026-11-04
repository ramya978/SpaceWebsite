# SPACE 1 website

A static website. No build step and no framework: open `index.html` in a browser, or upload the whole folder to any web host.

## Folder map

```
index.html ... contact.html   One HTML file per menu item (11 pages)
css/
  theme.css        All colours, fonts, sizes, spacing and animation timings. Start here.
  base.css         Reset and default text styles
  layout.css       Header, full-screen menu, hero, sections, footer
  components.css   Buttons, cards, tiles, tabs, forms and other reusable blocks
  animations.css   Scroll reveals, hero intro, page transition
js/
  site-config.js   Menu items, contact details, footer text (edit here)
  layout.js        Builds the header, menu and footer on every page
  components.js    Tabs, course explorer, forms, glossary search
  animations.js    Scroll reveals, parallax, star field, tilt, counters
images/
  home/ about/ learning-academy/ innovation-research/ experience-centre/
  future-industries/ partnerships/ events-community/ join/ knowledge-hub/ contact/
```

## Common changes

- **Change colours or fonts:** edit the variables at the top of `css/theme.css`.
- **Add, rename or reorder a menu item:** edit `pages` in `js/site-config.js`.
- **Change contact details:** edit `contact` in `js/site-config.js`.
- **Replace an image:** save the new photo over the file with the same name in that page's folder (1920 x 1080 JPG works well).
- **Turn off an animation:** delete its numbered block in `js/animations.js`, or change the timings in `css/theme.css`.
- **Edit page text:** each page is plain HTML. Every section has an `id` such as `about-founder`, and the "On this page" list at the top of each page links to those ids.

## Notes

- The Join and Contact forms show a message but do not send anything yet. Connect them to your email or CRM inside the submit handler in `js/components.js`.
- Images are rendered illustrations, not photographs. Replace them with licensed or agency photography before launch where realism matters.
- Fonts load from Google Fonts. To host fonts yourself, replace the `@import` line in `theme.css`.
- Course certificates are described as SPACE 1's own. Do not add claims of accreditation or credit from other institutions until formally agreed.
