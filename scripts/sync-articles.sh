#!/usr/bin/env bash
# Copies the canonical paid-article markdown files from the sibling
# 2ushka_telegram_bot knowledge vault into escape-weekend's article content
# directory.
#
# Master source: ../2ushka_telegram_bot/knowledge/articles/*.md
#                (subfolder; only published paid articles, not bot-Q&A briefs)
#
# After editing knowledge/articles/*.md in the bot repo, run this before
# `npm run build` and update src/content/articles/index.ts if the slug list
# changed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ATLAS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ARTICLES_DIR="$(cd "$ATLAS_ROOT/../2ushka_telegram_bot/knowledge/articles" && pwd)"
TARGET_DIR="$ATLAS_ROOT/src/content/articles"

mkdir -p "$TARGET_DIR"

# Drop any stale .md files in the target that no longer exist in the source.
# Keep index.ts and any non-md files.
shopt -s nullglob
for stale in "$TARGET_DIR"/*.md; do
  base="$(basename "$stale")"
  if [[ ! -f "$ARTICLES_DIR/$base" ]]; then
    rm "$stale"
    echo "removed stale: $base"
  fi
done
shopt -u nullglob

# Copy fresh content
for src in "$ARTICLES_DIR"/*.md; do
  base="$(basename "$src")"
  cp "$src" "$TARGET_DIR/$base"
  echo "synced: $base"
done

echo "done. target: $TARGET_DIR"
