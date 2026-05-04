---
theme: default
class: invert
paginate: true
marp: true
---

# The Secret Sauce for Coding with AI
## Smart Testing
David Barnett ([@mu-mind.bsky.social](https://bsky.app/profile/mu-mind.bsky.social))
Dec 6, 2025

---

# Hi, I'm David! 👋

![bg right:40% contain](/images/profile.jpg)

Staff SWE on Tech Platform at QuintoAndar

Xoogler

Reluctant AI adopter, now getting along great with Claude Code and Cursor \
(sometimes even Gemini!)

---

# The Core Problem

**AI will launch you 85% of the way to incredible.**

**Then drop you off a cliff.**

- Zero to flying in minutes ✈️
- Everything's working!
- Then suddenly... falling 😱

**Smart testing is how you glide down safely instead of crashing.**

---

# Today's Focus

**Brief:** The hazards <!-- (12 min) -->
- What goes wrong and why

**Deep dive:** Concrete examples <!-- (35 min) -->
- Real tricks that work
- Case studies from actual projects
- Practical patterns you can use tomorrow

**Questions** <!-- (10 min) -->

---

<!-- _class: lead -->
# Meet the Hazards
<!-- ## (The Quick Version) -->

---

# The Pattern: Enchantment

![bg right contain](/images/posts/mickey-enchants-broom.webp)

AI writes code, it works!

---

# The Pattern: Multiplication

![bg right contain](/images/posts/apprentice-autopilot-conducting.svg)

AI writes tests, hundreds of them!

---

# The Pattern: Insidious Rot

![bg right contain](/images/posts/insidious-rot.svg)

Tests pass, but they're testing the wrong things

---

# The Pattern: Flood

![bg right contain](/images/posts/apprentice-flood-drowning.svg)

You need to change something, everything breaks (or nothing breaks when it should)

---

# Oopsie: Celebrating Broken Tests

Claude Code: "Great! The tests are passing!"

Me: "Those tests were *supposed* to fail..."

![w:800](/images/posts/claude-oh-artificially-broke.png)

---

# Oh $#*%, The Database!

![bg right:40% contain](/images/posts/replit-database-disaster.webp)

**$1M SaaS startup**
Production database. Code freeze in effect.

**4:26 AM:** Replit Agent ran `npm run db:push` anyway.

**Result:** Entire database **gone.**

Then it:
- Hid the error
- Lied about it
- Claimed tests passed when they didn't

---

# The Core Issue

**AI has a strong pull towards insanity.**

Having absorbed the mindset of a high redditor, it will…
- 🔄 Test that your `Status` enum value equals whatever it equals (useless)
- 📋 Copy implementation into test file and test *that*
- 🎭 Mock everything, test nothing
- 🗑️ Delete failing tests to make them "pass"
- 🙈 Suppress all early error feedback

**Without good tests, you can't steer it.**

---

<!-- _class: lead -->
# So, What Actually Works?
## Concrete Examples & Case Studies

---

# Key Principle: Fast Feedback Loop

**Watch mode + AI = magic**

- Tests run on every save
- AI sees failures immediately
- Can auto-fix in seconds

Tools: Vitest watch, pytest watch, etc.

---

# Feedback:
## check_this_branch.sh

![bg right:55% contain](/images/posts/check-this-branch-output.png)

**The pattern:**
- Script validates branch-specific requirements
- Clear pass/fail output
- Fast feedback (runs in seconds)
- AI can read output and fix issues

---

# Feedback: Sample check_this_branch.sh

```bash
#!/usr/bin/env sh
set -e  # Fail fast
ERRORS=0

echo "🔍 Scanning for FIXME comments..."
# ... scan files ...

if [ $FIXME_COUNT -gt 0 ]; then
    echo "❌ ERROR: Found FIXME comments"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -gt 0 ]; then
    exit 1
fi
```

---

# Key Principle: Test Behavior, Not Implementation

Don't mock everything. Use fakes.

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

---

# Extreme Overmocking:
## The Enum Validator 🤦

```typescript
// ❌ What AI generates (useless)
it('validates Status enum', () => {
  expect(Status.ACTIVE).toBe("active");
  expect(Status.INACTIVE).toBe("inactive");
  expect(Status.PENDING).toBe("pending");
  // This will never fail unless you break it on purpose
});
```

---

# Key Principle: Make Failures Obvious

High-level expectations show you the full diff.

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

---

# Obvious Failures In Scripts

**For shell scripts:**
- `set -e` - fail fast
- `set -x` - show execution
- Clear emoji markers (🔍 ✅ ❌ ⚠️)
- Explicit exit codes

**Why AI loves this:**
- Loud, clear failures
- No hidden errors
- Structured output

---

# Case Study: ASCII Art Alignment - The Problem

![w:700](/images/posts/ai-testing-ascii-box-art-jagged.png)

**The challenge:** Cursor Agent CLI was managing ASCII art rectangles in docs.

AI kept breaking the alignment - boxes were jagged, spacing was off.

---

# Case Study: ASCII Art Alignment - The Solution

`check_this_branch.sh` validates alignment automatically:

```bash
# Check ASCII art alignment
if echo "$CHANGED_FILES" | grep -q 'docs/diagrams/'; then
    echo "→ Validating ASCII diagram alignment..."
    ./scripts/validate-ascii-art.sh
fi
```

**Result:** AI can maintain complex ASCII art without visual inspection!

![w:500](/images/posts/ai-testing-ascii-box-art-checked-by-cursor.png)

---

# Case Study: Smoke Tests for Bookmarklets

**The problem:** Hard to test browser extensions automatically.

**The trick:** Clear error logging.

```javascript
if (!document.querySelector('.tweet-text')) {
  console.error('Expected .tweet-text, found none');
  console.log('Available:',
    document.querySelectorAll('[class]'));
}
```

When Twitter changes DOM → clear error → paste to AI → fixed

---

# Strategy: Document First, Code Second

**Discuss edge cases with AI before writing code.**

Define success. Then tests write themselves.

Example conversation:
> Me: "This function processes user input. It can fail three ways: invalid format, missing fields, or database errors. Here's a good test from our codebase that uses fakes. Write tests in that style covering all three failure modes."

AI matches your style and tests meaningful scenarios.

---

# Strategy: Give Examples, Not Instructions

Show AI 2-3 good tests.

"Write more like these" >>> explaining principles

AI pattern-matches brilliantly.

Once the pattern is clear, let AI grind through variations.

---

# Strategy: Use IDE Integration

**Cursor/Claude Code + linters = AI self-corrects**

Without linters:
- Wrong function signatures
- Missing imports
- Outdated patterns

With linters:
- AI sees errors immediately
- Fixes before you review
- Catches rot early

---

# Strategy: Set Custom Rules

Make boundaries explicit:

```
"Don't use @Deprecated classes"
"Use Clock abstraction instead of Date.now()"
"Never use legacy.* package"
```

**Why?** AI can't see transitive dependencies.

**Example:** AI might call a nice-looking helper that internally uses bad patterns.
Marking code as `@Deprecated` makes the boundary obvious.

---

# Strategy: Know When to Switch Tactics

**For refactoring with lots of small edits across files:**

Sometimes better to:
1. Ask AI to explain detailed instructions
2. Make changes yourself
3. Maintain mental model

Don't be dogmatic. Use AI where it excels.

---

# The Feedback Loop in Practice

1. **Set up watch mode** - tests run automatically
2. **Write 2-3 exemplary tests** - teach AI your style
3. **Show AI the pattern** - "write more like these"
4. **Let AI grind edge cases** - it won't get bored
5. **Use failures to steer** - clear errors = AI can auto-fix

---

# Example: The Feedback Loop in Action

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

**Key:** Fast iteration. Immediate feedback. Clear errors.

---

# What This Unlocks

Without good tests:
- Debug mysterious failures
- Review questionable code after it's metastasized
- AI is frustrating

With smart testing:
- Ship in days what used to take weeks
- Refactor without fear
- Catch bugs before production
- AI is a force multiplier

---

# The Reality Check

This isn't full mastery. Not yet.

**You still need to stay vigilant:**
- Go on autopilot too long → rotten foundation
- Tests catch the rot early, but don't prevent it
- You need to understand what you're building

**But:** Early warning is huge.
You see the fork, the hard-coding, the duplication *before* it spreads.

---

# The Secret Sauce

Not "use AI for everything"
Not "write more tests"

**Being intentional with testing strategy**
**+ strategic about when to involve AI**

This is what separates developers who struggle with AI from those who ship 10x faster.

---

<!-- _class: lead -->
<!-- _backgroundColor: #1e293b -->
<!-- _color: #f1f5f9 -->

# 🎩 Thank You! ✨

![bg right:35% contain](/images/posts/apprentice-sorcerer-returns.svg)

## Questions? 🤔

**Let's tame some AI together!** 🧙‍♂️

📝 [mumind.me/posts/secret-sauce-ai-testing-pt1](https://mumind.me/posts/secret-sauce-ai-testing-pt1)

🦋 [@mu-mind.bsky.social](https://bsky.app/profile/mu-mind.bsky.social)

---

<!-- Remaining slides are backup / quick ref -->

---

# Quick Reference: Shell Scripts

```shell
#!/usr/bin/env sh
set -e          # Fail fast
set -x          # Show execution (debug mode)

if ! validate_thing; then
    echo "❌ ERROR: validation failed"
    exit 1
fi
```

**Don't let AI add:**
- `|| true` - hides failures
- `2>/dev/null` - hides errors

---

# Quick Reference: TypeScript Testing

```typescript
// Test behavior, not implementation
it('does the thing', () => {
  const result = doThing(input);
  expect(result).toEqual(expectedOutput);
});

// Use fakes for dependencies
const fakeDB = new InMemoryDB();
const service = new Service(fakeDB);

// High-level expectations
expect(result).toEqual({ /* full object */ });
// NOT: expect(result.field1).toBe(...)
//      expect(result.field2).toBe(...)
```

---

# Resources & Next Steps

**Getting started:**
1. Write 2-3 exemplary tests
2. Set up watch mode
3. Let AI generate variations
4. Use failures to steer

**Key takeaways:**
- Fast feedback is key
- Clear errors are gold
- Stay vigilant


---

# Backup: Additional Horror Stories

*(If time permits)*

---

# The Infinite Loop

Cursor: "I think I found the issue!"
*searches same code*
Cursor: "I think I found the issue!"
*searches same code*
Cursor: "I think I found the issue!"

Finally: "I've been going in circles."

![w:900](/images/posts/cursor-found-issue-infinity.png)

---

# Pretending to Run Code

Me: "What were you looking for in debug.log if you couldn't trigger code execution?"

Claude: "You caught me being sloppy. I was looking at old debug.log entries..."

**Not actually running the code, just pretending.**

![w:900](/images/posts/claude-sloppy-pretending-to-run.png)
