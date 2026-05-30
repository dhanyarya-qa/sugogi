#!/usr/bin/env python3
"""Generate responsive image sizes (srcset) for all website images."""
import os
from PIL import Image

ASSETS_DIR = "assets"
OUTPUT_DIR = "assets/images"

# Each image: (filename_without_ext, original_width, [sizes_to_generate])
IMAGES = {
    "hero":     {"widths": [480, 768, 1024, 1200], "original": 1200},
    "meat":     {"widths": [480, 768, 800],        "original": 800},
    "veggies":  {"widths": [480, 768, 800],        "original": 800},
    "interior": {"widths": [480, 768, 800],        "original": 800},
    "sidedish": {"widths": [480, 768, 800],        "original": 800},
    "icecream": {"widths": [480, 768, 800],        "original": 800},
}

os.makedirs(OUTPUT_DIR, exist_ok=True)

for name, info in IMAGES.items():
    jpg_path = os.path.join(ASSETS_DIR, f"{name}.jpg")
    webp_path = os.path.join(ASSETS_DIR, f"{name}.webp")

    source_path = jpg_path if os.path.exists(jpg_path) else webp_path
    if not os.path.exists(source_path):
        print(f"  [SKIP] {name}: no source found")
        continue

    img = Image.open(source_path)
    orig_w, orig_h = img.size
    print(f"\n{name}: {orig_w}x{orig_h}")

    for w in sorted(set(info["widths"])):
        if w > orig_w:
            # Don't upscale; copy original instead
            w = orig_w

        ratio = w / orig_w
        h = int(orig_h * ratio)

        resized = img.resize((w, h), Image.LANCZOS)

        # Save as WebP (primary format)
        webp_out = os.path.join(OUTPUT_DIR, f"{name}-{w}w.webp")
        resized.save(webp_out, "WEBP", quality=82)
        webp_size = os.path.getsize(webp_out) / 1024
        print(f"  {w}w.webp  -> {webp_size:.0f}KB")

        # Save as JPEG (fallback)
        jpg_out = os.path.join(OUTPUT_DIR, f"{name}-{w}w.jpg")
        resized.save(jpg_out, "JPEG", quality=82, optimize=True)
        jpg_size = os.path.getsize(jpg_out) / 1024
        print(f"  {w}w.jpg   -> {jpg_size:.0f}KB")

print("\n✅ Done generating responsive images.")
