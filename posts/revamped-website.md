---
title: 'Revamped personal website'
date: '2023-12-17'
tags: ['dev']
---

I did a little overhaul of my personal website ([code](https://github.com/dbarnett/mumindme_web)),
moving from [Flask] on [Google App Engine] to something that feels a little more modern, running
[Next.js] on [Google Cloud Run]. I have mixed feelings about [React] and some of that tech I’m
running the website on now, feels like overkill for a personal site, but Next.js has really
impressed me with its polish and I haven’t managed to find any simpler alternative that doesn’t
feel clunky.

I’m doing a little blogging here just to test the waters. I keep getting the itch to blog some
thoughts but Blogger (where I used to manage my blog posts) really doesn’t seem to have kept up
with the times either. I actually composed this blog post in Markdown using a setup [like
this](https://nextjs.org/learn-pages-router/basics/data-fetching/blog-data). I think I want to set
up something like [Payload CMS] so it’s easier to write blog posts (without deploying a new version
of the whole site), but I’ll probably still use Markdown files for some of the other site content.

[Flask]: https://palletsprojects.com/p/flask/
[Google App Engine]: https://cloud.google.com/appengine
[Next.js]: https://nextjs.org/
[Google Cloud Run]: https://cloud.google.com/run/docs/overview/what-is-cloud-run
[React]: https://react.dev/
[Payload CMS]: https://payloadcms.com/
