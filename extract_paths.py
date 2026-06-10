import re

# Read the file
with open('new_map_state (1).txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all path elements with their ids and d attributes
pattern = r'<path[^>]*id="([^"]+)"[^>]*d="([^"]+)"[^>]*>'
matches = re.findall(pattern, content)

print(f"Found {len(matches)} states with path data\n")

# Generate the updated HTML paths
for state_id, path_data in matches:
    print(f'<path id="{state_id}" class="state" d="{path_data}" stroke-width="1.8" fill="#fff0e1" stroke="#f5c9b4"></path>')
    print()
