# SVG Tooling

## Source SVGs and the phase expansion pipeline

Illustration SVGs live in `src/svg/` and are built into `public/images/` by `scripts/expand-svg-phases.cjs`. SVGs without `@phase` annotations are copied through unchanged; those with annotations have their `<use>` elements expanded inline.

**The `@phase` annotation** lets a single `<symbol>` definition be instantiated multiple times with different SMIL animation start offsets, so a fleet of brooms each sway at a different point in their cycle:

```xml
<!-- @phase phase=0s -->   <use href="#broom-front" transform="translate(200, 200)"/>
<!-- @phase phase=0.3s --> <use href="#broom-front" transform="translate(275, 210)"/>
```

The build script clones the symbol body for each annotated `<use>`, patches every `begin=` attribute to the specified phase, and recursively expands any nested `<use href="#..."/>` references within symbols (so a `broom-front` symbol that itself uses `broom-besom` gets the phase applied at all levels).

Run it:

```sh
node scripts/expand-svg-phases.cjs            # all src/svg/**/*.svg
node scripts/expand-svg-phases.cjs src/svg/posts/foo.svg  # single file
```

Both generated SVG paths are gitignored; they're rebuilt at deploy time via the `build:svg` script, which runs automatically as part of `prebuild`/`predev`.

## generate-besom.js

`scripts/generate-besom.js` generates the bristle bundle (besom) part of a broom — the forked, cinched bundle of twigs. Outputs an SVG `<g>` to stdout; copy it into a source SVG wrapped in a `<g transform="translate(x,y) rotate(deg) scale(s)">`.

The broom handle, arms, and bucket are hand-authored in the SVG source files using `<symbol>` + `<use>` — `apprentice-1st-enchantment.svg` is the clearest reference for the full broom structure.

## Slide build pipeline

`scripts/build-talks.sh` compiles `talks/ai-testing-secret-sauce.md` (Marp markdown) into a self-contained HTML file at `public/talks/ai-testing-secret-sauce.html` (gitignored, rebuilt at deploy time).

The pipeline:

1. **`scripts/embed-images-markdown.cjs`** — replaces `/images/...` references with base64 data URIs. SVGs in Marp `![bg ...]` directives are converted to inline `<img>` blocks instead (Marp doesn't support `image/svg+xml` data URIs in bg directives), which preserves SMIL animations.
2. **`@marp-team/marp-cli`** — converts the preprocessed markdown to HTML.

```sh
npm run build:talks
```
