import re

# Read the file
with open('new_map_state (1).txt', 'r') as f:
    content = f.read()

# Extract all path elements - need to handle line breaks in d attribute
paths = re.findall(r'<path\s+d="([^"]+)"[^>]*id="([^"]+)"[^>]*>', content, re.DOTALL)

print(f"Found {len(paths)} state paths")

# Create SVG content
svg_paths = []
for i, (d_attr, state_name) in enumerate(paths):
    # Clean up d attribute
    d_attr = ' '.join(d_attr.split())  # Normalize whitespace
    svg_path = f'          <path d="{d_attr}" stroke-width="1.8" stroke-opacity="0" fill="#fff0e1" stroke="#f5c9b4" id="{state_name}" class="state" pointer-events="all" style="cursor: pointer;"></path>'
    svg_paths.append(svg_path)
    print(f"{i+1}. {state_name}")

# Write formatted paths to file
with open('formatted_paths.txt', 'w') as f:
    f.write('\n'.join(svg_paths))

print(f"\nFormatted {len(svg_paths)} paths to formatted_paths.txt")

# Also write just the paths content for insertion into HTML
with open('map_paths_content.txt', 'w') as f:
    for svg_path in svg_paths:
        f.write(svg_path + '\n')

