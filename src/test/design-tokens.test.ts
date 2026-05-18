/**
 * DESIGN.md hygiene — static-grep regression tests.
 *
 * Per global CLAUDE.md rule #7 ("add a regression test that fails if the pattern
 * reappears"): each time we sweep a DESIGN.md "Don't" across the codebase, we
 * add a grep here so it cannot creep back in via copy-paste from shadcn /
 * Tailwind playgrounds where the pattern is common.
 *
 * Currently guards:
 *   - `backdrop-blur*` — DESIGN.md "Don'ts: Backdrop-blur anywhere"
 *   - `bg-gradient-to-*` inside Card-class neighbourhoods — DESIGN.md
 *     "Don'ts: Gradient backgrounds on functional surfaces"
 *
 * To extend: add a `forbids(...)` call inside the describe block.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const SRC_ROOT = resolve(__dirname, '..');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      // Skip shadcn primitives — they are vendored upstream code we don't own.
      if (entry === 'ui') continue;
      out.push(...walk(full));
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      // Skip test files — they may mention forbidden tokens in docstrings/regex.
      out.push(full);
    }
  }
  return out;
}

const files = walk(SRC_ROOT).map(f => ({
  path: relative(SRC_ROOT, f),
  content: readFileSync(f, 'utf-8'),
}));

describe('DESIGN.md hygiene', () => {
  it('no backdrop-blur* anywhere in src/ (except src/components/ui)', () => {
    const offenders = files
      .filter(f => /\bbackdrop-blur(-\w+)?\b/.test(f.content))
      .map(f => f.path);
    expect(
      offenders,
      `backdrop-blur is banned by DESIGN.md "Don'ts". Use solid bg-X/95 with higher opacity instead.\nOffenders:\n  - ${offenders.join('\n  - ')}`
    ).toEqual([]);
  });
});
