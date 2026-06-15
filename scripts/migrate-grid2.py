#!/usr/bin/env python3
"""
Migrate all files using MUI Grid v2 size prop to import Grid from @mui/material/Grid2
instead of the deprecated Grid from @mui/material.
"""
import sys
import os
import subprocess

root = os.path.join(os.path.dirname(__file__), "..", "src")

# Find all files using the Grid v2 size prop
result = subprocess.run(
    ["grep", "-rln", "size={{ xs:", root, "--include=*.tsx"],
    capture_output=True, text=True
)
files = [f.strip() for f in result.stdout.strip().split("\n") if f.strip()]

for path in files:
    with open(path) as fh:
        src = fh.read()

    # Skip if Grid2 import already present
    if 'from "@mui/material/Grid2"' in src:
        print(f"skip (already done): {path}")
        continue

    lines = src.split("\n")
    new_lines = []
    grid2_added = False
    last_mui_line_idx = -1

    # Find last @mui/material import line
    for i, line in enumerate(lines):
        if '"@mui/material"' in line or "'@mui/material'" in line:
            last_mui_line_idx = i

    if last_mui_line_idx == -1:
        print(f"skip (no mui import): {path}")
        continue

    # Remove Grid from named imports in @mui/material lines
    for i, line in enumerate(lines):
        if ('"@mui/material"' in line or "'@mui/material'" in line) and "Grid" in line:
            # Remove Grid from named imports — handles ", Grid," / "Grid," / ", Grid"
            import re
            line = re.sub(r',\s*Grid\b(?!\d)', '', line)
            line = re.sub(r'\bGrid\b(?!\d)\s*,\s*', '', line)
            line = re.sub(r'\bGrid\b(?!\d)\s*', '', line)
            # Clean up empty braces or trailing commas
            line = re.sub(r'\{\s*,', '{', line)
            line = re.sub(r',\s*\}', ' }', line)
        new_lines.append(line)
        # After last @mui/material import, insert Grid2 import
        if i == last_mui_line_idx and not grid2_added:
            new_lines.append('import Grid from "@mui/material/Grid2";')
            grid2_added = True

    with open(path, "w") as fh:
        fh.write("\n".join(new_lines))
    print(f"patched: {path}")

print("Done.")
