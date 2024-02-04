---
title: 'Markdown Tailwind struggles'
date: '2023-12-25'
tags: ['dev']
---

I spent a little time hooking up [Tailwind] to the site and cleaning up some of the boilerplate
styles I copy-pasted (code: [dbarnett/mumindme_web@2fec823]). I can’t argue that the utility classes
are way simpler and less hassle than some of the awkward styles I copy-pasted. For example, instead
of having in one layout.jsx file

```jsx
import styles from './layout.module.css';

… <div className={styles.backToHome}> …
```

and in another layout.module.css file

```css
.backToHome {
  margin: 3rem 0 0;
}
```

it’s _dramatically_ easier and more intuitive to just write in the one file

```jsx
… <div className="mt-12"> …
```

([meaning](https://tailwindcss.com/docs/margin) "margin top: size 12", where size 12 defaults to a
literal size of `3rem`).

Their [utility-first philosophy](https://tailwindcss.com/docs/utility-first) felt really backwards
to me at first but eventually grew on me.

**BUT** then I run into this stupid exercise in reinventing the wheel: I’m writing this blog post
content in Markdown, which renders to simple unstyled HTML tags like `<h1>`, `<li>`, etc. Kinda the
whole idea of markup was we used to say "this is a level 1 heading, list item, etc" and then "on
this site, this is how headings, list items, etc should look". But no, Tailwind insists there should
be no overarching idea of how things should look, each individual thing should encapuslate its own
look... 🙄

In fact, as soon as you hook up Tailwind it activates this ["preflight" thing] to specifically clear
out any idea the browser might have had about how these things should look. Now whatever the bits of
content may _mean_, they all just look like plain ’ol text:
![Screenshot of boring unstyled headings and list items](/images/posts/boring_unstyled_content_500.png)

Alright, fine, let’s not have a global "way a list item should look", but when I inject some
completely unstyled blog post content into the blog post page on my site can I at least give that
container page some idea how those kinds of content should look, maybe even passing down some kind
of broader context about how the surrounding site looks instead of having the `Post` component
single-handedly own the job of teaching content how to look from first principles?
![Composing rendered blog post from content and
styles](/images/posts/composing_content_and_styles.svg)

Now I’m on some silly quest to find solutions to both of those problems:

1. How do I re-introduce some generalized notion of how content should look and
2. How do I teach the stuff converting Markdown into my site content how to apply that desired
   representation onto the raw content when displaying it?

A lot of the info I’m finding so far involves a thing called "MDX", doubling down on this philosophy
that this idea of "raw content" simply should not exist, and that instead all rich text content must
embed its own hard-coded prescriptions about how each bit of it should look.  Like… seriously, each
blog post should prescribe how it should look on different size screens, in dark mode, what color
each individual hyperlink should be highlighted, all of that?

For now I’ve just gone rogue and set up some simple [global styles]. I’ll noodle on this a while and
see what else I come up with… 🤓

[Tailwind]: https://tailwindcss.com
[dbarnett/mumindme_web@2fec823]: https://github.com/dbarnett/mumindme_web/commit/2fec823
["preflight" thing]: https://tailwindcss.com/docs/preflight
[global styles]: https://github.com/dbarnett/mumindme_web/blob/2624cde/styles/global.css
