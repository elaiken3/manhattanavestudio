# /public/fonts/

Drop the following WOFF2 files here from the foundry packages you already own.
After they're in place, commit and deploy. The CSS already references them.

## From PP Editorial New (Pangram Pangram)
Look inside the package's `/Web` or `/Webfonts` subfolder.

- PPEditorialNew-Regular.woff2
- PPEditorialNew-Italic.woff2
- PPEditorialNew-Bold.woff2
- PPEditorialNew-BoldItalic.woff2
- PPEditorialNew-Heavy.woff2
- PPEditorialNew-HeavyItalic.woff2

## From Satoshi_Complete (Fontshare)
Prefer the variable file. It covers weights 300–900 in a single file.

- Satoshi-Variable.woff2
- Satoshi-VariableItalic.woff2

(If the variable file isn't present, use Satoshi-Regular.woff2 / Medium / Bold
+ italics instead and update styles/mas.css `@font-face` blocks accordingly.)

## Notes

- Filenames must match exactly: the @font-face rules in `styles/mas.css` use these paths.
- These are cached for 1 year as immutable via the `/public/fonts/*` rule in
  `vercel.json`, so a replacement font needs a new filename to reach browsers.
- Don't add a `.gitignore` here. The fonts are committed so deploys ship them.
