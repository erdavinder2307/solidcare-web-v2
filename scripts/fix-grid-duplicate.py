#!/usr/bin/env python3
"""
Remove standalone Grid entries from multi-line @mui/material import blocks
in files that already have 'import Grid from "@mui/material/Grid2"'.
"""
import os, re, subprocess

root = os.path.join(os.path.dirname(__file__), "..", "src")

result = subprocess.run(
    ["grep", "-rln", 'from "@mui/material/Grid2"', root, "--include=*.tsx"],
    capture_output=True, text=True
)
files = [f.strip() for f in result.stdout.strip().split("\n") if f.strip()]

for path in files:
    with open(path) as fh:
        src = fh.read()

    # Match multi-line import block from @mui/material and remove Grid from it
    # Pattern: import {\n  ...\n  Grid,\n  ...\n} from "@mui/material";
    def remove_grid_from_block(m):
        block = m.group(0)
        # Remove lines that are just "Grid," or "  Grid," or ", Grid," etc.
        lines = block.split("\n")
        new_lines = []
        for line in lines:
            # Skip lines that are purely the Grid entry (with optional trailing comma)
            stripped = line.strip().rstrip(",")
            if stripped == "Grid":
                continue
            new_lines.append(line)
        result = "\n".join(new_lines)
        # Clean up trailing comma before closing brace
        result = re.sub(r',(\s*\n\s*})', r'\1', result)
        return result

    new_src = re.sub(
        r'import\s*\{[^}]*\}\s*from\s*"@mui/material"\s*;',
        remove_grid_from_block,
        src,
        flags=re.DOTALL
    )

    if new_src != src:
        with open(path, "w") as fh:
            fh.write(new_src)
        print(f"fixed: {path}")
    else:
        print(f"no change: {path}")

print("Done.")
