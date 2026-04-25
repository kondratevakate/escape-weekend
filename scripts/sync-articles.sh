#!/usr/bin/env bash
# Copies the canonical knowledge markdown files from the sibling 2ushka_telegram_bot
# into atlas-explorer's article content directory.
#
# Master source: ../2ushka_telegram_bot/knowledge/*.md
# Run before `npm run build` if knowledge has changed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ATLAS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
KNOWLEDGE_DIR="$(cd "$ATLAS_ROOT/../2ushka_telegram_bot/knowledge" && pwd)"
TARGET_DIR="$ATLAS_ROOT/src/content/articles"

mkdir -p "$TARGET_DIR"

for src in "$KNOWLEDGE_DIR"/*.md; do
  base="$(basename "$src")"
  cp "$src" "$TARGET_DIR/$base"
  echo "synced: $base"
done

echo "done. target: $TARGET_DIR"
