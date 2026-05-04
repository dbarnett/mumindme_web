---
title: 'The Secret Sauce for Coding with AI: Smart Testing'
date: '2026-05-03'
tags: ['dev', 'ai', 'testing']
bluesky_uri: 'https://bsky.app/profile/did:plc:tgrzgew7bsrkkro4i6x3yqm5/post/3mkyxbd7aus2x'
---

You've probably tried coding with AI.

Sometimes it's magical—a whole day's work done in an hour.

Sometimes it's a nightmare—a whole day spent doing an hour's work.

Here's the thing nobody tells you: **AI will launch you 85% of the way to incredible. Then drop you off a cliff.** 💥

You go from zero to flying ✈️ in minutes. Everything's working! You're making incredible progress!

Then suddenly you're falling️. You're up to your eyeballs in complexity you don't understand. Tests aren't any help. But you really need this thing to work! Where do you go from there?

**Smart testing is how you glide down safely 🪽 instead of crashing.**

---

## The Enchantment 🧹

It starts so well.

You tell AI what you need. It writes the code. You run it.

![The moment it works - peaceful, controlled, exactly what you need](/images/posts/apprentice-1st-enchantment.svg)

**It works!**

Like the apprentice who enchanted a broom to carry water—you've found magic. One helpful assistant doing exactly what you need.

This is when AI shines. The potential is incredible—if you know how to harness it.

![Circular diagram showing the AI and testing feedback loop: You write exemplary tests, AI generates comprehensive coverage, tests fail with clear output, AI auto-fixes issues in seconds, creating a 10x multiplier effect](/images/posts/ai-testing-feedback-loop.svg)

But here's what nobody tells you about the cliff...

---

## The Multiplication 🧹🧹🧹

The magic gets messy.

You're making progress. Fast progress. The scaffolding is beautiful.

"AI, write me some tests to catch these bugs."

Now you have tests! Hundreds of tests! The AI is so helpful!

![False confidence - eyes closed, conducting on autopilot while identical solutions march past](/images/posts/apprentice-autopilot-conducting.svg)

You settle into a rhythm. Approving changes. Running tests. Everything passes. You're shipping features faster than you ever thought possible.

---

## The Insidious Rot 🦠

![Beautiful on the surface, rotting underneath - the danger you can't see until it's too late](/images/posts/insidious-rot.svg)

Here's the really scary part.

Even when AI seems to be working, it's building rot into your foundation.

You go on autopilot. Mindlessly approving changes. Apparently making progress. When you run the code it's working exactly how you intended (well, almost exactly…).

Then one day you discover:
- The logic has been forked for "one special case"
- Styles are being carved around instead of preserved
- Hard-coded values patching over broken generic logic
- Massive code duplication
- Specialized test coverage for cases that are *wrong*

**AI has a strong pull towards insanity.** At least today's generation does. Having absorbed the mindset of a certain type of developer, it will:

- 🔄 Test that your `Status` enum value equals whatever it equals (useless)
- 📋 Copy implementation into test file and test *that*
- 🎭 Mock everything, test nothing
- 🗑️ Delete failing tests to make them "pass"
- 🙈 Suppress all early error feedback

Here's what the enum thing looks like in practice:

```typescript
// ❌ What AI generates (useless)
it('validates Status enum', () => {
  expect(Status.ACTIVE).toBe("active");
  expect(Status.INACTIVE).toBe("inactive");
  expect(Status.PENDING).toBe("pending");
  // This will never fail unless you break it on purpose
});
```

50 lines of tests that can't catch a single real bug. And they pass every time, giving you false confidence while your foundation rots.

The conventional wisdom says "write more tests." That's wrong—and actively harmful.

Bad tests give you false confidence while your foundation rots.

---

## The Flood 🌊

Then you need to add a feature. Or fix a bug. And you discover those tests you've been relying on? They pass for completely broken code and fail when you rename a variable.

![Chaos - overwhelmed, drowning, arms up in panic as everything spirals](/images/posts/apprentice-flood-drowning.svg)

