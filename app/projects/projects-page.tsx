'use client';

import Image from 'next/image';
import AppLayout from "@/components/app-layout";

export default function ProjectsPage() {
  return (
    <AppLayout lang="en-US">
      <h1 className="text-3xl font-extrabold my-4">My projects</h1>
      <section>
        <p>
          I like to build things to help people be productive and fulfilled in whatever little ways
          I can. Here are some of my more shareable projects.
        </p>
      </section>
      <section>
        <h2>Recent Projects ⚡</h2>
        <h3>Obsidian FIT - File gIT</h3>
        <p>
          My biggest recent work has been maintaining and improving{' '}
          <a href="https://github.com/joshuakto/fit">FIT (File gIT)</a>, a plugin for the{' '}
          <a href="https://obsidian.md/">Obsidian</a> note-taking app that syncs your vault to GitHub.
          I took over maintenance from the original author and have massively improved it to squash bugs,
          boost performance, and make it much friendlier to use.
        </p>
        <p>
          The plugin now has over <strong>38,000 downloads</strong> and stands out from alternatives with
          excellent mobile sync support on both iOS and Android. It's become an essential tool for
          thousands of Obsidian users who want reliable, Git-based backup and sync.
        </p>
        <p>
          <a href="https://github.com/joshuakto/fit">View on GitHub →</a>
        </p>
        <h3>Spice of Life - Hackathon Game 🎮</h3>
        <p>
          A fun browser-based game I created with a friend during a hackathon. Try it out right here!
        </p>
        <div className="my-4 border-2 border-gray-300 rounded-lg overflow-hidden">
          <iframe
            src="https://dbarnett.github.io/spice-of-life/"
            width="100%"
            height="600"
            title="Spice of Life Game"
            className="border-0"
          />
        </div>
        <p>
          <a href="https://github.com/dbarnett/spice-of-life">View source on GitHub →</a>
        </p>
      </section>
      <section>
        <h2>Vim Development Tools 🛠️</h2>
        <h3>vim-plugin-metadata</h3>
        <p>
          A project I'm particularly proud of that uses{' '}
          <a href="https://tree-sitter.github.io/tree-sitter/">Tree-sitter</a> and its Rust interface
          to parse and analyze VimScript. It provides Python bindings via{' '}
          <a href="https://pyo3.rs/">PyO3</a>, enabling sophisticated static analysis of Vim plugins
          from Python code.
        </p>
        <p>
          This was a fun exploration of the Rust/Python interop ecosystem and tree-sitter's powerful
          parsing capabilities.
        </p>
        <p>
          <a href="https://github.com/dbarnett/vim-plugin-metadata">View on GitHub →</a>
        </p>
        <h3>Vim@Google</h3>
        <div className="flex flex-row flex-wrap gap-x-2">
          <div className="flex-grow basis-1/2">
            <p className="mt-0">
              I built and maintained tools for writing code in the Vim editor at Google,
              helping with things like automatically fixing formatting and invoking build tools.
            </p>
            <p>
              <strong>Note:</strong> These projects are largely unmaintained now, as only Google employees
              can review and accept contributions and they're no longer actively maintaining them.
              However, they're still used by many developers.
            </p>
            <p>
              See projects at <a href="https://github.com/orgs/google/teams/vim/repositories">GitHub
              google vim team</a> and <a
              href="https://github.com/orgs/bazelbuild/teams/vim/repositories">Github bazelbuild vim
              team</a>.
            </p>
          </div>
          <Image
            src="/images/codefmt_screenshot_400.png"
            width={400}
            height={239}
            title="vim-codefmt plugin in action"
            alt="Screenshot of command from vim-codefmt plugin being invoked"
            className="flex-initial" />
        </div>
      </section>
      <section>
        <h2>Past Work 💼</h2>
        <h3>Google</h3>
        <p>
          Through my years at Google I was part of several projects I'm proud of:
        </p>
        <ul className="list-disc ps-10">
          <li>
            Enabled Google products like Search and Photos to be delightfully fast, secure, and
            beautiful in web browsers through next-gen web technologies.
          </li>
          <li>
            <a href="https://support.google.com/families/answer/7103338">Supervised child
            accounts</a> to allow younger users to get what they need from products they use.
          </li>
          <li>
            <a href="https://workspace.google.com/">Google Workspace</a> to help teams collaborate
            together at work.
          </li>
        </ul>
      </section>
      <section>
        <h2>Fun stuff 😄</h2>
        <h3>Coding with kids</h3>
        <p>
          I’m passionate about teaching kids to wield technology and giving them those “aha!” moments.
        </p>
        <h4>In the classroom</h4>
        <p>
          For several years I’ve taught coding enrichments at <a
          href="https://www.discoveryk8.org/">Discovery Charter School’s</a> Falcon Campus using
          code.org and Scratch, giving each child in the class hands-on time with the tools and
          individual guidance.
        </p>
        <h4>Toy projects</h4>
        <p>
          I’ve built some little projects with my kids using Scratch, finding creative ways to deal
          with its limitations and demonstrate programming concepts.
        </p>
        <div className="flex flex-row flex-wrap gap-x-2">
          <p className="flex-grow basis-1/2 mt-0">
            For instance, <a href="https://scratch.mit.edu/projects/368852755">Scratch defly.io
            </a> is a clone of parts of the online game <a href="https://defly.io">defly.io</a> I
            recreated in Scratch as a learning exercise with an elementary schooler.
          </p>
          <Image
            src="/images/Scratch_defly_studio_400.png"
            width={400}
            height={224}
            title="Scratch defly.io in Scratch"
            alt="Screenshot of the &quot;Scratch defly.io&quot; project in Scratch Studio"
            className="flex-initial" />
        </div>
      </section>
      <section>
        <h2>Community 🙌</h2>
        <p>
          GitHub &mdash; See my development activity on <a href="https://github.com/dbarnett">my
          GitHub profile</a>.
        </p>
        <p>
          StackOverflow &mdash; Top 4% overall reputation on the site for my technology questions
          &amp; answers.

          <a href="https://stackexchange.com/users/117511">
            <img
              src="https://stackexchange.com/users/flair/117511.png" width="208" height="58"
              alt="profile for Mu Mind on Stack Exchange, a network of free, community-driven Q&amp;A
          sites"
              title="profile for Mu Mind on Stack Exchange, a network of free, community-driven
          Q&amp;A sites" />
          </a>
        </p>
      </section>
    </AppLayout>
  );
}
