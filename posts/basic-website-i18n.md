---
title: 'Basic website i18n'
date: '2024-02-03'
tags: ['dev', 'i18n']
---

I recently developed a little obsession with [adding basic i18n to this
site](https://github.com/dbarnett/mumindme_web/issues/7), to make it a little more nicely ergonomic
for viewing in Spanish as well as English. I started out in search of some simple i18n helpers I
could use, but hit some limitations I didn‘t love and decided to try reinventing the wheel.

I really wanted the one URL https://mumind.me/ to show content in whichever preferred language
in-place, not to send Spanish-speaking users to an alternate `es.mumind.me/` or `mumind.me/es/`, but
all the tools I could find wanted to force this kind of "subdomain" or "sub-path". A lot of popular
websites do work that way, for example Facebook‘s es-la.facebook.com and Wikipedia‘s
es.wikipedia.org to view in (Latin American) Spanish, but some don‘t:

* reddit.com and twitter.com don‘t seem to let me switch languages without signing in, but once I do
  they show my preferred language in-place
* netflix.com immediately redirects me to a subpath like netflix.com/mx/ or /us-es/ if it detects
  I‘m not in their target market (English speaker in the US)
* youtube.com gives me a menu button to switch languages and shows whichever language I pick at the
  same "youtube.com" location
* amazon.com and tiktok.com tack on a little signal at the end of the URL if I switch languages
  (like `?language=es_US` or `?lang=en`)

There are pros and cons to those different approaches, but TikTok or YouTube are closest to the
behavior I wanted here.

Now here‘s what changes it took me to get a passable basic implementation of that:
[dbarnett/mumindme_web@97e598f]

The language picker is still ugly and most of the site isn‘t actually translated yet, but I
definitely enjoyed the learning process of reinventing the wheel and successfully achieved most of
what I wanted it to do:

* Respects your standard preferences
* Lets you pick a different language manually
* Translates in-place, quickly and seamlessly
* Remembers your manual selection as you navigate around
* Tags other languages used in any untranslated parts of pages (per [this
  recommendation](https://stackoverflow.com/a/21246457/307705))

## Tradeoffs

It involved a little complexity getting this to work how I wanted, and I definitely could have done
something simpler that would‘ve been plenty "good enough" for a personal website. Worrying about
things like translations or accessibility at all is kinda weird and probably more trouble than it‘s
worth. Most web browsers can just auto-translate websites nowadays anyway (and might even do a
better job of it than I‘ve done manually), but I wanted explicit translation support and wanted my
**U**niform **R**esource **L**ocators to actually be "uniform" (where each logical page lives at
exactly one address). I‘ve seen enough apps/sites mess this up that I wanted to spend some time
learning about the challenges and approaches.

Besides tiny personal sites, some sites like Wikipedia with lots of user-submitted content would
have a messy time of trying to translate in-place like this. For example, the site knows that
https://en.wikipedia.org/wiki/Peccary and https://es.wikipedia.org/wiki/Tayassuidae are actually
different translations of the same logical webpage, but there‘s no good way they could share one
simple URL representing both.

It can also get messy organizing translated versions of content. There are plenty of good solutions
for managing translations of simple sentences and phrases (like the [`{msg}` command in Closure
Templates](https://github.com/google/closure-templates/blob/master/documentation/reference/messages.md)
that I mostly rely on at work), but for entire pages of prose it‘s not so clear how to chunk the
text down into pieces to be translated, when there are links and structure mixed in with the text.

## Future

I still want to do a bunch of cleanup on the translation handling and polish up the language picker
widget.

Especially where I’m managing the blog post content in Markdown, I need to figure out a decent way
to provide translations for those, or at least to get out of the browser’s way for it to offer its
own auto-translations for untranslated sections of the page.

I was also hoping to upgrade from my own one-off solution to some existing i18n tooling. Or maybe
factor out my own tooling if I can’t find any existing solution that works quite how I want? I did
find one called [Ni18n] (mentioned in
<https://iamsannyrai.medium.com/i18n-in-next-js-without-sub-path-or-domain-routing-2443c1a349c6>)
that looks like it might be pretty close to the functionality I was looking for.

Those and I dumped a [list of various other improvement
ideas](https://github.com/dbarnett/mumindme_web/issues/7#issuecomment-1873059045) to look into
eventually.

[dbarnett/mumindme_web@97e598f]: https://github.com/dbarnett/mumindme_web/commit/97e598f
[Ni18n]: https://jcquintas.gitbook.io/ni18n/
