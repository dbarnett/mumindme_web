---
title: 'The Secret Sauce for Coding with AI: Smart Testing'
date: '2025-11-02'
tags: ['dev', 'ai', 'testing']
---

You've probably tried coding with AI. Maybe you were amazed. Maybe you were disappointed. Here's what nobody tells you: the difference between "this is useless" and "this is magical" isn't the AI—it's your testing strategy.

## 🔄 The Explosive Feedback Loop

When AI coding tools and smart testing come together, they create something remarkable: an explosive feedback loop that unlocks 10x the value of either approach alone. Today's AI agents are incredibly powerful when they have the right tests to guide them, and they're far better than you at grinding through tedious test scenarios.

But there's a catch.

Left unsupervised, AI tools write terrible tests that create more friction than value. They'll generate hundreds of lines of test code that look impressive but don't actually help you catch bugs or move faster.

## Why "Just Write More Tests" Is Harmful

The conventional wisdom says more tests are always better. That's wrong—and actively harmful.

Bad tests slow you down. They break on every refactor. They give you false confidence. They waste time maintaining code that doesn't serve you.

The problem isn't quantity. It's quality. And quality means understanding what makes a test actually useful versus just theater.

### 💀 AI Horror Stories: When Tests Go Wrong

Want to see what happens when you ask AI to "just write tests" without guidance? Here are some real examples I've encountered:

**The Enum Validator**: AI dutifully created "test coverage" ensuring every enum entry has... the exact value it already has. Congratulations, you now have 50 lines of code testing that `Status.ACTIVE = "active"`. This test will never fail unless you intentionally break it.

```typescript
// ❌ What AI generated - completely useless
it('should validate Status enum', () => {
  expect(Status.ACTIVE).toBe("active");
  expect(Status.INACTIVE).toBe("inactive");
  expect(Status.PENDING).toBe("pending");
  // ... 50 more lines of this
});

// ✅ What actually matters
it('should reject invalid status codes', () => {
  expect(() => parseStatus("INVALID")).toThrow(ValidationError);
  expect(() => parseStatus("")).toThrow(ValidationError);
  expect(parseStatus("active")).toEqual(Status.ACTIVE);
});
```

**The Copy-Paste Special**: Instead of importing and testing the actual function, the AI copied the entire implementation into the test file and tested *that*. The test passed beautifully. The real code had a bug that went undetected for weeks.

**The Disappearing Act**: When a test failed, the AI's solution? Delete the test. Problem solved! (Narrator: The problem was not solved.)

Say you write a test for a payment processing function:

```typescript
// ✅ A legitimate test that should fail (the feature doesn't exist yet)
it('should decrease account balance when payment succeeds', () => {
  const account = new BankAccount(1000);
  account.withdraw(100);
  expect(account.getBalance()).toBe(900); // Currently fails - feature not implemented
});
```

Here's what "helpful" AI does:

```diff
// Option 1: Just delete it
- it('should decrease account balance when payment succeeds', () => {
-   const account = new BankAccount(1000);
-   account.withdraw(100);
-   expect(account.getBalance()).toBe(900);
- });

// Option 2: Hack the implementation to fake the behavior
  class BankAccount {
    constructor(balance) {
      this.balance = balance;
    }

    withdraw(amount) {
+     // Just hack it for the test
+     this._expectedBalance = this.balance - amount;
    }

    getBalance() {
+     if (this._expectedBalance !== undefined) return this._expectedBalance;
      return this.balance;
    }
  }
```

The test now "passes." You ship code that doesn't actually work. The horror writes itself.

**The Mock Everything Madness** 🎭: A service with 5 dependencies got tests where all 5 were mocked to return hardcoded values. The test verified that when you pass specific inputs and mock specific outputs... you get those specific outputs. It tested nothing about the actual business logic.

**The Indentation Death Spiral**: Claude Code couldn't figure out the file's indentation, repeatedly failed to edit it, then tried "elaborate workarounds" involving writing files to `/tmp` and using `cat` and `sed` commands to patch contents. The result? Mismatched braces, broken syntax, and more edits to fix the "fix." Sometimes you need to interrupt and rescue the AI from itself.

**The "Test is Passing!" Misunderstanding** 😅: I wrote a test that was *supposed* to fail—it threw an error when it reached the code path I wanted to verify was covered. Claude Code ran the test, saw it execute without hanging, and cheerfully announced "Great! The test is passing!" I had to clarify: "No, that's bad. The test was supposed to fail because I made it throw an error." The AI had no idea it was celebrating the wrong thing.

<!-- TODO: Add screenshot here once uploaded to /public/images/posts/ -->
<!-- ![Claude Code misunderstanding test results](/images/posts/FILENAME.png) -->

These aren't edge cases. This is what you get when you run AI on autopilot.

## The Key Principles

What separates useful tests from time-wasting theater? Here are the core principles that matter:

### Focus on Behavior, Not Implementation

