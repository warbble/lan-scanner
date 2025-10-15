#!/bin/bash

# Create a simple icon using iconutil (macOS built-in)
# First, create a base PNG using imagemagick or create manually

# For now, we'll use SF Symbols or create a simple colored icon
# Create icon.iconset directory
mkdir -p icon.iconset

# Create different sizes (we'll use a simple network icon representation)
# Using sips to create colored squares as a temporary solution
for size in 16 32 64 128 256 512 1024; do
  # Create a colored PNG using sips/built-in tools
  # Blue color for network theme
  python3 << PYTHON
from PIL import Image, ImageDraw, ImageFont
import os

size = ${size}
img = Image.new('RGB', (size, size), color='#0066CC')
draw = ImageDraw.draw(img)

# Draw a simple network icon (circles connected)
scale = size / 256
circle_r = int(30 * scale)
line_w = int(8 * scale)

# Center
cx, cy = size // 2, size // 2

# Draw connections
draw.line([(cx, cy), (cx - int(60*scale), cy - int(60*scale))], fill='white', width=line_w)
draw.line([(cx, cy), (cx + int(60*scale), cy - int(60*scale))], fill='white', width=line_w)
draw.line([(cx, cy), (cx - int(60*scale), cy + int(60*scale))], fill='white', width=line_w)
draw.line([(cx, cy), (cx + int(60*scale), cy + int(60*scale))], fill='white', width=line_w)

# Draw nodes
positions = [
    (cx, cy),
    (cx - int(60*scale), cy - int(60*scale)),
    (cx + int(60*scale), cy - int(60*scale)),
    (cx - int(60*scale), cy + int(60*scale)),
    (cx + int(60*scale), cy + int(60*scale))
]

for px, py in positions:
    draw.ellipse([px-circle_r, py-circle_r, px+circle_r, py+circle_r], fill='white', outline='white')

img.save(f'icon.iconset/icon_{size}x{size}.png')
if size <= 512:
    img.save(f'icon.iconset/icon_{size//2}x{size//2}@2x.png')
PYTHON
done

# Convert to icns
iconutil -c icns icon.iconset -o icon.icns

# Cleanup
rm -rf icon.iconset

echo "Icon created: icon.icns"
