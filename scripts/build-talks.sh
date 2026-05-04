#!/usr/bin/env sh
# Build talk slides to self-contained HTML with embedded images
set -e

OUTPUT_DIR="$1"

if [ -z "$OUTPUT_DIR" ]; then
  echo "Error: OUTPUT_DIR required"
  echo "Usage: $0 <output-directory>"
  exit 1
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Error: Output directory does not exist: $OUTPUT_DIR"
  exit 1
fi

echo "🎤 Building talk slides..."

# Pre-process markdown to embed images as base64
node scripts/embed-images-markdown.cjs \
  talks/ai-testing-secret-sauce.md \
  /tmp/slides-embedded.md

# Generate HTML with marp
# TODO: marp converts emojis to CDN links, which makes it not fully offline-compatible
# despite base64-encoded images. Consider: custom emoji embedding or alternative renderer.
npx @marp-team/marp-cli /tmp/slides-embedded.md \
  --html \
  --no-stdin \
  -o "$OUTPUT_DIR/ai-testing-secret-sauce.html"

echo "✅ Slides built to $OUTPUT_DIR/ai-testing-secret-sauce.html"