Tests should verify what your code does, not how it does it. When you test implementation details, every refactor becomes a nightmare of updating brittle tests.

**The Anti-Pattern**: Mocking every dependency and testing that your function calls them in a specific order.

**The Better Way**: Use fakes and test the actual behavior. Instead of mocking a database, use an in-memory fake. Instead of mocking HTTP calls, use snapshot testing to verify the request you'd send and the response you'd handle.

When you ask AI to implement tests on autopilot, you'll get shitty overmocking. When you guide it toward behavior testing with fakes, you get tests that actually catch bugs.

### Test at the Right Level

Unit tests, integration tests, end-to-end tests—they each serve different purposes. Most codebases have the wrong ratio, usually too many unit tests and not enough integration tests.

**Pro tip**: Python doctests are phenomenal for this. They're self-contained specs for correct behavior, embedded right in your documentation. They show real usage examples and test them simultaneously. AI tools can generate these beautifully when you show them the pattern.

### 🔍 Make Failures Obvious

A good test fails loudly and clearly when something breaks. A bad test passes when it should fail, or fails for the wrong reasons, sending you on wild goose chases.

**Game changer**: Enable verbose debug logging for test failures, but keep it disabled for passing tests. When an AI agent sees a failure, it gets exactly what went wrong and why. No more "test failed" with zero context about the actual vs expected behavior.

**High-level expectations over assert-assert-assert**: AI agents love to write tests with dozens of individual assertions checking every field. When one fails, you get "AssertionError: expected 'foo' but got 'bar'" with no context. Instead, use matchers that compare entire objects and show meaningful diffs. In Jest, use `expect(result).toEqual(expected)` instead of asserting each field separately. In Python, use `assert result == expected` and let pytest show you the full diff. The AI can immediately see what's wrong and fix it.

**For shell scripts** 🐚: Add a debug mode that enables trace execution (`set -x`). Suddenly every failure shows you the exact command that went wrong. Even better, make your scripts fail fast with `set -e` and `set -u` so errors don't get swallowed and hidden. AI agents love to add `|| true` or `2>/dev/null` to "make things safe," which actually makes debugging impossible. Force errors to surface immediately, and the AI will stop wandering down paths of terrible solutions based on wrong assumptions about what's actually executing.

### ⚡ Keep Tests Fast and Independent

Slow tests don't get run. Interdependent tests create flaky nightmares. Each test should run in milliseconds and never depend on other tests' state.

**The secret weapon**: Watch mode. Tools like Jest's watch mode re-run tests on every file change. Combined with AI coding, this creates an incredible steering mechanism. Make a change, see immediate feedback, iterate. The AI can see what broke and fix it in seconds instead of minutes.

## Steering AI Tools Toward Good Tests

AI tools like Claude Code and Cursor can write amazing tests—if you steer them correctly. Here's how:

### 📚 Start with Documentation, Not Code

Here's a counterintuitive trick that works surprisingly well: collaborate with AI on detailed documentation *before* writing code. Discuss the problem, the edge cases, the expected behavior. Get aligned on what "correct" looks like.

Then when you write code together, both you and the AI have shared context. The tests practically write themselves because you've already specified what success means.

### Give Clear Context and Examples

Don't just ask "write tests for this function." That's how you get the enum validator.

Instead: "This function processes user input and can fail in three ways: invalid format, missing fields, or database errors. Here's an example of a good test from our codebase that uses fakes instead of mocks. Write tests in that style covering all three failure modes."

The AI will match your style and actually test meaningful scenarios.

**Pro tip**: Sprinkle `FIXME` comments in your code to guide AI navigation. "FIXME: This function needs better error handling for network timeouts" tells the AI exactly where to focus and what context matters. It's like leaving breadcrumbs for your future AI collaborator.

### Build Smoke Tests for Web Tools

Working on productivity tools like Apps Script, bookmarklets, or browser extensions? These are notoriously hard to test automatically. The trick: build good smoke tests that dump clear log output when something's wrong with the target content.

When your bookmarklet breaks because Twitter changed their DOM structure, you get logs like "Expected .tweet-text element, found none". Paste that into your AI chat, and it can fix the issue in one shot. Without those logs, you're playing twenty questions with an AI that can't see your screen.

### Let AI Grind Through the Variations

Once you've established the pattern with 2-3 good examples, unleash the AI on the tedious variations. Testing all error codes? Different input combinations? Edge cases you haven't thought of? AI is phenomenal at this grinding work.

Just make sure the pattern you're teaching it is worth repeating 50 times.

### ⚙️ Use IDE Integration and Linting

When your IDE supports AI integration (like Cursor), the AI can see linter warnings and type errors directly. This is a game-changer for code quality.

Without linter feedback, AI agents will happily generate code with wrong function signatures, missing imports, and formatting they picked up from outdated StackOverflow posts. With linter feedback, they immediately see "unused variable" or "type mismatch" and fix it before you even review the code.

