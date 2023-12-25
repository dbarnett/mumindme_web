import Head from 'next/head';
import Image from 'next/image';
import Layout from "../components/layout";

export default function Projects() {
    return (
        <Layout>
            <Head>
                <title>My projects</title>
            </Head>
            <h1 className="text-3xl font-extrabold my-4">My projects</h1>
            <section>
                <p>
                    I like to build things to help people be productive and fulfilled in
                    whatever little ways I can.  Here are some of my more shareable
                    projects.
                </p>
            </section>
            <section>
                <h2>Work projects</h2>
                <h3>Google products</h3>
                <p>
                    Through my years working at Google I've been part of a few different
                    projects I'm proud of:
                </p>
                <ul className="list-disc ps-10">
                    <li>
                        Enable Google products like Search and Photos to be delightfully fast,
                        secure, and beautiful in web browsers through next-gen web
                        technologies.
                    </li>
                    <li>
                        <a
                            href="https://support.google.com/families/answer/7103338" target="_blank">Supervised
                            child accounts</a> to allow younger users to get what they need from
                        products they use.
                    </li>
                    <li>
                        <a href="https://workspace.google.com/" target="_blank">Google
                            Workspace</a> to help teams collaborate together at work.
                    </li>
                </ul>
                <h3>Vim@Google</h3>
                <div>
                    <div style={{ float: 'right' }}>
                        <Image
                            src="/images/codefmt_screenshot_400.png"
                            width={400}
                            height={239}
                            title="vim-codefmt plugin in action"
                            alt="Screenshot of command from vim-codefmt plugin being invoked" />
                    </div>
                    <p>
                        I've built/maintained some tools for writing code in the vim editor,
                        to help with things like automatically fixing formatting and invoking
                        build tools.
                    </p>
                    <p>
                        See projects at <a href="https://github.com/orgs/google/teams/vim/repositories"
                            target="_blank">GitHub google vim team</a> and <a href="https://github.com/orgs/bazelbuild/teams/vim/repositories"
                                target="_blank">Github bazelbuild vim team</a>.
                    </p>
                    <div style={{ clear: 'both' }}></div>
                </div>
            </section>
            <section>
                <h2>Fun stuff</h2>
                <h3>Coding with kids</h3>
                <p>
                    I’m passionate about teaching kids to wield technology and giving them those “aha!” moments.
                </p>
                <h4>In the classroom</h4>
                <p>
                    For several years I’ve taught coding enrichments at <a href="https://www.discoveryk8.org/"
                        target="_blank">Discovery Charter School’s</a> Falcon Campus using code.org and Scratch,
                    giving each child in the class hands-on time with the tools and individual guidance.
                </p>
                <h4>Toy projects</h4>
                <p>
                    I’ve built some little projects with my kids using Scratch, finding
                    creative ways to deal with its limitations and demonstrate programming
                    concepts.
                </p>
                <div class="proj-hil-list">
                    <div class="proj-hil-sec">
                        <div>
                            <h5>Scratch defly.io</h5>
                            <p>
                                Parts of the online game <a href="https://defly.io" target="_blank">defly.io</a> recreated in Scratch,
                                built as a learning exercise with elementary schooler PichuIgglypuff.
                            </p>
                        </div>
                        <a class="proj-hil-img"
                            href="https://scratch.mit.edu/projects/368852755" target="_blank">
                            {/* <img src="{{ url_for('static', filename='img/Scratch_defly_studio_400.png') }}"
                                    width="400" height="224"
                                    title="Scratch defly.io in Scratch"
                                    alt="Screenshot of the &quot;Scratch defly.io&quot; project in Scratch Studio"> */}
                        </a>
                    </div>
                    <div class="proj-hil-sec">
                        <div>
                            <h5>Scratch "Zedla"</h5>
                            An intro to a game with goofy-named characters totally not ripped off from
                            "Zelda: Breath of the Wild", created by PichuIgglypuff with my coding help
                            throughout (particularly on getting the health hearts to work).
                        </div>
                        <a class="proj-hil-img"
                            href="https://scratch.mit.edu/projects/294687172" target="_blank">
                            {/* <img src="{{ url_for('static', filename='img/zedla_bookooblins_300.png') }}"
                                    width="300" height="243"
                                    title="De Legend o Zedla gameplay"
                                    alt="Screenshot of computer game with pixellated character in elvish cap and clothing standing in a field next to goblin-like characters"> */}
                        </a>
                    </div>
                </div>
            </section>
            <section>
                <h2>Community</h2>
                <ul className="list-disc ps-10">
                    <li>GitHub &mdash; See my development activity on <a href="https://github.com/dbarnett" target="_blank">my GitHub profile</a>.</li>
                    <li>StackOverflow &mdash; <a href="https://stackoverflow.com/users/307705/mu-mind?tab=profile"
                        target="_blank">Top 4% overall reputation</a> on the site for my technology questions &amp; answers.</li>
                </ul>
            </section>
        </Layout>
    )
}
