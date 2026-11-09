#!/usr/bin/env bash
# Generates apps/blog/public/og-blog.png — the default Open Graph card for the
# blog (used on the index, tag pages and any post without a cover image).
#
# The card mirrors the site's dark, monospace look: the same pixel-M glyph and
# amber cursor as /favicon.svg, monospace type, 1200x630 at under 100 KB.
#
# Requires ImageMagick 6+ and a monospace font on the machine that regenerates
# it. The PNG is committed, so building and deploying never need this.
#
#   bash apps/blog/scripts/og-image.sh
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
out="$here/../public/og-blog.png"

bg="#0d0d0d"
fg="#e8e8e8"
muted="#8a8a8a"
line="#262626"
amber="#eab308"

font="$(fc-match -f '%{file}' 'DejaVu Sans Mono' 2>/dev/null || true)"
if [ -z "$font" ] || [ ! -f "$font" ]; then
  font="$(fc-match -f '%{file}' 'monospace' 2>/dev/null || true)"
fi
if [ -z "$font" ] || [ ! -f "$font" ]; then
  echo "no monospace font found (install fontconfig and a monospace font)" >&2
  exit 1
fi

# Pixel-M glyph from favicon.svg (5x5 rects on a 5px grid), scaled 3x and
# placed at 36,33. Each entry is the top-left corner of one lit pixel.
glyph=(
  "36,33 108,33"
  "36,51 54,51 90,51 108,51"
  "36,69 72,69 108,69"
  "36,87 72,87 108,87"
  "36,105 108,105"
  "36,123 108,123"
  "36,141 108,141"
)

draw=()
for row in "${glyph[@]}"; do
  for corner in $row; do
    x="${corner%,*}"
    y="${corner#*,}"
    draw+=("-draw" "rectangle $x,$y $((x + 14)),$((y + 14))")
  done
done
# Amber terminal cursor next to the glyph's base row.
draw+=("-draw" "rectangle 135,141 161,155")

convert -size 1200x630 "xc:$bg" \
  -fill none -stroke "$line" -strokewidth 1 -draw "rectangle 32,32 1168,598" \
  -stroke none -fill "$fg" "${draw[@]}" \
  -fill "$amber" -draw "rectangle 135,141 161,155" \
  -font "$font" -kerning 6 -pointsize 22 -fill "$muted" \
  -annotate +80+300 'mathews shaji / writing' \
  -kerning 1 -pointsize 72 -fill "$fg" \
  -annotate +80+400 'notes from the backend' \
  -kerning 2 -pointsize 26 -fill "$muted" \
  -annotate +80+452 'backend systems · data pipelines · cloud infrastructure' \
  -kerning 3 -pointsize 20 -fill "$muted" \
  -annotate +80+558 'blog.mathewsshaji.com' \
  -kerning 3 -pointsize 20 -fill "$muted" \
  -gravity NorthEast -annotate +80+540 'full-stack & devops engineer, kochi, india' \
  -depth 8 -strip -define png:compression-level=9 \
  "$out"

echo "wrote $out"
identify "$out"