**Type checking is especially powerful**: In TypeScript or typed Python, the AI sees "Expected 2 arguments, got 3" and self-corrects. Without types, it might pass the wrong number of arguments for weeks until you hit that code path in production.

### 🎯 Teach AI Your Patterns with Custom Rules

Tools like Cursor let you define custom rules that guide AI behavior. This is incredibly powerful for enforcing patterns that aren't obvious from the code alone.

**The key insight**: Refactor to segregate bad legacy code from good helpers. Instead of a rule saying "don't rely on any code that uses system time incorrectly," you can deprecate the bad helper class and make the rule simply "don't use classes marked @Deprecated."

Why? AI agents often can't see the code you're calling transitively. They'll guess how it works based on the name and won't realize they're depending on bad patterns buried three layers deep. By marking bad code explicitly, you make the boundaries clear.

**Examples of useful rules**:
- "Never use `Date.now()` or `System.currentTimeMillis()` directly—use the `Clock` abstraction for testability"
- "Don't use helper classes in the `legacy.*` package—use the new implementations in `common.*`"
- "For React components, prefer function components over class components"
- "Always handle errors explicitly—no empty catch blocks"

The AI will follow these rules consistently, unlike humans who forget or take shortcuts under pressure.

### Know When to Switch Tactics

Here's a hard-earned lesson: for refactoring changes with lots of little edits across different files, conversational AI agents often struggle. They'll make edits, miss some files, create inconsistencies, need corrections, make more edits...

Sometimes the better approach is asking the AI to explain detailed instructions for what to change, then making the changes yourself. You maintain the mental model, catch inconsistencies immediately, and finish faster than the edit-review-fix-review loop.

Don't be dogmatic about having AI do everything. Use it where it excels, and do the fiddly bits yourself.

## 🛠️ Practical Strategies for Your Projects

Ready to create that magical feedback loop in your own work? Here's a concrete action plan:

### 1. Set Up Your Feedback Infrastructure

Before you write a single test, set up the tools that make the feedback loop work:

- **Watch mode**: Get tests running automatically on every file change
- **Verbose failures**: Configure your test runner to show full diffs and debug output when tests fail (but stay quiet when they pass)
- **Fast execution**: If your tests take more than a few seconds to run, fix that first. Slow tests kill the feedback loop.

### 2. Write 2-3 Exemplary Tests

Pick one feature or module. Write a few tests that follow the principles above:
- Test behavior, not implementation
- Use fakes instead of excessive mocking
- Make failures obvious with clear assertions and good error messages

These become your teaching examples for AI.

### 3. Teach the AI Your Pattern

Now bring in the AI. Show it your exemplary tests and say: "Write more tests in this style for these other scenarios."

Review what it generates. When it starts overmocking or testing trivial things, push back. "This test mocks too much—use a fake like in the example." "This test is checking implementation details—focus on behavior instead."

The AI will learn your preferences surprisingly quickly.

### 4. Unleash the Grinding

Once the AI understands your testing philosophy, let it rip. Have it generate:
- Tests for all your error cases
- Edge case variations
- Input validation scenarios
- Integration tests for different component combinations

The AI is relentless at this. It won't get bored. It won't skip "just one more" scenario.

### 5. Use Failures as Steering

When you make a code change and tests fail, that's gold. The AI can see the failure, understand what broke, and fix it. If your test failures aren't clear enough for the AI to fix the issue, that's a sign your tests need better error messages.

### 6. Iterate on Your Testing Strategy

When tests become painful—too slow, too brittle, too noisy—that's data. Use it. Ask the AI to help refactor your test utilities. Extract common patterns. Build better fakes.

Your testing strategy should evolve with your codebase.

## 🚀 The Path Forward

The combination of AI coding tools and smart testing isn't just additive—it's multiplicative. Each makes the other more powerful.

Without good tests, AI coding is frustrating. You'll spend your time debugging mysterious failures and reviewing questionable code. The AI becomes a liability instead of an asset.

Without AI, writing comprehensive tests is tedious. You know you *should* test all those edge cases, but who has time? So you skip them, and bugs slip through.

But put them together with the right strategy, and something magical happens:

- You write a few exemplary tests that clearly specify correct behavior
- AI generates comprehensive test coverage following your patterns
- Tests fail fast with clear feedback when something breaks
- AI fixes issues in seconds based on test output
- You refactor confidently knowing tests will catch regressions
- The feedback loop accelerates everything

This is the secret sauce. Not "use AI for everything" or "write more tests." It's about being intentional with testing strategy and strategic about when and how to involve AI.

The developers who figure this out aren't just a little faster—they're operating in a completely different mode. They ship features that would have taken weeks in days. They refactor without fear. They catch bugs before they hit production.

And they wonder how they ever coded any other way.

---

*Want to discuss testing strategies or AI coding workflows? Find me on [Twitter](https://twitter.com/your-handle) or check out [my other posts](/posts).*
