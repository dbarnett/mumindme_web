import Image from 'next/image';
import Layout from "@/components/layout";

export const metadata = {
  title: 'My projects',
};

export default function Projects() {
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold my-4">My projects</h1>
      <section>
        <p>
          I like to build things to help people be productive and fulfilled in whatever little ways
          I can.  Here are some of my more shareable projects.
        </p>
      </section>
      <section>
        <h2>Work projects 💼</h2>
        <h3>Google products</h3>
        <p>
          Through my years working at Google I've been part of a few different projects I'm proud
          of:
        </p>
        <ul className="list-disc ps-10">
          <li>
            Enable Google products like Search and Photos to be delightfully fast, secure, and
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
        <h3>Vim@Google</h3>
        <div className="flex flex-row flex-wrap gap-x-2">
          <div className="flex-grow basis-1/2">
            <p className="mt-0">
              I've built/maintained some tools for writing code in the vim editor,
              to help with things like automatically fixing formatting and invoking
              build tools.
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
    </Layout>
  );
}