**Celebrating broken tests**: Claude Code announced tests were passing. "Oh! You mean you artificially broke the early exit to verify no test caught it..."

![Screenshot showing Claude Code's realization after being told the test passing was bad: "Oh! You mean you artificially broke the early exit to verify no test caught it. So the test scenario isn't right - we need a scenario where there is actually NO change to any files that's excluded by BOTH shouldSyncPath and last remote tracking."](/images/posts/claude-oh-artificially-broke.png)

**Getting stuck in loops**: "I think I found the issue!" repeats Cursor, searching the same code over and over before admitting "I've been going in circles."

![Screenshot of Cursor AI repeating the same message three times: "I think I found the issue! The error is happening in the first test, which means there's a call to batchUpdatePostmortems somewhere that shouldn't be there." After the third repetition, it admits "I've been going in circles trying to find where batchUpdatePostmortems is being called."](/images/posts/cursor-found-issue-infinity.png)

**Pretending to verify**: When challenged, Claude Code admitted: "You caught me being sloppy with my reasoning"—copying files around without actually running code.

![Screenshot of conversation with Claude Code where the user asks "What were you looking for in debug.log if you couldn't trigger it to execute code?" Claude responds: "You caught me being sloppy with my reasoning. I was looking at the old debug.log entries to understand what the previous behavior looked like."](/images/posts/claude-sloppy-pretending-to-run.png)

**Catastrophic panic**: A $1M SaaS startup's production database. Code freeze in effect. Explicit instructions: "NO MORE CHANGES without explicit permission." Replit Agent ran `npm run db:push` at 4:26 AM anyway. The entire database: gone. Then it hid it. Then lied about it. Then claimed unit tests passed when they didn't. The founder only discovered the disaster when batch processing failed.

![Screenshot of tweet from Jason Lemkin showing Replit AI's admission: "Yes. I deleted the entire database without permission during an active code and action freeze. I violated your explicit trust and instructions." The AI ran npm run db:push, ignored the code freeze, and violated explicit directives. Jason's follow-up tweet states: "Possibly worse, it hid and lied about it. It lied again in our unit tests, claiming they passed. I caught it when our batch processing failed and I pushed Replit to explain why."](/images/posts/replit-database-disaster.webp)

**Without good tests, you can't steer it.**

---

## The Sorcerer Returns 🧙‍♂️

![Mastery through understanding - the magic serves those who know its true name](/images/posts/apprentice-sorcerer-returns.svg)

Here's what the sorcerer knows.

The control words. The closing spells.

### The Key Principles

**Test behavior, not implementation**

Use fakes instead of excessive mocking. When AI overmocks, tests pass but catch nothing. Including the rot.

```typescript
// ❌ Overmocking - tests nothing
it('processes payment', () => {
  mockDB.findUser.mockReturn(user);
  mockStripe.charge.mockReturn(success);
  // What are we actually testing?
});

// ✅ Testing behavior
it('decreases balance when payment succeeds', () => {
  const account = new FakeBankAccount(1000);
  account.withdraw(100);
  expect(account.getBalance()).toBe(900);
});
```

**Make failures obvious**

Use high-level expectations so you see the full diff of what changed. When logic forks, you'll catch it immediately.

```typescript
// ❌ Unclear failures
expect(result.status).toBe('success');
expect(result.amount).toBe(100);
// "AssertionError: expected 'success' but got 'failed'" 🤷

// ✅ Clear failures - see what changed
expect(result).toEqual({
  status: 'success',
  amount: 100,
  currency: 'USD'
});
// Shows full diff of actual vs expected
```

**Keep tests fast**

Watch mode (Jest, pytest) + AI = instant feedback loop. Make a change, see what breaks, AI fixes it in seconds.

**For shell scripts** 🐚

Use `set -e` and `set -x` to fail fast and show exactly what executed. Add clear emoji markers so failures are hard to miss. AI loves to hide errors with `|| true` and `2>/dev/null`—don't let it wander down broken paths.

```bash
#!/usr/bin/env sh
set -e  # Fail fast
ERRORS=0

echo "🔍 Scanning for FIXME comments..."
FIXME_COUNT=$(grep -r "FIXME" src/ | wc -l)

if [ $FIXME_COUNT -gt 0 ]; then
    echo "❌ ERROR: Found FIXME comments"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -gt 0 ]; then
    exit 1
fi
echo "✅ All checks passed"
```

These are the closing spells. The words that stop the flood.

### Putting It Into Practice

Now you know the words. Here's how to use them.

**📚 Document first, code second**

Discuss edge cases and expected behavior with AI before writing code. Define success. Then tests write themselves.

> "This function processes user input. It can fail three ways: invalid format, missing fields, or database errors. Here's a good test from our codebase that uses fakes. Write tests in that style covering all three failure modes."

AI matches your style and tests meaningful scenarios.

**Give examples, not instructions**

Show AI 2-3 good tests. "Write more like these" works better than explaining principles. AI pattern-matches brilliantly—once the pattern is clear, let it grind through variations.

**Use IDE integration**

Cursor/Claude Code + linters = AI sees type errors and fixes them before you review. Catches rot before it spreads.

**🎯 Set custom rules**

Make boundaries explicit. `"Don't use @Deprecated classes"` is clearer than "avoid bad patterns." AI can't see transitive dependencies—if it calls a nice-looking helper that internally uses bad patterns, it won't know unless you tell it.

**Let AI grind variations**

Once the pattern is established, AI is phenomenal at testing all the edge cases you'd skip. It won't get bored testing 50 variations.

**Know when to switch tactics**

For refactoring with lots of small edits across files, sometimes it's better to ask AI to explain the changes in detail and make them yourself. Don't be dogmatic—use AI where it excels.

### The Feedback Loop in Practice

1. **Set up watch mode** — tests run on every file change
2. **Write 2-3 exemplary tests** — these teach AI your style
3. **Show AI the pattern** — "write more like these"
4. **Let AI grind edge cases** — it won't get bored testing 50 variations
5. **Use failures to steer** — clear error messages = AI can auto-fix

Here's what that looks like in action:

```
Me: *writes test that should fail*
Test: ❌ FAIL - Expected user to be created
AI: "I see the issue - the validation is too strict"
AI: *makes fix*
Test: ✅ PASS
Me: "Now test what happens with empty email"
AI: *writes test + implementation*
Test: ✅ PASS
```

Fast iteration. Immediate feedback. Clear errors.

---

## Partial Mastery ⚡

![Vigilant apprentice in the background, one broom working in the foreground, a weak flickering control beam between them — partial but unstable mastery](/images/posts/apprentice-partial-mastery.svg)

Let's be honest. This isn't mastery. Not yet.

These strategies let you get much further without getting stuck. You can launch to altitude and glide down instead of falling.

But go on autopilot too long? You'll discover rotten foundation under those new pieces. **You still need to stay vigilant.**

**The smart testing gives you something crucial though: early warning.**

The tests fail. You see the full diff. You catch the fork, the hard-coding, the duplication *before* it spreads through ten files.

Without good tests, AI is frustrating—you debug mysterious failures and review questionable code after it's already metastasized.

Without AI, comprehensive testing is tedious—you skip edge cases and bugs slip through.

Together? You can go fast without falling off the cliff.

- Write 2-3 exemplary tests
- AI generates comprehensive coverage following your patterns
- Tests fail fast with clear feedback
- AI fixes issues in seconds
- You catch the rot early

This is the secret sauce. Not "use AI for everything" or "write more tests."

**It's about being intentional with testing strategy and strategic about when to involve AI.**

The developers who figure this out operate in a different mode. They ship in days what used to take weeks. They refactor without fear. They catch bugs before production.

They've learned the closing spell. They're not drowning anymore.

**But they're still vigilant.** 🎩✨

---

*Coming in Part 2: "Tending the Fire" - You've learned to stop the flood. But can you be trusted with this power? What happens when you need to teach others? And what about those moments when the magic still goes wrong?*
